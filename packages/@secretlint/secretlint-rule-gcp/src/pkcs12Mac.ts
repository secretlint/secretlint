/**
 * Minimal PKCS#12 MAC verification.
 *
 * GCP Service Account .p12 files are detected by checking whether the
 * top-level MAC verifies against the well-known `notasecret` password.
 * Full decryption of the PKCS#12 ContentInfo is unnecessary for that check,
 * so we only parse enough of the DER structure to extract the MacData and
 * the authSafe content, then recompute the MAC. Supports the SHA-1 MAC
 * used by the classic openssl default and the SHA-256 MAC emitted by
 * openssl 3+.
 *
 * Runs in Node.js 20+ and any environment with a Web Crypto
 * implementation on `globalThis.crypto.subtle`.
 *
 * References:
 *   - RFC 7292 (PKCS #12 v1.1) section 4, Appendix B
 */

// ASN.1 tags we care about.
const TAG_INTEGER = 0x02;
const TAG_OCTET_STRING = 0x04;
const TAG_NULL = 0x05;
const TAG_OID = 0x06;
const TAG_SEQUENCE = 0x30;
const TAG_CONTEXT_0 = 0xa0;

type TLV = {
    tag: number;
    content: Uint8Array;
    end: number;
};

function readTlv(buf: Uint8Array, offset: number): TLV {
    if (offset + 2 > buf.length) {
        throw new Error("PKCS12: truncated TLV header");
    }
    const tag = buf[offset]!;
    const lenByte = buf[offset + 1]!;
    let length: number;
    let contentStart: number;
    if (lenByte < 0x80) {
        length = lenByte;
        contentStart = offset + 2;
    } else {
        const lenBytes = lenByte & 0x7f;
        if (lenBytes === 0 || lenBytes > 4) {
            throw new Error("PKCS12: unsupported ASN.1 length encoding");
        }
        if (offset + 2 + lenBytes > buf.length) {
            throw new Error("PKCS12: truncated ASN.1 length");
        }
        length = 0;
        for (let i = 0; i < lenBytes; i++) {
            length = (length << 8) | buf[offset + 2 + i]!;
        }
        contentStart = offset + 2 + lenBytes;
    }
    const end = contentStart + length;
    if (end > buf.length) {
        throw new Error("PKCS12: TLV extends past buffer");
    }
    return { tag, content: buf.subarray(contentStart, end), end };
}

function expectTag(tlv: TLV, tag: number, label: string): void {
    if (tlv.tag !== tag) {
        throw new Error(`PKCS12: expected ${label} tag 0x${tag.toString(16)} but got 0x${tlv.tag.toString(16)}`);
    }
}

function readInteger(tlv: TLV): number {
    expectTag(tlv, TAG_INTEGER, "INTEGER");
    let value = 0;
    for (const byte of tlv.content) {
        value = value * 256 + byte;
    }
    return value;
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        diff |= a[i]! ^ b[i]!;
    }
    return diff === 0;
}

// OIDs we recognize, DER-encoded value bytes (without tag/length).
const OID_DATA = new Uint8Array([0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x07, 0x01]);
const OID_SHA1 = new Uint8Array([0x2b, 0x0e, 0x03, 0x02, 0x1a]);
const OID_SHA256 = new Uint8Array([0x60, 0x86, 0x48, 0x01, 0x65, 0x03, 0x04, 0x02, 0x01]);

type MacHash = {
    name: "SHA-1" | "SHA-256";
    outputSize: number; // u
    blockSize: number; // v
};

const MAC_HASHES: ReadonlyArray<{ oid: Uint8Array; hash: MacHash }> = [
    { oid: OID_SHA1, hash: { name: "SHA-1", outputSize: 20, blockSize: 64 } },
    { oid: OID_SHA256, hash: { name: "SHA-256", outputSize: 32, blockSize: 64 } },
];

function matchHash(oidBytes: Uint8Array): MacHash | undefined {
    for (const { oid, hash } of MAC_HASHES) {
        if (bytesEqual(oidBytes, oid)) return hash;
    }
    return undefined;
}

type ParsedPkcs12 = {
    authSafe: Uint8Array;
    macHash: MacHash;
    macSalt: Uint8Array;
    macDigest: Uint8Array;
    iterations: number;
};

function parsePkcs12(buf: Uint8Array): ParsedPkcs12 {
    // PFX ::= SEQUENCE { version INTEGER, authSafe ContentInfo, macData MacData OPTIONAL }
    const pfx = readTlv(buf, 0);
    expectTag(pfx, TAG_SEQUENCE, "PFX SEQUENCE");

    const version = readTlv(pfx.content, 0);
    if (readInteger(version) !== 3) {
        throw new Error("PKCS12: unsupported version");
    }

    const authSafeInfo = readTlv(pfx.content, version.end);
    expectTag(authSafeInfo, TAG_SEQUENCE, "ContentInfo SEQUENCE");

    // ContentInfo ::= SEQUENCE { contentType OID, content [0] EXPLICIT ANY }
    const contentType = readTlv(authSafeInfo.content, 0);
    expectTag(contentType, TAG_OID, "contentType OID");
    if (!bytesEqual(contentType.content, OID_DATA)) {
        // We only support the unencrypted `data` ContentInfo which is what
        // `openssl pkcs12 -export` (and therefore GCP) emits.
        throw new Error("PKCS12: unsupported authSafe contentType");
    }
    const explicit0 = readTlv(authSafeInfo.content, contentType.end);
    expectTag(explicit0, TAG_CONTEXT_0, "[0] EXPLICIT");
    const authSafeOctet = readTlv(explicit0.content, 0);
    expectTag(authSafeOctet, TAG_OCTET_STRING, "authSafe OCTET STRING");

    const macData = readTlv(pfx.content, authSafeInfo.end);
    expectTag(macData, TAG_SEQUENCE, "MacData SEQUENCE");

    // MacData ::= SEQUENCE { mac DigestInfo, macSalt OCTET STRING, iterations INTEGER DEFAULT 1 }
    const digestInfo = readTlv(macData.content, 0);
    expectTag(digestInfo, TAG_SEQUENCE, "DigestInfo SEQUENCE");

    const alg = readTlv(digestInfo.content, 0);
    expectTag(alg, TAG_SEQUENCE, "AlgorithmIdentifier SEQUENCE");
    const algOid = readTlv(alg.content, 0);
    expectTag(algOid, TAG_OID, "algorithm OID");
    const macHash = matchHash(algOid.content);
    if (!macHash) {
        throw new Error("PKCS12: unsupported MAC digest algorithm");
    }
    // Optional NULL parameters are ignored.
    if (algOid.end < alg.content.length) {
        const params = readTlv(alg.content, algOid.end);
        if (params.tag !== TAG_NULL) {
            throw new Error("PKCS12: unexpected MAC algorithm parameters");
        }
    }

    const digest = readTlv(digestInfo.content, alg.end);
    expectTag(digest, TAG_OCTET_STRING, "digest OCTET STRING");

    const salt = readTlv(macData.content, digestInfo.end);
    expectTag(salt, TAG_OCTET_STRING, "macSalt OCTET STRING");

    let iterations = 1;
    if (salt.end < macData.content.length) {
        const iter = readTlv(macData.content, salt.end);
        iterations = readInteger(iter);
    }

    return {
        authSafe: authSafeOctet.content,
        macHash,
        macSalt: salt.content,
        macDigest: digest.content,
        iterations,
    };
}

// Web Crypto's BufferSource requires an ArrayBufferView whose buffer is an
// ArrayBuffer (not the default ArrayBufferLike of Uint8Array). Copy into a
// fresh ArrayBuffer to satisfy the type without relying on assertions.
function toBufferSource(data: Uint8Array): Uint8Array<ArrayBuffer> {
    const copy = new Uint8Array(data.length);
    copy.set(data);
    return copy;
}

async function digest(hash: MacHash, data: Uint8Array): Promise<Uint8Array> {
    return new Uint8Array(await globalThis.crypto.subtle.digest(hash.name, toBufferSource(data)));
}

function padToMultipleOf(src: Uint8Array, blockSize: number): Uint8Array {
    if (src.length === 0) return new Uint8Array(0);
    const padded = new Uint8Array(Math.ceil(src.length / blockSize) * blockSize);
    for (let i = 0; i < padded.length; i++) {
        padded[i] = src[i % src.length]!;
    }
    return padded;
}

function encodePasswordAsBmpString(password: string): Uint8Array {
    // PKCS#12 passwords are encoded as BMPString (UTF-16BE) with a trailing
    // two-byte null terminator.
    const bytes = new Uint8Array(password.length * 2 + 2);
    for (let i = 0; i < password.length; i++) {
        const code = password.charCodeAt(i);
        bytes[i * 2] = (code >> 8) & 0xff;
        bytes[i * 2 + 1] = code & 0xff;
    }
    return bytes;
}

/**
 * PKCS#12 key derivation (RFC 7292 Appendix B.2) for deriving the MAC key.
 *
 * Specialized for the case where the desired key length is at most the
 * hash output size (which is always true for HMAC keys here: 20 bytes for
 * SHA-1, 32 bytes for SHA-256). In that case only a single block A[1] is
 * produced, so the iterative I-update loop from the spec is unnecessary.
 */
async function deriveMacKey(
    hash: MacHash,
    password: string,
    salt: Uint8Array,
    iterations: number,
): Promise<Uint8Array> {
    const v = hash.blockSize;
    const u = hash.outputSize;
    const ID_MAC = 3;

    const D = new Uint8Array(v).fill(ID_MAC);
    const P = padToMultipleOf(encodePasswordAsBmpString(password), v);
    const S = padToMultipleOf(salt, v);

    const DI = new Uint8Array(D.length + S.length + P.length);
    DI.set(D, 0);
    DI.set(S, D.length);
    DI.set(P, D.length + S.length);

    let A = await digest(hash, DI);
    for (let i = 1; i < iterations; i++) {
        A = await digest(hash, A);
    }
    return A.subarray(0, u);
}

/**
 * Verify a PKCS#12 PFX MAC using the supplied password.
 *
 * Returns `true` only when the file is a well-formed PKCS#12 v3 structure
 * with an unencrypted `data` authSafe, a recognized MAC digest algorithm
 * (SHA-1 or SHA-256), and a MAC that matches the password. Any structural
 * or algorithmic mismatch yields `false`.
 */
export async function verifyPkcs12Mac(pfxBytes: Uint8Array, password: string): Promise<boolean> {
    let parsed: ParsedPkcs12;
    try {
        parsed = parsePkcs12(pfxBytes);
    } catch {
        return false;
    }
    const key = await deriveMacKey(parsed.macHash, password, parsed.macSalt, parsed.iterations);
    const cryptoKey = await globalThis.crypto.subtle.importKey(
        "raw",
        toBufferSource(key),
        { name: "HMAC", hash: parsed.macHash.name },
        false,
        ["sign"],
    );
    const mac = new Uint8Array(await globalThis.crypto.subtle.sign("HMAC", cryptoKey, toBufferSource(parsed.authSafe)));
    return bytesEqual(mac, parsed.macDigest);
}
