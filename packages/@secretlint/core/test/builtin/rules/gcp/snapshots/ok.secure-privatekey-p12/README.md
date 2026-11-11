#  input.p12 with `secure` password

## Create Test data

```
export PASS="secure"
openssl genrsa -aes256 -passout "pass:${PASS}" -out ./prvkey.pem 2048
openssl req -new -key ./prvkey.pem -out req.csr -passin "pass:${PASS}"
openssl x509 -req -in req.csr -signkey prvkey.pem -out pubkey.crt -days 36500 -passin "pass:${PASS}"
openssl pkcs12 -export -in pubkey.crt -inkey prvkey.pem -out input.p12 -passin "pass:${PASS}" -password "pass:${PASS}"
```

## References

* [JavaScriptでp12ファイルから証明書と秘密鍵を取得する | MMMブログ](https://blog.mmmcorp.co.jp/blog/2018/12/17/p12-to-pem-with-js/)
* [開発用のPKCS#12ファイルをOpenSSLで出来るだけ速く作る – One IT Thing](https://one-it-thing.com/5624/)

