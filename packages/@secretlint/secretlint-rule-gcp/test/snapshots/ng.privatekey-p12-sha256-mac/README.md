# input.p12 with SHA-256 MAC (openssl 3 default)

- PKCS12 format using openssl 3.0+ which emits SHA-256 MAC by default.
- Password is `notasecret` so this is treated as a GCP service account p12.

## Create Test data

```
export PASS="notasecret"
openssl genrsa -out prvkey.pem 2048
openssl req -new -key prvkey.pem -subj "/CN=test" -out req.csr
openssl x509 -req -in req.csr -signkey prvkey.pem -out pubkey.crt -days 365
openssl pkcs12 -export -in pubkey.crt -inkey prvkey.pem -out input.p12 -password "pass:${PASS}"
```
