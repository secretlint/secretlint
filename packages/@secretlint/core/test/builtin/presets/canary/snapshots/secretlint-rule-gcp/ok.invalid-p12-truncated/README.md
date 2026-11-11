# truncated PKCS#12 file

- First 200 bytes of `ng.privatekey-p12/input.p12` — enough to look like the start of a PKCS#12 but missing the bulk of the structure.
- Used to verify the parser rejects truncated input cleanly.
