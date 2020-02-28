window.BENCHMARK_DATA = {
  "lastUpdate": 1582871567611,
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
      }
    ]
  }
}