window.BENCHMARK_DATA = {
  "lastUpdate": 1582460400282,
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
          "id": "e80b87ef0a3cee8320bb613dc7eabf7939ed0eeb",
          "message": "ci(test): use branches-ignore",
          "timestamp": "2020-02-21T00:26:00+09:00",
          "tree_id": "d2b22021c3184e1a40f4bbf366241036e35185b2",
          "url": "https://github.com/secretlint/secretlint/commit/e80b87ef0a3cee8320bb613dc7eabf7939ed0eeb"
        },
        "date": 1582212486197,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.02,
            "range": "±2.03%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.98,
            "range": "±1.63%",
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
          "id": "48c25d41f3c9cdb2b27b978d70954e4f82207a30",
          "message": "ci(test): fix",
          "timestamp": "2020-02-21T00:29:51+09:00",
          "tree_id": "1c0b95e587910978c819e4472546f1febc72541b",
          "url": "https://github.com/secretlint/secretlint/commit/48c25d41f3c9cdb2b27b978d70954e4f82207a30"
        },
        "date": 1582212711640,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.22,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 1.05,
            "range": "±2.23%",
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
          "id": "69a43c6e6668976c704db0eb3e6a163f6548a610",
          "message": "ci(test): fix",
          "timestamp": "2020-02-21T00:34:43+09:00",
          "tree_id": "3e7a30b67a2055dcaf3de614e9cf5dfec29131f2",
          "url": "https://github.com/secretlint/secretlint/commit/69a43c6e6668976c704db0eb3e6a163f6548a610"
        },
        "date": 1582213014187,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.89,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.92,
            "range": "±1.58%",
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
          "id": "0f86e5415f0c249c6f5c2dfbf44465f0c58ce56e",
          "message": "feat(profiler): add --profiler flag (#40)\n\n* feat(profiler): add --profiler flag\r\n\r\n* chore(profiler): suppress test\r\n\r\n* chore(cli): add pattern\r\n\r\n* chore(profiler): wait for complete measure\r\n\r\n* fix(config-validator): add dependencies",
          "timestamp": "2020-02-21T12:27:31+09:00",
          "tree_id": "e392998f625d7afa1bb6a0a20071324ec264ed4d",
          "url": "https://github.com/secretlint/secretlint/commit/0f86e5415f0c249c6f5c2dfbf44465f0c58ce56e"
        },
        "date": 1582255774995,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.82,
            "range": "±0.65%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.71,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "88418baea0b9e8a2134aee084e5603fb0cfa0110",
          "message": "chore(deps): Update to TypeScript@3.8 (#42)\n\n* chore(deps): Update to TypeScript@3.8\r\n\r\n* fix(core): fix wrong parameter type",
          "timestamp": "2020-02-23T19:55:13+09:00",
          "tree_id": "64fea7489d118d6e0577b48c7b51ad4d9ca6ce36",
          "url": "https://github.com/secretlint/secretlint/commit/88418baea0b9e8a2134aee084e5603fb0cfa0110"
        },
        "date": 1582455429887,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.06,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.81,
            "range": "±1.87%",
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
          "id": "17b85709be9558a744d2164884a9810a46e53635",
          "message": "fix(cli): prevent to output profile if no --profile flag",
          "timestamp": "2020-02-23T20:26:14+09:00",
          "tree_id": "c18109cb6b164cfe8506f58c618b40e66f64fca1",
          "url": "https://github.com/secretlint/secretlint/commit/17b85709be9558a744d2164884a9810a46e53635"
        },
        "date": 1582457301778,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.98,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.79,
            "range": "±0.87%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "50116f6bdf06ae95f7afc4d9c5e35dedaeeb9aca",
          "message": "Add parent context (#43)\n\n* feat(formatter): output parent id\r\n\r\nfix #28\r\n\r\n* test(formatter): add output\r\n\r\n* test(cli): update snapshot",
          "timestamp": "2020-02-23T21:18:05+09:00",
          "tree_id": "3db33dcef22f7c479fdce14de7e69601766cd9cf",
          "url": "https://github.com/secretlint/secretlint/commit/50116f6bdf06ae95f7afc4d9c5e35dedaeeb9aca"
        },
        "date": 1582460399757,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.12,
            "range": "±1.55%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.84,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "7 samples"
          }
        ]
      }
    ]
  }
}