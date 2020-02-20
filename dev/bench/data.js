window.BENCHMARK_DATA = {
  "lastUpdate": 1582212313860,
  "repoUrl": "https://github.com/secretlint/secretlint",
  "entries": {
    "Secretlint benchmark": [
      {
        "commit": {
          "author": {
            "email": "azuciao@gmail.com",
            "name": "azu",
            "username": "azu"
          },
          "committer": {
            "email": "azuciao@gmail.com",
            "name": "azu",
            "username": "azu"
          },
          "distinct": true,
          "id": "82a18a55dfa08486e1ece1be8072c928ab92880a",
          "message": "fix(example): fix example",
          "timestamp": "2020-02-20T15:51:38+09:00",
          "tree_id": "2ac45310d53542bf8f2df4a0ea79015f3959540f",
          "url": "https://github.com/secretlint/secretlint/commit/82a18a55dfa08486e1ece1be8072c928ab92880a"
        },
        "date": 1582181620581,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.88,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.83,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "7 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "azuciao@gmail.com",
            "name": "azu",
            "username": "azu"
          },
          "committer": {
            "email": "azuciao@gmail.com",
            "name": "azu",
            "username": "azu"
          },
          "distinct": true,
          "id": "73893d6e385d223e629689f9cd7aa5b35d92cbd8",
          "message": "fix(example): use preset",
          "timestamp": "2020-02-20T15:54:15+09:00",
          "tree_id": "e82118152d64faf32a1dc90a4fac35d3afea5576",
          "url": "https://github.com/secretlint/secretlint/commit/73893d6e385d223e629689f9cd7aa5b35d92cbd8"
        },
        "date": 1582181775661,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.12,
            "range": "±3.13%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.94,
            "range": "±3.13%",
            "unit": "ops/sec",
            "extra": "7 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "azuciao@gmail.com",
            "name": "azu",
            "username": "azu"
          },
          "committer": {
            "email": "azuciao@gmail.com",
            "name": "azu",
            "username": "azu"
          },
          "distinct": true,
          "id": "37e3dfb0be03f78da555a48b709f0c3de005b156",
          "message": "docs: fix typo",
          "timestamp": "2020-02-20T15:55:52+09:00",
          "tree_id": "f5e53f1678d81bef054546ba632744127de8ab75",
          "url": "https://github.com/secretlint/secretlint/commit/37e3dfb0be03f78da555a48b709f0c3de005b156"
        },
        "date": 1582181881464,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.77,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.81,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "7 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "azu@users.noreply.github.com",
            "name": "azu",
            "username": "azu"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3883c7578de38854aba2d1d20b8f167c8275f1c9",
          "message": "feat(rule): add `supportedContentTypes` to rule `meta` (#39)\n\n* feat(rule): add `supportedContentTypes` to rule `meta`\r\n\r\nIt optimize that secretlint can skip large binary file like binary file.\r\nAlmost rules only support \"text\", so we need to skip binary file by each rule's meta.\r\n\r\n* chore: fix comment\r\n\r\n* test(core): fix core test\r\n\r\n* test(source-creator): fix test",
          "timestamp": "2020-02-21T00:16:17+09:00",
          "tree_id": "2796d1008faf0c0a1227f4ab679a9dd890987d13",
          "url": "https://github.com/secretlint/secretlint/commit/3883c7578de38854aba2d1d20b8f167c8275f1c9"
        },
        "date": 1582211888321,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.09,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.91,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "7 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "azuciao@gmail.com",
            "name": "azu",
            "username": "azu"
          },
          "committer": {
            "email": "azuciao@gmail.com",
            "name": "azu",
            "username": "azu"
          },
          "distinct": true,
          "id": "1e2eb3eb61b6198619e0283bb05ede28f4a1d5b0",
          "message": "perf(core): skip lint with rule if the rule does not support contentType\n\nFollow up #39",
          "timestamp": "2020-02-21T00:23:01+09:00",
          "tree_id": "b08f7a417d5ae3b17e22938da00a5696ac31b5f2",
          "url": "https://github.com/secretlint/secretlint/commit/1e2eb3eb61b6198619e0283bb05ede28f4a1d5b0"
        },
        "date": 1582212313077,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.89,
            "range": "±2.66%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.91,
            "range": "±2.76%",
            "unit": "ops/sec",
            "extra": "7 samples"
          }
        ]
      }
    ]
  }
}