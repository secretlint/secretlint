# PKCS#12 file without MAC

- Emitted by openssl with `-nomac`. Our verifier requires a MacData field to authenticate the password, so a file without one is not detected as GCP even if the password were `notasecret`.

## Create Test data

```
openssl pkcs12 -export -in pubkey.crt -inkey prvkey.pem -out input.p12 -password "pass:notasecret" -nomac
```
