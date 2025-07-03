# @secretlint/secretlint-rule-database-connection-string

A secretlint rule for detecting hardcoded credentials in database connection strings.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-database-connection-string

## MessageIDs

### MongoDBConnection

Report when hardcoded credentials are found in MongoDB connection strings.

**Good:**
```
const uri = "mongodb://localhost:27017/mydb";
const uri = "mongodb://username:${PASSWORD}@host:27017/mydb";
```

**Bad:**
```
const uri = "mongodb://user:realpassword123@cluster.mongodb.net/mydb";
```

### MySQLConnection

Report when hardcoded credentials are found in MySQL connection strings.

**Good:**
```
const uri = "mysql://localhost:3306/mydb";
const uri = "mysql://user:${PASSWORD}@host:3306/mydb";
```

**Bad:**
```
const uri = "mysql://admin:secretpassword@db.example.com:3306/mydb";
```

### PostgreSQLConnection

Report when hardcoded credentials are found in PostgreSQL connection strings.

**Good:**
```
const uri = "postgresql://localhost:5432/mydb";
const uri = "postgres://user:${PASSWORD}@host:5432/mydb";
```

**Bad:**
```
const uri = "postgresql://user:mypassword123@db.example.com:5432/mydb";
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Running tests

No Test to avoid Dependency cycles.

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/secretlint/secretlint/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT © azu
