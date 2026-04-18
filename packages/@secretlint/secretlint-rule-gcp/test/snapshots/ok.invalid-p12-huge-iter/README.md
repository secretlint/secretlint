# PKCS#12 with excessive MAC iteration count

- openssl `-iter 2000000` — above our `MAX_MAC_ITERATIONS` cap.
- The cap exists to stop a crafted .p12 from DoS'ing the scanner by forcing millions of digest calls. This fixture exercises that guard: parsing rejects it and the rule does not fire, even though the password is `notasecret`.

## Create Test data

```
openssl pkcs12 -export -in pubkey.crt -inkey prvkey.pem -out input.p12 -password "pass:notasecret" -iter 2000000
```
