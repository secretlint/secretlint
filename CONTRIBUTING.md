# Contributing

You can contribute to secretlint in various ways:

- Reporting issues
- Submitting pull request which fixes known issues, improve documentation, or implement new feature
- Creating an enhancement request or suggestions
- Writing your own rules or plugins
- Writing an article about secretlint on your blog

Although we are accepting pull request, we recommend creating an issue first as it enables us to discuss your proposal before you put significant effort into it.

## Reporting New Issues or Feature Suggestions

Please [create a new issue](https://github.com/secretlint/secretlint/issues/new) on GitHub if you found a bug, got a question, or had an idea for improvement. All work on secretlint happens on GitHub in English.

As described at the [`ISSUE_TEMPLATE.md`](https://github.com/secretlint/secretlint/blob/master/.github/ISSUE_TEMPLATE.md), please include following information when reporting a bug:

- What version of secretlint are you using? (`secretlint -v`)
- What file type (Markdown, plain text, etc.) are you using?
- What did you do? Please include the actual source code causing the issue.
- What did you expect to happen?
- What actually happened? Please include the actual, raw output from secretlint. (`secretlint --debug <options> ...`)

Creating a new repository that can reproduce the issue helps us understand your situation. [This repository](https://github.com/azu/secretlint-isssue78) for example.

## Development Workflow

Here you can see how to get the source of secretlint, build it, and run tests locally. We use [GitHub Flow](https://guides.github.com/introduction/flow/) as development workflow.

If you want to contribute to secretlint, please check issues labeled [`good first issue`](https://github.com/secretlint/secretlint/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22). These issues are suitable for your first contribution.

### Installing Prerequisites

Please install following development prerequisites. You also need a [GitHub](https://github.com/) account for contribution.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)
- Text editor
- Terminal emulator

### Cloning Copy of secretlint

Forking a repository allows you to work with secretlint codebase without special permission to the secretlint repository itself.

1. Navigate to [secretlint](https://github.com/secretlint/secretlint/) repository
2. In the top–right corner of the page, click **Fork** button
3. Create a clone of the fork locally in your terminal:

    ```sh
    $ git clone --recursive https://github.com/YOUR_ACCOUNT/secretlint YOUR_FORKED_REPOSITORY
    ```

See [Fork A Repo: GitHub Help](https://help.github.com/articles/fork-a-repo/) for further detail.

### Building secretlint

After getting your clone, you can start playing with secretlint.

1. Change directory to your clone:

    ```sh
    $ cd YOUR_FORKED_REPOSITORY
    ```

2. Install dependencies and build packages:

    ```sh
    $ pnpm install
    ```

3. Run build:

    ```sh
    $ pnpm run build
    ```

Under the hood, secretlint uses Turbopack to manage multiple packages:

- `packages/*`
- `packages/@secretlint/*`
- `examples/*`

If you are new to Lerna, it seems to add another layer of complexity but it's simpler than you think; you can edit codes, run tests, commit changes, etc. as usual in most cases.

Note that `pnpm install` also builds a codebase, you can manually build by running `pnpm run build`.

### Creating a Branch for Your Work

Before adding changes to your clone, please create a new branch (typically called _feature branch_). Changes made to feature branch don't affect or corrupt `master` branch so you will feel safe. In Git, creating a branch is easy and fast:

```sh
$ git checkout -b your-new-feature
```

### Making Changes

You have your feature branch with working secretlint then it's time to start making changes! Edit codes with text editor of your choice and add commits as you work on. Please don't forget to add or modify test cases and documents according to your changes.

#### Coding Guideline

##### Languages

While working with your idea, please use:

- [TypeScript](https://www.typescriptlang.org/) for new codes and tests
- [GitHub flavored Markdown](https://github.github.com/gfm/) for documentation

We are migrating entire codes to TypeScript.

##### Linting and Style

This repository uses [Prettier](https://prettier.io/) for code formatter. We use [`lint-staged`](https://www.npmjs.com/package/lint-staged) and [`husky`](https://www.npmjs.com/package/husky) to make coding style consistent before commit, but if you have your own [Git hooks](https://git-scm.com/book/gr/v2/Customizing-Git-Git-Hooks) locally, these setup doesn't work. In such case, please run Prettier manually as below after making changes.

- Run Prettier to reformat code:

    ```sh
    $ pnpm prettier
    ```

##### Commit Message Format

We use [Angular Convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) for commit message.

In order to make repository history clean, please use the following guideline as possible as you can. It also enables us creating comprehensive changelog semi–automatically.

```
                      component        commit title
       commit type       /                /      
               \        |                |
                feat(rule-context): add template url parameter to events
                (a blank line)
       body ->  The `src` (i.e. the url of the template to load) is now provided to the
                `$includeContentRequested`, `$includeContentLoaded` and `$includeContentError`
                events.

referenced  ->  Closes #8453
issues          Ref. #8454
```

- commit type:
    - `docs`: create or update document
    - `feat`: add new feature
    - `fix`: fix a bug
    - `style`: change formatting
    - `perf`: performance related change
    - `test`: update on tests
    - `chore`: house–keeping
    - `refactor`: refactoring related change
- component: package or file name
- commit title:
    - Limit to 50 characters including commit type and component (as possible as you can)
    - Do not capitalize first character
    - Do not end with a period
    - Use imperative mood, in present tense; commit title should always be able to complete the following sentence:
        - If applied, this commit will _commit title here_
- body:
    - Separate from subject with a blank line
    - Wrap texts at 72 characters
    - Explain _what_ and _why_, not _how_
    - [GitHub flavored Markdown](https://github.github.com/gfm/) is ok to use
    - Start with `BREAKING CHANGE: ` when you made significant change in the commit (see versioning section below).

Example commit message:

```
test(formatter): check types while testing

- Add strict type check option to `ts-node` to make sure future
  interface changes will be took into account while running test.
- Update test case for interface changes made at #430.

Closes #448.
```

Please see [Commit Message Format](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) and [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/) for detail.

##### Versioning

We care version number while releasing packages to npm registry so you should not modify `version` field of `package.json`. For the record, we use [Semantic Versioning](https://semver.org/).

- Patch release (intended to not break your lint build)
    - A bug fix to the CLI or core (including formatters)
    - Improvements to documentation
    - Non-user-facing changes such as refactoring
    - Re-releasing after a failed release (i.e., publishing a release that doesn't work for anyone)
- Minor release (might break your lint build)
    - A new option
    - An existing rule is deprecated
    - A new CLI capability is created
    - New public API are added (new classes, new methods, new arguments to existing methods, etc.)
        - It might break type interface(`.d.ts`)
    - A new formatter is created
- Major release (break your lint build)
    - A new option to an existing rule that results in Secretlint reporting more errors by default
    - An existing formatter is removed
    - Part of the public API is removed or changed in an incompatible way

### Running Tests

We have some type of tests. You should run at least **unit test** before submitting a pull request.

All tests should be run at the top directory of your fork.

#### Unit Test

Run tests for all packages:

```sh
$ pnpm test
```

While developing, it would be good to run package level unit test since it will run faster:

```sh
$ cd packages/PACKAGE
$ pnpm test
```

#### Snapshot Test

We have much Snapshot testings.
This test is same with Jest's [Snapshot Testing](https://jestjs.io/docs/ja/snapshot-testing).

You can update snapshot's output via following command:

```sh
# Root(all)
$ pnpm run updateSnapshot
# Package
$ cd packages/PACKAGE
$ pnpm run updateSnapshot
```

### Pushing the Commit and Opening a Pull Request

After finishing your changes and unit tests or documentation test ran fine, you can push your feature branch to GitHub. Please see [GitHub Help](https://help.github.com/articles/pushing-to-a-remote/) for detail but typically, run `git push` at your terminal.

```sh
$ git push origin feature-branch
```

Then follow another [GitHub Help](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) to create a pull request.

### Working with Reviews (if any)

Once a pull request has been created, it will initiate continuous integration builds and we can work on your changes. You can push additional commits to your fork according to feedback.

### Merging

After all participants on pull request are satisfied to the changes, we will merge your code into the secretlint master branch. Yay!

## Add New Rule

This project has a template for creating a new rule.

```sh
pnpm run gen:rule
```

1. Enter rule name
   - e.g.) `aws`
   - This generator create `@secretlint/secretlint-rule-aws` package
2. Implement it and run tests!
3. Update README.md

## Add a rule to preset rules

This project has two preset rules:

- [secretlint-rule-preset-canary](./packages/@secretlint/secretlint-rule-preset-canary): Experimental preset for testing new rules
- [secretlint-rule-preset-recommend](./packages/@secretlint/secretlint-rule-preset-recommend): Stable preset for production use

### Rule Addition Flow

New rules follow a two-stage deployment process:

1. **Stage 1: Canary Testing** - Add to canary preset for experimental testing
2. **Stage 2: Production Release** - Sync to recommended preset for stable release (usually in major versions)

### Step 1: Add a rule to canary preset

First, add your rule to [secretlint-rule-preset-canary](./packages/@secretlint/secretlint-rule-preset-canary):

1. Add the rule package to devDependencies in `packages/@secretlint/secretlint-rule-preset-canary/package.json`:
   ```json
   "devDependencies": {
     // ... existing dependencies
     "@secretlint/secretlint-rule-your-rule": "workspace:*"
   }
   ```
   Then run `pnpm install` to update dependencies.

2. Import and add the rule to `packages/@secretlint/secretlint-rule-preset-canary/src/index.ts`:
   ```typescript
   import { creator as ruleYourRule } from "@secretlint/secretlint-rule-your-rule";
   
   export const rules = [
       // ... existing rules
       ruleYourRule,  // Add your rule here
   ];
   ```

3. Import test snapshots and run tests (from project root):
   ```sh
   # From any directory in the project
   pnpm run -r --filter "@secretlint/secretlint-rule-preset-canary" import-test
   pnpm run -r --filter "@secretlint/secretlint-rule-preset-canary" test
   ```

### Step 2: Sync to recommended preset (for major releases)

After the rule has been tested in canary, sync it to [secretlint-rule-preset-recommend](./packages/@secretlint/secretlint-rule-preset-recommend):

1. Run the sync script (from project root):
   ```sh
   # From any directory in the project
   pnpm run -r --filter "@secretlint/secretlint-rule-preset-recommend" sync-canary
   ```

2. Verify the sync:
   - Check that `packages/@secretlint/secretlint-rule-preset-recommend/src/index.ts` includes your new rule
   - Check that test snapshots were copied
   - Check that devDependencies were added

3. Fix any version downgrades:
   - The sync script may downgrade some dependencies
   - Manually update `package.json` if needed (e.g., `@rollup/plugin-node-resolve`)
   - Run `pnpm install` to update the lock file

4. Run tests to ensure everything works:
   ```sh
   # From any directory in the project
   pnpm run -r --filter "@secretlint/secretlint-rule-preset-recommend" test
   ```

### Alternative: Direct navigation approach

If you prefer to work directly in the package directories:

```sh
# For canary preset
cd packages/@secretlint/secretlint-rule-preset-canary
pnpm add -D @secretlint/secretlint-rule-your-rule
pnpm run import-test
pnpm test

# For recommended preset
cd packages/@secretlint/secretlint-rule-preset-recommend
pnpm run sync-canary
pnpm test
```

### Important Notes

- **Breaking Changes**: Adding new rules to the recommended preset is a breaking change as it may introduce new secret detections
- **Major Versions Only**: Sync to recommended preset should typically be done only for major version releases (e.g., v11.0.0)
- **Test Coverage**: Ensure all rules have adequate test coverage before adding to presets
- **Documentation**: Update the rule's README with examples and configuration options

## Benchmark

Secretlint has a continuous benchmark:

- <https://secretlint.github.io/secretlint/dev/bench/>

## Release Flow

A Maintainer release new version of secretlint by following way.

**Prerequisites:**
- Maintainer should have **commit right**
- Each npm package must be configured with **OIDC trusted publisher** (no npm tokens needed)
- Check provenance status: GitHub Actions workflow `.github/workflows/check-provenance.yml` runs automatically

### Initial Package Release (First-time publish)

For new packages that have never been published:

1. **Setup OIDC and initial publish:**
   ```bash
   npx setup-npm-trusted-publish @secretlint/your-package-name
   ```
   
   This command will:
   - Reserve the package name on npm
   - Configure OIDC trusted publishing automatically
   - Set up the following configuration:
     - Repository: `secretlint/secretlint`
     - Workflow: `.github/workflows/publish.yml`

2. **Verify OIDC setup:**
   The `.github/workflows/check-provenance.yml` workflow will automatically verify the configuration on your next PR.

After initial setup, all future releases will use OIDC automatically through CI without npm tokens.

### Pre-Release Checklist

Before creating a release, ensure documentation is up-to-date:

1. **For new packages/rules**: Check that they are documented in:
   - Main README.md (if it's a standalone rule or important package)
   - docs/configuration.md (if it affects configuration)
   - CONTRIBUTING.md (if it's a preset that affects the rule addition flow)

2. **For preset packages** (`@secretlint/secretlint-rule-preset-*`):
   - Ensure the preset is listed in README.md
   - Update configuration examples if needed
   - Document any breaking changes in the preset

### Release Process

1. Create Release PR via GitHub Actions: <https://github.com/secretlint/secretlint/actions/workflows/create-release-pr.yml>
   - Run workflow with `version` input
      - You can select new version with semver(patch,minor,major)
2. [CI] Create Release PR
   - Update `packages/*/package.json`'s `version` and root `package.json`'s `version`
   - Fill the Pull Request body with [Automatically generated release notes](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes)
   - e.g. https://github.com/azu/monorepo-github-releases/pull/18
3. Review the Release PR
   - You can modify PR body for changelog
   - Verify that documentation mentions all new packages/features
4. Merge the Release PR
5. [CI] Publish new version to npm and GitHub Release
   - Uses OIDC trusted publishing (no npm tokens required)
   - Packages are published with provenance attestations
   - The release note content is same to PR body
   - CI copy to release note from PR body when merge the PR
   - e.g. https://github.com/azu/monorepo-github-releases/releases/tag/v1.6.3

> **Warning**
> If the publishing(Step 5) is failed, you can re-run the workflow.  
> Or, Open <https://github.com/textlint/secretlint/actions/workflows/publish.yml> and do "Run workflow".

