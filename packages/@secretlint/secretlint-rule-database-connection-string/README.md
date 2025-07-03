# @secretlint/secretlint-rule-database-connection-string

A Secretlint rule to detect hardcoded passwords in database connection strings for MongoDB, MySQL, and PostgreSQL.

This rule detects URI format database connection strings that contain hardcoded credentials for MongoDB, MySQL, and PostgreSQL.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-database-connection-string

## MessageIDs

### MongoDBConnection

Report when hardcoded credentials are found in MongoDB connection strings.

Detects:
- Standard URI format: `mongodb://user:password@host:port/database`
- MongoDB Atlas SRV format: `mongodb+srv://user:password@cluster.mongodb.net/database`
- Connection strings within quoted strings and environment variable assignments

**Good:**
```
const uri = "mongodb://localhost:27017/mydb";
const uri = "mongodb://username:${PASSWORD}@host:27017/mydb";
const uri = "mongodb://username:REPLACE_WITH_PASSWORD@localhost:27017/mydb";  // placeholder
const uri = "mongodb+srv://user:{password}@cluster.mongodb.net/test";
```

**Bad:**
```
const uri = "mongodb://user:s3cr3tP4ss@cluster.mongodb.net/mydb";
MONGO_URI="mongodb://admin:realP@ssw0rd@cluster.mongodb.net/production";
mongodb+srv://app:c0mpl3xPwd@cluster0.mongodb.net/mydb?retryWrites=true;
```

### MySQLConnection

Report when hardcoded credentials are found in MySQL connection strings.

Detects:
- URI format: `mysql://user:password@host:port/database`
- JDBC format: `jdbc:mysql://user:password@host:port/database`
- X DevAPI format: `mysqlx://user:password@host:port/database`

**Good:**
```
const uri = "mysql://localhost:3306/mydb";
const uri = "mysql://user:${PASSWORD}@host:3306/mydb";
const uri = "mysql://user:REPLACE_WITH_PASSWORD@localhost:3306/mydb";  // placeholder
```

**Bad:**
```
const uri = "mysql://user:hardcodedpass@db.example.com:3306/mydb";
const jdbc = "jdbc:mysql://admin:s3cr3tPwd@db.company.com:3306/app";
```

### PostgreSQLConnection

Report when hardcoded credentials are found in PostgreSQL connection strings.

Detects:
- URI format: `postgresql://user:password@host:port/database`
- Alternative URI format: `postgres://user:password@host:port/database`

**Good:**
```
const uri = "postgresql://localhost:5432/mydb";
const uri = "postgres://user:${PASSWORD}@host:5432/mydb";
const uri = "postgres://user:REPLACE_WITH_PASSWORD@localhost:5432/mydb";  // placeholder
```

**Bad:**
```
const uri = "postgres://user:secretpass@db.example.com:5432/mydb";
create_engine('postgresql://postgres:c0mpl3xPwd@host:5432/mydb')
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string) to exclude specific patterns from detection.

## False Positive Prevention

This rule includes several mechanisms to prevent false positives:

1. **Variable Pattern Detection**: Automatically ignores common variable patterns like `${PASSWORD}`, `{password}`, `{{username}}`
2. **Placeholder Detection**: Skips common placeholder values like `password`, `username`, `YOUR_PASSWORD`, etc.
3. **Entropy Analysis**: Uses entropy calculation to distinguish real passwords from simple placeholder text
4. **Minimum Length**: Requires passwords to be at least 4 characters long to reduce noise

Example patterns that are **ignored**:
```
mongodb://username:password@localhost:27017/database
mysql://user:${PASSWORD}@host:3306/db
postgresql://{username}:{password}@host:5432/db
```

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
