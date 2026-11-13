# ok.json-escaped-key

The key `private_key_id` is written with a unicode escape (`"\u0070rivate_key_id"`).

The gcp rule looks for the text `private_key_id` before it parses a file as JSON, so it does not report this file.
The key file that Google Cloud creates does not escape the key.
