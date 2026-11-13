# PKCS#12 with MAC iteration count just above the cap

- openssl `-iter 100001` — one above `MAX_MAC_ITERATIONS`, so parsing rejects it and the rule does not fire even though the password is `notasecret`.

## Create Test data

```
openssl pkcs12 -export -in ../ng.privatekey-p12/pubkey.crt -inkey ../ng.privatekey-p12/prvkey.pem -passin "pass:notasecret" -out input.p12 -password "pass:notasecret" -iter 100001
```
