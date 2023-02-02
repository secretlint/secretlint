window.BENCHMARK_DATA = {
  "lastUpdate": 1675300942290,
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
          "id": "3b0daef862bbd7b894216963ad43503fa960c390",
          "message": "docs(CONTRIBUTION): add snapshot testing",
          "timestamp": "2020-02-23T21:23:02+09:00",
          "tree_id": "d9c323742247e89dc7552628ae9a3916082d9c40",
          "url": "https://github.com/secretlint/secretlint/commit/3b0daef862bbd7b894216963ad43503fa960c390"
        },
        "date": 1582460696225,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.27,
            "range": "±2.04%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.89,
            "range": "±2.39%",
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
          "id": "ed95207e606100c39f781b7ad4675ccc293efb4f",
          "message": "docs(CONTRIBUTION): fix tests",
          "timestamp": "2020-02-23T21:25:42+09:00",
          "tree_id": "a77b9cd5c4e8e3818f29331be94923bfec722485",
          "url": "https://github.com/secretlint/secretlint/commit/ed95207e606100c39f781b7ad4675ccc293efb4f"
        },
        "date": 1582460864471,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.04,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.8,
            "range": "±2.48%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "dac405de9fab0bb70ecdb3701790e6f0bad48ca3",
          "message": "v0.2.0",
          "timestamp": "2020-02-23T21:28:50+09:00",
          "tree_id": "83784db5fd31b701684ba91a9577c32d456cf842",
          "url": "https://github.com/secretlint/secretlint/commit/dac405de9fab0bb70ecdb3701790e6f0bad48ca3"
        },
        "date": 1582461054521,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.15,
            "range": "±2.10%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.84,
            "range": "±1.42%",
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
          "id": "7e4e40a3ecefb0f1c2ded1b6aca4217dd14edcbd",
          "message": "Merge pull request #46 from secretlint/secretlint-rule-basicauth\n\nfeat(basicauth): add @secretlint/secretlint-rule-basicauth",
          "timestamp": "2020-02-23T22:25:45+09:00",
          "tree_id": "23279a988ddb5a75dfee0b885910d1e0d264be31",
          "url": "https://github.com/secretlint/secretlint/commit/7e4e40a3ecefb0f1c2ded1b6aca4217dd14edcbd"
        },
        "date": 1582464456315,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.21,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.81,
            "range": "±1.86%",
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
          "id": "3fcb7dbbde9b185000abaef411ccc6ebcc253066",
          "message": "feat(secretlint-scripts): add secretlint-scripts is wrapper of tsc",
          "timestamp": "2020-02-24T00:04:33+09:00",
          "tree_id": "07af763925d1013cdfa1c103725a36b5ad3b60cf",
          "url": "https://github.com/secretlint/secretlint/commit/3fcb7dbbde9b185000abaef411ccc6ebcc253066"
        },
        "date": 1582470464282,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.59,
            "range": "±0.99%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±4.88%",
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
          "id": "13e31c44b1a811209bb218be891fb244b699ff7b",
          "message": "Merge pull request #48 from secretlint/slack\n\nfeat: add @secretlint/secretlint-rule-slack",
          "timestamp": "2020-02-24T11:43:45+09:00",
          "tree_id": "ad2de7544cf1d5746ad07cec52e4bc35f86dbd43",
          "url": "https://github.com/secretlint/secretlint/commit/13e31c44b1a811209bb218be891fb244b699ff7b"
        },
        "date": 1582512371510,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.61,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±1.57%",
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
          "id": "dc1a1675fdfc88d4a2b0aa5484ed50aaa506a9d2",
          "message": "Merge pull request #51 from teppeis/patch-1\n\ndocs(readme): fix typo",
          "timestamp": "2020-02-24T11:57:56+09:00",
          "tree_id": "d44746757b5f0f377229d59aadbaa8f0cd40b51b",
          "url": "https://github.com/secretlint/secretlint/commit/dc1a1675fdfc88d4a2b0aa5484ed50aaa506a9d2"
        },
        "date": 1582513206885,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.8,
            "range": "±1.07%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "f64a1ec72a74d1dd2c098e28b083f4fd05f9c78d",
          "message": "chore(deps): update lock",
          "timestamp": "2020-02-24T15:38:52+09:00",
          "tree_id": "ff91cd9221efc3bb397f1dbf24102ab2946da898",
          "url": "https://github.com/secretlint/secretlint/commit/f64a1ec72a74d1dd2c098e28b083f4fd05f9c78d"
        },
        "date": 1582526481801,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.74,
            "range": "±0.73%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "09c0f395396aed20b9dcba97ffcbad51a3dfdfbc",
          "message": "ci(binary): remove paths",
          "timestamp": "2020-02-24T15:40:53+09:00",
          "tree_id": "0a4f18fed12a4fe5afd1c1219f88ac5550d229bc",
          "url": "https://github.com/secretlint/secretlint/commit/09c0f395396aed20b9dcba97ffcbad51a3dfdfbc"
        },
        "date": 1582526600788,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.74,
            "range": "±0.57%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±1.21%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "e4e237d388b204080f6f3e39551d2a7e840b7d4e",
          "message": "chore(binary): fix version",
          "timestamp": "2020-02-24T15:41:13+09:00",
          "tree_id": "e6dc43190fa625aba0c9a95db6d396383b791cd1",
          "url": "https://github.com/secretlint/secretlint/commit/e4e237d388b204080f6f3e39551d2a7e840b7d4e"
        },
        "date": 1582526821723,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.9,
            "range": "±2.26%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.69,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "557c3c272d13e186c50a937c0458bbfc0e9ea090",
          "message": "ci(binary): disable windows",
          "timestamp": "2020-02-24T15:55:11+09:00",
          "tree_id": "b6d4bb36dc9308ea9ac9d10caeb34a95c89be0bb",
          "url": "https://github.com/secretlint/secretlint/commit/557c3c272d13e186c50a937c0458bbfc0e9ea090"
        },
        "date": 1582527446978,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.89,
            "range": "±3.07%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.73,
            "range": "±5.60%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "7bb26a5f4c955008e02d8447cb2e81f876e6a5f6",
          "message": "chore(deps): update lock",
          "timestamp": "2020-02-24T18:12:06+09:00",
          "tree_id": "6d12ba8927a6f6d273ea2482fc642f5480071c3a",
          "url": "https://github.com/secretlint/secretlint/commit/7bb26a5f4c955008e02d8447cb2e81f876e6a5f6"
        },
        "date": 1582535675449,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.69,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "e21031d59d558dd56f8fd27ef814cf594758885f",
          "message": "chore(binary): build: false",
          "timestamp": "2020-02-24T19:59:16+09:00",
          "tree_id": "e880a6de20a3e5883c0413b79fde27d2fb98bde1",
          "url": "https://github.com/secretlint/secretlint/commit/e21031d59d558dd56f8fd27ef814cf594758885f"
        },
        "date": 1582542097191,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.91,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.71,
            "range": "±1.77%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "6b624a62c1d3f2d991bd9fef312de8cf9068c15b",
          "message": "ci(binary): pin version",
          "timestamp": "2020-02-24T20:11:34+09:00",
          "tree_id": "933b2ccc8de00a5de3642238f772375d9a06cc46",
          "url": "https://github.com/secretlint/secretlint/commit/6b624a62c1d3f2d991bd9fef312de8cf9068c15b"
        },
        "date": 1582542849520,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.65,
            "range": "±1.07%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "be867d0f8d6088fecf737b9eb4b1845fb1d418a5",
          "message": "ci(binary): fix node_version",
          "timestamp": "2020-02-24T20:20:11+09:00",
          "tree_id": "ab70a08328f51846a67338c42650fcd563d1cd5d",
          "url": "https://github.com/secretlint/secretlint/commit/be867d0f8d6088fecf737b9eb4b1845fb1d418a5"
        },
        "date": 1582543359769,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.72,
            "range": "±0.98%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±0.47%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "63e4e292e587501d88e8260a762758e1e7b880dd",
          "message": "fix(binary): suppress fs error",
          "timestamp": "2020-02-24T20:24:04+09:00",
          "tree_id": "8c412227969abc36765c8f515450862a4bdc93c0",
          "url": "https://github.com/secretlint/secretlint/commit/63e4e292e587501d88e8260a762758e1e7b880dd"
        },
        "date": 1582543592814,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.73,
            "range": "±0.64%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "bc498e7f6c7e95c96ec6e4891400582f38dea57d",
          "message": "ci(binary): fix working dir",
          "timestamp": "2020-02-24T20:51:15+09:00",
          "tree_id": "884de7cd5993c48a606a0a14874a726b27319890",
          "url": "https://github.com/secretlint/secretlint/commit/bc498e7f6c7e95c96ec6e4891400582f38dea57d"
        },
        "date": 1582545221103,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.78,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.66,
            "range": "±1.24%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "e3b6ea955b261dd387b504d70b6f1cb0225d23a9",
          "message": "fix",
          "timestamp": "2020-02-24T21:07:33+09:00",
          "tree_id": "76aa84a17c9e6ead1b082dba2732b34a42ea2c96",
          "url": "https://github.com/secretlint/secretlint/commit/e3b6ea955b261dd387b504d70b6f1cb0225d23a9"
        },
        "date": 1582546188352,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.16,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.8,
            "range": "±3.28%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "88d5df9d70fa887627798c909ac5d4a7276327b7",
          "message": "ci(binary): use latest",
          "timestamp": "2020-02-24T21:26:29+09:00",
          "tree_id": "bef057b25c791475b9c2726cd601d2fe5f473e25",
          "url": "https://github.com/secretlint/secretlint/commit/88d5df9d70fa887627798c909ac5d4a7276327b7"
        },
        "date": 1582547344429,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.7,
            "range": "±1.24%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±1.81%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "b462b35b24eab3a58a36d2c2b9c41006e8ab3eb3",
          "message": "chore(deps): update lock",
          "timestamp": "2020-02-26T23:31:14+09:00",
          "tree_id": "c22e87968232889f348618fbd6e35f5be3333fd7",
          "url": "https://github.com/secretlint/secretlint/commit/b462b35b24eab3a58a36d2c2b9c41006e8ab3eb3"
        },
        "date": 1582727624622,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.72,
            "range": "±0.95%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±0.94%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "48a820e1b3ded16b188f4b155f01dbd77d4f7771",
          "message": "docs(docker): update README",
          "timestamp": "2020-02-26T23:32:44+09:00",
          "tree_id": "74293ba8d9fccf0334f022fda610ee84938fea39",
          "url": "https://github.com/secretlint/secretlint/commit/48a820e1b3ded16b188f4b155f01dbd77d4f7771"
        },
        "date": 1582727708672,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.8,
            "range": "±0.69%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "1baa24161f9f64fe40f392d3719f5396aa6913b4",
          "message": "fix(aws): fix false-positive _KEY=XXX pattern",
          "timestamp": "2020-02-27T15:16:41+09:00",
          "tree_id": "9d784eaf25fe3a9d20c2307bbaccc0a10948762e",
          "url": "https://github.com/secretlint/secretlint/commit/1baa24161f9f64fe40f392d3719f5396aa6913b4"
        },
        "date": 1582784364356,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.6,
            "range": "±2.99%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "2197b7efd27d93bd30b86f70b2a1cc8b2a332408",
          "message": "test: update snapshot",
          "timestamp": "2020-02-27T15:16:58+09:00",
          "tree_id": "2d844c2916abfbe2b3b5eb5d3ed07975de0927de",
          "url": "https://github.com/secretlint/secretlint/commit/2197b7efd27d93bd30b86f70b2a1cc8b2a332408"
        },
        "date": 1582784382497,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.73,
            "range": "±1.73%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±2.64%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "44a734fa89514b53d6bf0dfe2d0075204f3d75f2",
          "message": "v0.3.0",
          "timestamp": "2020-02-27T15:24:00+09:00",
          "tree_id": "620510f1bf975d1872c73498f6d57bcfb44e8246",
          "url": "https://github.com/secretlint/secretlint/commit/44a734fa89514b53d6bf0dfe2d0075204f3d75f2"
        },
        "date": 1582784785060,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.79,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±2.64%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "a89e59992bbcf042592b8531f753d79cdc734590",
          "message": "fix(binary-compiler): use name includes OS",
          "timestamp": "2020-02-27T15:37:07+09:00",
          "tree_id": "1c65e502a989d7e37aee8c3cebfa55501d388659",
          "url": "https://github.com/secretlint/secretlint/commit/a89e59992bbcf042592b8531f753d79cdc734590"
        },
        "date": 1582785570747,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.87,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.67,
            "range": "±2.04%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "9c72c340c49c2c69817e3d0ab86aa06b1a4a3f8a",
          "message": "CI(docker): split steps",
          "timestamp": "2020-02-27T15:59:25+09:00",
          "tree_id": "2a78f17d02fce2218fd338e8ee608ce7526b7a45",
          "url": "https://github.com/secretlint/secretlint/commit/9c72c340c49c2c69817e3d0ab86aa06b1a4a3f8a"
        },
        "date": 1582786923824,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.63,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±1.28%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "b79b0aec75c4e7bb6863d1b72484c383adfbde22",
          "message": "CI(docker): split steps",
          "timestamp": "2020-02-27T16:04:10+09:00",
          "tree_id": "b33df8712d0d996067ca30d7180710cadec6a521",
          "url": "https://github.com/secretlint/secretlint/commit/b79b0aec75c4e7bb6863d1b72484c383adfbde22"
        },
        "date": 1582787206603,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.68,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±2.04%",
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
          "id": "bed1d57ba6bf543e2403d28006f3bf4710ac1e32",
          "message": "Merge pull request #57 from numb86/switch-rules-to-messages\n\ndocs(packages): change \"Rules\" to \"Messages\"",
          "timestamp": "2020-02-27T16:05:17+09:00",
          "tree_id": "f9702c55e6ca463770281cfdcfe56c316ff4825f",
          "url": "https://github.com/secretlint/secretlint/commit/bed1d57ba6bf543e2403d28006f3bf4710ac1e32"
        },
        "date": 1582787250566,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.05,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.74,
            "range": "±2.81%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "3906d9d08b0486c1ee2a335c766ce6bedf81f85c",
          "message": "CI(docker): fix name",
          "timestamp": "2020-02-27T16:08:50+09:00",
          "tree_id": "f14502c266937a91180bb12883f76bb701b746bd",
          "url": "https://github.com/secretlint/secretlint/commit/3906d9d08b0486c1ee2a335c766ce6bedf81f85c"
        },
        "date": 1582787480776,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.69,
            "range": "±0.87%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±1.39%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "fefbc5e7ab2f5d67e62b8533b0f86e307749136a",
          "message": "CI(docker): fix name",
          "timestamp": "2020-02-27T16:10:26+09:00",
          "tree_id": "aaf058c6cc75ad84ddc27305d5897346fa561a52",
          "url": "https://github.com/secretlint/secretlint/commit/fefbc5e7ab2f5d67e62b8533b0f86e307749136a"
        },
        "date": 1582787577939,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.72,
            "range": "±2.70%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±3.08%",
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
          "id": "d13b138fd269654eb5543f0bcc36bf8962ea3f10",
          "message": "Merge pull request #58 from secretlint/core-filter\n\nfeat(core): support Context#ignore method",
          "timestamp": "2020-02-27T21:56:10+09:00",
          "tree_id": "a93071df4f2213d9e7648b0220d9712b02582804",
          "url": "https://github.com/secretlint/secretlint/commit/d13b138fd269654eb5543f0bcc36bf8962ea3f10"
        },
        "date": 1582808327568,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.63,
            "range": "±3.27%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±3.23%",
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
          "id": "a5f06720253701c2c9b9ecc0f9e04cf865bac079",
          "message": "Merge pull request #59 from secretlint/core-messages-filter\n\nfeat(core): support \"allowMessages\" options",
          "timestamp": "2020-02-28T10:14:21+09:00",
          "tree_id": "a2df8f4e82583690204d6228310a5cbc30877b4f",
          "url": "https://github.com/secretlint/secretlint/commit/a5f06720253701c2c9b9ecc0f9e04cf865bac079"
        },
        "date": 1582852607583,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.66,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "fe3020a7949f27db05d6796828d02402f6802007",
          "message": "Update README",
          "timestamp": "2020-02-28T10:31:36+09:00",
          "tree_id": "714f760564a48b6dbdd2582bbb1e1b08c003d56d",
          "url": "https://github.com/secretlint/secretlint/commit/fe3020a7949f27db05d6796828d02402f6802007"
        },
        "date": 1582853643130,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.78,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.66,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "b1458e1ff9ee3d1cf7d2c8bb31879714b6751c09",
          "message": "v0.4.0",
          "timestamp": "2020-02-28T10:31:55+09:00",
          "tree_id": "c64c754730e86c04bb241005fb3dfdd55ccd4222",
          "url": "https://github.com/secretlint/secretlint/commit/b1458e1ff9ee3d1cf7d2c8bb31879714b6751c09"
        },
        "date": 1582853671161,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.65,
            "range": "±2.22%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "ae0100caffc57b7b216a1fa10553f3c88fcf3eaa",
          "message": "Update README",
          "timestamp": "2020-02-28T10:38:35+09:00",
          "tree_id": "38297141af6a600af46c609ed9466ae0e570da2b",
          "url": "https://github.com/secretlint/secretlint/commit/ae0100caffc57b7b216a1fa10553f3c88fcf3eaa"
        },
        "date": 1582854056001,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.79,
            "range": "±0.93%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.66,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "2af45606f7a9fdd421526846d6f6c25449e52525",
          "message": "Update README",
          "timestamp": "2020-02-28T10:44:11+09:00",
          "tree_id": "0b9d927ccffbe21fe11070cd675a2982fd933fec",
          "url": "https://github.com/secretlint/secretlint/commit/2af45606f7a9fdd421526846d6f6c25449e52525"
        },
        "date": 1582854398986,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.74,
            "range": "±1.00%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "170d607ac374676c592c046aded838bed160fb09",
          "message": "Update README",
          "timestamp": "2020-02-28T10:45:27+09:00",
          "tree_id": "c1f11c2ffe83dd60a2f2f0b104c61edbe890110f",
          "url": "https://github.com/secretlint/secretlint/commit/170d607ac374676c592c046aded838bed160fb09"
        },
        "date": 1582854465259,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.88,
            "range": "±2.82%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.71,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "95449d5612df7a1d00310c4af612534e7357d2fc",
          "message": "chore(core): rename `allowMessages` to `allowMessageIds`",
          "timestamp": "2020-02-28T10:57:15+09:00",
          "tree_id": "7d72b82be35eaba46a3646cdf4136706f775519b",
          "url": "https://github.com/secretlint/secretlint/commit/95449d5612df7a1d00310c4af612534e7357d2fc"
        },
        "date": 1582855185112,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.81,
            "range": "±1.14%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.67,
            "range": "±2.26%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "44896ffd81a3257ad8e258cdf4e7ec55a7d99d8c",
          "message": "Update README",
          "timestamp": "2020-02-28T11:20:56+09:00",
          "tree_id": "9e4d0420acac62b6f61737672c300d15068fab97",
          "url": "https://github.com/secretlint/secretlint/commit/44896ffd81a3257ad8e258cdf4e7ec55a7d99d8c"
        },
        "date": 1582856613293,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.68,
            "range": "±0.74%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "82a20fd707390a2a111d056d8f8243116830c767",
          "message": "Update README",
          "timestamp": "2020-02-28T11:24:59+09:00",
          "tree_id": "12c4b2eab2a9120ae11588054adef399fa3c8513",
          "url": "https://github.com/secretlint/secretlint/commit/82a20fd707390a2a111d056d8f8243116830c767"
        },
        "date": 1582856849957,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.67,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±2.78%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "152abdd8ebb1b9147af83366f2d8bdcb98065664",
          "message": "CI(docker): fix SECRETLINT_VERSION",
          "timestamp": "2020-02-28T11:49:11+09:00",
          "tree_id": "c76f7739b030e0eab56450e6d75d83b38616c463",
          "url": "https://github.com/secretlint/secretlint/commit/152abdd8ebb1b9147af83366f2d8bdcb98065664"
        },
        "date": 1582858299002,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.75,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.66,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "9ba2847828c14aa722de0a7e74208f38e75c231f",
          "message": "CI(docker): fix SECRETLINT_VERSION",
          "timestamp": "2020-02-28T11:54:20+09:00",
          "tree_id": "289539149ed78181e0c4e7d5d4554b2ec04cb768",
          "url": "https://github.com/secretlint/secretlint/commit/9ba2847828c14aa722de0a7e74208f38e75c231f"
        },
        "date": 1582858606020,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.8,
            "range": "±1.20%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.66,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "0bf11aedc033bd4217040f2198b3b43cc4197372",
          "message": "fix(aws): remove console.log",
          "timestamp": "2020-02-28T11:58:53+09:00",
          "tree_id": "5ff141200db2288ff2f25a1e192214b1d12c3391",
          "url": "https://github.com/secretlint/secretlint/commit/0bf11aedc033bd4217040f2198b3b43cc4197372"
        },
        "date": 1582858895671,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.6,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "6fc61f4be471835dd492b1d890f20b1c9361e0c6",
          "message": "docs(rule): add word boundary doc",
          "timestamp": "2020-02-28T15:29:59+09:00",
          "tree_id": "21ff4ab3ead7217436ca21386d57a43e1cee0f12",
          "url": "https://github.com/secretlint/secretlint/commit/6fc61f4be471835dd492b1d890f20b1c9361e0c6"
        },
        "date": 1582871547845,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.76,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.66,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "d0a8f0202151e379c8f8c4203122fde37a2f0022",
          "message": "v0.4.1",
          "timestamp": "2020-02-28T15:30:20+09:00",
          "tree_id": "7a83a3992d9d975ce1f4ce40ccb507f0117dc46f",
          "url": "https://github.com/secretlint/secretlint/commit/d0a8f0202151e379c8f8c4203122fde37a2f0022"
        },
        "date": 1582871567088,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.81,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.68,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "b53471a59d6505d76198aca8b06b8bed469f9ae2",
          "message": "fix(lerna): add --no-push for waiting docker image",
          "timestamp": "2020-02-28T15:38:50+09:00",
          "tree_id": "313200e5669460589c7f03b455097cd6afd5f01a",
          "url": "https://github.com/secretlint/secretlint/commit/b53471a59d6505d76198aca8b06b8bed469f9ae2"
        },
        "date": 1582872064004,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2,
            "range": "±2.81%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.74,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "7dcb506315fae72c12253c6dd7119f746f80fddc",
          "message": "fix(core): fix allowMessageIds of preset's rule options\n\nPreviously, it does not work correctly. This commit fix to work.",
          "timestamp": "2020-02-28T17:13:40+09:00",
          "tree_id": "d480117d056a08fdef93fe68686ad11bddadaf15",
          "url": "https://github.com/secretlint/secretlint/commit/7dcb506315fae72c12253c6dd7119f746f80fddc"
        },
        "date": 1582877770048,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.88,
            "range": "±3.32%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.73,
            "range": "±4.03%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "9c5fb4c6d23182ba02034b5c29250612d66ba602",
          "message": "v0.4.2",
          "timestamp": "2020-02-28T17:14:20+09:00",
          "tree_id": "85e3edfebcb17401f5782b8f1796a46503e6bfd2",
          "url": "https://github.com/secretlint/secretlint/commit/9c5fb4c6d23182ba02034b5c29250612d66ba602"
        },
        "date": 1582877972896,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.72,
            "range": "±2.00%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±1.78%",
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
          "id": "babd150a0c66b3ee4607b313e3a7f93ff55ccf54",
          "message": "Merge pull request #60 from secretlint/debug-flag\n\nfeat(cli): add --debug flag",
          "timestamp": "2020-02-28T23:27:53+09:00",
          "tree_id": "cf3beb57f1726b13ffa58b6611a1cae8dd03e345",
          "url": "https://github.com/secretlint/secretlint/commit/babd150a0c66b3ee4607b313e3a7f93ff55ccf54"
        },
        "date": 1582900208188,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.83,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.67,
            "range": "±4.77%",
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
          "id": "6d6ed9f4008aadf6c472cd1ef6773448d1601c48",
          "message": "Merge pull request #61 from secretlint/gcp\n\nfeat(gcp): add @secretlint/secretlint-rule-gcp",
          "timestamp": "2020-02-29T01:23:54+09:00",
          "tree_id": "c63e3ee5f85bfab71eb1e8ebee71281634311413",
          "url": "https://github.com/secretlint/secretlint/commit/6d6ed9f4008aadf6c472cd1ef6773448d1601c48"
        },
        "date": 1582907181074,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.58,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±1.20%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "5b400a28ba0837485e4b0452b3574b2634fe13be",
          "message": "v0.5.0",
          "timestamp": "2020-02-29T01:24:27+09:00",
          "tree_id": "eb6fdf118f356e32fe90ca504781ecbede42db20",
          "url": "https://github.com/secretlint/secretlint/commit/5b400a28ba0837485e4b0452b3574b2634fe13be"
        },
        "date": 1582935658775,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.66,
            "range": "±1.66%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±0.68%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "5bb36be5421f347639b9f00c867cb8cb48f81f5f",
          "message": "fix(secretlint-rule-basicauth): fix regexp pattern",
          "timestamp": "2020-02-29T09:33:49+09:00",
          "tree_id": "b5b487e7b28a0fa159b12279b963c32084acc4ef",
          "url": "https://github.com/secretlint/secretlint/commit/5bb36be5421f347639b9f00c867cb8cb48f81f5f"
        },
        "date": 1582936585182,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.59,
            "range": "±2.48%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±1.37%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "a68b875843b9f8f41bb21c3ad229a272bddfdf3e",
          "message": "feat(slack): support Incoming Webhook\n\nfix #63",
          "timestamp": "2020-02-29T10:11:07+09:00",
          "tree_id": "c318337f56398c4a65fce43c6bd41a86aeafb6a2",
          "url": "https://github.com/secretlint/secretlint/commit/a68b875843b9f8f41bb21c3ad229a272bddfdf3e"
        },
        "date": 1582938828926,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.57,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±0.81%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "88a2e3eeb6cff8e65f2ea2fc8147bfb09fc6296c",
          "message": "test: update snapshots",
          "timestamp": "2020-02-29T10:16:42+09:00",
          "tree_id": "6349f21e1b3f7928334a078bc1550ec002625c81",
          "url": "https://github.com/secretlint/secretlint/commit/88a2e3eeb6cff8e65f2ea2fc8147bfb09fc6296c"
        },
        "date": 1582939145757,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.76,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±2.76%",
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
          "id": "a28ef9eb9b3803984ec37bbbd9cdf35e7d4b67a6",
          "message": "feat: support terminalLink (#65)\n\n* feat: add docsUrl and show url in output\r\n\r\n* feat: support terminalLink\r\n\r\n* test: update snapshots",
          "timestamp": "2020-02-29T18:36:37+09:00",
          "tree_id": "ac807c0c6faed57fb7aca3ed9fb30dfdbecf6926",
          "url": "https://github.com/secretlint/secretlint/commit/a28ef9eb9b3803984ec37bbbd9cdf35e7d4b67a6"
        },
        "date": 1582969150104,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.47,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.56,
            "range": "±0.92%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "1c1e4b6791d7c9865dbf8f741b6b5f8f28b689f4",
          "message": "docs: add GitHub Actions integration",
          "timestamp": "2020-02-29T18:48:48+09:00",
          "tree_id": "d451afba33c5968d4956df58521e2e1c2adc865a",
          "url": "https://github.com/secretlint/secretlint/commit/1c1e4b6791d7c9865dbf8f741b6b5f8f28b689f4"
        },
        "date": 1582969876707,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.59,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "66bc2042b543222389e7f214b7720bc672492ce9",
          "message": "Update README",
          "timestamp": "2020-02-29T19:42:32+09:00",
          "tree_id": "641b77f449d860b015d40af741be90f85a70259d",
          "url": "https://github.com/secretlint/secretlint/commit/66bc2042b543222389e7f214b7720bc672492ce9"
        },
        "date": 1582973128218,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.39,
            "range": "±2.10%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.56,
            "range": "±2.10%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "02cc8e86387c52612a1660fc5bc5a381dec1697c",
          "message": "Update README",
          "timestamp": "2020-02-29T19:54:46+09:00",
          "tree_id": "4c0ba8e9598c13c538bf4544c14a0142cbcb3185",
          "url": "https://github.com/secretlint/secretlint/commit/02cc8e86387c52612a1660fc5bc5a381dec1697c"
        },
        "date": 1582973837541,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.73,
            "range": "±0.90%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "62cef6ce5740ce6141933882a36aa22f9a947814",
          "message": "Update README",
          "timestamp": "2020-02-29T19:57:06+09:00",
          "tree_id": "13e1f7167356480f7b69ef9813f46c7563be3645",
          "url": "https://github.com/secretlint/secretlint/commit/62cef6ce5740ce6141933882a36aa22f9a947814"
        },
        "date": 1582973979435,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.57,
            "range": "±0.29%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "dc5300683d2b8ae6e16ea999d3bf1696ea34fb65",
          "message": "Update README",
          "timestamp": "2020-02-29T20:05:48+09:00",
          "tree_id": "38494e0012c4d7cdfb0719a614e5aacf9cf12e84",
          "url": "https://github.com/secretlint/secretlint/commit/dc5300683d2b8ae6e16ea999d3bf1696ea34fb65"
        },
        "date": 1582974496651,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.67,
            "range": "±3.36%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±2.90%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "dc63d6dab38d4c8721e4a51cc541f1de42277b87",
          "message": "Update README",
          "timestamp": "2020-02-29T20:07:28+09:00",
          "tree_id": "ac19814dc051f0cc97e4d8170210098876585dca",
          "url": "https://github.com/secretlint/secretlint/commit/dc63d6dab38d4c8721e4a51cc541f1de42277b87"
        },
        "date": 1582974605259,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.54,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±1.75%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "0e27374fdb3e6e51747457f2f8a1af7dea944172",
          "message": "Update README",
          "timestamp": "2020-02-29T20:20:25+09:00",
          "tree_id": "ce197a09ef7122ac9d7e266199b5d2ea81e31623",
          "url": "https://github.com/secretlint/secretlint/commit/0e27374fdb3e6e51747457f2f8a1af7dea944172"
        },
        "date": 1582975372386,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.65,
            "range": "±2.41%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±6.04%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "9840ce2308acfa957d66e7aa6d46739f99e0ffb3",
          "message": "Update README",
          "timestamp": "2020-02-29T20:18:28+09:00",
          "tree_id": "964a8c93ffaf4cf6ca417f410e0450d2a701d789",
          "url": "https://github.com/secretlint/secretlint/commit/9840ce2308acfa957d66e7aa6d46739f99e0ffb3"
        },
        "date": 1582975396896,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.5,
            "range": "±3.47%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±2.51%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "da46f8c14efe12d1d47170beb37bea001f28e38b",
          "message": "Update README",
          "timestamp": "2020-02-29T20:21:31+09:00",
          "tree_id": "63dbcce768890b72194a151ac1c8452a6b6591ee",
          "url": "https://github.com/secretlint/secretlint/commit/da46f8c14efe12d1d47170beb37bea001f28e38b"
        },
        "date": 1582975434370,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.81,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.67,
            "range": "±3.02%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "872313356c1c4b6798036877e8433dc1f00abb57",
          "message": "Update README",
          "timestamp": "2020-02-29T20:21:51+09:00",
          "tree_id": "8a0c54d0ca7174c5d7d881ac071250f26115aa5d",
          "url": "https://github.com/secretlint/secretlint/commit/872313356c1c4b6798036877e8433dc1f00abb57"
        },
        "date": 1582975439665,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.96,
            "range": "±7.14%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.76,
            "range": "±1.25%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "c679a7da1e0d6ca3e79c3b3a7ea6c03adb254c94",
          "message": "docs(publish): add note",
          "timestamp": "2020-03-01T16:24:18+09:00",
          "tree_id": "ca5b2a80ae112f812129953b9979a5e9872f25a2",
          "url": "https://github.com/secretlint/secretlint/commit/c679a7da1e0d6ca3e79c3b3a7ea6c03adb254c94"
        },
        "date": 1583047621514,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.55,
            "range": "±2.27%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "ac1829c1d046792f87ed17dbc6f53979309b4b08",
          "message": "CI(publish): add Build",
          "timestamp": "2020-03-01T16:26:36+09:00",
          "tree_id": "4c536392e5a3741ef12cfaf6d5423918038029e9",
          "url": "https://github.com/secretlint/secretlint/commit/ac1829c1d046792f87ed17dbc6f53979309b4b08"
        },
        "date": 1583047746930,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.69,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "8e1d5bce9e986ea93ebbf0daaebcd8912c2aaf85",
          "message": "CI(publish): fix token",
          "timestamp": "2020-03-01T16:33:12+09:00",
          "tree_id": "96f239d8d83091fde016867cda52499e16294904",
          "url": "https://github.com/secretlint/secretlint/commit/8e1d5bce9e986ea93ebbf0daaebcd8912c2aaf85"
        },
        "date": 1583048149366,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.63,
            "range": "±1.10%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "105645f8ecd0b5a6899acdf1f9834b9ced34bb5c",
          "message": "CI(publish): fix token",
          "timestamp": "2020-03-01T16:34:55+09:00",
          "tree_id": "8ca9b4dcc4cd8402549128e7c20030ea56351450",
          "url": "https://github.com/secretlint/secretlint/commit/105645f8ecd0b5a6899acdf1f9834b9ced34bb5c"
        },
        "date": 1583048253970,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.53,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±0.75%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5413f0f3d81e79dc84952c62453de2e592743516",
          "message": "ci(changeset): generate PR with changelog & version updates (#69)",
          "timestamp": "2020-03-01T16:40:14+09:00",
          "tree_id": "e4fa492e96e7baa706645411b1b90a2c93c93788",
          "url": "https://github.com/secretlint/secretlint/commit/5413f0f3d81e79dc84952c62453de2e592743516"
        },
        "date": 1583048558686,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.68,
            "range": "±1.30%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±1.41%",
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
          "id": "8887af1adb411ba8dacce0e3e5a497f0bb822c85",
          "message": "fix(quick-start): fix bin script name (#70)\n\n* fix(quick-start): fix bin script name\r\n\r\n* chore(changeset): enable commit\r\n\r\n* Create tough-actors-allow.md",
          "timestamp": "2020-03-01T17:19:40+09:00",
          "tree_id": "c776749a8eaee3dd7bfdaddcc7659d17864a8b83",
          "url": "https://github.com/secretlint/secretlint/commit/8887af1adb411ba8dacce0e3e5a497f0bb822c85"
        },
        "date": 1583050931641,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.59,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±2.17%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "f066a487092ba301d1236b34c844cb231a64f4c0",
          "message": "chore(changeset): revert commit",
          "timestamp": "2020-03-01T17:30:29+09:00",
          "tree_id": "5afa007ae165e25c45fffd52a69bf9aa1b4440ca",
          "url": "https://github.com/secretlint/secretlint/commit/f066a487092ba301d1236b34c844cb231a64f4c0"
        },
        "date": 1583051581019,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.7,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±1.75%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b9fdf173632b6e929cf92b018a52e1c1092b37e9",
          "message": "ci(changeset): generate PR with changelog & version updates (#71)",
          "timestamp": "2020-03-01T17:39:59+09:00",
          "tree_id": "e265cb7083637118a899acdf5f1de8fb66a8f5f1",
          "url": "https://github.com/secretlint/secretlint/commit/b9fdf173632b6e929cf92b018a52e1c1092b37e9"
        },
        "date": 1583052142662,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.69,
            "range": "±3.04%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±2.27%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "c1026fd9cdd22cd07bbcf035bfe0d340d7b9a6f1",
          "message": "Merge remote-tracking branch 'origin/master'",
          "timestamp": "2020-03-01T18:52:57+09:00",
          "tree_id": "4c4661c936382df4111105fb716f38056e531cc5",
          "url": "https://github.com/secretlint/secretlint/commit/c1026fd9cdd22cd07bbcf035bfe0d340d7b9a6f1"
        },
        "date": 1583056526987,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.65,
            "range": "±0.87%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±1.11%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "b29781cbb16259b05547b66b5a728f56c9ad9698",
          "message": "v0.7.0",
          "timestamp": "2020-03-01T19:35:46+09:00",
          "tree_id": "d78952209cd374730ca851cbfd4ccdb982110d79",
          "url": "https://github.com/secretlint/secretlint/commit/b29781cbb16259b05547b66b5a728f56c9ad9698"
        },
        "date": 1583059246880,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.53,
            "range": "±1.24%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±0.59%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "0cc3e9d180bd13abe328fd08102e2879dbe861be",
          "message": "v0.7.1",
          "timestamp": "2020-03-01T19:47:00+09:00",
          "tree_id": "e0871b10465522739b93e3e80a33b2db35c06d18",
          "url": "https://github.com/secretlint/secretlint/commit/0cc3e9d180bd13abe328fd08102e2879dbe861be"
        },
        "date": 1583059806156,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.51,
            "range": "±1.98%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "f25cb0b1fae45e9420a7de7d291251cb5f4e56b5",
          "message": "fix(secretlint-rule-gcp): fix plaice holder of report",
          "timestamp": "2020-03-01T20:42:17+09:00",
          "tree_id": "cbac4c386eee88e6ff85081582c51607f56f00c7",
          "url": "https://github.com/secretlint/secretlint/commit/f25cb0b1fae45e9420a7de7d291251cb5f4e56b5"
        },
        "date": 1583063114265,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.6,
            "range": "±0.97%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "e92597c1378bb16ef051ee21fc1013e923270150",
          "message": "v0.7.2",
          "timestamp": "2020-03-01T20:42:53+09:00",
          "tree_id": "6556eb83f4fe89730677231ead352a0bde500991",
          "url": "https://github.com/secretlint/secretlint/commit/e92597c1378bb16ef051ee21fc1013e923270150"
        },
        "date": 1583063191719,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.87,
            "range": "±4.28%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.71,
            "range": "±0.98%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "a6fd6ad0fa330862e37019bfd6586bd29f53be62",
          "message": "v0.7.3",
          "timestamp": "2020-03-01T21:21:14+09:00",
          "tree_id": "bad089b0e9bdb426c4a5db385811daca170fdd29",
          "url": "https://github.com/secretlint/secretlint/commit/a6fd6ad0fa330862e37019bfd6586bd29f53be62"
        },
        "date": 1583065745085,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.46,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.55,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "bb7e7ef5f91ef292ea6d4300ecc9a7f2215b3666",
          "message": "chore(node): add debug log",
          "timestamp": "2020-03-01T21:32:46+09:00",
          "tree_id": "55925e4e171834e158a48f12ecfda9e3f176ad63",
          "url": "https://github.com/secretlint/secretlint/commit/bb7e7ef5f91ef292ea6d4300ecc9a7f2215b3666"
        },
        "date": 1583066121559,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.63,
            "range": "±4.58%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "d8a4fd1fab54597638654f49ddd0181c72da19b9",
          "message": "chore(node): use %o instead of %O",
          "timestamp": "2020-03-01T21:33:11+09:00",
          "tree_id": "b7d5097f7a2c7d607b0d5f8d844bd861c057a1ce",
          "url": "https://github.com/secretlint/secretlint/commit/d8a4fd1fab54597638654f49ddd0181c72da19b9"
        },
        "date": 1583066165888,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.43,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.53,
            "range": "±1.03%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "1eece91a532d79c627881e9209154d1c6ecc9e9d",
          "message": "chore(node): short log",
          "timestamp": "2020-03-01T21:35:00+09:00",
          "tree_id": "a86fe2e108471b675c67f2024489ba39cd5f9ee2",
          "url": "https://github.com/secretlint/secretlint/commit/1eece91a532d79c627881e9209154d1c6ecc9e9d"
        },
        "date": 1583066273447,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.46,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.56,
            "range": "±0.90%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "5062fac5e0fe70230d6db0f022f8842fc05e43b7",
          "message": "docs: Update Usage",
          "timestamp": "2020-03-01T21:52:52+09:00",
          "tree_id": "290cc3ee5901e3c6ffd186be8d2a2819625f848d",
          "url": "https://github.com/secretlint/secretlint/commit/5062fac5e0fe70230d6db0f022f8842fc05e43b7"
        },
        "date": 1583067332767,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.56,
            "range": "±0.42%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±1.10%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "1bc3934ce4504aade4aa1ef58d1785c1f0530ece",
          "message": "docs: Update Usage",
          "timestamp": "2020-03-01T22:03:43+09:00",
          "tree_id": "c23c1e0f881a06ed270bf035ae9304f2fe9ec767",
          "url": "https://github.com/secretlint/secretlint/commit/1bc3934ce4504aade4aa1ef58d1785c1f0530ece"
        },
        "date": 1583067971783,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.79,
            "range": "±2.00%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.66,
            "range": "±2.95%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "cb46f567c60b6eab2871cd4394e6a76e9474ff98",
          "message": "docs: Update Usage",
          "timestamp": "2020-03-01T22:29:56+09:00",
          "tree_id": "28c45ac046037b8a79b666f9b1604077dd8d914b",
          "url": "https://github.com/secretlint/secretlint/commit/cb46f567c60b6eab2871cd4394e6a76e9474ff98"
        },
        "date": 1583069562238,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.58,
            "range": "±5.51%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±3.48%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "08f502329d351b481a5d2ad34e8f745b162aefe9",
          "message": "Update README",
          "timestamp": "2020-03-03T00:07:24+09:00",
          "tree_id": "2b9996667c57a832baefbc9aef185afd902a88c0",
          "url": "https://github.com/secretlint/secretlint/commit/08f502329d351b481a5d2ad34e8f745b162aefe9"
        },
        "date": 1583161795728,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.79,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.67,
            "range": "±1.98%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "d127d237843341d7704fe96852e0d4638da50eaa",
          "message": "perf(profiler): add profile mark to config-loader",
          "timestamp": "2020-03-04T00:06:36+09:00",
          "tree_id": "c419a17f337e98772999a503b17fbe915e4ed323",
          "url": "https://github.com/secretlint/secretlint/commit/d127d237843341d7704fe96852e0d4638da50eaa"
        },
        "date": 1583474896940,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.49,
            "range": "±2.66%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±1.92%",
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
          "id": "d7243fe9bffb233d6c04a86a1a550f96f1c0e203",
          "message": "docs: Add git hook globally (#74)\n\nfix https://github.com/secretlint/secretlint/issues/73",
          "timestamp": "2020-03-08T00:44:24+09:00",
          "tree_id": "07961d05ff738d02564031a5390ee3c3dc4a6e11",
          "url": "https://github.com/secretlint/secretlint/commit/d7243fe9bffb233d6c04a86a1a550f96f1c0e203"
        },
        "date": 1583596018923,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.5,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±1.21%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "f32f942f071454d8e5598129d417c064bb8988f1",
          "message": "docs: Add Node.js for global",
          "timestamp": "2020-03-08T00:48:52+09:00",
          "tree_id": "69044f6adc9e39ec4d1be3306effb95870c30eee",
          "url": "https://github.com/secretlint/secretlint/commit/f32f942f071454d8e5598129d417c064bb8988f1"
        },
        "date": 1583596301716,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.57,
            "range": "±1.86%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±0.99%",
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
          "id": "71c382abb4c2f8bf60319e2716f3d6600f1de8ba",
          "message": "perf(secretlint-rule-preset-recommend): rollup (#76)\n\n* perf(secretlint-rule-preset-recommend): roll up it\r\n\r\nroll up and distribute bundled file\r\n\r\n* test: fix test config",
          "timestamp": "2020-03-08T01:55:11+09:00",
          "tree_id": "c1d6f2b245b25c85539a44a36c0dd3f1aac39b89",
          "url": "https://github.com/secretlint/secretlint/commit/71c382abb4c2f8bf60319e2716f3d6600f1de8ba"
        },
        "date": 1583600239408,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.91,
            "range": "±2.69%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.7,
            "range": "±3.20%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "e50730ee9eca22786231223abaa99f6a78b155aa",
          "message": "Update README",
          "timestamp": "2020-03-08T02:01:00+09:00",
          "tree_id": "96c233dd1aab25d7e4722072983e25f6d78f519b",
          "url": "https://github.com/secretlint/secretlint/commit/e50730ee9eca22786231223abaa99f6a78b155aa"
        },
        "date": 1583600610737,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.73,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±2.03%",
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
          "id": "449b4a1c78c33722c41d1251d2dde4d8d040cf88",
          "message": "feat(cli): support --secretlintrcJSON flag (#78)\n\nIt allow to pass JSON string instead of secretlintrc file path",
          "timestamp": "2020-03-08T12:32:41+09:00",
          "tree_id": "b6fa3c151082985fb811d6aa2f130bb47b24e2bc",
          "url": "https://github.com/secretlint/secretlint/commit/449b4a1c78c33722c41d1251d2dde4d8d040cf88"
        },
        "date": 1583638503251,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.71,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±3.22%",
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
          "id": "4d0413a091332f29962704247f1185988ec6a161",
          "message": "CI: Add Changesets workflow (#79)\n\n* update\r\n\r\n* update\r\n\r\n* CI(chansets): add changesets workflow",
          "timestamp": "2020-03-08T14:31:00+09:00",
          "tree_id": "6bc22669bb08b8b9fa289c762f64e68d01617b25",
          "url": "https://github.com/secretlint/secretlint/commit/4d0413a091332f29962704247f1185988ec6a161"
        },
        "date": 1583645609434,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.73,
            "range": "±2.94%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "18261ff7e46810751fac714d2c924d657344ed43",
          "message": "CI(changesets): add builkd",
          "timestamp": "2020-03-08T14:32:42+09:00",
          "tree_id": "4b4fb3273bbb3394433b3bb89e4ddb17db0efccc",
          "url": "https://github.com/secretlint/secretlint/commit/18261ff7e46810751fac714d2c924d657344ed43"
        },
        "date": 1583645716798,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.63,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±2.46%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "c7fc79f91202056865b4c71a25d9284e6b95b5b1",
          "message": "CI(changesets): update CHANGELOG",
          "timestamp": "2020-03-08T14:37:55+09:00",
          "tree_id": "3b8e732eb37f0a808acab92982713b8d4d0da48c",
          "url": "https://github.com/secretlint/secretlint/commit/c7fc79f91202056865b4c71a25d9284e6b95b5b1"
        },
        "date": 1583646032621,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.62,
            "range": "±1.22%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±2.13%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9a0a111e6ea7d2eca5f934d4a0a85b8eb537dc5f",
          "message": "ci(changeset): generate PR with changelog & version updates (#80)\n\nCo-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>",
          "timestamp": "2020-03-08T19:19:12+09:00",
          "tree_id": "172488c35098697613029ec64df88d4553a288f3",
          "url": "https://github.com/secretlint/secretlint/commit/9a0a111e6ea7d2eca5f934d4a0a85b8eb537dc5f"
        },
        "date": 1583662903594,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.64,
            "range": "±0.72%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±1.20%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "73275353531d6282d2b6feb07daa6873bbbbac5b",
          "message": "CI(changeset): add changeset workflow",
          "timestamp": "2020-03-08T20:08:15+09:00",
          "tree_id": "494193d7dc9129eda05204ad849c464b5073d17b",
          "url": "https://github.com/secretlint/secretlint/commit/73275353531d6282d2b6feb07daa6873bbbbac5b"
        },
        "date": 1583665828212,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.06,
            "range": "±1.72%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.72,
            "range": "±3.34%",
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
          "id": "5223b966d53943014af12567cd9195ab878a0dc4",
          "message": "docs(source-creator): Update README (#81)",
          "timestamp": "2020-03-08T20:11:35+09:00",
          "tree_id": "47fa1a00fb4552ece1af5483391bf514b8275c1c",
          "url": "https://github.com/secretlint/secretlint/commit/5223b966d53943014af12567cd9195ab878a0dc4"
        },
        "date": 1583666045006,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.64,
            "range": "±1.24%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±3.59%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "416250e39c95737840bb02913a0d7f62de6ed0ff",
          "message": "CI(changesets): fix CI",
          "timestamp": "2020-03-08T20:12:34+09:00",
          "tree_id": "d03933319f36bee4cd7135b24baa531733c194f7",
          "url": "https://github.com/secretlint/secretlint/commit/416250e39c95737840bb02913a0d7f62de6ed0ff"
        },
        "date": 1583666108898,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.66,
            "range": "±0.98%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "0726bfd6f34c1ea658d29e0b77acee228ee8d53e",
          "message": "CI(changesets): fix CI",
          "timestamp": "2020-03-08T20:12:54+09:00",
          "tree_id": "adf67a00d21ba4e78a480cba8ac79d320686f518",
          "url": "https://github.com/secretlint/secretlint/commit/0726bfd6f34c1ea658d29e0b77acee228ee8d53e"
        },
        "date": 1583666129589,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.65,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±0.49%",
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
          "id": "cbd2717d94ccf62386b2d84f1e7a72074992be77",
          "message": "Merge pull request #82 from secretlint/refactor-core-registerRule\n\nrefactor(core): remove export registerRule",
          "timestamp": "2020-03-08T20:14:38+09:00",
          "tree_id": "f513f0bf8c517469c9ff38983345c270dbf36bf2",
          "url": "https://github.com/secretlint/secretlint/commit/cbd2717d94ccf62386b2d84f1e7a72074992be77"
        },
        "date": 1583666219184,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.74,
            "range": "±1.24%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "a015cbacd6be68002c7fa18f38ce1a66c885ee98",
          "message": "CI(changesets): use npx",
          "timestamp": "2020-03-08T20:16:49+09:00",
          "tree_id": "f68dfbc82ce5fceed462cd46aa616ac2b0328f8a",
          "url": "https://github.com/secretlint/secretlint/commit/a015cbacd6be68002c7fa18f38ce1a66c885ee98"
        },
        "date": 1583666381225,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.44,
            "range": "±3.23%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.56,
            "range": "±0.98%",
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
          "id": "e97b44df8efddf057a28ad1670bc4742544cf4c2",
          "message": "Merge pull request #83 from secretlint/fix-messages-to-markdown\n\nfix(messages-to-markdown): rename bin script",
          "timestamp": "2020-03-08T20:18:54+09:00",
          "tree_id": "6ed402e89dfb40b7af559826efd4e893a9228336",
          "url": "https://github.com/secretlint/secretlint/commit/e97b44df8efddf057a28ad1670bc4742544cf4c2"
        },
        "date": 1583666476791,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.78,
            "range": "±2.17%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "240e9be6d759b0f3ebef27f63385a6e887687fc5",
          "message": "CI(changesets): fix repo",
          "timestamp": "2020-03-08T20:23:15+09:00",
          "tree_id": "251c9a436813d6e3bdcb66026ac8f50c0fadcb89",
          "url": "https://github.com/secretlint/secretlint/commit/240e9be6d759b0f3ebef27f63385a6e887687fc5"
        },
        "date": 1583666739964,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.77,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±0.78%",
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
          "id": "026d9e32b84a86c29501f7c7ee8d17a24051c93a",
          "message": "Merge pull request #84 from secretlint/temp-pr\n\ndocs(binary-compiler): Add issue",
          "timestamp": "2020-03-08T20:26:17+09:00",
          "tree_id": "ef57c8a97b61ff73937aeb4c93765a8968eab87b",
          "url": "https://github.com/secretlint/secretlint/commit/026d9e32b84a86c29501f7c7ee8d17a24051c93a"
        },
        "date": 1583666926177,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.65,
            "range": "±1.10%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "3879b2041588b411af0860f1e4e703587cf88f5b",
          "message": "Merge remote-tracking branch 'origin/master'",
          "timestamp": "2020-03-08T20:28:24+09:00",
          "tree_id": "1d670b8004ddbaa0caca86d73466602e8540636a",
          "url": "https://github.com/secretlint/secretlint/commit/3879b2041588b411af0860f1e4e703587cf88f5b"
        },
        "date": 1583667039946,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.87,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.68,
            "range": "±2.07%",
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
          "id": "2131771fdffff1db591fb73928a9c983ed30fc61",
          "message": "Merge pull request #85 from secretlint/fix-typo-of-example\n\ndocs(rule-example): fix typo",
          "timestamp": "2020-03-08T20:30:10+09:00",
          "tree_id": "ab1dd699f0654942e2d70ea70e03cb0c2b029ff1",
          "url": "https://github.com/secretlint/secretlint/commit/2131771fdffff1db591fb73928a9c983ed30fc61"
        },
        "date": 1583667152811,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.73,
            "range": "±0.87%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "0635788a9893acf525660514f2b6dad30dda377a",
          "message": "CI(changeset): remove skip",
          "timestamp": "2020-03-08T20:31:44+09:00",
          "tree_id": "274c49cd374b0f763c85ffcecb5403f0378a833d",
          "url": "https://github.com/secretlint/secretlint/commit/0635788a9893acf525660514f2b6dad30dda377a"
        },
        "date": 1583667259807,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.63,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "ce60a8b2f145a345db04f25353069f43d705b768",
          "message": "ci: add pr_labels.yml",
          "timestamp": "2020-03-08T21:30:34+09:00",
          "tree_id": "739fd7b56a1c75ac411d004c56ce745e03f81dd1",
          "url": "https://github.com/secretlint/secretlint/commit/ce60a8b2f145a345db04f25353069f43d705b768"
        },
        "date": 1583670788967,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.64,
            "range": "±0.91%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "c581d7676c958ac4e9e58210cae440753bae7243",
          "message": "CI(changesets): remove duplicated workflow",
          "timestamp": "2020-03-08T21:34:29+09:00",
          "tree_id": "2c34d7e90bc436623d840ba27f5744123dfbb7d6",
          "url": "https://github.com/secretlint/secretlint/commit/c581d7676c958ac4e9e58210cae440753bae7243"
        },
        "date": 1583671022790,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.66,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±0.88%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "60616950a847c1db1ddae2ac466753590b92075b",
          "message": "CI(changesets): use @changesets/changelog-github",
          "timestamp": "2020-03-08T21:38:29+09:00",
          "tree_id": "77ff97286a14758e58003155d71e685445b1b772",
          "url": "https://github.com/secretlint/secretlint/commit/60616950a847c1db1ddae2ac466753590b92075b"
        },
        "date": 1583671262209,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.64,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±0.91%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "f8560bd59abf40e2eb3aa8aa6daac487cc8d6986",
          "message": "fix(deps): revert @changesets/changelog-github",
          "timestamp": "2020-03-08T21:44:33+09:00",
          "tree_id": "2c34d7e90bc436623d840ba27f5744123dfbb7d6",
          "url": "https://github.com/secretlint/secretlint/commit/f8560bd59abf40e2eb3aa8aa6daac487cc8d6986"
        },
        "date": 1583671648993,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.5,
            "range": "±3.55%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "74847afbbea57c675a2e64800a65efba4502346d",
          "message": "chore(deps) update lock",
          "timestamp": "2020-03-10T21:40:47+09:00",
          "tree_id": "ceeb4632749149b6131d719c814981e01a4bb89a",
          "url": "https://github.com/secretlint/secretlint/commit/74847afbbea57c675a2e64800a65efba4502346d"
        },
        "date": 1583844181847,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.03,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.73,
            "range": "±1.84%",
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
          "id": "ceffac0e71ed7bd2d20a518fbb74ecc6a9935161",
          "message": "Merge pull request #86 from secretlint/changeset-release/master\n\nVersion Packages",
          "timestamp": "2020-03-11T15:43:15+09:00",
          "tree_id": "45f08aae07cca257b31a918a41acc81dd9fb478a",
          "url": "https://github.com/secretlint/secretlint/commit/ceffac0e71ed7bd2d20a518fbb74ecc6a9935161"
        },
        "date": 1583909141745,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.7,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±0.86%",
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
          "id": "3dfb6a1a971a16f616f9ec2ab6e3467a10ab2192",
          "message": "Merge pull request #88 from secretlint/change-release-flow\n\nCI(publish): use lerna + GitHub Actions for release",
          "timestamp": "2020-03-16T16:20:45+09:00",
          "tree_id": "6a87307e63f3918a4887e3ee69534ee0782ef8ae",
          "url": "https://github.com/secretlint/secretlint/commit/3dfb6a1a971a16f616f9ec2ab6e3467a10ab2192"
        },
        "date": 1584343407537,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.47,
            "range": "±2.54%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.56,
            "range": "±1.72%",
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
          "id": "22701ddb7178683515c9a308cebf81cc6820ff52",
          "message": "Merge pull request #89 from secretlint/release/2020-03-16\n\nv0.9.0",
          "timestamp": "2020-03-16T16:44:56+09:00",
          "tree_id": "1d02833ddcb78fac0869f6b31c78218ddb06d945",
          "url": "https://github.com/secretlint/secretlint/commit/22701ddb7178683515c9a308cebf81cc6820ff52"
        },
        "date": 1584344837824,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.73,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "b50d2116ceae7f44d912d5a931411d746a4494d9",
          "message": "CI(publish): fix token",
          "timestamp": "2020-03-16T17:01:25+09:00",
          "tree_id": "9a462475fc95b7591b5d3ab573edb8449eb355c4",
          "url": "https://github.com/secretlint/secretlint/commit/b50d2116ceae7f44d912d5a931411d746a4494d9"
        },
        "date": 1584345873094,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.73,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±3.60%",
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
          "id": "fcf1f298450fef93262f9df4f36f01ccf0cde203",
          "message": "Merge pull request #90 from secretlint/release/2020-03-16-update\n\nv0.9.1",
          "timestamp": "2020-03-16T17:10:44+09:00",
          "tree_id": "bfa28047b38ee02bc8ed1a6f86d7df8396793fd0",
          "url": "https://github.com/secretlint/secretlint/commit/fcf1f298450fef93262f9df4f36f01ccf0cde203"
        },
        "date": 1584346382524,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.73,
            "range": "±1.47%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±1.61%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "8e1760bf9660ca2defdfc9789d1f7e891438220d",
          "message": "chore(script): add build before publish",
          "timestamp": "2020-03-16T17:22:03+09:00",
          "tree_id": "87e15d7de485621bd739264627da7d2cbda88ba1",
          "url": "https://github.com/secretlint/secretlint/commit/8e1760bf9660ca2defdfc9789d1f7e891438220d"
        },
        "date": 1584347146829,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.86,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.66,
            "range": "±1.45%",
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
          "id": "468d1ccd8b68d69031ced000b1a7bc980eabfc84",
          "message": "Merge pull request #91 from secretlint/release/2020-03-16-fix-release\n\nv0.9.2",
          "timestamp": "2020-03-16T17:27:33+09:00",
          "tree_id": "66ef5ae25136e6ae6dca4f75e0802c978c1d7b1a",
          "url": "https://github.com/secretlint/secretlint/commit/468d1ccd8b68d69031ced000b1a7bc980eabfc84"
        },
        "date": 1584347385221,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.86,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.68,
            "range": "±3.39%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "13f30714960e4f5cbde5198c57978d921541f42c",
          "message": "CI(publish): remove name",
          "timestamp": "2020-03-16T17:43:40+09:00",
          "tree_id": "3d13aef6194de81f5bf03a5cb643e83f936f7f48",
          "url": "https://github.com/secretlint/secretlint/commit/13f30714960e4f5cbde5198c57978d921541f42c"
        },
        "date": 1584348375707,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.63,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±4.62%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "ecbbf686f4082eafff9aaa186ee5cd0b9873a227",
          "message": "docs(GitHub): add Issue template",
          "timestamp": "2020-03-16T18:04:46+09:00",
          "tree_id": "fa92abc15c93dba787d49e936f59db651498e1fb",
          "url": "https://github.com/secretlint/secretlint/commit/ecbbf686f4082eafff9aaa186ee5cd0b9873a227"
        },
        "date": 1584349644153,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.63,
            "range": "±0.75%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±1.25%",
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
          "id": "2883cfe2851e14056a9d956a0c9677ea41295c79",
          "message": "Merge pull request #93 from secretlint/preset-canary\n\nfeat(preset-canary): add secretlint-rule-preset-canary",
          "timestamp": "2020-03-16T20:32:04+09:00",
          "tree_id": "d7514e3e278b032775b07691f7c027a891beff9b",
          "url": "https://github.com/secretlint/secretlint/commit/2883cfe2851e14056a9d956a0c9677ea41295c79"
        },
        "date": 1584358476190,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.61,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±1.95%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "c479668737b2a62aa3d46c97781effd4600b8a69",
          "message": "CI(publish): fix tag",
          "timestamp": "2020-03-16T20:41:03+09:00",
          "tree_id": "f67888aa31c0e95bce92a52e5be410732992b9c1",
          "url": "https://github.com/secretlint/secretlint/commit/c479668737b2a62aa3d46c97781effd4600b8a69"
        },
        "date": 1584359029119,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.46,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±1.91%",
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
          "id": "8bbd6c9ba630121eb36bf2e9c6e8ab154523974d",
          "message": "Merge pull request #95 from secretlint/locale\n\nfeat(core): support locale options",
          "timestamp": "2020-03-17T00:23:29+09:00",
          "tree_id": "dd0642b5b77c4e0c01433dc4a415ff5b5d841a6a",
          "url": "https://github.com/secretlint/secretlint/commit/8bbd6c9ba630121eb36bf2e9c6e8ab154523974d"
        },
        "date": 1584372368478,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.5,
            "range": "±3.18%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.56,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "e5f3c7c861d2e388b9bf44c11a5e17cca2a9b345",
          "message": "Ci(publish): fix publish-binary",
          "timestamp": "2020-03-18T22:05:44+09:00",
          "tree_id": "4841d7eb8c4842b9fd4fdf243370387f53c12ec7",
          "url": "https://github.com/secretlint/secretlint/commit/e5f3c7c861d2e388b9bf44c11a5e17cca2a9b345"
        },
        "date": 1584536898029,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.67,
            "range": "±1.00%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±2.44%",
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
          "id": "6ec495072025364e3075861448c8b017020ed921",
          "message": "Merge pull request #97 from secretlint/credentials-is-secret\n\ndocs: credentials is secret",
          "timestamp": "2020-03-18T23:13:19+09:00",
          "tree_id": "8fe5c6e93939346afc959e611d1a805013d3a3fb",
          "url": "https://github.com/secretlint/secretlint/commit/6ec495072025364e3075861448c8b017020ed921"
        },
        "date": 1584540949534,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.59,
            "range": "±2.70%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±2.89%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "b4a358cc2a786c4f0ba8c95d4bdee4168f7e37ad",
          "message": "fix(publish): split publish to binary",
          "timestamp": "2020-03-18T23:22:14+09:00",
          "tree_id": "fbb5b548b81b9d39ad3d4d8f0aaa14e572e44cee",
          "url": "https://github.com/secretlint/secretlint/commit/b4a358cc2a786c4f0ba8c95d4bdee4168f7e37ad"
        },
        "date": 1584541466343,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.98,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.71,
            "range": "±2.33%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "8d82565ae5cdb5a5a4305888cf58df7def23a1a2",
          "message": "fix(publish-binary): fix config",
          "timestamp": "2020-03-18T23:23:50+09:00",
          "tree_id": "8f6b966202a63141985c827047a62d051b7f904d",
          "url": "https://github.com/secretlint/secretlint/commit/8d82565ae5cdb5a5a4305888cf58df7def23a1a2"
        },
        "date": 1584541579625,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.74,
            "range": "±2.02%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±1.54%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "1596c379cbb535b4e43dff617cc34ef66e484490",
          "message": "fix(publish-binary): fix config",
          "timestamp": "2020-03-18T23:25:32+09:00",
          "tree_id": "7068308266dd4b8334c4bb3670196e35fc05c5aa",
          "url": "https://github.com/secretlint/secretlint/commit/1596c379cbb535b4e43dff617cc34ef66e484490"
        },
        "date": 1584541685287,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.61,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±4.51%",
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
          "id": "03d8ebf27b6a6723e846731e150acc77603290b2",
          "message": "Merge pull request #98 from secretlint/release/2020-03-18\n\nv0.10.0 - Next is 1.0.0",
          "timestamp": "2020-03-18T23:52:25+09:00",
          "tree_id": "23ba81857aed8f59786b7658950fe3a0257e21d2",
          "url": "https://github.com/secretlint/secretlint/commit/03d8ebf27b6a6723e846731e150acc77603290b2"
        },
        "date": 1584543306009,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.56,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "429fa9f23055e7e48a89966ef3560c4d247774ef",
          "message": "fix(publish-binary): fix config",
          "timestamp": "2020-03-19T00:02:12+09:00",
          "tree_id": "e6a65a665620be16ce936c63039d2a38b172f81c",
          "url": "https://github.com/secretlint/secretlint/commit/429fa9f23055e7e48a89966ef3560c4d247774ef"
        },
        "date": 1584543893438,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.65,
            "range": "±1.96%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "a2a7bb139bdd1c1a4386f14d8301231e24455c84",
          "message": "Update README",
          "timestamp": "2020-03-19T00:05:46+09:00",
          "tree_id": "69c34f927d81adad1d5aedf484aa114cf03ffd82",
          "url": "https://github.com/secretlint/secretlint/commit/a2a7bb139bdd1c1a4386f14d8301231e24455c84"
        },
        "date": 1584544112063,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.56,
            "range": "±3.72%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±1.39%",
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
          "id": "612a77f34ce0eda396470d822b6dfba5488eeaaf",
          "message": "Merge pull request #99 from secretlint/release/2020-03-19-1\n\nv0.10.1",
          "timestamp": "2020-03-19T00:07:25+09:00",
          "tree_id": "332760ca7d96f7dc1a6501322598e1f5493a4471",
          "url": "https://github.com/secretlint/secretlint/commit/612a77f34ce0eda396470d822b6dfba5488eeaaf"
        },
        "date": 1584544195133,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.6,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "0fca332dffaccd2a01a02e8aba68ca0d69731b7f",
          "message": "CI(publish-binary): publish binary on release",
          "timestamp": "2020-03-19T00:22:37+09:00",
          "tree_id": "51a0d59376701bd61dfde4304ec1f2a99b598753",
          "url": "https://github.com/secretlint/secretlint/commit/0fca332dffaccd2a01a02e8aba68ca0d69731b7f"
        },
        "date": 1584545138271,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.45,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±3.75%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "baba3e16d25846e694b6223cdce30e513c8b5657",
          "message": "Update README",
          "timestamp": "2020-03-19T14:30:45+09:00",
          "tree_id": "0edfc9ab55cef51964e763e690ae4fe856a82af5",
          "url": "https://github.com/secretlint/secretlint/commit/baba3e16d25846e694b6223cdce30e513c8b5657"
        },
        "date": 1584596001531,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.61,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±2.77%",
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
          "id": "b2ffb304a2b5dbfc9747988c22cff51a2a61fbb6",
          "message": "Merge pull request #100 from secretlint/release/1.0.0\n\nv1.0.0",
          "timestamp": "2020-03-19T14:53:26+09:00",
          "tree_id": "bd329e0d39211abd6b22e1a754e27b9764b8d424",
          "url": "https://github.com/secretlint/secretlint/commit/b2ffb304a2b5dbfc9747988c22cff51a2a61fbb6"
        },
        "date": 1584597357665,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.54,
            "range": "±0.83%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±1.22%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "217316503a35b3f3c2c213677dcb0c46c3c57be7",
          "message": "Merge remote-tracking branch 'origin/master'",
          "timestamp": "2020-03-19T23:18:30+09:00",
          "tree_id": "54d42213fd36834b62b36faf6bf10feb1708582e",
          "url": "https://github.com/secretlint/secretlint/commit/217316503a35b3f3c2c213677dcb0c46c3c57be7"
        },
        "date": 1584627676271,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.6,
            "range": "±2.69%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±3.37%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "56dc316f36d0a2d3c620cc00c1cbc768bd320cf0",
          "message": "CI(publish): add publish to latest",
          "timestamp": "2020-03-24T00:08:42+09:00",
          "tree_id": "17e55756a009d70f749a7f1a267756ee4e26acad",
          "url": "https://github.com/secretlint/secretlint/commit/56dc316f36d0a2d3c620cc00c1cbc768bd320cf0"
        },
        "date": 1584976301453,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.41,
            "range": "±2.99%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.55,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "d7dacae69aa10909a0c63287776d3cb56a231928",
          "message": "CI: fix name",
          "timestamp": "2020-03-24T00:17:14+09:00",
          "tree_id": "bdaf974f952300a4b0c4f69d75a507878a1add8c",
          "url": "https://github.com/secretlint/secretlint/commit/d7dacae69aa10909a0c63287776d3cb56a231928"
        },
        "date": 1584976795506,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.54,
            "range": "±3.79%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±5.30%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "ba009cb5dc3f11793ac52ad8c642de697f8d89e1",
          "message": "CI: rename file",
          "timestamp": "2020-03-24T00:17:32+09:00",
          "tree_id": "148a3f335b2522e1df6f094126f22cd50ee67308",
          "url": "https://github.com/secretlint/secretlint/commit/ba009cb5dc3f11793ac52ad8c642de697f8d89e1"
        },
        "date": 1584976823176,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.44,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.55,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "3dcd7ac46c023ac283ab8d711704e51218261a7a",
          "message": "CI: use @secretlint",
          "timestamp": "2020-03-24T00:18:57+09:00",
          "tree_id": "cee842d11f532c3ec243eade9d0335f0278f833d",
          "url": "https://github.com/secretlint/secretlint/commit/3dcd7ac46c023ac283ab8d711704e51218261a7a"
        },
        "date": 1584976887158,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.66,
            "range": "±1.49%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "67231c96c58205d7a8514d80035ee9f0146e5c20",
          "message": "CI: remove conditions",
          "timestamp": "2020-03-24T00:21:45+09:00",
          "tree_id": "5932acf9248f662d8da95a73c67b2d3ba194c836",
          "url": "https://github.com/secretlint/secretlint/commit/67231c96c58205d7a8514d80035ee9f0146e5c20"
        },
        "date": 1584977063085,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.59,
            "range": "±0.84%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±1.81%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "d8a03073be797494cf1be61c392bbfaafa307456",
          "message": "CI: use PERSONAL_TOKEN",
          "timestamp": "2020-03-24T00:23:56+09:00",
          "tree_id": "f3287a01e5a8a2f3c864d1b4c8ee5ab9073f55e8",
          "url": "https://github.com/secretlint/secretlint/commit/d8a03073be797494cf1be61c392bbfaafa307456"
        },
        "date": 1584977192422,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.6,
            "range": "±1.07%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "ffd9fc2cf9bca2421b99aca2198ac9833985872f",
          "message": "CI: fix condition",
          "timestamp": "2020-03-24T00:26:10+09:00",
          "tree_id": "0451b71cffdd05877396306027d47c5a436e8790",
          "url": "https://github.com/secretlint/secretlint/commit/ffd9fc2cf9bca2421b99aca2198ac9833985872f"
        },
        "date": 1584977337142,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.47,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.56,
            "range": "±1.73%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "4c76969df093548fc08cb508fe1745c4ede0521c",
          "message": "CI: fix docker on gh",
          "timestamp": "2020-03-24T00:28:46+09:00",
          "tree_id": "a9bdc25117c3ce901158ad02251346e74bd50f2e",
          "url": "https://github.com/secretlint/secretlint/commit/4c76969df093548fc08cb508fe1745c4ede0521c"
        },
        "date": 1584977482415,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.52,
            "range": "±3.42%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "09d6b0e8475c954c59ce22307fe34126ca191821",
          "message": "CI: add latest tag",
          "timestamp": "2020-03-24T00:47:01+09:00",
          "tree_id": "8277cde46e0e47d2650c54cb8a7065241d533918",
          "url": "https://github.com/secretlint/secretlint/commit/09d6b0e8475c954c59ce22307fe34126ca191821"
        },
        "date": 1584978585198,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.55,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±2.40%",
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
          "id": "879ca379537acb1a3768ff1a26d2e87abe982b1b",
          "message": "Merge pull request #102 from secretlint/chore/2020-03-24-update-deps\n\nchore(deps): update dependencies",
          "timestamp": "2020-03-24T08:43:10+09:00",
          "tree_id": "c047cbbb251a752c8e619eab3219ed0a39d4aa6a",
          "url": "https://github.com/secretlint/secretlint/commit/879ca379537acb1a3768ff1a26d2e87abe982b1b"
        },
        "date": 1585007488786,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.81,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±3.79%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "a5f56d1df9c9d88b7a8ff82867ab7e51aab06a20",
          "message": "CI: move comments",
          "timestamp": "2020-03-24T19:39:02+09:00",
          "tree_id": "0aa4de75e551033da2f82c6401938fc30033e947",
          "url": "https://github.com/secretlint/secretlint/commit/a5f56d1df9c9d88b7a8ff82867ab7e51aab06a20"
        },
        "date": 1585046499846,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.6,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±3.80%",
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
          "id": "edfcf8bb105e74ffbe0a1c64fbbe27304d946777",
          "message": "feat(rule): Add rule to detect presence of secp256k1 private keys (#103)\n\nCo-authored-by: Matheus Alencar <matheus@kleros.io>\r\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2020-03-29T22:43:56+09:00",
          "tree_id": "1a9bfedef319c9ce4116861265c75d7ab7110db0",
          "url": "https://github.com/secretlint/secretlint/commit/edfcf8bb105e74ffbe0a1c64fbbe27304d946777"
        },
        "date": 1585489586714,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.6,
            "range": "±1.28%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±2.17%",
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
          "id": "cff07ecbd79e50d15f4b743b97ce2e1179c6becd",
          "message": "Merge pull request #108 from secretlint/revert-canary\n\nrevert: remove secretlint-rule-secp256k1-privatekey from canary",
          "timestamp": "2020-03-29T23:38:08+09:00",
          "tree_id": "f90fb826c91f913a9fd5cd8536ac19f7b6c834f8",
          "url": "https://github.com/secretlint/secretlint/commit/cff07ecbd79e50d15f4b743b97ce2e1179c6becd"
        },
        "date": 1585492828429,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.8,
            "range": "±2.41%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.66,
            "range": "±1.32%",
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
          "id": "def18bf840d00d67f07f0f3e4e896bbfb1dfc41f",
          "message": "Merge pull request #109 from secretlint/release/2020-03-29\n\nv1.0.1",
          "timestamp": "2020-03-29T23:47:54+09:00",
          "tree_id": "b3b35d40eb482d48f661901b7cf795c5aa89ff75",
          "url": "https://github.com/secretlint/secretlint/commit/def18bf840d00d67f07f0f3e4e896bbfb1dfc41f"
        },
        "date": 1585493431587,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.62,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±1.00%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "601c88f2e76bbeca8f58794fb0171404461e1105",
          "message": "chore(lerna): add \"includeMergedTags\": true",
          "timestamp": "2020-03-29T23:49:38+09:00",
          "tree_id": "c32da2e5b202d76c7b5a0d9784102b9268cf2e9b",
          "url": "https://github.com/secretlint/secretlint/commit/601c88f2e76bbeca8f58794fb0171404461e1105"
        },
        "date": 1585493549678,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.52,
            "range": "±1.72%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "1348b35d989dddb88d9067bc5a89d5f8bcc0f856",
          "message": "CI(publish): use Personal GH token",
          "timestamp": "2020-03-29T23:57:34+09:00",
          "tree_id": "544e2606655c91f2b01af356f7e47621ffc889ed",
          "url": "https://github.com/secretlint/secretlint/commit/1348b35d989dddb88d9067bc5a89d5f8bcc0f856"
        },
        "date": 1585495132121,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.52,
            "range": "±2.61%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "malencar@pm.me",
            "name": "Matheus Faria de Alencar",
            "username": "mtsalenc"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "320b3446d7afd85e342cb9bb15f6e9df7dae8036",
          "message": "fix(secretlint-rule-secp256k1-privatekey): handle thrown exception due to invalid key (#110)",
          "timestamp": "2020-03-30T07:45:44+09:00",
          "tree_id": "4be621fb54720b47d187a657fbb6221d3f2ba72b",
          "url": "https://github.com/secretlint/secretlint/commit/320b3446d7afd85e342cb9bb15f6e9df7dae8036"
        },
        "date": 1585522111493,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.5,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±1.08%",
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
          "id": "314535644c128254080b3be64c77643f5e2c5894",
          "message": "v1.0.2 (#111)",
          "timestamp": "2020-03-30T07:57:35+09:00",
          "tree_id": "856757cc03983d444e125a5c5f877b8ca1e0b32b",
          "url": "https://github.com/secretlint/secretlint/commit/314535644c128254080b3be64c77643f5e2c5894"
        },
        "date": 1585522816003,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.52,
            "range": "±2.06%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.56,
            "range": "±1.79%",
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
          "id": "5dd3982da24e1a15a40c7be2fbe72ee0f68dda03",
          "message": "feat(secretlint-rule-no-k8s-kind-secret): add new rule (#113)\n\n* feat(secretlint-rule-no-k8s-kind-secret): add new rule\r\n\r\n* docs: Update README\r\n\r\n* test(secretlint-rule-no-k8s-kind-secret): update snapshots\r\n\r\n* docs(secretlint-rule-no-k8s-kind-secret): update README\r\n\r\n* docs(secretlint-rule-no-k8s-kind-secret): update README\r\n\r\n* fix(secretlint-rule-no-k8s-kind-secret): support multiple manifest",
          "timestamp": "2020-03-31T00:16:38+09:00",
          "tree_id": "6b3138febfcc6af8e169c86c09325d463122a5be",
          "url": "https://github.com/secretlint/secretlint/commit/5dd3982da24e1a15a40c7be2fbe72ee0f68dda03"
        },
        "date": 1585581554822,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.7,
            "range": "±2.82%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±3.35%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "95759f0d2b2ef2cf003fcbf0f9550af08e8c3c7b",
          "message": "chode(deps): update deps",
          "timestamp": "2020-03-31T00:19:12+09:00",
          "tree_id": "ccc1ade8f491a137cdefe03729531f4cdc245873",
          "url": "https://github.com/secretlint/secretlint/commit/95759f0d2b2ef2cf003fcbf0f9550af08e8c3c7b"
        },
        "date": 1585581718546,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.53,
            "range": "±2.52%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±8.02%",
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
          "id": "a8855624bdfb58c741f0628c38a9a881339378d5",
          "message": "Merge pull request #115 from secretlint/release/2020-03-31-secretlint-rule-no-k8s-kind-secret\n\nv1.0.3: Add secretlint-rule-no-k8s-kind-secret",
          "timestamp": "2020-03-31T00:42:45+09:00",
          "tree_id": "33a21836968fd7159b128164bf18267a83e0b4d2",
          "url": "https://github.com/secretlint/secretlint/commit/a8855624bdfb58c741f0628c38a9a881339378d5"
        },
        "date": 1585583123509,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.68,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±2.15%",
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
          "id": "4fa809d6fbe9a5179ac0b11466f460c2b6a48e75",
          "message": "Merge pull request #117 from secretlint/fix/116\n\nfix(core): fix placeholder assertion for rule",
          "timestamp": "2020-03-31T14:00:31+09:00",
          "tree_id": "51ab4baa6b8c3c85b9e19ad6d4d8946d18607e51",
          "url": "https://github.com/secretlint/secretlint/commit/4fa809d6fbe9a5179ac0b11466f460c2b6a48e75"
        },
        "date": 1585630981134,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.73,
            "range": "±1.71%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±1.75%",
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
          "id": "027a3f447a9b1a1ce54e7128721254aa43f0b4cb",
          "message": "Merge pull request #118 from secretlint/release/2020-03-31\n\nv1.0.4: bug fixes",
          "timestamp": "2020-03-31T14:06:16+09:00",
          "tree_id": "4d2b9e0519a5cd3c1941565f1c89d4aa0d900341",
          "url": "https://github.com/secretlint/secretlint/commit/027a3f447a9b1a1ce54e7128721254aa43f0b4cb"
        },
        "date": 1585631338357,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.52,
            "range": "±1.84%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "c2445ccd7db13c559bff269b8e5d2dfda1936200",
          "message": "test(core): add not passed tests",
          "timestamp": "2020-03-31T14:14:19+09:00",
          "tree_id": "1ddbddb5ebf434a1518bd02ea8a89656ae33a875",
          "url": "https://github.com/secretlint/secretlint/commit/c2445ccd7db13c559bff269b8e5d2dfda1936200"
        },
        "date": 1585631819213,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.53,
            "range": "±8.59%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±4.16%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "973544765c8dc9b51f1e3bbdd6eb784e31882ad3",
          "message": "Update README",
          "timestamp": "2020-03-31T21:22:26+09:00",
          "tree_id": "5b1c441682995f1871e11ebc28f28b40a69410eb",
          "url": "https://github.com/secretlint/secretlint/commit/973544765c8dc9b51f1e3bbdd6eb784e31882ad3"
        },
        "date": 1585657511392,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.64,
            "range": "±1.28%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±1.16%",
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
          "id": "44e1388cbead71f09b2cb81352429002dac53a8c",
          "message": "Merge pull request #120 from munierujp/patch-1\n\ndocs(secretlint-rule): fix link syntax",
          "timestamp": "2020-04-02T23:48:51+09:00",
          "tree_id": "708649879a7474a4c233ee7e4cff89d7a900edc8",
          "url": "https://github.com/secretlint/secretlint/commit/44e1388cbead71f09b2cb81352429002dac53a8c"
        },
        "date": 1585839092536,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.53,
            "range": "±0.85%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±1.21%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "d0cbab72ef1465db54727b7103d2ffde92e952e8",
          "message": "fix(secretlint-rule-no-k8s-kind-secret): fix detect logic",
          "timestamp": "2020-04-03T10:44:28+09:00",
          "tree_id": "790eb34347df44d32d720ba8bd1d3acf89661fbc",
          "url": "https://github.com/secretlint/secretlint/commit/d0cbab72ef1465db54727b7103d2ffde92e952e8"
        },
        "date": 1585878433038,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.62,
            "range": "±1.11%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±1.13%",
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
          "id": "1ba65ca5ab0c7b081a222f645a3ce26c4f08879e",
          "message": "Merge pull request #122 from secretlint/release/2020-04-03\n\nv1.0.5: fix @secretlint/secretlint-rule-no-k8s-kind-secret",
          "timestamp": "2020-04-03T10:46:45+09:00",
          "tree_id": "699bf7346c91cf96cd16f1153cd048466a7d045b",
          "url": "https://github.com/secretlint/secretlint/commit/1ba65ca5ab0c7b081a222f645a3ce26c4f08879e"
        },
        "date": 1585878604824,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.42,
            "range": "±2.20%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.54,
            "range": "±1.34%",
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
          "id": "d12daa62ce7c132e709dc93d9722c5f74fccda98",
          "message": "feat(secretlint-rule-no-dotenv): add new rule (#121)\n\n* feat(secretlint-rule-no-dotenv): add new rule\r\n\r\n* docs(secretlint-rule-no-dotenv): update README\r\n\r\n* docs(secretlint-rule-no-dotenv): add LICENSE file\r\n\r\n* docs(secretlint-rule-no-dotenv): add License section to README\r\n\r\n* docs(secretlint-rule-no-dotenv): add Author section to README\r\n\r\n* chore(secretlint-rule-no-dotenv): add license to package.json\r\n\r\n* chore(secretlint-rule-no-dotenv): add author to package.json",
          "timestamp": "2020-04-04T09:24:40+09:00",
          "tree_id": "8dcda9bcb7ee800cadda24d5fbc10eece4fe3893",
          "url": "https://github.com/secretlint/secretlint/commit/d12daa62ce7c132e709dc93d9722c5f74fccda98"
        },
        "date": 1585960049866,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.5,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±1.24%",
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
          "id": "d924bd2e020439f449aa24d1673a3d212ebefa49",
          "message": "Merge pull request #123 from secretlint/release/2020-04-04\n\nv1.1.0: Add secretlint-rule-no-dotenv",
          "timestamp": "2020-04-04T10:05:12+09:00",
          "tree_id": "fd4aad7b0a7ad927a6c6619b1540ebbc0ea0de4b",
          "url": "https://github.com/secretlint/secretlint/commit/d924bd2e020439f449aa24d1673a3d212ebefa49"
        },
        "date": 1585962462782,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.73,
            "range": "±3.10%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "cd0466b08af61ead0755b67a511e3570ad985cc0",
          "message": "chore(deps): update lock",
          "timestamp": "2020-04-04T21:33:48+09:00",
          "tree_id": "316c72a3c27ea187fa3a4bd0c67a07eebda8f128",
          "url": "https://github.com/secretlint/secretlint/commit/cd0466b08af61ead0755b67a511e3570ad985cc0"
        },
        "date": 1586003796995,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.58,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±0.62%",
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
          "id": "45021494aa44c81c3f87eb4a38f262d4376cd081",
          "message": "Merge pull request #126 from munierujp/migrate_mocha_config_file\n\nchore: migrate mocha.opts to .mocharc.json",
          "timestamp": "2020-04-08T21:52:07+09:00",
          "tree_id": "91b50b8604786446a7eeee5bbb823f1d259d7a7e",
          "url": "https://github.com/secretlint/secretlint/commit/45021494aa44c81c3f87eb4a38f262d4376cd081"
        },
        "date": 1586350481129,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.65,
            "range": "±2.55%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±2.49%",
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
          "id": "c09ba64dc91dd85cd3066492f1054bcd15457190",
          "message": "Merge pull request #127 from secretlint/feature/124\n\nfix(core): change SecretLintRuleMessageTranslate to check statically",
          "timestamp": "2020-04-11T19:08:50+09:00",
          "tree_id": "e440226ef7ecb07513bbf94eced2e817ffcfe725",
          "url": "https://github.com/secretlint/secretlint/commit/c09ba64dc91dd85cd3066492f1054bcd15457190"
        },
        "date": 1586599904527,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.46,
            "range": "±0.86%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.56,
            "range": "±0.92%",
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
          "id": "71d32cb41aa1dff26cebc9df31e32a9eafeb5371",
          "message": "feat(secretelint-rule-sendgrid): add new sendgrid rule\n\nDetect SendGrid API key",
          "timestamp": "2020-04-27T09:04:09+09:00",
          "tree_id": "6fad7b09b68600b030296209cdccea32b878a6ff",
          "url": "https://github.com/secretlint/secretlint/commit/71d32cb41aa1dff26cebc9df31e32a9eafeb5371"
        },
        "date": 1587946011299,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.64,
            "range": "±0.88%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "17da3f25c1179618e23d487af2ccd957197c162d",
          "message": "Update README",
          "timestamp": "2020-04-27T22:50:28+09:00",
          "tree_id": "6de174817470b2f84116d13914cf425df7ee02e9",
          "url": "https://github.com/secretlint/secretlint/commit/17da3f25c1179618e23d487af2ccd957197c162d"
        },
        "date": 1587995592930,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.8,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±5.77%",
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
          "id": "d961f968a46561ca424d54d6f34ce94e245a6e16",
          "message": "chore(release): v2.0.0 (#134)",
          "timestamp": "2020-04-29T13:02:09+09:00",
          "tree_id": "20726e5d3f5de8e92a1fe0eb5fbb3166ddccaffc",
          "url": "https://github.com/secretlint/secretlint/commit/d961f968a46561ca424d54d6f34ce94e245a6e16"
        },
        "date": 1588133112148,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.67,
            "range": "±1.02%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±1.75%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "0d8e28c26dcda2f2211d1b139fa505fe0e5ce1e8",
          "message": "Update README",
          "timestamp": "2020-04-29T17:17:05+09:00",
          "tree_id": "4d5a4f632a0a00b9a2ed3834b57538518a792887",
          "url": "https://github.com/secretlint/secretlint/commit/0d8e28c26dcda2f2211d1b139fa505fe0e5ce1e8"
        },
        "date": 1588148402939,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.53,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.55,
            "range": "±1.66%",
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
          "id": "447e2e0b473e267934ea42ed8788de15dcea9cd8",
          "message": "feat(secretlint-rule-no-homedir): add new rule (#136)\n\n* feat(secretlint-rule-no-homedir): add new rule\r\n\r\n* chore(no-homedir): remove unused options\r\n\r\n* chore(no-homedir): remove unused options\r\n\r\n* docs: Update README\r\n\r\n* chore: fix typo",
          "timestamp": "2020-05-02T20:50:46+09:00",
          "tree_id": "5fae2094c6c974470c92e7abfe9804dd6ba20ec6",
          "url": "https://github.com/secretlint/secretlint/commit/447e2e0b473e267934ea42ed8788de15dcea9cd8"
        },
        "date": 1588420410820,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.63,
            "range": "±2.08%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±1.62%",
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
          "id": "510decf4605b202539c7bedf7a6ea22bdd4cc62f",
          "message": "fix(secretlint): fix handling for non-ascii file path (#137)\n\n* fix(secretlin): fix non-ascii file path\r\n\r\n* chore: apply style",
          "timestamp": "2020-06-06T10:09:49+09:00",
          "tree_id": "572269381e4a1cd7c024a61b663aa865a7e37fff",
          "url": "https://github.com/secretlint/secretlint/commit/510decf4605b202539c7bedf7a6ea22bdd4cc62f"
        },
        "date": 1591405965326,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.55,
            "range": "±1.10%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "dphoude@gmail.com",
            "name": "PseudoCoding",
            "username": "PseudoCoding"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "097921f9682b619dbeb5e35068b1c57913bf5df9",
          "message": "feat(rule): Creating new rule for SecretLint for using regular expressions (#139)\n\n* Creating new rule for SecretLint for using regular expressions\r\n\r\n* Rename directory and remove package-lock.json from secretlint-rule-pattern\r\n\r\n* Switching to matchPatterns instead of RegExp",
          "timestamp": "2020-06-16T00:17:36+09:00",
          "tree_id": "39fb5be87fd37be855958483b06550fd9d9dfbea",
          "url": "https://github.com/secretlint/secretlint/commit/097921f9682b619dbeb5e35068b1c57913bf5df9"
        },
        "date": 1592234434214,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.61,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±2.24%",
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
          "id": "bd05e472ac9e4eb979070626b9a70e21950111e1",
          "message": "2.1.0 (#141)\n\n* chore(pattern): add ja localize\r\n\r\n* chore(release): v2.1.0",
          "timestamp": "2020-06-16T18:49:29+09:00",
          "tree_id": "058c0de1d1379f890dea92b9cbd2c89251424426",
          "url": "https://github.com/secretlint/secretlint/commit/bd05e472ac9e4eb979070626b9a70e21950111e1"
        },
        "date": 1592301120032,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.85,
            "range": "±4.50%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±2.04%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "e6770770f4a147cb4d1c8e43ff363c55253cac63",
          "message": "docs: Add new rules\n\nfix #142",
          "timestamp": "2020-06-16T20:41:21+09:00",
          "tree_id": "33ffb42bf78aea1776494b2764d2d1b2158afef3",
          "url": "https://github.com/secretlint/secretlint/commit/e6770770f4a147cb4d1c8e43ff363c55253cac63"
        },
        "date": 1592307860889,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.61,
            "range": "±0.83%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.56,
            "range": "±1.01%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "9c7f374866e8966a28a9eae48dfcfe1213f9f765",
          "message": "docs: Update",
          "timestamp": "2020-06-18T23:14:12+09:00",
          "tree_id": "5299586c67b11fb6f45276b25e5c309135f2894d",
          "url": "https://github.com/secretlint/secretlint/commit/9c7f374866e8966a28a9eae48dfcfe1213f9f765"
        },
        "date": 1592489841229,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.55,
            "range": "±3.42%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.54,
            "range": "±4.07%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b8fee2739b1e0b1731de038d0300979b26cab006",
          "message": "chore(deps): bump lodash from 4.17.15 to 4.17.19 (#144)\n\nBumps [lodash](https://github.com/lodash/lodash) from 4.17.15 to 4.17.19.\r\n- [Release notes](https://github.com/lodash/lodash/releases)\r\n- [Commits](https://github.com/lodash/lodash/compare/4.17.15...4.17.19)\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2020-07-19T22:04:24+09:00",
          "tree_id": "9a12b903b09fa9b40e7621e07309188bc56abafc",
          "url": "https://github.com/secretlint/secretlint/commit/b8fee2739b1e0b1731de038d0300979b26cab006"
        },
        "date": 1595164041513,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.54,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.55,
            "range": "±1.13%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "9de8d7bc90b7200041b275702ba98348a2e6170e",
          "message": "test: update snapshots",
          "timestamp": "2020-07-20T00:24:25+09:00",
          "tree_id": "172dd0f9f54cf3a7fdf3d7410185cf16ad563def",
          "url": "https://github.com/secretlint/secretlint/commit/9de8d7bc90b7200041b275702ba98348a2e6170e"
        },
        "date": 1595172427693,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.87,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±2.64%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "ae976afb01acb540c7070e088879119908a90fca",
          "message": "CI: use checkout v2",
          "timestamp": "2020-07-20T01:29:57+09:00",
          "tree_id": "e3068f085a296ba1484a3e27abf79bd9f782e954",
          "url": "https://github.com/secretlint/secretlint/commit/ae976afb01acb540c7070e088879119908a90fca"
        },
        "date": 1595176377291,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.61,
            "range": "±0.67%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8f077d9cf45a4a8cb33e38e7da895627c0828b6e",
          "message": "chore(deps): bump elliptic from 6.5.2 to 6.5.3 (#146)\n\nBumps [elliptic](https://github.com/indutny/elliptic) from 6.5.2 to 6.5.3.\r\n- [Release notes](https://github.com/indutny/elliptic/releases)\r\n- [Commits](https://github.com/indutny/elliptic/compare/v6.5.2...v6.5.3)\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2020-08-02T09:58:55+09:00",
          "tree_id": "533ed3f01fc5b9ea2799792c65bdf357e8af769a",
          "url": "https://github.com/secretlint/secretlint/commit/8f077d9cf45a4a8cb33e38e7da895627c0828b6e"
        },
        "date": 1596330121395,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.56,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.52,
            "range": "±6.19%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "dbbdfba8d5f903fa96471e3b2104513ac83c463b",
          "message": "CI: use node-version",
          "timestamp": "2020-08-31T22:58:20+09:00",
          "tree_id": "36c97b2f6660aa1ef545786c08f75cfd95cbf597",
          "url": "https://github.com/secretlint/secretlint/commit/dbbdfba8d5f903fa96471e3b2104513ac83c463b"
        },
        "date": 1598882471533,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.86,
            "range": "±0.49%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.66,
            "range": "±1.05%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "dc389c0ca8e19c1e5a71d60769cfa1548deb6ad9",
          "message": "CI: remove duplicated tag",
          "timestamp": "2020-09-01T00:22:21+09:00",
          "tree_id": "5bcddace6ebad920b4f79eeb388fffea949a34af",
          "url": "https://github.com/secretlint/secretlint/commit/dc389c0ca8e19c1e5a71d60769cfa1548deb6ad9"
        },
        "date": 1598887525513,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.8,
            "range": "±2.20%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±2.91%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6b0caa7f6eb728d8261637ae794482256c2ee68d",
          "message": "chore(deps): bump node-fetch from 2.6.0 to 2.6.1 (#147)\n\nBumps [node-fetch](https://github.com/bitinn/node-fetch) from 2.6.0 to 2.6.1.\r\n- [Release notes](https://github.com/bitinn/node-fetch/releases)\r\n- [Changelog](https://github.com/node-fetch/node-fetch/blob/master/docs/CHANGELOG.md)\r\n- [Commits](https://github.com/bitinn/node-fetch/compare/v2.6.0...v2.6.1)\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2020-09-13T00:44:55+09:00",
          "tree_id": "68306597fbabeede069068d2372ded4a3d11d963",
          "url": "https://github.com/secretlint/secretlint/commit/6b0caa7f6eb728d8261637ae794482256c2ee68d"
        },
        "date": 1599925669701,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.78,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±0.90%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "dbd62f7fb328244d960d69ed05fc34a6afa2c1be",
          "message": "chore(deps): bump node-forge from 0.9.1 to 0.10.0 (#148)\n\nBumps [node-forge](https://github.com/digitalbazaar/forge) from 0.9.1 to 0.10.0.\r\n- [Release notes](https://github.com/digitalbazaar/forge/releases)\r\n- [Changelog](https://github.com/digitalbazaar/forge/blob/master/CHANGELOG.md)\r\n- [Commits](https://github.com/digitalbazaar/forge/compare/0.9.1...0.10.0)\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2020-11-05T07:35:47+09:00",
          "tree_id": "931368650827f893953f4af1f91342b8230e30c0",
          "url": "https://github.com/secretlint/secretlint/commit/dbd62f7fb328244d960d69ed05fc34a6afa2c1be"
        },
        "date": 1604529503598,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.13,
            "range": "±2.41%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.71,
            "range": "±0.95%",
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
          "id": "ee794cdf7b9aa5f2ec756e361d269b24b6e40070",
          "message": "chore(release): v2.1.1 (#151)",
          "timestamp": "2020-11-05T07:42:54+09:00",
          "tree_id": "69ac3969a373fb042e6e0ed83487baf17dece0cd",
          "url": "https://github.com/secretlint/secretlint/commit/ee794cdf7b9aa5f2ec756e361d269b24b6e40070"
        },
        "date": 1604529935033,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.96,
            "range": "±2.42%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.7,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "bfff6db593ff86e87ca4f9145d025f70036f148d",
          "message": "chore(deps): bump ini from 1.3.5 to 1.3.8 (#152)\n\nBumps [ini](https://github.com/isaacs/ini) from 1.3.5 to 1.3.8.\r\n- [Release notes](https://github.com/isaacs/ini/releases)\r\n- [Commits](https://github.com/isaacs/ini/compare/v1.3.5...v1.3.8)\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2020-12-12T19:19:10+09:00",
          "tree_id": "905144889b0a51de8231d4e0687c848f5a221b64",
          "url": "https://github.com/secretlint/secretlint/commit/bfff6db593ff86e87ca4f9145d025f70036f148d"
        },
        "date": 1607768509727,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.07,
            "range": "±3.41%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.72,
            "range": "±2.23%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fa9e16640f6c351a7cf762e0a0bcc6fd1f98b7b4",
          "message": "chore(deps): bump y18n from 4.0.0 to 4.0.1 (#155)\n\nBumps [y18n](https://github.com/yargs/y18n) from 4.0.0 to 4.0.1.\r\n- [Release notes](https://github.com/yargs/y18n/releases)\r\n- [Changelog](https://github.com/yargs/y18n/blob/master/CHANGELOG.md)\r\n- [Commits](https://github.com/yargs/y18n/commits)\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2021-03-31T23:59:23+09:00",
          "tree_id": "72abc30213eb736fc990309531953e032613cc51",
          "url": "https://github.com/secretlint/secretlint/commit/fa9e16640f6c351a7cf762e0a0bcc6fd1f98b7b4"
        },
        "date": 1617202942473,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.78,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±2.13%",
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
          "id": "0bb3fae3c3d19d7c43fbd9e65793daadd04f117c",
          "message": "Create codeql-analysis.yml",
          "timestamp": "2021-04-06T05:56:21+09:00",
          "tree_id": "cf106f6f958252c5a82f92921295a77bc56da9ca",
          "url": "https://github.com/secretlint/secretlint/commit/0bb3fae3c3d19d7c43fbd9e65793daadd04f117c"
        },
        "date": 1617656343714,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.9,
            "range": "±3.52%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.68,
            "range": "±3.19%",
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
          "id": "c0da8dbcd16063f08a7b8b319f4a7b62b90ce6de",
          "message": "fix(docker): fix invalid label key (#156)",
          "timestamp": "2021-04-06T06:58:54+09:00",
          "tree_id": "0df3ead4c96cf965cf7998191311538057f512d6",
          "url": "https://github.com/secretlint/secretlint/commit/c0da8dbcd16063f08a7b8b319f4a7b62b90ce6de"
        },
        "date": 1617660090658,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.7,
            "range": "±3.74%",
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
          "id": "3d6e6bc6d9a9a4e0e6b690e7ec87b98a8c4b2781",
          "message": "chore(deps): update all typescript (#157)\n\n* chore(dep): update devDeps\r\n\r\n* chore(deps): update all typescript\r\n\r\n* fix(config-validator): fix validator schema\r\n\r\n* test(formatter): fix escaped message\r\n\r\n* style: apply prettier\r\n\r\n* chore: rename to .githooks",
          "timestamp": "2021-04-25T21:01:47+09:00",
          "tree_id": "6f4e747426b03e6c9cf344fcc5c18525ee42103a",
          "url": "https://github.com/secretlint/secretlint/commit/3d6e6bc6d9a9a4e0e6b690e7ec87b98a8c4b2781"
        },
        "date": 1619352294733,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.76,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±2.42%",
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
          "id": "96c17a6a0f002c08ba79da971f374e1ac6de4380",
          "message": "Update README.md",
          "timestamp": "2021-04-26T14:06:42+09:00",
          "tree_id": "0157d497c2a07fd88939ff75d08f65370b2fd3af",
          "url": "https://github.com/secretlint/secretlint/commit/96c17a6a0f002c08ba79da971f374e1ac6de4380"
        },
        "date": 1619413787322,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.74,
            "range": "±2.43%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±2.34%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "a15e9c15f11ca73290c7d57e617d7df9bfadfb46",
          "message": "chore(deps): update lock",
          "timestamp": "2021-05-23T09:55:52+09:00",
          "tree_id": "ed6d87cfffc85a8adc3a193e7235f1b780687c8c",
          "url": "https://github.com/secretlint/secretlint/commit/a15e9c15f11ca73290c7d57e617d7df9bfadfb46"
        },
        "date": 1621731554481,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.67,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±1.23%",
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
          "id": "e4294f09d9faf8d598d369837b152694be7ca3a7",
          "message": "feat: implement @secretlint/secretlint-rule-github (#160)\n\n* feat: implement @secretlint/secretlint-rule-github\r\n\r\nsupport new GitHub Token format\r\n\r\n* chore: fix\r\n\r\n* chore: fix\r\n\r\n* chore: fix\r\n\r\n* chore: fix",
          "timestamp": "2021-05-27T14:39:23+09:00",
          "tree_id": "69ae40b57d23ce7397c561f401828e86e5ad69a3",
          "url": "https://github.com/secretlint/secretlint/commit/e4294f09d9faf8d598d369837b152694be7ca3a7"
        },
        "date": 1622094126697,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.91,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.69,
            "range": "±0.75%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "06ae2498d17035b31fe7c290549368dff2955f3c",
          "message": "CI: use $GITHUB_ENV",
          "timestamp": "2021-05-27T14:41:53+09:00",
          "tree_id": "c8fa6b7a5bec2f023dbed7b7120584234d99ce8b",
          "url": "https://github.com/secretlint/secretlint/commit/06ae2498d17035b31fe7c290549368dff2955f3c"
        },
        "date": 1622094300767,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.82,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±4.42%",
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
          "id": "64bf33d6ee6e31a8416bf2bde6ee27a700955fb1",
          "message": "chore(release): v2.2.0 (#162)",
          "timestamp": "2021-05-27T14:55:16+09:00",
          "tree_id": "87d1a03cd896c58c5778e293d5d67870ee05788a",
          "url": "https://github.com/secretlint/secretlint/commit/64bf33d6ee6e31a8416bf2bde6ee27a700955fb1"
        },
        "date": 1622095115580,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.73,
            "range": "±0.99%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±1.57%",
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
          "id": "7b65f778f8031d621c39d00a07eb7cdd830404ef",
          "message": "refactor: drop to support Node.js 10 (#163)\n\n* refactor: drop to support Node.js 10\r\n\r\n- remove matchAll polyfill\r\n- remove Node.js 10 from CI\r\n- update target to es2015\r\n\r\n* CI: add hub tag\r\n\r\n* CI: add hub tag",
          "timestamp": "2021-05-29T11:08:50+09:00",
          "tree_id": "628ed7f34c8574e48a6335cf205f2f4fa5097117",
          "url": "https://github.com/secretlint/secretlint/commit/7b65f778f8031d621c39d00a07eb7cdd830404ef"
        },
        "date": 1622254340040,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.6,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±2.30%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "94c30463866f3027bfba5c53bde3b4f4ae88a649",
          "message": "docs: add GitHub secret scanning\n\nfix https://github.com/secretlint/secretlint/issues/159",
          "timestamp": "2021-05-29T11:24:21+09:00",
          "tree_id": "ca2c42121c01b37cbd33134638ac1d72cc41731f",
          "url": "https://github.com/secretlint/secretlint/commit/94c30463866f3027bfba5c53bde3b4f4ae88a649"
        },
        "date": 1622255246681,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.81,
            "range": "±3.82%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±3.39%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "5fbb39f1f5873d5391c5be6094aa6c92f5aaae2e",
          "message": "fix typo",
          "timestamp": "2021-05-29T11:25:51+09:00",
          "tree_id": "ea38de51ba73074f722c81eb9bf1f36bda46ae8d",
          "url": "https://github.com/secretlint/secretlint/commit/5fbb39f1f5873d5391c5be6094aa6c92f5aaae2e"
        },
        "date": 1622255347061,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.68,
            "range": "±1.17%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±1.68%",
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
          "id": "c5fb2778961b784be255549519a27d920a0278dd",
          "message": "feat(preset-recommend): add GitHub to preset (#164)\n\nBREAKING CHANGE: secretlint-rule-preset-recommend has been changed\r\n\r\n- It includes \"@secretlint/secretlint-rule-github\" by default",
          "timestamp": "2021-05-29T11:49:59+09:00",
          "tree_id": "2a641714ad922e99b316afbec5fb88169ead5c74",
          "url": "https://github.com/secretlint/secretlint/commit/c5fb2778961b784be255549519a27d920a0278dd"
        },
        "date": 1622256783397,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.77,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±1.30%",
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
          "id": "06a6a5c0aedc4bfa89b91891c04095d04bdf09d6",
          "message": "chore(release): v3.0.0 (#165)",
          "timestamp": "2021-05-29T11:59:22+09:00",
          "tree_id": "05e575930759ef74524d511c270a63dcdb2ddb8b",
          "url": "https://github.com/secretlint/secretlint/commit/06a6a5c0aedc4bfa89b91891c04095d04bdf09d6"
        },
        "date": 1622257330738,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.95,
            "range": "±2.05%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±5.40%",
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
          "id": "8dc54c345420b30c95f671d63d777a3e002c3e63",
          "message": "Update README.md",
          "timestamp": "2021-06-02T22:51:50+09:00",
          "tree_id": "6e51911d5a1813b48abd925f785fa833b6715ce1",
          "url": "https://github.com/secretlint/secretlint/commit/8dc54c345420b30c95f671d63d777a3e002c3e63"
        },
        "date": 1622642074747,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.01,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±2.14%",
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
          "id": "54d833d3cd10b10c334c13a22b59845127a05b05",
          "message": "docs: use LTS",
          "timestamp": "2021-06-02T22:55:56+09:00",
          "tree_id": "7cec727ae46b12e3724d49f455bc2f0792feb202",
          "url": "https://github.com/secretlint/secretlint/commit/54d833d3cd10b10c334c13a22b59845127a05b05"
        },
        "date": 1622642324781,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.01,
            "range": "±0.96%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±2.96%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "a5976f962ae4aeae178c7c54c8a5051dfffe6c6e",
          "message": "docs: add options",
          "timestamp": "2021-06-03T22:15:51+09:00",
          "tree_id": "a4619a30cfe7dffd8d784de9c78f1f648b5ca2c9",
          "url": "https://github.com/secretlint/secretlint/commit/a5976f962ae4aeae178c7c54c8a5051dfffe6c6e"
        },
        "date": 1622726329813,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.83,
            "range": "±0.40%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "6def0a7ea8cc966d2e8aa404160768440b973512",
          "message": "docs: update example",
          "timestamp": "2021-06-03T22:18:21+09:00",
          "tree_id": "4f254ddbd83eb4605d255caadbfc83e359b00f1f",
          "url": "https://github.com/secretlint/secretlint/commit/6def0a7ea8cc966d2e8aa404160768440b973512"
        },
        "date": 1622726505210,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.94,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±2.17%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "27b51b0ac9debc44b6076dc1379203d412dbdd99",
          "message": "docs: fix typo",
          "timestamp": "2021-06-03T22:19:10+09:00",
          "tree_id": "54c38df0b89166d0cd6bdaf2accf224955e42431",
          "url": "https://github.com/secretlint/secretlint/commit/27b51b0ac9debc44b6076dc1379203d412dbdd99"
        },
        "date": 1622726635149,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.9,
            "range": "±2.93%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.66,
            "range": "±1.16%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "a7e926d21efe457b6c2f6951895ed78e972db53e",
          "message": "docs: update",
          "timestamp": "2021-06-03T22:21:12+09:00",
          "tree_id": "f80d75fd36e20d55176d36908047a5d0457f4229",
          "url": "https://github.com/secretlint/secretlint/commit/a7e926d21efe457b6c2f6951895ed78e972db53e"
        },
        "date": 1622726685112,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.62,
            "range": "±0.95%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.56,
            "range": "±1.86%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "53790060+DeviousLab@users.noreply.github.com",
            "name": "DeviousLab",
            "username": "DeviousLab"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ceab00980de07c80f2a290b45a70201250fc71d6",
          "message": "fix(gcp): Fixed typo from CP to GCP (#170)",
          "timestamp": "2021-06-15T21:49:19+09:00",
          "tree_id": "d0d92b484eee4f53d360c305bb14b8173827e22d",
          "url": "https://github.com/secretlint/secretlint/commit/ceab00980de07c80f2a290b45a70201250fc71d6"
        },
        "date": 1623761511904,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.19,
            "range": "±0.39%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.73,
            "range": "±1.61%",
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
          "id": "1198da1c6557801cc161b659d4760f504d135921",
          "message": "chore(deps): update devDeps  (#172)\n\n* chore(deps): update devDeps\r\n\r\n* chore(deps): update lock\r\n\r\n* chore: update snapshot",
          "timestamp": "2021-06-23T15:26:04+09:00",
          "tree_id": "461267456ba58ca0724712b15cf88c43eb143076",
          "url": "https://github.com/secretlint/secretlint/commit/1198da1c6557801cc161b659d4760f504d135921"
        },
        "date": 1624429720169,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.3,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.75,
            "range": "±3.98%",
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
          "id": "c211103d9a151e02be53f693997f0d68e6781427",
          "message": "feat(privatekey): support non cryptosystem name pattern (#173)\n\n* feat(privatekey): support non cryptosystem name pattern\r\n\r\n* chore: 16\r\n\r\n* test: update snapshot",
          "timestamp": "2021-06-24T22:02:49+09:00",
          "tree_id": "0684a1bf68f2e303b0bf592ef41c05a9565cb5dd",
          "url": "https://github.com/secretlint/secretlint/commit/c211103d9a151e02be53f693997f0d68e6781427"
        },
        "date": 1624539957580,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.8,
            "range": "±1.22%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±3.33%",
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
          "id": "634a3fb30f99492e94676a358aaae3de31d99207",
          "message": "chore(release): v3.1.0 (#174)",
          "timestamp": "2021-06-24T22:10:34+09:00",
          "tree_id": "193de46a192bff398b08b3f12d03ef2df282ef88",
          "url": "https://github.com/secretlint/secretlint/commit/634a3fb30f99492e94676a358aaae3de31d99207"
        },
        "date": 1624540420789,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.83,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.63,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "46071336+susam-projects@users.noreply.github.com",
            "name": "Sergey Belskiy",
            "username": "susam-projects"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6bd79101458677a08a69bdfc36c0782e3fb90799",
          "message": "feat(formatter): add \"native\" table formatter (#169)\n\n* feat(formatter): add \"native\" table formatter\r\n\r\n* refactor: clear code\r\n\r\n* test(secretlint): update shapshots\r\n\r\n* fix(formatter): fix imports\r\n\r\n* fix(formatter): fix getting formatters list for prod\r\n\r\n* chore(deps): update yarn.lock\r\n\r\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2021-06-27T14:53:27+09:00",
          "tree_id": "5cc8aa6891f5cd77aa128e56f7a5bb71e77267ba",
          "url": "https://github.com/secretlint/secretlint/commit/6bd79101458677a08a69bdfc36c0782e3fb90799"
        },
        "date": 1624773406824,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.69,
            "range": "±3.05%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.56,
            "range": "±1.58%",
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
          "id": "a291a9dcc6e51c89ac8356b95ecda0b35f595cf4",
          "message": "chore(release): v3.2.0 (#175)",
          "timestamp": "2021-06-27T15:02:03+09:00",
          "tree_id": "b50e012be6f4decf837e8d5f1f1be2d7178fcb62",
          "url": "https://github.com/secretlint/secretlint/commit/a291a9dcc6e51c89ac8356b95ecda0b35f595cf4"
        },
        "date": 1624773916999,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.8,
            "range": "±2.22%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±4.16%",
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
          "id": "a11bf0684b9654e9851a34c0a92de67f8e9cfdc1",
          "message": "docs: add permissions to GitHub Actions",
          "timestamp": "2021-06-27T15:05:24+09:00",
          "tree_id": "82885640bc5dfbd7392624fbe23c7ad8b75b8c53",
          "url": "https://github.com/secretlint/secretlint/commit/a11bf0684b9654e9851a34c0a92de67f8e9cfdc1"
        },
        "date": 1624774107048,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.17,
            "range": "±0.28%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.7,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f6ee7794184c8cfb89c0bcd87e11e58d99301b25",
          "message": "chore(release): v3.3.0 (#178)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2021-07-05T20:39:52+09:00",
          "tree_id": "698015cc59a4516ab751f24edda16dc310f08bf5",
          "url": "https://github.com/secretlint/secretlint/commit/f6ee7794184c8cfb89c0bcd87e11e58d99301b25"
        },
        "date": 1625485379227,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.87,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±2.26%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "6e65392d983db8b0e4ee9d2bcb1e179be7d93e59",
          "message": "CI: update permissions",
          "timestamp": "2021-07-05T21:06:28+09:00",
          "tree_id": "8bf8b47864e19c2618f8ab0703c9da6cf02f76ce",
          "url": "https://github.com/secretlint/secretlint/commit/6e65392d983db8b0e4ee9d2bcb1e179be7d93e59"
        },
        "date": 1625486982659,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.81,
            "range": "±0.89%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±1.71%",
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
          "id": "92d625ec5a8cdd2b5c86e5a0c6acd9069362cd17",
          "message": "Update README.md",
          "timestamp": "2021-07-12T23:08:11+09:00",
          "tree_id": "6c251fe3d5074b22f95005760bb7e678c2d89b4e",
          "url": "https://github.com/secretlint/secretlint/commit/92d625ec5a8cdd2b5c86e5a0c6acd9069362cd17"
        },
        "date": 1626099073674,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.88,
            "range": "±2.41%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±2.05%",
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
          "id": "dcd641256c11e5f4e3b6daadab0e9e5dddc9ae98",
          "message": "Update README.md",
          "timestamp": "2021-07-12T23:14:31+09:00",
          "tree_id": "85302e42d2ecbbe8931ce77ba68ccdcd4ce9688b",
          "url": "https://github.com/secretlint/secretlint/commit/dcd641256c11e5f4e3b6daadab0e9e5dddc9ae98"
        },
        "date": 1626099477615,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.57,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.55,
            "range": "±1.69%",
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
          "id": "1408bd75d140ab7cce07a3509570bfdaa05c01ad",
          "message": "Update README.md",
          "timestamp": "2021-08-09T12:51:37+09:00",
          "tree_id": "f823b242c724b34e78dbb0cbc4fad74f691eedca",
          "url": "https://github.com/secretlint/secretlint/commit/1408bd75d140ab7cce07a3509570bfdaa05c01ad"
        },
        "date": 1628481262081,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.1,
            "range": "±0.59%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.7,
            "range": "±1.98%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "nicolas.vuillamy@gmail.com",
            "name": "Nicolas Vuillamy",
            "username": "nvuillam"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c9fc3d4a593c4ffe7b2d36e2febf527388240ee3",
          "message": "docs: Add Mega-Linter in CI Integrations (#183)\n\n* docs: Add Mega-Linter in CI Integrations\r\n\r\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2021-08-12T20:23:47+09:00",
          "tree_id": "ae72b0499a8596a32463ad85f747e6cc694601a9",
          "url": "https://github.com/secretlint/secretlint/commit/c9fc3d4a593c4ffe7b2d36e2febf527388240ee3"
        },
        "date": 1628767938613,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.81,
            "range": "±1.14%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±2.02%",
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
          "id": "dcb57d8e3d359ae26b10978737e62d5c2850eb4b",
          "message": "Update README.md",
          "timestamp": "2021-08-12T20:25:09+09:00",
          "tree_id": "0a719c976d405d46c2cfdc09aa386f2ae37521d8",
          "url": "https://github.com/secretlint/secretlint/commit/dcb57d8e3d359ae26b10978737e62d5c2850eb4b"
        },
        "date": 1628768063047,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.66,
            "range": "±1.73%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "a8aa674237f14bce5b7a3c3d527d7fe9ad4c0dc6",
          "message": "chore: remove travis",
          "timestamp": "2021-08-13T22:38:37+09:00",
          "tree_id": "445d727028d7c9bca12a1104938aab13fac6ebfd",
          "url": "https://github.com/secretlint/secretlint/commit/a8aa674237f14bce5b7a3c3d527d7fe9ad4c0dc6"
        },
        "date": 1628862110178,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.89,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±1.65%",
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
          "id": "f3226ca5190faad1b41b8690fc294fc824c20bae",
          "message": "fix(privatekey): fix report range (#184)\n\n* fix(privatekey): fix report range\r\n\r\nshould report Private key range between ---- { key } -----\r\n\r\n* test: update snapshot",
          "timestamp": "2021-08-16T13:27:59+09:00",
          "tree_id": "85c9eccbed2100c821753b199ef2ceaf8b52c3f7",
          "url": "https://github.com/secretlint/secretlint/commit/f3226ca5190faad1b41b8690fc294fc824c20bae"
        },
        "date": 1629088254083,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.89,
            "range": "±2.45%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.66,
            "range": "±2.83%",
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
          "id": "bb9db2a77ace960fbe10669119aacb093ece160d",
          "message": "docs: add secretlint webextension (#185)",
          "timestamp": "2021-08-19T20:32:58+09:00",
          "tree_id": "d960687c5875a14970f73df76d2cef10e6df8a68",
          "url": "https://github.com/secretlint/secretlint/commit/bb9db2a77ace960fbe10669119aacb093ece160d"
        },
        "date": 1629372962714,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.84,
            "range": "±2.73%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±1.80%",
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
          "id": "590c3339f2f10ffeaf2b6d1084f9a907466d7453",
          "message": "feat(config-loader): support a rule written by ESM (#187)\n\n* feat(config-loader): support a rule written by ESM\r\n\r\n* test: fix test\r\n\r\n* chore: remove unused ok:false type\r\n\r\n* fix: error handling\r\n\r\n* fix: add error message\r\n\r\n* fix(tester): do not load when does not exist .secretlintrc\r\n\r\n* test: add ESM loading rule",
          "timestamp": "2021-09-14T20:34:27+09:00",
          "tree_id": "f90c6fbe9549b536cff2c13cdb8e635717631912",
          "url": "https://github.com/secretlint/secretlint/commit/590c3339f2f10ffeaf2b6d1084f9a907466d7453"
        },
        "date": 1631619465924,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.73,
            "range": "±1.33%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±2.84%",
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
          "id": "0d75bd15b438a6341aa50e104ce609da5d097f31",
          "message": "fix(config-loader)!: secretlint rule should `export { creator }` (#191)\n\n* fix(config-loader)!: secretlint should export `creator`\r\n\r\n* refactor: remove default export and use import { creator }\r\n\r\n* chore: fix import rules in preset\r\n\r\n* test: fix test\r\n\r\n* chore: move to original\r\n\r\n* docs: Update secreltint-rule.md",
          "timestamp": "2021-09-14T22:50:19+09:00",
          "tree_id": "8754117c8b01150a639fce6e2d61bee4e08a47f0",
          "url": "https://github.com/secretlint/secretlint/commit/0d75bd15b438a6341aa50e104ce609da5d097f31"
        },
        "date": 1631627614111,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.69,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±2.76%",
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
          "id": "36398f7ea23092bf7dcf4964c874b3bda55b2e26",
          "message": "chore!: requires Node.js 12+ (#193)\n\n- update engines and target",
          "timestamp": "2021-09-14T23:11:15+09:00",
          "tree_id": "dc9e04abc782f92c73371a4365ba684a9a807502",
          "url": "https://github.com/secretlint/secretlint/commit/36398f7ea23092bf7dcf4964c874b3bda55b2e26"
        },
        "date": 1631628867618,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.8,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±2.46%",
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
          "id": "607f361bebf75f532ac1966c6939ed5955f3c669",
          "message": "feat(secretlint-rule-filter-comments): secretlint-disable/secretlint-enable comment (#195)\n\n* feat(secretlint-rule-filter-comments): secretlint-disable/secretlint-enable comment\r\n\r\n* feat(secretlint-rule-filter-comments): secretlint-disable-next-line/secretlint-disable-line\r\n\r\n* docs: Update README\r\n\r\n* test: fix test case",
          "timestamp": "2021-09-15T12:07:48+09:00",
          "tree_id": "dcd9af90691ebb0d1510ec4733ce13aacce2f878",
          "url": "https://github.com/secretlint/secretlint/commit/607f361bebf75f532ac1966c6939ed5955f3c669"
        },
        "date": 1631675474855,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.59,
            "range": "±0.56%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±1.00%",
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
          "id": "3e834dce68e40456961059dac0b8adbe9aca6d70",
          "message": "chore(deps): update dependencies (#196)\n\n* chore(deps): update dependencies\r\n\r\n* fix: fix catch:unknown type\r\n\r\n* fix(deps): update js-yaml\r\n\r\n* fix: type issue",
          "timestamp": "2021-09-15T12:52:26+09:00",
          "tree_id": "5a8e8e909be1d51fa1bd94e45b8468d2a753b7e7",
          "url": "https://github.com/secretlint/secretlint/commit/3e834dce68e40456961059dac0b8adbe9aca6d70"
        },
        "date": 1631678117292,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.11,
            "range": "±0.54%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.73,
            "range": "±1.07%",
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
          "id": "7f25af32977bc4726c8d2e796b08ba046e58f2fc",
          "message": "feat(preset): add @secretlint/secretlint-rule-filter-comments to presets (#198)\n\n* feat(preset): add @secretlint/secretlint-rule-filter-comments to presets\r\n\r\n* Update README\r\n\r\n* Update README\r\n\r\n* Update README\r\n\r\n* Update README\r\n\r\n* Update README\r\n\r\n* Update README\r\n\r\n* Update README\r\n\r\n* Update README\r\n\r\n* Update README\r\n\r\n* Update README\r\n\r\n* Update README\r\n\r\n* Update README",
          "timestamp": "2021-09-15T14:22:32+09:00",
          "tree_id": "1fc2b080e4c44d51b6269018119551448fa4bc18",
          "url": "https://github.com/secretlint/secretlint/commit/7f25af32977bc4726c8d2e796b08ba046e58f2fc"
        },
        "date": 1631683557156,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.73,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±2.64%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "2c93303d1fd60f10601af494489dc55eeb5669a8",
          "message": "Update README",
          "timestamp": "2021-09-15T14:24:59+09:00",
          "tree_id": "45493f4d8d543ddfa95339d5a58b6ddeeea72a24",
          "url": "https://github.com/secretlint/secretlint/commit/2c93303d1fd60f10601af494489dc55eeb5669a8"
        },
        "date": 1631683763068,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.73,
            "range": "±2.38%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±1.54%",
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
          "id": "58b3e051ef5e739877e176b670dd49e93226cd48",
          "message": "chore(release): v4.0.0 (#199)",
          "timestamp": "2021-09-15T16:32:20+09:00",
          "tree_id": "26e2b17f00dd2ed129e38db01935ade4643302fb",
          "url": "https://github.com/secretlint/secretlint/commit/58b3e051ef5e739877e176b670dd49e93226cd48"
        },
        "date": 1631691347474,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.74,
            "range": "±2.84%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.56,
            "range": "±1.14%",
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
          "id": "e1939e08e22b6901ebf979f6968cead51371b7f9",
          "message": "docs: require Node.js 12+",
          "timestamp": "2021-09-18T11:32:01+09:00",
          "tree_id": "15d30f0685a433e563566515a97517e002cb9dd9",
          "url": "https://github.com/secretlint/secretlint/commit/e1939e08e22b6901ebf979f6968cead51371b7f9"
        },
        "date": 1631932516042,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.96,
            "range": "±4.07%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.67,
            "range": "±2.78%",
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
          "id": "66ee5b27c364a0a7d053437e6ed1d7f795e09987",
          "message": "Create FUNDING.yml",
          "timestamp": "2021-09-24T23:00:07+09:00",
          "tree_id": "166b3b2864c56307321bfdfc65da5ca7d2641609",
          "url": "https://github.com/secretlint/secretlint/commit/66ee5b27c364a0a7d053437e6ed1d7f795e09987"
        },
        "date": 1632492172448,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.27,
            "range": "±1.28%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.69,
            "range": "±3.60%",
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
          "id": "20c483970ab1e7a2c33cedff4ac79df7201bc86f",
          "message": "feat(npm): support `npm_` prefix access token (#201)",
          "timestamp": "2021-09-25T11:41:15+09:00",
          "tree_id": "e008812181c39098fd9f78265bbae2216ed4acf9",
          "url": "https://github.com/secretlint/secretlint/commit/20c483970ab1e7a2c33cedff4ac79df7201bc86f"
        },
        "date": 1632537910430,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.49,
            "range": "±1.56%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.5,
            "range": "±0.93%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "6b41e01801d9fe8d5fb25cd15250efddc36f9787",
          "message": "fix(github): token length should be 40",
          "timestamp": "2021-09-25T11:42:25+09:00",
          "tree_id": "955409047174e72d362cacc80a860a5560cd133f",
          "url": "https://github.com/secretlint/secretlint/commit/6b41e01801d9fe8d5fb25cd15250efddc36f9787"
        },
        "date": 1632537955235,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.88,
            "range": "±4.16%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±4.68%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1499dd8224123deeb6c570590db762f37e6cb033",
          "message": "chore(release): v4.1.0 (#203)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2021-09-25T11:48:29+09:00",
          "tree_id": "0c73d306df1f2f7dc27a0ee9ea13c9480da2b917",
          "url": "https://github.com/secretlint/secretlint/commit/1499dd8224123deeb6c570590db762f37e6cb033"
        },
        "date": 1632538329044,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.62,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.54,
            "range": "±1.85%",
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
          "id": "74526f4a3204a36f9c6ea2fa4bccb546e20cb8e6",
          "message": "fix(config-loader): fix to load secretlint rule on Windows (#206)\n\n* fix(config-loader): fix to load secretlint rule on Windows\r\n\r\nfix https://github.com/secretlint/secretlint/issues/205\r\n\r\n* chore: move comment",
          "timestamp": "2021-10-11T20:18:39+09:00",
          "tree_id": "70738abc9fcaa020a6f978b735633d1701858aca",
          "url": "https://github.com/secretlint/secretlint/commit/74526f4a3204a36f9c6ea2fa4bccb546e20cb8e6"
        },
        "date": 1633951335486,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.68,
            "range": "±1.27%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.53,
            "range": "±3.04%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d2dafb50817126bb53c107d027ed99ec96d17246",
          "message": "chore(release): v4.1.1 (#207)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2021-10-11T20:21:39+09:00",
          "tree_id": "e962cc82991abbe7289b3e34a2721393bf738711",
          "url": "https://github.com/secretlint/secretlint/commit/d2dafb50817126bb53c107d027ed99ec96d17246"
        },
        "date": 1633951539737,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.6,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.53,
            "range": "±0.87%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "cafbd3a75b108a47c86377045015ce5f258e9109",
          "message": "CI: remove publish-binary from publish-artifact.yml",
          "timestamp": "2021-10-13T10:06:18+09:00",
          "tree_id": "89de13cbf9da7e3fbc24290aa758b74a85775755",
          "url": "https://github.com/secretlint/secretlint/commit/cafbd3a75b108a47c86377045015ce5f258e9109"
        },
        "date": 1634087401392,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.67,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.54,
            "range": "±2.97%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "a610c311c2ff2b97e8ab4c7e8ff1fe0f9a5bae69",
          "message": "docs: update @secretlint/secretlint-rule-filter-comments",
          "timestamp": "2021-10-13T10:14:32+09:00",
          "tree_id": "cef033fc761ac67b0f63434dee053e968be6ff0e",
          "url": "https://github.com/secretlint/secretlint/commit/a610c311c2ff2b97e8ab4c7e8ff1fe0f9a5bae69"
        },
        "date": 1634087874466,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.76,
            "range": "±1.19%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.55,
            "range": "±1.26%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ddf7cf25db4663e993d144e5902aefe957ff59d8",
          "message": "chore(release): v4.1.2 (#209)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2021-10-13T10:17:01+09:00",
          "tree_id": "bd7d905dd674704c4a592be58cb0c20e5f8dae3e",
          "url": "https://github.com/secretlint/secretlint/commit/ddf7cf25db4663e993d144e5902aefe957ff59d8"
        },
        "date": 1634088069463,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.75,
            "range": "±1.50%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.55,
            "range": "±2.79%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "594ce698864729bb11936c7d86d75fcd329430c8",
          "message": "CI: add create-release-force-patch-pr.yml\n\nto fix https://github.com/secretlint/secretlint/issues/208",
          "timestamp": "2021-10-13T10:29:49+09:00",
          "tree_id": "165cbf44024a31301feaf55a395f5b4a0b510ace",
          "url": "https://github.com/secretlint/secretlint/commit/594ce698864729bb11936c7d86d75fcd329430c8"
        },
        "date": 1634088799063,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.67,
            "range": "±2.72%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.53,
            "range": "±4.96%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "3e7b7e9f8eeacd98ee0f3188d33b8d25302d8c28",
          "message": "CI: use --force-publish",
          "timestamp": "2021-10-13T10:33:11+09:00",
          "tree_id": "9e89e9b6a714220d3468b71e5ff4736cc3fef4cc",
          "url": "https://github.com/secretlint/secretlint/commit/3e7b7e9f8eeacd98ee0f3188d33b8d25302d8c28"
        },
        "date": 1634088988623,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.75,
            "range": "±3.76%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±9.12%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7b0af3675a5a18ccbc19fe923194f5849e82740f",
          "message": "chore(release): 4.1.3 (#210)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2021-10-13T10:35:27+09:00",
          "tree_id": "07bbb8ce277b26042ebfe283265738783ba846ba",
          "url": "https://github.com/secretlint/secretlint/commit/7b0af3675a5a18ccbc19fe923194f5849e82740f"
        },
        "date": 1634089200312,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.04,
            "range": "±0.67%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±1.06%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "94024734+cm-dyoshikawa@users.noreply.github.com",
            "name": "cm-dyoshikawa",
            "username": "cm-dyoshikawa"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "10eae64760324ea53394280f3db957cd6439e8d1",
          "message": "fix(secretlint-rule-gcp): update node-forge (#212)",
          "timestamp": "2022-01-13T19:38:25+09:00",
          "tree_id": "a3a0f5f34ae18adeafbce64509900e10e215d432",
          "url": "https://github.com/secretlint/secretlint/commit/10eae64760324ea53394280f3db957cd6439e8d1"
        },
        "date": 1642070503361,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.81,
            "range": "±0.74%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.56,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6ff0f43c018e4164eb05d132c2a1bdeed5fc9e48",
          "message": "chore(release): v4.1.4 (#213)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2022-01-13T19:42:51+09:00",
          "tree_id": "d71acde4262c6fcbf33c38b267c91bc19575f2bf",
          "url": "https://github.com/secretlint/secretlint/commit/6ff0f43c018e4164eb05d132c2a1bdeed5fc9e48"
        },
        "date": 1642070749208,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.06,
            "range": "±3.00%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±3.59%",
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
          "id": "7080b052f1e02feb9146bfb054aa17b7e0ed27a1",
          "message": "perf: introduce turborepo (#215)\n\n* perf: introduce turborepo\r\n\r\n* chore: add snapshots\r\n\r\n* chore: add turbo ci command\r\n\r\n* fix: ci pipeline\r\n\r\n* fix deps\r\n\r\n* fix deps\r\n\r\n* fix deps\r\n\r\n* fix deps\r\n\r\n* fix deps\r\n\r\n* fix deps\r\n\r\n* fix Dependency cycles\r\n\r\n* chore(deps): remove cross-env",
          "timestamp": "2022-01-20T00:29:23+09:00",
          "tree_id": "200b4db80305178ec83581155ae89366194ff2db",
          "url": "https://github.com/secretlint/secretlint/commit/7080b052f1e02feb9146bfb054aa17b7e0ed27a1"
        },
        "date": 1642606381033,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.75,
            "range": "±0.98%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.55,
            "range": "±2.78%",
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
          "id": "dfd0b9f6652bebd848d9731a8e7a38a9ea6d697c",
          "message": "chore(deps): update turbo (#216)",
          "timestamp": "2022-02-05T16:34:05+09:00",
          "tree_id": "0df95025b2556d99e33a14c6b3cea8c3a82d71a9",
          "url": "https://github.com/secretlint/secretlint/commit/dfd0b9f6652bebd848d9731a8e7a38a9ea6d697c"
        },
        "date": 1644046665390,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.77,
            "range": "±2.17%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±2.06%",
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
          "id": "c8b55ad93780e4468297720786984c3d3571a0bc",
          "message": "Update README.md",
          "timestamp": "2022-03-02T16:45:04+09:00",
          "tree_id": "7b2d237f453bdf577ba5b4c884746dc8ec5b6eed",
          "url": "https://github.com/secretlint/secretlint/commit/c8b55ad93780e4468297720786984c3d3571a0bc"
        },
        "date": 1646207348594,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.66,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.54,
            "range": "±2.02%",
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
          "id": "a4b2e03bc4fddd733801c7fdccc6a0c4fd8ee758",
          "message": "Update README.md",
          "timestamp": "2022-03-02T16:45:17+09:00",
          "tree_id": "aa9c1e8a0f98814373a38399be9ccac5d22b8fa9",
          "url": "https://github.com/secretlint/secretlint/commit/a4b2e03bc4fddd733801c7fdccc6a0c4fd8ee758"
        },
        "date": 1646207416860,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.23,
            "range": "±1.39%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.7,
            "range": "±3.31%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "838c70250f61a787fb169ae55cefc48dce3b8baf",
          "message": "CI(benchmark): update node version",
          "timestamp": "2022-03-02T18:23:35+09:00",
          "tree_id": "d1681a837ad6db904f68bc5c449184db29cd35d9",
          "url": "https://github.com/secretlint/secretlint/commit/838c70250f61a787fb169ae55cefc48dce3b8baf"
        },
        "date": 1646213263447,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.55,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.52,
            "range": "±1.31%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7879c01d93ae5932822c2864e9bb51e7a6627f0f",
          "message": "chore(release): v4.2.0 (#220)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2022-03-02T18:29:31+09:00",
          "tree_id": "b39052a33d2b6b34b37e1db1619e144bd7696718",
          "url": "https://github.com/secretlint/secretlint/commit/7879c01d93ae5932822c2864e9bb51e7a6627f0f"
        },
        "date": 1646213625531,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.49,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.51,
            "range": "±1.12%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "cf874e4a18c598af02b78a439c026a5099750844",
          "message": "fix(sarif): fix main file path",
          "timestamp": "2022-03-02T18:39:47+09:00",
          "tree_id": "70cdca8cf8fe80eee0b3b9deba9bc80bdd6331c5",
          "url": "https://github.com/secretlint/secretlint/commit/cf874e4a18c598af02b78a439c026a5099750844"
        },
        "date": 1646214237639,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.56,
            "range": "±1.48%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.54,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4a82dab233c18981376630977ed91d8e0c3c0ba9",
          "message": "chore(release): v4.2.1 (#221)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2022-03-02T18:41:48+09:00",
          "tree_id": "ec47eb8ccfa06d34a5d7227b5e89fa4542c76b57",
          "url": "https://github.com/secretlint/secretlint/commit/4a82dab233c18981376630977ed91d8e0c3c0ba9"
        },
        "date": 1646214352367,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.61,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.53,
            "range": "±1.52%",
            "unit": "ops/sec",
            "extra": "6 samples"
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
          "id": "97d47d114a5084ab040ec0770b21db0904d6f7d0",
          "message": "chore: fix validator",
          "timestamp": "2022-03-05T21:52:21+09:00",
          "tree_id": "0df8b0c79e9902d93eaa2790dd23df7e81c5ce90",
          "url": "https://github.com/secretlint/secretlint/commit/97d47d114a5084ab040ec0770b21db0904d6f7d0"
        },
        "date": 1646484989598,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.59,
            "range": "±3.95%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.55,
            "range": "±3.11%",
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
          "id": "288230aa9284520b6b67d7c8853ae98fe151f8cc",
          "message": "fix(docker): update Node.js 16",
          "timestamp": "2022-03-06T00:01:08+09:00",
          "tree_id": "18140ae01d2ff76a8c51f5fcbbba048b58cf4a10",
          "url": "https://github.com/secretlint/secretlint/commit/288230aa9284520b6b67d7c8853ae98fe151f8cc"
        },
        "date": 1646492697962,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.58,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.53,
            "range": "±1.53%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "bot@renovateapp.com",
            "name": "Renovate Bot",
            "username": "renovate-bot"
          },
          "committer": {
            "email": "bot@renovateapp.com",
            "name": "Renovate Bot",
            "username": "renovate-bot"
          },
          "distinct": false,
          "id": "5957e002bda921da178b0287151040d3b2635de1",
          "message": "chore(deps): update patch updates",
          "timestamp": "2022-03-05T15:02:31Z",
          "tree_id": "417dd774375d35daa60477029388e4e63a896606",
          "url": "https://github.com/secretlint/secretlint/commit/5957e002bda921da178b0287151040d3b2635de1"
        },
        "date": 1646497001192,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.57,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.54,
            "range": "±1.95%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "bot@renovateapp.com",
            "name": "Renovate Bot",
            "username": "renovate-bot"
          },
          "committer": {
            "email": "bot@renovateapp.com",
            "name": "Renovate Bot",
            "username": "renovate-bot"
          },
          "distinct": false,
          "id": "6e18caddcb62c644997024133ef24de103eec762",
          "message": "chore(deps): update dependency mocha to ^7.2.0",
          "timestamp": "2022-03-05T16:13:30Z",
          "tree_id": "6bc3ca49026147007ff0307d753dcebd58905585",
          "url": "https://github.com/secretlint/secretlint/commit/6e18caddcb62c644997024133ef24de103eec762"
        },
        "date": 1646506072734,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.55,
            "range": "±1.89%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.54,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "bot@renovateapp.com",
            "name": "Renovate Bot",
            "username": "renovate-bot"
          },
          "committer": {
            "email": "bot@renovateapp.com",
            "name": "Renovate Bot",
            "username": "renovate-bot"
          },
          "distinct": false,
          "id": "2c0bd2ca44be2b7f69cebe842b70a867ab1bb0e8",
          "message": "chore(deps): update dependency ts-node to ^8.10.2",
          "timestamp": "2022-03-05T18:44:48Z",
          "tree_id": "b2649aea16fda73c27662fe676dfd277ba94df85",
          "url": "https://github.com/secretlint/secretlint/commit/2c0bd2ca44be2b7f69cebe842b70a867ab1bb0e8"
        },
        "date": 1646511626385,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.56,
            "range": "±1.95%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.52,
            "range": "±1.92%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "hpujhari7@gmail.com",
            "name": "Hritik R",
            "username": "HritikR"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1276228114d667955731a1738d435b02aa975d8f",
          "message": "fix: refactor while loop + RegExp.exec → matchAll (#238)\n\nfix #236",
          "timestamp": "2022-03-06T13:31:26+09:00",
          "tree_id": "23ab774819495b1f25937efbfde99ccc840150e7",
          "url": "https://github.com/secretlint/secretlint/commit/1276228114d667955731a1738d435b02aa975d8f"
        },
        "date": 1646541319395,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.59,
            "range": "±0.79%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.53,
            "range": "±1.23%",
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
          "id": "d60316539b315e9d5d99f4a92146b0385333cb50",
          "message": "feat(slack): detect xapp- token (#239)",
          "timestamp": "2022-03-08T22:44:41+09:00",
          "tree_id": "ed20794663d9612ffb7e586e83192a7e34474769",
          "url": "https://github.com/secretlint/secretlint/commit/d60316539b315e9d5d99f4a92146b0385333cb50"
        },
        "date": 1646747343543,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.44,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.52,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "28c22da1267274b454a25eaf21de740860b35053",
          "message": "chore(release): v5.1.0 (#240)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2022-03-08T22:48:49+09:00",
          "tree_id": "2599742d6347f2dcd01382d02c29181ae5e0b15c",
          "url": "https://github.com/secretlint/secretlint/commit/28c22da1267274b454a25eaf21de740860b35053"
        },
        "date": 1646747583811,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.46,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.51,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "bot@renovateapp.com",
            "name": "Renovate Bot",
            "username": "renovate-bot"
          },
          "committer": {
            "email": "bot@renovateapp.com",
            "name": "Renovate Bot",
            "username": "renovate-bot"
          },
          "distinct": false,
          "id": "7310ad83391a4b739767d41ac9a763ba111e0cf9",
          "message": "chore(deps): update dependency ts-node to ^10.7.0",
          "timestamp": "2022-03-13T04:39:03Z",
          "tree_id": "56915295d5f2df8d87ad02889744109bb1186154",
          "url": "https://github.com/secretlint/secretlint/commit/7310ad83391a4b739767d41ac9a763ba111e0cf9"
        },
        "date": 1647164452745,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.89,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.62,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fb5b0aa7af925c5fef11d85882af9ee428c9ef58",
          "message": "chore(deps): bump node-forge from 1.2.1 to 1.3.0 (#243)\n\nBumps [node-forge](https://github.com/digitalbazaar/forge) from 1.2.1 to 1.3.0.\r\n- [Release notes](https://github.com/digitalbazaar/forge/releases)\r\n- [Changelog](https://github.com/digitalbazaar/forge/blob/main/CHANGELOG.md)\r\n- [Commits](https://github.com/digitalbazaar/forge/compare/v1.2.1...v1.3.0)\r\n\r\n---\r\nupdated-dependencies:\r\n- dependency-name: node-forge\r\n  dependency-type: direct:production\r\n...\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2022-03-24T09:04:25+09:00",
          "tree_id": "9ec41960e8b44b7e724d936ab696445fe7a8cacd",
          "url": "https://github.com/secretlint/secretlint/commit/fb5b0aa7af925c5fef11d85882af9ee428c9ef58"
        },
        "date": 1648080497421,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.57,
            "range": "±1.18%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.52,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5f31f6d4593c3f0af8a20ef5c557ecee3df0e267",
          "message": "chore(deps): update peter-evans/create-pull-request action to v4 (#242)\n\nCo-authored-by: Renovate Bot <bot@renovateapp.com>",
          "timestamp": "2022-03-24T09:06:17+09:00",
          "tree_id": "025586e48a0e2fe2d664763990f6c695ffc4231a",
          "url": "https://github.com/secretlint/secretlint/commit/5f31f6d4593c3f0af8a20ef5c557ecee3df0e267"
        },
        "date": 1648080610526,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.55,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.52,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5a7d75b492d0a720a5ab2fb94274fac67eb7a046",
          "message": "chore(deps): update peter-evans/repository-dispatch action to v2 (#241)\n\nCo-authored-by: Renovate Bot <bot@renovateapp.com>",
          "timestamp": "2022-03-24T09:06:48+09:00",
          "tree_id": "dfb0df0721e680139ed2672d1151219f2d03df17",
          "url": "https://github.com/secretlint/secretlint/commit/5a7d75b492d0a720a5ab2fb94274fac67eb7a046"
        },
        "date": 1648080660482,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.72,
            "range": "±2.58%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±2.03%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6bd47a6d9f84850bc53d5f5b45341755b9b063d7",
          "message": "chore(release): v5.1.1 (#244)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2022-03-24T09:07:35+09:00",
          "tree_id": "3485a5d82c548e72d27b4721f47bf239faca16a1",
          "url": "https://github.com/secretlint/secretlint/commit/6bd47a6d9f84850bc53d5f5b45341755b9b063d7"
        },
        "date": 1648080833181,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.57,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.55,
            "range": "±2.35%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "493a622ef5b771fce87b7274af90f8d4117a478e",
          "message": "chore(deps): bump minimist from 1.2.5 to 1.2.6 (#245)\n\nBumps [minimist](https://github.com/substack/minimist) from 1.2.5 to 1.2.6.\r\n- [Release notes](https://github.com/substack/minimist/releases)\r\n- [Commits](https://github.com/substack/minimist/compare/1.2.5...1.2.6)\r\n\r\n---\r\nupdated-dependencies:\r\n- dependency-name: minimist\r\n  dependency-type: indirect\r\n...\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2022-03-24T21:54:53+09:00",
          "tree_id": "0d820b2e1e55a4faef981c99d25af1a43d908ed9",
          "url": "https://github.com/secretlint/secretlint/commit/493a622ef5b771fce87b7274af90f8d4117a478e"
        },
        "date": 1648126687197,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.95,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±0.63%",
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
          "id": "191c210f58c68d657bc6096c5b2fa00836d1a70d",
          "message": "doc: Update README.md (#246)\n\n* Update README.md\r\n\r\n* Update README.md",
          "timestamp": "2022-03-24T22:01:52+09:00",
          "tree_id": "d7d6fa303f6a9ee9fcf11118c64f9a04e36e83d7",
          "url": "https://github.com/secretlint/secretlint/commit/191c210f58c68d657bc6096c5b2fa00836d1a70d"
        },
        "date": 1648127109834,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.93,
            "range": "±0.72%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.73,
            "range": "±0.84%",
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
          "id": "a14c416c51207cf5b09cd6ea7421c903a9afd9da",
          "message": "CI: use GitHub Apps instead of PAT (#249)",
          "timestamp": "2022-03-26T13:25:35+09:00",
          "tree_id": "b86c9130edbb06ce890980896032a4d5b94a24fd",
          "url": "https://github.com/secretlint/secretlint/commit/a14c416c51207cf5b09cd6ea7421c903a9afd9da"
        },
        "date": 1648268962779,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.69,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "bot@renovateapp.com",
            "name": "Renovate Bot",
            "username": "renovate-bot"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "a11c9e0e408d4cc2a98673e7206dc285dcc33f67",
          "message": "fix(deps): update minor updates",
          "timestamp": "2022-03-30T03:10:26Z",
          "tree_id": "f2fc362c9afb45a8b6289f16a9beda39adf63dcd",
          "url": "https://github.com/secretlint/secretlint/commit/a11c9e0e408d4cc2a98673e7206dc285dcc33f67"
        },
        "date": 1648610042799,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.83,
            "range": "±1.09%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±1.04%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "korosuke613@users.noreply.github.com",
            "name": "Futa HIRAKOBA",
            "username": "korosuke613"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fcdab11abdd4204c985f02c789459209b428c048",
          "message": "feat(docker): support arm64 for image (#253)",
          "timestamp": "2022-04-04T23:44:13+09:00",
          "tree_id": "236f194283234551a807d584a8afb102651b006b",
          "url": "https://github.com/secretlint/secretlint/commit/fcdab11abdd4204c985f02c789459209b428c048"
        },
        "date": 1649083682782,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.73,
            "range": "±1.25%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "88afce7a8fb14a85c8223260a465799ef1dd889c",
          "message": "chore(release): 5.1.2 (#255)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2022-04-04T23:48:37+09:00",
          "tree_id": "1ee6381d70af993c0eadf63fb1b272eec50ed038",
          "url": "https://github.com/secretlint/secretlint/commit/88afce7a8fb14a85c8223260a465799ef1dd889c"
        },
        "date": 1649083971572,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.51,
            "range": "±0.88%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.52,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6aaef752db394bd8b03af51635068a2582dd0fb4",
          "message": "chore(release): 5.1.3 (#256)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2022-04-05T00:05:23+09:00",
          "tree_id": "2e0e0811a29671fa511669d9b91210a3e2064ccb",
          "url": "https://github.com/secretlint/secretlint/commit/6aaef752db394bd8b03af51635068a2582dd0fb4"
        },
        "date": 1649084961237,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.53,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.51,
            "range": "±1.44%",
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
          "id": "423686f5873ae6820dde7519c1fa9fdc8a48c9cf",
          "message": "CI(publish): do not run PR is closed without merge (#258)",
          "timestamp": "2022-04-05T00:22:58+09:00",
          "tree_id": "840872e1b8a914f33040d25985b02b741e9426d3",
          "url": "https://github.com/secretlint/secretlint/commit/423686f5873ae6820dde7519c1fa9fdc8a48c9cf"
        },
        "date": 1649086027757,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.48,
            "range": "±1.14%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.51,
            "range": "±2.15%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "bot@renovateapp.com",
            "name": "Renovate Bot",
            "username": "renovate-bot"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "ce263ba24aaa2664687b2ba9b73ef7214ef298f1",
          "message": "chore(deps): update patch updates",
          "timestamp": "2022-04-06T04:39:29Z",
          "tree_id": "dabdf1fc5c5df2e86ded9607364064a77e5c0a11",
          "url": "https://github.com/secretlint/secretlint/commit/ce263ba24aaa2664687b2ba9b73ef7214ef298f1"
        },
        "date": 1649220205443,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.71,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.49,
            "range": "±2.40%",
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
          "id": "35fc82e55c819b3078051d08dc8d1e4c7813d5ce",
          "message": "fix(monorepo): use lerna-lite instead of lerna (#250)\n\n* fix(monorepo): use lerna-lite instead of lerna\r\n\r\n* fix: ignore engines version for lerna-lite\r\n\r\n* CI: update lerna-lite and turbo\r\n\r\n* up",
          "timestamp": "2022-04-11T20:09:30+09:00",
          "tree_id": "776fc0572b4d48373efb25200148b564cd3a8e4b",
          "url": "https://github.com/secretlint/secretlint/commit/35fc82e55c819b3078051d08dc8d1e4c7813d5ce"
        },
        "date": 1649675599900,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.63,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.52,
            "range": "±0.73%",
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
          "id": "3a9e1fed393fd8646c8f3a8134859454d47edfdb",
          "message": "Merge pull request #261 from secretlint/feature/247\n\nfeat: implement rule for Shopify API keys",
          "timestamp": "2022-04-11T21:00:37+09:00",
          "tree_id": "f9e97139d5bf46a4a0b6e51f3c73fa8e6f384ddc",
          "url": "https://github.com/secretlint/secretlint/commit/3a9e1fed393fd8646c8f3a8134859454d47edfdb"
        },
        "date": 1649678689915,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.53,
            "range": "±2.27%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.51,
            "range": "±1.68%",
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
          "id": "334bdc88e68449009ea32399cec2a14f0a2a537b",
          "message": "Merge pull request #262 from secretlint/release/5.2.0-1649678518\n\nv5.2.0",
          "timestamp": "2022-04-11T21:05:05+09:00",
          "tree_id": "164390c753e6adb0ad1b9da80f766739494fbf12",
          "url": "https://github.com/secretlint/secretlint/commit/334bdc88e68449009ea32399cec2a14f0a2a537b"
        },
        "date": 1649678970121,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.42,
            "range": "±2.97%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.48,
            "range": "±4.02%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "bot@renovateapp.com",
            "name": "Renovate Bot",
            "username": "renovate-bot"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "0913164dbc3178dc7ec8230a2bcae6f2434eacfc",
          "message": "fix(deps): update minor updates",
          "timestamp": "2022-04-11T14:44:32Z",
          "tree_id": "5c5ba117e30fc78f1eff786203cf9a798babfb85",
          "url": "https://github.com/secretlint/secretlint/commit/0913164dbc3178dc7ec8230a2bcae6f2434eacfc"
        },
        "date": 1649688529638,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.58,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.51,
            "range": "±4.99%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "bot@renovateapp.com",
            "name": "Renovate Bot",
            "username": "renovate-bot"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "0d28402f989c633a795ddbb1cd688167f37b3285",
          "message": "chore(deps): update dependency ts-node to ^10.8.0",
          "timestamp": "2022-05-28T22:14:33Z",
          "tree_id": "3a5652c98b221b12007c8a4d3e0ead7a77d3f00b",
          "url": "https://github.com/secretlint/secretlint/commit/0d28402f989c633a795ddbb1cd688167f37b3285"
        },
        "date": 1653776288461,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.83,
            "range": "±0.32%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±0.74%",
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
          "id": "244f3e6ed4253b7072448d7b2e95cbd3ba1c4f42",
          "message": "Merge pull request #266 from secretlint/renovate/docker-setup-buildx-action-2.x\n\nchore(deps): update docker/setup-buildx-action action to v2",
          "timestamp": "2022-06-02T07:33:02+09:00",
          "tree_id": "ee05ad849885f2e3b092c1159bc53aa9a4fcd0af",
          "url": "https://github.com/secretlint/secretlint/commit/244f3e6ed4253b7072448d7b2e95cbd3ba1c4f42"
        },
        "date": 1654122980865,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.89,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±4.34%",
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
          "id": "b0c3c0b7f62d51d747eb172310f3688450a5963b",
          "message": "Merge pull request #267 from secretlint/renovate/docker-setup-qemu-action-2.x\n\nchore(deps): update docker/setup-qemu-action action to v2",
          "timestamp": "2022-06-02T07:33:19+09:00",
          "tree_id": "cec3e367dab38a6f630b9f0fdce45d121efde990",
          "url": "https://github.com/secretlint/secretlint/commit/b0c3c0b7f62d51d747eb172310f3688450a5963b"
        },
        "date": 1654123001615,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.83,
            "range": "±0.59%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±0.67%",
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
          "id": "e0b785bba2ceac7e5d1b088c74cd8a55bdd12ba5",
          "message": "Merge pull request #265 from secretlint/renovate/github-codeql-action-2.x\n\nchore(deps): update github/codeql-action action to v2",
          "timestamp": "2022-06-02T07:32:13+09:00",
          "tree_id": "c25136d91928dc3505ea9b751b1362bff46559df",
          "url": "https://github.com/secretlint/secretlint/commit/e0b785bba2ceac7e5d1b088c74cd8a55bdd12ba5"
        },
        "date": 1654123017944,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.37,
            "range": "±2.86%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.46,
            "range": "±3.21%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "bot@renovateapp.com",
            "name": "Renovate Bot",
            "username": "renovate-bot"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "b16d7fea2ecae869f7bddf9814525fb05600c143",
          "message": "chore(deps): update dependency ts-node to ^10.8.1",
          "timestamp": "2022-06-10T23:13:30Z",
          "tree_id": "0b50ee4f5fa2835cebd033cb7d87152065ffb9ef",
          "url": "https://github.com/secretlint/secretlint/commit/b16d7fea2ecae869f7bddf9814525fb05600c143"
        },
        "date": 1654903061905,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.49,
            "range": "±2.95%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.51,
            "range": "±1.60%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "8cfc1314032002519877ae19e0750a4096849826",
          "message": "chore(deps): update patch updates",
          "timestamp": "2022-06-22T18:59:13Z",
          "tree_id": "16f56f2174191ccbaf6cc09fdc3435da456ae3b5",
          "url": "https://github.com/secretlint/secretlint/commit/8cfc1314032002519877ae19e0750a4096849826"
        },
        "date": 1655924565301,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.84,
            "range": "±0.42%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.56,
            "range": "±2.27%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "98940253baaf1008577ffb125a59fd902abfdc6c",
          "message": "chore(deps): update minor updates",
          "timestamp": "2022-06-22T22:05:16Z",
          "tree_id": "7ab91ac4a2b321a2641a44c1791cf3c98a0d41ce",
          "url": "https://github.com/secretlint/secretlint/commit/98940253baaf1008577ffb125a59fd902abfdc6c"
        },
        "date": 1655935734217,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.77,
            "range": "±0.32%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.55,
            "range": "±0.73%",
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
          "id": "53c318cc68e5396408653642c60c1546df9b8b53",
          "message": "Merge pull request #272 from secretlint/azu-patch-1\n\nchore(config-loader): fix typo",
          "timestamp": "2022-06-26T16:05:47+09:00",
          "tree_id": "1f1af58b6c2d74425af389161e1e3415d823cc1a",
          "url": "https://github.com/secretlint/secretlint/commit/53c318cc68e5396408653642c60c1546df9b8b53"
        },
        "date": 1656227401440,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.5,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.49,
            "range": "±2.12%",
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
          "id": "769977776eaa5bd8b663106195f88d7e3070d1d6",
          "message": "fix(config-loader): use native import() (#275)\n\n* fix(config-loader): use native import()\r\n\r\n* fix: make range to readonly [number, number] type\r\n\r\n* test: update snapshot\r\n\r\n* fix: types\r\n\r\n* fix: types",
          "timestamp": "2022-06-26T17:01:07+09:00",
          "tree_id": "3cd8da9e3022cfc7bb98e5d5ec01abb8f9e70483",
          "url": "https://github.com/secretlint/secretlint/commit/769977776eaa5bd8b663106195f88d7e3070d1d6"
        },
        "date": 1656230671921,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.86,
            "range": "±0.50%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4e578c531a3989e9575b49bfa1b47d8a4cb7748e",
          "message": "chore(release): v5.2.1 (#276)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2022-06-26T17:02:38+09:00",
          "tree_id": "d3dc6c012511d7f7fd7a491e8c33786159ab8adf",
          "url": "https://github.com/secretlint/secretlint/commit/4e578c531a3989e9575b49bfa1b47d8a4cb7748e"
        },
        "date": 1656230770916,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.82,
            "range": "±0.56%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "032b3112823593ca3ce66bd40d6991b9eae74418",
          "message": "chore(deps): update dependency rollup to ^2.75.7",
          "timestamp": "2022-06-27T15:25:16Z",
          "tree_id": "d124460e5c91fd15fb3112cf48d9170cdf2d3880",
          "url": "https://github.com/secretlint/secretlint/commit/032b3112823593ca3ce66bd40d6991b9eae74418"
        },
        "date": 1656343731438,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.84,
            "range": "±1.10%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.64,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "koichi.h+github@gmail.com",
            "name": "HAL",
            "username": "k-hal"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f5ae4224b6ddc8f28923877f70cb20ce0c52efd4",
          "message": "feat(docker): install sarif formatter to docker image (#279)",
          "timestamp": "2022-06-28T16:03:48+09:00",
          "tree_id": "bc8086b3cbc20a3175a0f4e49d5fb53986811e3a",
          "url": "https://github.com/secretlint/secretlint/commit/f5ae4224b6ddc8f28923877f70cb20ce0c52efd4"
        },
        "date": 1656400037003,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.97,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±4.92%",
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
          "id": "cdd668e72d6ad0530ba5636cb4ba917109d098a6",
          "message": "chore(deps): udpate devDeps (#280)",
          "timestamp": "2022-06-28T16:11:53+09:00",
          "tree_id": "42cc1227f9dc36341fb80e7b9f5a049869fe530d",
          "url": "https://github.com/secretlint/secretlint/commit/cdd668e72d6ad0530ba5636cb4ba917109d098a6"
        },
        "date": 1656400554870,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.59,
            "range": "±1.20%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.49,
            "range": "±0.54%",
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
          "id": "6103ff9a0e5f3ef09807ef0eb04d4360858ace97",
          "message": "fix(docker): use latest formatter version (#282)",
          "timestamp": "2022-06-28T16:16:53+09:00",
          "tree_id": "43c258e2b7f053522f94d570cd7f521f05bfa542",
          "url": "https://github.com/secretlint/secretlint/commit/6103ff9a0e5f3ef09807ef0eb04d4360858ace97"
        },
        "date": 1656401077011,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.46,
            "range": "±4.37%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.47,
            "range": "±2.26%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8893638c2554667a880717bf30df6640fd839dda",
          "message": "chore(release): v5.2.2 (#283)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2022-06-28T16:28:49+09:00",
          "tree_id": "d45025a00c8481b8bdfe5f1a5460cab4f901d433",
          "url": "https://github.com/secretlint/secretlint/commit/8893638c2554667a880717bf30df6640fd839dda"
        },
        "date": 1656401535842,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.88,
            "range": "±0.63%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±1.85%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "kyontan@monora.me",
            "name": "kyontan",
            "username": "kyontan"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2a81100e036107eff3ff59aab77284b872fa050b",
          "message": "Fix issue template: how to check the secretlint's version (#284)",
          "timestamp": "2022-06-28T18:54:43+09:00",
          "tree_id": "a15be4060557cebb417b6bbc066ec97852bc715b",
          "url": "https://github.com/secretlint/secretlint/commit/2a81100e036107eff3ff59aab77284b872fa050b"
        },
        "date": 1656410281070,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.92,
            "range": "±0.35%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.68,
            "range": "±0.94%",
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
          "id": "3ea1be3b850b4423ed826d9c4ff396cd327d825b",
          "message": "Update publish.yml (#286)",
          "timestamp": "2022-06-28T20:23:10+09:00",
          "tree_id": "4e32162164b7ac153f89b9ccd6497bcb5be1cd3f",
          "url": "https://github.com/secretlint/secretlint/commit/3ea1be3b850b4423ed826d9c4ff396cd327d825b"
        },
        "date": 1656415664133,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.56,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.51,
            "range": "±1.94%",
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
          "id": "2e1aac26624300bb33af81515e0632fa88da67ca",
          "message": "Merge pull request #287 from secretlint/feature/285\n\n fix: fix secretlint ignore resolve logic",
          "timestamp": "2022-06-28T22:39:07+09:00",
          "tree_id": "4dfbd0826fcb255968c573b261094e5d168f35fd",
          "url": "https://github.com/secretlint/secretlint/commit/2e1aac26624300bb33af81515e0632fa88da67ca"
        },
        "date": 1656423777258,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.8,
            "range": "±0.94%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±0.92%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d3d86dfb4fab74b355098bdd8cef834001ab9433",
          "message": "chore(release): v5.2.3 (#288)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2022-06-28T22:41:35+09:00",
          "tree_id": "37fa5c9cdc4a0dff086057410a4f72ec7ea48379",
          "url": "https://github.com/secretlint/secretlint/commit/d3d86dfb4fab74b355098bdd8cef834001ab9433"
        },
        "date": 1656423903303,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.92,
            "range": "±0.54%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.65,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8434419658c2e068aa6cc681e4faef1b5a01d563",
          "message": "chore(deps): bump parse-url from 6.0.0 to 6.0.2 (#289)\n\nBumps [parse-url](https://github.com/IonicaBizau/parse-url) from 6.0.0 to 6.0.2.\r\n- [Release notes](https://github.com/IonicaBizau/parse-url/releases)\r\n- [Commits](https://github.com/IonicaBizau/parse-url/commits)\r\n\r\n---\r\nupdated-dependencies:\r\n- dependency-name: parse-url\r\n  dependency-type: indirect\r\n...\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2022-07-06T09:14:49+09:00",
          "tree_id": "d61829bccbc30df638c22ec8562fea6b78241d17",
          "url": "https://github.com/secretlint/secretlint/commit/8434419658c2e068aa6cc681e4faef1b5a01d563"
        },
        "date": 1657066752872,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.42,
            "range": "±3.74%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.47,
            "range": "±5.83%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "5d3d8c449952ef34cef87833e3b147a5f53b2b6f",
          "message": "chore(deps): update minor updates",
          "timestamp": "2022-07-08T02:58:46Z",
          "tree_id": "8cc458dc93d185812ab30e6dce6f0057baa80fee",
          "url": "https://github.com/secretlint/secretlint/commit/5d3d8c449952ef34cef87833e3b147a5f53b2b6f"
        },
        "date": 1657249410502,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.52,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.48,
            "range": "±1.83%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "3ae6dfb61f4ba4698633b1ea032a36a102ab0fd6",
          "message": "chore(deps): update dependency ts-node to ^10.8.2",
          "timestamp": "2022-07-09T20:47:44Z",
          "tree_id": "ef9bef5890e5d71e607f44f30da1b58f4925fd82",
          "url": "https://github.com/secretlint/secretlint/commit/3ae6dfb61f4ba4698633b1ea032a36a102ab0fd6"
        },
        "date": 1657399874691,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.86,
            "range": "±0.71%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±0.65%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "a1250c58ac606b719ae715fcf35387e0b92f78c5",
          "message": "chore(deps): update dependency @types/node-forge to ^1.0.4",
          "timestamp": "2022-07-20T04:39:50Z",
          "tree_id": "1e36f7e4d4c4fef13172ec4e5bf9b33400dfeec0",
          "url": "https://github.com/secretlint/secretlint/commit/a1250c58ac606b719ae715fcf35387e0b92f78c5"
        },
        "date": 1658292256607,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.47,
            "range": "±4.34%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.5,
            "range": "±2.21%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "94411e68f26073ca2dbecad68f40f8230d549f08",
          "message": "chore(deps): update dependency ts-node to ^10.9.1",
          "timestamp": "2022-07-21T12:06:10Z",
          "tree_id": "165bc2e184bb3ca54d21e5b0b99b5b83cad916d2",
          "url": "https://github.com/secretlint/secretlint/commit/94411e68f26073ca2dbecad68f40f8230d549f08"
        },
        "date": 1658405386430,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.85,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±2.18%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "3e957789c1ae859c7400c335f61ff9ca335739ac",
          "message": "chore(deps): update patch updates",
          "timestamp": "2022-08-04T10:25:23Z",
          "tree_id": "4d51c4f83bffd1ba3951f072f7a421fecfe48d9b",
          "url": "https://github.com/secretlint/secretlint/commit/3e957789c1ae859c7400c335f61ff9ca335739ac"
        },
        "date": 1659608925553,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.95,
            "range": "±0.57%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±0.44%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "222c89f7f117ced05dd8df882371fbee6cfd3ae1",
          "message": "chore(deps): update patch updates",
          "timestamp": "2022-08-17T00:56:09Z",
          "tree_id": "13b06d4c14e14cce9100f15c23e3ec52fc9388e7",
          "url": "https://github.com/secretlint/secretlint/commit/222c89f7f117ced05dd8df882371fbee6cfd3ae1"
        },
        "date": 1660698048460,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.41,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.48,
            "range": "±1.15%",
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
          "id": "a0a2f5142854c2659a897de46aec2e61865423c2",
          "message": "fix(npm): allow `_authToken=${NPM_TOKEN}` (#303)\n\n* fix(npm): allow `_authToken=${NPM_TOKEN}`\r\n\r\n* docs: add link\r\n\r\n* docs: add link",
          "timestamp": "2022-08-24T21:24:09+09:00",
          "tree_id": "f0e0855a8d207221b38c7b97eabc7886a99461bb",
          "url": "https://github.com/secretlint/secretlint/commit/a0a2f5142854c2659a897de46aec2e61865423c2"
        },
        "date": 1661344059124,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.88,
            "range": "±0.79%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±0.99%",
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
          "id": "7834bf1a819fdb9f3d723c216ebfde0fe087aa29",
          "message": "CI: add release.yml (#305)",
          "timestamp": "2022-08-24T21:26:27+09:00",
          "tree_id": "763a66685f6c62f673be4e3a0397ec1a1a3c583e",
          "url": "https://github.com/secretlint/secretlint/commit/7834bf1a819fdb9f3d723c216ebfde0fe087aa29"
        },
        "date": 1661344344157,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.48,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.48,
            "range": "±4.07%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5b67058d70acd3f10ccf5686222caa2bf4961517",
          "message": "chore(release): v5.2.4 (#304)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2022-08-24T21:27:00+09:00",
          "tree_id": "23270946a0e0aff393371f6c4849a5df848c707f",
          "url": "https://github.com/secretlint/secretlint/commit/5b67058d70acd3f10ccf5686222caa2bf4961517"
        },
        "date": 1661344556179,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.35,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.45,
            "range": "±2.62%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "38461277+gkzz@users.noreply.github.com",
            "name": "Gakuji Tamaki",
            "username": "gkzz"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0c5db4066a61375b7954b716f952aedd16357b1b",
          "message": "test(runConfigCreator): add tests for secretlint --init (#306)\n\nAdd tests as bellow:\r\n- Check to create `.secretlintrc.json` when `runConfigCreator` is called\r\n- Check whether `createConfig` works well\r\n\r\nclose #33",
          "timestamp": "2022-09-10T18:07:09+09:00",
          "tree_id": "9b63f5baa4c0c68dcc49b3e2d2f924fba8bfa11a",
          "url": "https://github.com/secretlint/secretlint/commit/0c5db4066a61375b7954b716f952aedd16357b1b"
        },
        "date": 1662801022724,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.96,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.68,
            "range": "±1.68%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "b7c35ffd68e0b54f13e157815c6439f92510ec29",
          "message": "chore(deps): update minor updates",
          "timestamp": "2022-09-13T01:41:06Z",
          "tree_id": "50009e3511077c8aef3154d35c12a2d5166ba1a9",
          "url": "https://github.com/secretlint/secretlint/commit/b7c35ffd68e0b54f13e157815c6439f92510ec29"
        },
        "date": 1663033482267,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.85,
            "range": "±0.86%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±5.04%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "eba85923f7413e3487ef70a7729e003ff07911a6",
          "message": "fix(deps): update patch updates",
          "timestamp": "2022-09-15T05:15:01Z",
          "tree_id": "98a3ada49129fc5bea671cc27902a7945f2111d1",
          "url": "https://github.com/secretlint/secretlint/commit/eba85923f7413e3487ef70a7729e003ff07911a6"
        },
        "date": 1663219157737,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.57,
            "range": "±2.24%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.49,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "690e32a576df96c9ce201cf1a361ddc9613247ec",
          "message": "chore(deps): update patch updates",
          "timestamp": "2022-09-29T10:19:46Z",
          "tree_id": "6e1c382ec7e19c8bd7fb06d1742294a5d6ab264c",
          "url": "https://github.com/secretlint/secretlint/commit/690e32a576df96c9ce201cf1a361ddc9613247ec"
        },
        "date": 1664446985837,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.91,
            "range": "±2.90%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "9103b964abc1735c960ea3ffdc62d41a18aec155",
          "message": "chore(deps): update dependency tsd to ^0.24.1",
          "timestamp": "2022-09-29T13:48:15Z",
          "tree_id": "53f83a083b98a5bf83ee6046e0506ac532945097",
          "url": "https://github.com/secretlint/secretlint/commit/9103b964abc1735c960ea3ffdc62d41a18aec155"
        },
        "date": 1664459547125,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.56,
            "range": "±1.38%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.5,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "68afc752661693d1115c087fd3ea4734564f5d53",
          "message": "chore(deps): update patch updates",
          "timestamp": "2022-10-07T02:38:09Z",
          "tree_id": "b7537626c0f060390baa11cfbbd4f375b9162cf4",
          "url": "https://github.com/secretlint/secretlint/commit/68afc752661693d1115c087fd3ea4734564f5d53"
        },
        "date": 1665110497972,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.91,
            "range": "±0.48%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "c30daaedb1c527614b5587b9b13e938f3b4fb231",
          "message": "chore(deps): update dependency turbo to ^1.5.6",
          "timestamp": "2022-10-18T01:18:46Z",
          "tree_id": "23a046639dfee554d696445e4ad5cb41b994490d",
          "url": "https://github.com/secretlint/secretlint/commit/c30daaedb1c527614b5587b9b13e938f3b4fb231"
        },
        "date": 1666056184332,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.89,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±0.95%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "thinca@gmail.com",
            "name": "thinca",
            "username": "thinca"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4b22e2dba99d31c47488e3114d9cf3def67dea4f",
          "message": "docs(aws): Fix id of secretlint-rule-aws in README (#314)",
          "timestamp": "2022-10-24T11:52:50+09:00",
          "tree_id": "15c7388fb7b22a7ff932d9450fe63c8675575268",
          "url": "https://github.com/secretlint/secretlint/commit/4b22e2dba99d31c47488e3114d9cf3def67dea4f"
        },
        "date": 1666580210207,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.59,
            "range": "±1.51%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.5,
            "range": "±2.67%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "b481d54d7dba767e6e1685b7a413aae71a691507",
          "message": "chore(deps): update dependency @types/node to ^18.0.6",
          "timestamp": "2022-10-26T14:37:41Z",
          "tree_id": "6c1db29ae844fa1be7b9679c5f1a71de6246b7a4",
          "url": "https://github.com/secretlint/secretlint/commit/b481d54d7dba767e6e1685b7a413aae71a691507"
        },
        "date": 1666795297960,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.85,
            "range": "±0.81%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "1deb75ec6286dbcc84d7c25854d6b24c3bca30b0",
          "message": "chore(deps): update dependency @types/node to ^18.11.2",
          "timestamp": "2022-10-26T18:06:39Z",
          "tree_id": "237496c97a83dc3b5d12835659c148c5fcb2468c",
          "url": "https://github.com/secretlint/secretlint/commit/1deb75ec6286dbcc84d7c25854d6b24c3bca30b0"
        },
        "date": 1666807827691,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.86,
            "range": "±0.65%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±2.71%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "9208278e0d667fe47eb92279d0890eab01af2e3b",
          "message": "chore(deps): update minor updates",
          "timestamp": "2022-10-26T21:20:49Z",
          "tree_id": "691e4f8cc7c938077c99eeae8c569ddb9df24c9a",
          "url": "https://github.com/secretlint/secretlint/commit/9208278e0d667fe47eb92279d0890eab01af2e3b"
        },
        "date": 1666819514392,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.59,
            "range": "±1.36%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.5,
            "range": "±2.53%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "86017a5b2347832fd8bff41ae29fe4c8ca1ddae3",
          "message": "chore(deps): update dependency @types/node to ^18.11.3",
          "timestamp": "2022-10-27T20:09:57Z",
          "tree_id": "a99c7be6d4b8b7a0bca7f4fbf334260d9873b633",
          "url": "https://github.com/secretlint/secretlint/commit/86017a5b2347832fd8bff41ae29fe4c8ca1ddae3"
        },
        "date": 1666901618751,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.97,
            "range": "±0.57%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±2.68%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "30f1b2dc91795044bb7bedebb33452935c01d8f9",
          "message": "chore(deps): update dependency turbo to ^1.6.0",
          "timestamp": "2022-10-28T16:43:51Z",
          "tree_id": "54cd890f1194b6e799fcb7600afbd8d8f4a02e33",
          "url": "https://github.com/secretlint/secretlint/commit/30f1b2dc91795044bb7bedebb33452935c01d8f9"
        },
        "date": 1666975657160,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.92,
            "range": "±0.59%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±2.25%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "aa5fec1e4ec0179c3a30fb46197952cece255cd3",
          "message": "chore(deps): update dependency turbo to ^1.6.1",
          "timestamp": "2022-10-29T01:14:07Z",
          "tree_id": "a51ac5928a1c2b4f2d39b3e5b6d415f0e30c23db",
          "url": "https://github.com/secretlint/secretlint/commit/aa5fec1e4ec0179c3a30fb46197952cece255cd3"
        },
        "date": 1667006277795,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.94,
            "range": "±0.57%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.67,
            "range": "±2.14%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "c99e4cc461bb469ea339db248cff68df89ba5fdc",
          "message": "fix(deps): update dependency node-sarif-builder to ^2.0.3",
          "timestamp": "2022-10-30T04:51:56Z",
          "tree_id": "872cf5a19f9c6ad9bfd70955baf58355bf264806",
          "url": "https://github.com/secretlint/secretlint/commit/c99e4cc461bb469ea339db248cff68df89ba5fdc"
        },
        "date": 1667105730288,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.97,
            "range": "±0.68%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.69,
            "range": "±1.04%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "rhysd@users.noreply.github.com",
            "name": "Linda_pp",
            "username": "rhysd"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9eae766e2bfc69b79050a2df1cabeef3a1e53427",
          "message": "feat(secretlint-rule-github): support for fine-grained personal access tokens (#322)\n\n- blog post for introduction: https://github.blog/2022-10-18-introducing-fine-grained-personal-access-tokens-for-github/\r\n- document: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-fine-grained-personal-access-token",
          "timestamp": "2022-10-31T08:27:53+09:00",
          "tree_id": "58d7b79b702c20a8ce5bbd183f166c0ffd46bfc8",
          "url": "https://github.com/secretlint/secretlint/commit/9eae766e2bfc69b79050a2df1cabeef3a1e53427"
        },
        "date": 1667172692812,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.96,
            "range": "±0.59%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.69,
            "range": "±0.40%",
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
          "id": "d70f8151ffb08ea93c343b7217ff7c1f492f06a9",
          "message": "fix(github): remove duplicated gho- prefix  (#323)\n\n* fix(github): remove duplicated `gho-` prefix\r\n\r\n* chore(github): add comment",
          "timestamp": "2022-10-31T08:36:06+09:00",
          "tree_id": "2645cfa83725ed164d566069713ad978830eb65d",
          "url": "https://github.com/secretlint/secretlint/commit/d70f8151ffb08ea93c343b7217ff7c1f492f06a9"
        },
        "date": 1667173280846,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.37,
            "range": "±1.15%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.46,
            "range": "±0.43%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7df8da9e3b25593fe47a4f190fe073623a4b94c1",
          "message": "chore(release): v5.3.0 (#324)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2022-10-31T08:39:58+09:00",
          "tree_id": "b40908f1cb1f39557015318f1138a905f152d3d1",
          "url": "https://github.com/secretlint/secretlint/commit/7df8da9e3b25593fe47a4f190fe073623a4b94c1"
        },
        "date": 1667173418077,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.95,
            "range": "±0.67%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±2.50%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "5707adbae2b746689dc7d37aefa9d405ce5a7e9b",
          "message": "chore(deps): update dependency @types/node to ^18.11.4",
          "timestamp": "2022-10-31T04:46:00Z",
          "tree_id": "559bfea01fb69ec2e8f948ee1ea1d571ff1ce483",
          "url": "https://github.com/secretlint/secretlint/commit/5707adbae2b746689dc7d37aefa9d405ce5a7e9b"
        },
        "date": 1667191814686,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.72,
            "range": "±2.41%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.53,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "6d0fa77f295f4337474c49fc4e5d57bd5e10899c",
          "message": "chore(deps): update dependency @types/node to ^18.11.5",
          "timestamp": "2022-11-01T05:37:18Z",
          "tree_id": "4dda031761e8b0e2905fb6aeb526e4ca7edd3d45",
          "url": "https://github.com/secretlint/secretlint/commit/6d0fa77f295f4337474c49fc4e5d57bd5e10899c"
        },
        "date": 1667281301431,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.58,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.49,
            "range": "±2.74%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "5c04ec24073916212dd3619d6018fb0b26a40237",
          "message": "chore(deps): update dependency @types/node to ^18.11.6",
          "timestamp": "2022-11-02T17:01:36Z",
          "tree_id": "a769a682b9cc12020bc3de6a36bcbbc48b3eeb05",
          "url": "https://github.com/secretlint/secretlint/commit/5c04ec24073916212dd3619d6018fb0b26a40237"
        },
        "date": 1667408732859,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.86,
            "range": "±0.66%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "c438da856a72dc2a3f6ae8404405dd2862c7d3cf",
          "message": "chore(deps): update dependency @types/node to ^18.11.7",
          "timestamp": "2022-11-03T00:03:07Z",
          "tree_id": "8e146a2d4f1740173f0eb73dbd0c2c0d68437bb3",
          "url": "https://github.com/secretlint/secretlint/commit/c438da856a72dc2a3f6ae8404405dd2862c7d3cf"
        },
        "date": 1667434015280,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.91,
            "range": "±0.61%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±1.41%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "e8a732c61aa9bf94172a88da6505429033ac0d26",
          "message": "fix(deps): update dependency rc-config-loader to ^4.1.1",
          "timestamp": "2022-11-03T20:29:46Z",
          "tree_id": "2a8509ba13ec315e7b964abb0cbcad3ec65bf398",
          "url": "https://github.com/secretlint/secretlint/commit/e8a732c61aa9bf94172a88da6505429033ac0d26"
        },
        "date": 1667507663852,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.55,
            "range": "±3.24%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.5,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "92a799e7a99e9e008ba9caee1cae5e8e63b831a9",
          "message": "chore(deps): update dependency turbo to ^1.6.2",
          "timestamp": "2022-11-04T13:07:15Z",
          "tree_id": "7168ae4816e64cddfa32d670ec05a1ad19045bd9",
          "url": "https://github.com/secretlint/secretlint/commit/92a799e7a99e9e008ba9caee1cae5e8e63b831a9"
        },
        "date": 1667567455405,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.92,
            "range": "±0.73%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.68,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "027b010b509a24c00f30455d39cbb484dd66013f",
          "message": "chore(deps): update dependency @types/node to ^18.11.8",
          "timestamp": "2022-11-06T23:59:50Z",
          "tree_id": "35cbbb9ab10780be76bff57b0cbf5222672c3772",
          "url": "https://github.com/secretlint/secretlint/commit/027b010b509a24c00f30455d39cbb484dd66013f"
        },
        "date": 1667779410657,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.97,
            "range": "±0.48%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.69,
            "range": "±0.95%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "e5f864c3ab9167cdfd8d6dd715a30251dfe21a04",
          "message": "chore(deps): update patch updates",
          "timestamp": "2022-11-08T13:23:51Z",
          "tree_id": "974f963051117293ae682d953c1566613622e206",
          "url": "https://github.com/secretlint/secretlint/commit/e5f864c3ab9167cdfd8d6dd715a30251dfe21a04"
        },
        "date": 1667914136801,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.41,
            "range": "±2.09%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.49,
            "range": "±5.08%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "489f457ec0feddefdced1ac5dd36c1acf306c84f",
          "message": "fix(deps): update dependency table to ^6.8.1",
          "timestamp": "2022-11-09T04:24:00Z",
          "tree_id": "f47bbd3b7412ba294a9422e885f40de9e77f48c0",
          "url": "https://github.com/secretlint/secretlint/commit/489f457ec0feddefdced1ac5dd36c1acf306c84f"
        },
        "date": 1667968137131,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.47,
            "range": "±2.70%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.49,
            "range": "±1.02%",
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
          "id": "ceb7f095083f22adc563c7b99fcab7c9c9d40787",
          "message": "docs: add https://secretlint.github.io/ (#335)\n\nhttps://secretlint.github.io/ is quick demo site.",
          "timestamp": "2022-11-11T22:07:42+09:00",
          "tree_id": "1d90d20b66cd38b5d58b07e557769fcc22bf0ffb",
          "url": "https://github.com/secretlint/secretlint/commit/ceb7f095083f22adc563c7b99fcab7c9c9d40787"
        },
        "date": 1668172332876,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.61,
            "range": "±1.17%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.5,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "78aa14fa970155b5aaad15555fb79dfcd6a314b0",
          "message": "fix(deps): update patch updates to ^12.2.3",
          "timestamp": "2022-11-17T17:50:21Z",
          "tree_id": "5c05928f55d9eea77052fb413ab49f8fc49e2a10",
          "url": "https://github.com/secretlint/secretlint/commit/78aa14fa970155b5aaad15555fb79dfcd6a314b0"
        },
        "date": 1668707643257,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.93,
            "range": "±1.22%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.66,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "497c10652912c54c921b559d80089dc0fd48e83a",
          "message": "fix(deps): update dependency ajv to ^8.11.2",
          "timestamp": "2022-11-21T02:22:33Z",
          "tree_id": "5c7bfbb27b59dd119d631597d5b7e949ef342778",
          "url": "https://github.com/secretlint/secretlint/commit/497c10652912c54c921b559d80089dc0fd48e83a"
        },
        "date": 1668997576202,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.95,
            "range": "±0.80%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.68,
            "range": "±1.20%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "3887c3c1de071fcf075af03e05a900ed8d124bc7",
          "message": "chore(deps): update dependency @lerna-lite/cli to ^1.13.0",
          "timestamp": "2022-11-29T20:24:14Z",
          "tree_id": "9dc4dfc269abb53c228308eb5cd7df0ba1bf2a7d",
          "url": "https://github.com/secretlint/secretlint/commit/3887c3c1de071fcf075af03e05a900ed8d124bc7"
        },
        "date": 1669753678971,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.96,
            "range": "±2.88%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±1.46%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "766486fd490f361378a7242fb1351e76347a6e25",
          "message": "chore(deps): update dependency lint-staged to ^13.0.4",
          "timestamp": "2022-12-02T11:16:43Z",
          "tree_id": "8cfc578d6add0397ebbd933f32a4044c4092091e",
          "url": "https://github.com/secretlint/secretlint/commit/766486fd490f361378a7242fb1351e76347a6e25"
        },
        "date": 1669980025274,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.94,
            "range": "±0.82%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±2.03%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "305bf04ee876121d2b01ed6f6c13d1df131f531f",
          "message": "chore(deps): update dependency tsd to ^0.25.0",
          "timestamp": "2022-12-06T09:39:14Z",
          "tree_id": "2e649324bcf2164748b468ff6533892bf58cd9a2",
          "url": "https://github.com/secretlint/secretlint/commit/305bf04ee876121d2b01ed6f6c13d1df131f531f"
        },
        "date": 1670319772845,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.96,
            "range": "±0.44%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.68,
            "range": "±1.93%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "82b9bef37177dcc7199b92621cb434cb57b8e4a2",
          "message": "chore(deps): update dependency @types/node to ^18.11.10",
          "timestamp": "2022-12-08T01:52:36Z",
          "tree_id": "784d6ff3a587c9c57de08e8ee3602fb1d105cefc",
          "url": "https://github.com/secretlint/secretlint/commit/82b9bef37177dcc7199b92621cb434cb57b8e4a2"
        },
        "date": 1670464647433,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.46,
            "range": "±2.03%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.48,
            "range": "±2.66%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "e26d9dc91c77eafe4db30f9a1e66b8ef3aacb912",
          "message": "fix(deps): update dependency @textlint/linter-formatter to ^12.2.4",
          "timestamp": "2022-12-11T08:24:14Z",
          "tree_id": "d32507d07ec69481cf7dfdf4b7cb7a62b3ad40c8",
          "url": "https://github.com/secretlint/secretlint/commit/e26d9dc91c77eafe4db30f9a1e66b8ef3aacb912"
        },
        "date": 1670747286026,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.89,
            "range": "±0.44%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±2.40%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "0dd18915084f021b24b7b8b42a2969916c42b789",
          "message": "chore(deps): update dependency lint-staged to ^13.1.0",
          "timestamp": "2022-12-11T17:15:24Z",
          "tree_id": "5b11c16a04486494cf03f86331bea514e31fee9b",
          "url": "https://github.com/secretlint/secretlint/commit/0dd18915084f021b24b7b8b42a2969916c42b789"
        },
        "date": 1670779163013,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.86,
            "range": "±0.45%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±1.95%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e97e9dcee2aa2a99c3382ad714ea5b218d3682c3",
          "message": "chore(deps): bump decode-uri-component from 0.2.0 to 0.2.2 (#342)\n\nBumps [decode-uri-component](https://github.com/SamVerschueren/decode-uri-component) from 0.2.0 to 0.2.2.\r\n- [Release notes](https://github.com/SamVerschueren/decode-uri-component/releases)\r\n- [Commits](https://github.com/SamVerschueren/decode-uri-component/compare/v0.2.0...v0.2.2)\r\n\r\n---\r\nupdated-dependencies:\r\n- dependency-name: decode-uri-component\r\n  dependency-type: indirect\r\n...\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2022-12-12T08:38:56+09:00",
          "tree_id": "86aa7cf1259e0031e39bb29fabc4e2486c22f8a4",
          "url": "https://github.com/secretlint/secretlint/commit/e97e9dcee2aa2a99c3382ad714ea5b218d3682c3"
        },
        "date": 1670802174711,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.89,
            "range": "±0.31%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±0.90%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "be9f52646d757810e5758630c409ef6843614f83",
          "message": "chore(deps): update dependency @types/node to ^18.11.11",
          "timestamp": "2022-12-12T23:39:07Z",
          "tree_id": "e8281bf3660928b77551e3effe0074579df52d0d",
          "url": "https://github.com/secretlint/secretlint/commit/be9f52646d757810e5758630c409ef6843614f83"
        },
        "date": 1670888612801,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.64,
            "range": "±1.28%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.51,
            "range": "±2.07%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "61e823af6fa55dad282e26511ff56474118d9c5e",
          "message": "chore(deps): update dependency @types/node to ^18.11.13",
          "timestamp": "2022-12-17T23:33:22Z",
          "tree_id": "926f7acf7c6822851f6aa1b5995cea9b3ee5beac",
          "url": "https://github.com/secretlint/secretlint/commit/61e823af6fa55dad282e26511ff56474118d9c5e"
        },
        "date": 1671320216739,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.96,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.69,
            "range": "±0.88%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "2bc360f23e8d4669d3853336659f56023e4b4b4d",
          "message": "chore(deps): update dependency mocha to ^10.2.0",
          "timestamp": "2022-12-18T19:40:57Z",
          "tree_id": "9c944bbfa0fe76a7e19e3a128196d31d54be5e6c",
          "url": "https://github.com/secretlint/secretlint/commit/2bc360f23e8d4669d3853336659f56023e4b4b4d"
        },
        "date": 1671392693622,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.88,
            "range": "±0.88%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±1.24%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "3d75ebb8d14d4e670bf14dc51290ea86ebb65883",
          "message": "chore(deps): update dependency @types/node to ^18.11.14",
          "timestamp": "2022-12-20T09:12:16Z",
          "tree_id": "7ac923d3e7166242328c0682e26b52f509fdeb75",
          "url": "https://github.com/secretlint/secretlint/commit/3d75ebb8d14d4e670bf14dc51290ea86ebb65883"
        },
        "date": 1671527830243,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.47,
            "range": "±1.97%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.48,
            "range": "±2.12%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "1820a6ef8d4d3487b848d96de1b56c530271b966",
          "message": "chore(deps): update dependency @types/node to ^18.11.15",
          "timestamp": "2022-12-21T00:54:23Z",
          "tree_id": "d359aacea200c7b8a90584a00c4019bc879f3804",
          "url": "https://github.com/secretlint/secretlint/commit/1820a6ef8d4d3487b848d96de1b56c530271b966"
        },
        "date": 1671584292946,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.97,
            "range": "±0.36%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.67,
            "range": "±1.94%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "fac111587d03fd7c9426522fa59c59db2940589c",
          "message": "chore(deps): update dependency @types/node to ^18.11.16",
          "timestamp": "2022-12-23T23:52:41Z",
          "tree_id": "6384e9f24240ddb3c8d4a9521fcf4b46ea44a38f",
          "url": "https://github.com/secretlint/secretlint/commit/fac111587d03fd7c9426522fa59c59db2940589c"
        },
        "date": 1671839807231,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.84,
            "range": "±0.65%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±0.86%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "4909e5bb3d573cafdde2bfbfcd087e4f26c9d5de",
          "message": "chore(deps): update dependency @types/node to ^18.11.17",
          "timestamp": "2022-12-24T23:47:46Z",
          "tree_id": "c5ba0a751242a6972f36d37ed900fa54030e4c46",
          "url": "https://github.com/secretlint/secretlint/commit/4909e5bb3d573cafdde2bfbfcd087e4f26c9d5de"
        },
        "date": 1671925902021,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.82,
            "range": "±1.86%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.56,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "0cd52733f37f6940b5bc69d0ce8abdd0ccb1eeea",
          "message": "fix(deps): update dependency nexe to ^4.0.0-rc.2",
          "timestamp": "2022-12-27T01:36:25Z",
          "tree_id": "bc2a98691f8d58dce21b555298ce84c76b08b8cc",
          "url": "https://github.com/secretlint/secretlint/commit/0cd52733f37f6940b5bc69d0ce8abdd0ccb1eeea"
        },
        "date": 1672105225537,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.91,
            "range": "±0.77%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.6,
            "range": "±0.67%",
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
          "id": "eb49c314ba45048a6b2d40e90fa4d0f5f82ca1d0",
          "message": "feat(formatter): add --format=mask-result (#359)\n\n* feat(formatter): add --format=mask-result\r\n\r\n* test: add test case\r\n\r\n* test: fix\r\n\r\n* docs: update --format=mask-result usecase\r\n\r\n* test: fix  test\r\n\r\n* test: update snapshot\r\n\r\n* test: fix  test",
          "timestamp": "2023-01-02T22:52:03+09:00",
          "tree_id": "abb6e574dc2081d56229741a723f80a894aa440b",
          "url": "https://github.com/secretlint/secretlint/commit/eb49c314ba45048a6b2d40e90fa4d0f5f82ca1d0"
        },
        "date": 1672667807686,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.51,
            "range": "±1.76%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.5,
            "range": "±1.84%",
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
          "id": "4cf620f0f5c70e7ba9f94fc7fdfbc3a26f43a4ff",
          "message": "docs: add \"sourceContent\" and \"sourceContentType\" to message (#362)\n\nBREAKING CHANGE: you may need to update snapshots via @secretlint/tester",
          "timestamp": "2023-01-02T23:00:16+09:00",
          "tree_id": "67f6d86aa3e028bd9fee9e918fc69b74adaf55cb",
          "url": "https://github.com/secretlint/secretlint/commit/4cf620f0f5c70e7ba9f94fc7fdfbc3a26f43a4ff"
        },
        "date": 1672668275687,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.96,
            "range": "±0.51%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.69,
            "range": "±0.76%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c8ff5f28bbecd8e6a7bb06f733a1747435479029",
          "message": "chore(deps): bump json5 from 2.2.1 to 2.2.3 (#360)\n\nBumps [json5](https://github.com/json5/json5) from 2.2.1 to 2.2.3.\r\n- [Release notes](https://github.com/json5/json5/releases)\r\n- [Changelog](https://github.com/json5/json5/blob/main/CHANGELOG.md)\r\n- [Commits](https://github.com/json5/json5/compare/v2.2.1...v2.2.3)\r\n\r\n---\r\nupdated-dependencies:\r\n- dependency-name: json5\r\n  dependency-type: indirect\r\n...\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2023-01-02T23:00:51+09:00",
          "tree_id": "d8c93e1579f689141f828aeb07a63be855448da0",
          "url": "https://github.com/secretlint/secretlint/commit/c8ff5f28bbecd8e6a7bb06f733a1747435479029"
        },
        "date": 1672668519912,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.45,
            "range": "±1.21%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.48,
            "range": "±1.11%",
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
          "id": "e4e60a5b78cbef1f4e9d74211b3eead3eee4dc92",
          "message": "fix!: Update README (#364)\n\nBREAKING CHANGE: It is just update for rule creator",
          "timestamp": "2023-01-02T23:08:57+09:00",
          "tree_id": "0f7f4bcb8f3d81a9ef009cec1974765eb6e4bed1",
          "url": "https://github.com/secretlint/secretlint/commit/e4e60a5b78cbef1f4e9d74211b3eead3eee4dc92"
        },
        "date": 1672668759494,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.92,
            "range": "±0.53%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.67,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "88def656b35ab6646510ae6b4402f698c3bc87d5",
          "message": "chore(release): v6.0.0 (#365)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2023-01-02T23:17:52+09:00",
          "tree_id": "67b84db779c936c9af6df706737e37ff1cd9f14c",
          "url": "https://github.com/secretlint/secretlint/commit/88def656b35ab6646510ae6b4402f698c3bc87d5"
        },
        "date": 1672669290236,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 2.03,
            "range": "±2.37%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.61,
            "range": "±1.75%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "67f291f3857b462d2b998d00c26d3c58a26c0d72",
          "message": "chore(release): 6.0.1 (#366)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2023-01-02T23:35:14+09:00",
          "tree_id": "ebb5526e10a296d8f62d77317a73ad24211d88b2",
          "url": "https://github.com/secretlint/secretlint/commit/67f291f3857b462d2b998d00c26d3c58a26c0d72"
        },
        "date": 1672670398976,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.54,
            "range": "±2.28%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.49,
            "range": "±1.79%",
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
          "id": "bc69a4d9c59859236cc458d5d4750e280eb69a6f",
          "message": "CI: drop support Node.js 14 (#367)",
          "timestamp": "2023-01-02T23:53:09+09:00",
          "tree_id": "d69c4ed9c95186e043f90f474f824cf1ef48fbc6",
          "url": "https://github.com/secretlint/secretlint/commit/bc69a4d9c59859236cc458d5d4750e280eb69a6f"
        },
        "date": 1672671461913,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.58,
            "range": "±1.78%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.5,
            "range": "±1.21%",
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
          "id": "d6fdf0a35e2c324522918ace4a7bf90c023d45f9",
          "message": "docs: Node.js 14+ → 16+ (#368)",
          "timestamp": "2023-01-03T00:50:06+09:00",
          "tree_id": "5d664fee7f7abaf5b1141f2b1537b23c1b0e6577",
          "url": "https://github.com/secretlint/secretlint/commit/d6fdf0a35e2c324522918ace4a7bf90c023d45f9"
        },
        "date": 1672675063367,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.9,
            "range": "±0.70%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.67,
            "range": "±0.94%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "1811ccbf17cffa669315df0c21e2add76e1e810f",
          "message": "chore(deps): update dependency @types/node to ^18.11.18",
          "timestamp": "2023-01-02T21:51:17Z",
          "tree_id": "d5729e1723d06b080e3efb52b1f0c642cb3cc6a0",
          "url": "https://github.com/secretlint/secretlint/commit/1811ccbf17cffa669315df0c21e2add76e1e810f"
        },
        "date": 1672696515151,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.86,
            "range": "±0.85%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±1.66%",
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
          "id": "c3418997a21eb78541128934828901e990954223",
          "message": "chore(deps): update dependencies (#370)\n\n* chore(deps): update deps\r\n\r\n* refactor: update rollup and typescript\r\n\r\n* chore(turborepo): migrate env",
          "timestamp": "2023-01-03T10:09:02+09:00",
          "tree_id": "701903cfa163f8b5b3c0468e58f59b1b248ea748",
          "url": "https://github.com/secretlint/secretlint/commit/c3418997a21eb78541128934828901e990954223"
        },
        "date": 1672708350587,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.94,
            "range": "±0.57%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.68,
            "range": "±2.55%",
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
          "id": "df755395280f6314624e61b4763067d55f5cf951",
          "message": "fix(filter-comment): fix secretlint-disable comment parsing (#372)\n\n* fix(filter-comment): fix secretlint-disable comment parsing\r\n\r\n* test: add tests",
          "timestamp": "2023-01-03T20:49:23+09:00",
          "tree_id": "af3a08968381eede1307d55aec4ded005e47b981",
          "url": "https://github.com/secretlint/secretlint/commit/df755395280f6314624e61b4763067d55f5cf951"
        },
        "date": 1672746819830,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.53,
            "range": "±1.91%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.49,
            "range": "±1.40%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "15a9f79e558fed32a4cead3943754d6ec55890af",
          "message": "chore(release): v6.0.2 (#373)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2023-01-03T20:53:07+09:00",
          "tree_id": "35c99935d6c0b5ed405d56b381bcc73a266d6950",
          "url": "https://github.com/secretlint/secretlint/commit/15a9f79e558fed32a4cead3943754d6ec55890af"
        },
        "date": 1672746993570,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.94,
            "range": "±1.08%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.66,
            "range": "±3.73%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "0fda742affefedde6db9e4ea4d3ec5640a78b320",
          "message": "fix(deps): update dependency ajv to ^8.12.0",
          "timestamp": "2023-01-10T22:44:57Z",
          "tree_id": "6f3193021ebedfc095fc342ac3cbe2cc8fa72a1f",
          "url": "https://github.com/secretlint/secretlint/commit/0fda742affefedde6db9e4ea4d3ec5640a78b320"
        },
        "date": 1673390915504,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.87,
            "range": "±0.74%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.59,
            "range": "±0.59%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "114c99059ff4fbe296ad0c8f1e02a2bb848d1d51",
          "message": "fix(deps): update minor updates to ^12.5.0",
          "timestamp": "2023-01-11T05:51:15Z",
          "tree_id": "e223b855efa3c037ab10b122e3a59992fdde78c2",
          "url": "https://github.com/secretlint/secretlint/commit/114c99059ff4fbe296ad0c8f1e02a2bb848d1d51"
        },
        "date": 1673416488745,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.87,
            "range": "±0.90%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±1.45%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "e94cd57f520dffb4878ec3355dcaa440a89f6145",
          "message": "chore(deps): update dependency turbo to ^1.7.0",
          "timestamp": "2023-01-18T06:07:54Z",
          "tree_id": "9d4ea0a87ed458992db101b2a5782cc5793b2594",
          "url": "https://github.com/secretlint/secretlint/commit/e94cd57f520dffb4878ec3355dcaa440a89f6145"
        },
        "date": 1674022284778,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.95,
            "range": "±0.41%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.69,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "876249d55180328571586244946d88d35d69a045",
          "message": "chore(deps): update dependency rollup to ^3.10.0",
          "timestamp": "2023-01-19T12:32:41Z",
          "tree_id": "195b9575052f63c4455aeb80f67781410371cde5",
          "url": "https://github.com/secretlint/secretlint/commit/876249d55180328571586244946d88d35d69a045"
        },
        "date": 1674131776654,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.92,
            "range": "±0.85%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.66,
            "range": "±1.90%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "3c643a40d0203456b95e4b6ec04d8ca697271629",
          "message": "chore(deps): update dependency @lerna-lite/cli to ^1.14.0",
          "timestamp": "2023-01-25T22:23:42Z",
          "tree_id": "f974ef15115418e38bf950a5f1438245efe240fe",
          "url": "https://github.com/secretlint/secretlint/commit/3c643a40d0203456b95e4b6ec04d8ca697271629"
        },
        "date": 1674685706878,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.45,
            "range": "±1.67%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.48,
            "range": "±3.39%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "8953af4e9e581ec467cfe5b789e805236e6dc2bd",
          "message": "chore(deps): update dependency @lerna-lite/cli to ^1.14.1",
          "timestamp": "2023-01-26T05:33:17Z",
          "tree_id": "bfd120eb258615e562fc5199b7198eb33c920a70",
          "url": "https://github.com/secretlint/secretlint/commit/8953af4e9e581ec467cfe5b789e805236e6dc2bd"
        },
        "date": 1674711416777,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.88,
            "range": "±0.64%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.58,
            "range": "±2.39%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "5efb88679a996b6e13a831db84fb20de2a9a8ee1",
          "message": "chore(deps): update dependency rollup to ^3.10.1",
          "timestamp": "2023-01-27T18:54:45Z",
          "tree_id": "731586ded83d2f9a4671937556ea40d4751fd450",
          "url": "https://github.com/secretlint/secretlint/commit/5efb88679a996b6e13a831db84fb20de2a9a8ee1"
        },
        "date": 1674845891907,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.96,
            "range": "±0.68%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.68,
            "range": "±2.60%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "7d92248c39c5e62c9345d3cfadd052e1702cace6",
          "message": "chore(deps): update dependency @rollup/plugin-commonjs to ^24.0.1",
          "timestamp": "2023-01-28T03:46:00Z",
          "tree_id": "9ade8ce9a28c09df5062184fb4deaf9558d27067",
          "url": "https://github.com/secretlint/secretlint/commit/7d92248c39c5e62c9345d3cfadd052e1702cace6"
        },
        "date": 1674877843604,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.47,
            "range": "±1.43%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.49,
            "range": "±1.25%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "cbf11a241c5d9ff2415fd7860876eecc2d3f58b3",
          "message": "fix(deps): update patch updates to ^12.5.2",
          "timestamp": "2023-01-28T18:46:18Z",
          "tree_id": "9e6353c75eb0a96a583717f0453259e671181086",
          "url": "https://github.com/secretlint/secretlint/commit/cbf11a241c5d9ff2415fd7860876eecc2d3f58b3"
        },
        "date": 1674931834118,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.6,
            "range": "±1.03%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.5,
            "range": "±2.03%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "3a13d69f7e9a5d651ad364d3a7bb0fb4b821c66b",
          "message": "fix(deps): update patch updates to ^12.6.0",
          "timestamp": "2023-01-28T22:02:18Z",
          "tree_id": "b23fbbf217e8abde4f63d00b989d63f917f2ff39",
          "url": "https://github.com/secretlint/secretlint/commit/3a13d69f7e9a5d651ad364d3a7bb0fb4b821c66b"
        },
        "date": 1674943544717,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.96,
            "range": "±0.72%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.67,
            "range": "±3.02%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "974191b866799b2ddcb729100c6225ed5ecb9ed9",
          "message": "chore(deps): update dependency @lerna-lite/cli to ^1.14.2",
          "timestamp": "2023-01-29T04:37:51Z",
          "tree_id": "fcc0f694986200b3d19e5e14d9f4247bec72a678",
          "url": "https://github.com/secretlint/secretlint/commit/974191b866799b2ddcb729100c6225ed5ecb9ed9"
        },
        "date": 1674967284201,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.92,
            "range": "±0.96%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.68,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "distinct": true,
          "id": "9b79aa0f3bc3eb3b773bcee08cbd8e4279c6d19d",
          "message": "fix(deps): update patch updates to ^12.6.1",
          "timestamp": "2023-02-01T19:55:35Z",
          "tree_id": "f9cb8c3296ad0922e6e5609e6350a30c8a2a2944",
          "url": "https://github.com/secretlint/secretlint/commit/9b79aa0f3bc3eb3b773bcee08cbd8e4279c6d19d"
        },
        "date": 1675281626995,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.39,
            "range": "±2.22%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.47,
            "range": "±1.42%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arvid.bjurklint@hotmail.com",
            "name": "Arvid Bjurklint",
            "username": "slarwise"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b232cb8233c9ddea0e5673665562debc4464d7cb",
          "message": "feat(Dockerfile): install secretlint-rule-pattern (#387)\n\nCloses #380.",
          "timestamp": "2023-02-02T09:35:49+09:00",
          "tree_id": "f9c8718a1948007660b73c690ddae554a4ac0128",
          "url": "https://github.com/secretlint/secretlint/commit/b232cb8233c9ddea0e5673665562debc4464d7cb"
        },
        "date": 1675298354330,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.97,
            "range": "±0.54%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.7,
            "range": "±1.24%",
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
          "id": "61628901473ec6a123b0c32ab1437bcaf28e7238",
          "message": "CI: use new release flow based on GitHub Release (#390)\n\n* CI: use new release flow based on GitHub Releases\r\n\r\nReference: https://github.com/azu/monorepo-github-releases\r\n\r\n* chore: Update release.yml",
          "timestamp": "2023-02-02T09:56:01+09:00",
          "tree_id": "081c9b6d4ae32e45de469eb00f93462e6f4fc89b",
          "url": "https://github.com/secretlint/secretlint/commit/61628901473ec6a123b0c32ab1437bcaf28e7238"
        },
        "date": 1675299584196,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.85,
            "range": "±0.61%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.57,
            "range": "±1.82%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "41898282+github-actions[bot]@users.noreply.github.com",
            "name": "github-actions[bot]",
            "username": "github-actions[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3515e9b2553ed1d3391a41cf6cc5e84b3caff618",
          "message": "chore(release): v6.1.0 (#392)\n\nCo-authored-by: azu <azu@users.noreply.github.com>",
          "timestamp": "2023-02-02T09:58:46+09:00",
          "tree_id": "b56db42b318faa5b1d6e9a31da4a06a26f88fb04",
          "url": "https://github.com/secretlint/secretlint/commit/3515e9b2553ed1d3391a41cf6cc5e84b3caff618"
        },
        "date": 1675299885334,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.54,
            "range": "±1.29%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.51,
            "range": "±2.57%",
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
          "id": "c9a596755fdaf0735e08b6443d0c4fbaf119d1e5",
          "message": "docs(docker): add built-in packages (#393)",
          "timestamp": "2023-02-02T10:02:39+09:00",
          "tree_id": "f4c41c70fe7b09a447a678dab00a0689ecc9e208",
          "url": "https://github.com/secretlint/secretlint/commit/c9a596755fdaf0735e08b6443d0c4fbaf119d1e5"
        },
        "date": 1675300162214,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.92,
            "range": "±1.03%",
            "unit": "ops/sec",
            "extra": "9 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.66,
            "range": "±2.84%",
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
          "id": "67ff3debaa4ada1c94c3e756da8a6fb8e0ec1edd",
          "message": "docs: Update README (#394)",
          "timestamp": "2023-02-02T10:17:32+09:00",
          "tree_id": "338c45e66be290bb11f5e44dc9c131d53c87794c",
          "url": "https://github.com/secretlint/secretlint/commit/67ff3debaa4ada1c94c3e756da8a6fb8e0ec1edd"
        },
        "date": 1675300940888,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "run secretlint for textling.github.io",
            "value": 1.53,
            "range": "±1.87%",
            "unit": "ops/sec",
            "extra": "8 samples"
          },
          {
            "name": "run secretlint for js-primer",
            "value": 0.48,
            "range": "±1.99%",
            "unit": "ops/sec",
            "extra": "6 samples"
          }
        ]
      }
    ]
  }
}