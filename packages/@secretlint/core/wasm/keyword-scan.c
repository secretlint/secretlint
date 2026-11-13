// The keyword scan of @secretlint/core for WebAssembly with SIMD (128 bits).
//
// It finds the same hits as the scan loop of src/helper/keyword-matcher.ts, which reads a table for every byte.
// Most bytes of a file are not a part of a keyword, so this code first drops them 16 bytes at a time:
//
// 1. Filter: each keyword has a fingerprint of 3 bytes (FINGERPRINT_LENGTH). For each position of a block of
//    16 bytes, the filter tests if the 3 bytes from the position can be a fingerprint. The test is a lookup of
//    the low and the high 4 bits of each byte in small tables (MASKS), which `i8x16.swizzle` does for 16 bytes
//    at once. A fingerprint is in one of 16 buckets, and a bit of the result is for a bucket.
//    The filter can report a position that is not a keyword, but it never misses a keyword.
//    This is the idea of the "Teddy" algorithm of Hyperscan and of the aho-corasick crate of Rust.
// 2. Check: only around a block that the filter reports, the automaton of keyword-matcher.ts runs
//    (the same table), and writes the hits.
//
// Build: node scripts/build-wasm.mjs (needs clang and wasm-ld). The result is src/helper/keyword-scan-wasm.ts.
#include <stdint.h>
#include <wasm_simd128.h>

#define EXPORT(name) __attribute__((export_name(#name)))
#define MAX_HITS 4096
#define FINGERPRINT_LENGTH 3
#define MASK_SETS 2

// The transition table of the automaton: TABLE[state * CLASS_COUNT + CLASS_OF_BYTE[byte]] is the next state * CLASS_COUNT
static uint16_t TABLE[65536];
static uint8_t CLASS_OF_BYTE[256];
// [set][position in the fingerprint][low or high 4 bits][value of the 4 bits] = bits of the buckets
static uint8_t MASKS[MASK_SETS][FINGERPRINT_LENGTH][2][16];
static uint32_t HIT_INDEX[MAX_HITS];
static uint16_t HIT_STATE[MAX_HITS];
// A state * CLASS_COUNT that is FIRST_OUTPUT or more completes a keyword
static uint32_t CLASS_COUNT, FIRST_OUTPUT;
// A keyword starts at most BACK bytes before its fingerprint, and ends at most FORWARD bytes after the start of it
static uint32_t BACK, FORWARD;

extern uint8_t __heap_base;

EXPORT(table) uint16_t* table(void) { return TABLE; }
EXPORT(classOfByte) uint8_t* classOfByte(void) { return CLASS_OF_BYTE; }
EXPORT(masks) uint8_t* masks(void) { return &MASKS[0][0][0][0]; }
EXPORT(hitIndex) uint32_t* hitIndex(void) { return HIT_INDEX; }
EXPORT(hitState) uint16_t* hitState(void) { return HIT_STATE; }
EXPORT(input) uint8_t* input(void) { return &__heap_base; }
EXPORT(maxHits) uint32_t maxHits(void) { return MAX_HITS; }

EXPORT(configure) void configure(uint32_t classCount, uint32_t firstOutput, uint32_t back, uint32_t forward) {
    CLASS_COUNT = classCount;
    FIRST_OUTPUT = firstOutput;
    BACK = back;
    FORWARD = forward;
}

// Run the automaton for bytes[from, to), and return the number of the hits so far
static inline uint32_t check(const uint8_t* bytes, uint32_t from, uint32_t to, uint32_t* state, uint32_t hits) {
    uint32_t s = *state;
    for (uint32_t i = from; i < to; i++) {
        s = TABLE[s + CLASS_OF_BYTE[bytes[i]]];
        if (s >= FIRST_OUTPUT) {
            if (hits < MAX_HITS) {
                HIT_INDEX[hits] = i;
                HIT_STATE[hits] = (uint16_t)(s / CLASS_COUNT);
            }
            hits++;
        }
    }
    *state = s;
    return hits;
}

// For each of the 16 positions from `p`: the buckets of the set that can have a fingerprint at the position
static inline v128_t candidates(const uint8_t* p, uint32_t set) {
    const v128_t low4 = wasm_i8x16_splat(0x0f);
    v128_t result = wasm_i8x16_splat((char)0xff);
    for (int j = 0; j < FINGERPRINT_LENGTH; j++) {
        v128_t bytes = wasm_v128_load(p + j);
        v128_t low = wasm_i8x16_swizzle(wasm_v128_load(MASKS[set][j][0]), wasm_v128_and(bytes, low4));
        v128_t high = wasm_i8x16_swizzle(wasm_v128_load(MASKS[set][j][1]), wasm_u8x16_shr(bytes, 4));
        result = wasm_v128_and(result, wasm_v128_and(low, high));
    }
    return result;
}

// Find the keywords in the `length` bytes at `input()`.
// Returns the number of the hits. Only the first MAX_HITS hits are written to `hitIndex()` and `hitState()`:
// if the result is larger than MAX_HITS, the scan stopped there, and the caller scans the input again in another way.
EXPORT(scan) uint32_t scan(uint32_t length) {
    const uint8_t* bytes = &__heap_base;
    uint32_t hits = 0;
    uint32_t state = 0;
    // The automaton has read bytes[.., done)
    uint32_t done = 0;
    uint32_t i = 0;
    while (i + 16 + FINGERPRINT_LENGTH - 1 <= length) {
        v128_t found = wasm_v128_or(candidates(bytes + i, 0), candidates(bytes + i, 1));
        if (wasm_v128_any_true(found)) {
            // A keyword that has its fingerprint in this block is in bytes[i - BACK, i + 16 + FORWARD)
            uint32_t from = i > BACK ? i - BACK : 0;
            if (from > done) {
                // No keyword is over the bytes that were skipped, so the automaton starts again
                state = 0;
            } else {
                from = done;
            }
            uint32_t to = i + 16 + FORWARD;
            if (to > length) to = length;
            if (to > from) {
                hits = check(bytes, from, to, &state, hits);
                done = to;
                if (hits > MAX_HITS) {
                    // The caller scans the input again, so the rest is not read here
                    return hits;
                }
            }
        }
        i += 16;
    }
    // The last bytes are fewer than a block
    uint32_t from = i > BACK ? i - BACK : 0;
    if (from > done) {
        state = 0;
    } else {
        from = done;
    }
    if (length > from) {
        hits = check(bytes, from, length, &state, hits);
    }
    return hits;
}
