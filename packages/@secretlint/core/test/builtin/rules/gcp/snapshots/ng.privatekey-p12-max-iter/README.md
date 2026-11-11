# PKCS#12 with MAC iteration count at the cap

- openssl `-iter 100000` — exactly `MAX_MAC_ITERATIONS`, so the MAC is still verified and the rule reports it.

## Create Test data

```
openssl pkcs12 -export -in ../ng.privatekey-p12/pubkey.crt -inkey ../ng.privatekey-p12/prvkey.pem -passin "pass:notasecret" -out input.p12 -password "pass:notasecret" -iter 100000
```
