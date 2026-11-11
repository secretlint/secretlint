# input.p12 with SHA-512 MAC

- PKCS12 file whose top-level MAC uses SHA-512 (openssl `-macalg sha512`).
- Password is `notasecret` so it is treated as a GCP service account p12.

## Create Test data

```
openssl pkcs12 -export -in pubkey.crt -inkey prvkey.pem -out input.p12 -password "pass:notasecret" -macalg sha512
```
