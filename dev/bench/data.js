window.BENCHMARK_DATA = {
  "lastUpdate": 1585581555396,
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
      }
    ]
  }
}