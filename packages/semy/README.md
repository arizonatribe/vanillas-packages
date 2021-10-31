# Semy

<img src="media/logo.png" width="200" align="left" hspace="12" />
<p align="left">Semy - (pronounced "SEM-ee")</p>

Set a semantic version value onto the package.json for a NodeJs project (directly or interactively)

### Possible ways to use this tool:

* In a [husky](https://www.npmjs.com/package/husky) pre-commit hook
* In a CI/CD pipeline (non-ineteractive mode)
* Manually (interactively) prior to writing up a PR

## Usage

Easiest is to launch it interactively, and it'll guide you through the choices:

```
npx semy
```

<div align="center">
  <img width="480" src="media/semy-interactive.gif" alt="Semy (interactive)">
</div>

#### Directlly

Simplest is to set the version directly (non-ineteractive) in one-shot:

```
npx semy 1.12.0
```

Perhaps you are basing your versioning of the project on git tagging and can parse the exact semver you will set every time. If so, just plug that value as a command-line arg to `semy` (for example: `npx semy 1.12.0`).

#### Patch, Minor or Major

Create a __patch__ version change directly (non-interactive):

```
npx semy --type=patch
```

<div align="center">
  <img width="480" src="media/semy.gif" alt="Semy)">
</div>


Or a __minor__ version change: 

```
npx semy --type=minor
```

Or a __major__ version change: 

```
npx semy --type=major
```

And although it's recommended to use the `--type=patch|minor|major` flag instead, you can optionally specify `--patch`, `--minor` or `--major` (would get weird if you combined them though, so it's not listed in the `--help` docs).

#### Different Branch

Packages (not apps) are often single-branched projects or when they are not, you still publish only from one branch (this ain't Java). And while `develop` is a common branch to settle on as the default, just use the `--branch` flag to specify a different one to use as the basis for the published `package.json`.

```
npx semy --branch=main
```

#### Conventional Commit

A [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) is a prefixing pattern for git commit messages which can be used to drive automation scripts (especially in CI/CD pipelines) that set the semantic version for you.

This prefixing convention for git commit messages is extremely simple, basically just this:
 - `fix:` - means a patch update
 - `feat:` - means a minor update
 - `feat!:` or `fix!:` - means a major update

Here's a couple of example git commit messages which follow that convention:

```
feat: Added a new helper util function to determine git (current) commit hashes by a given branch name.
```

That `feat:` prefix would signify a __minor__ semantic version change. For example, bumping from __1.3.9__ to __1.40__

Here's an example of a patch change convention:

```
fix: A divide by zero error in the summary calculator function. Wrote a test to make sure the bug doesn't happen again.
```

And lastly a __major__ update would just being either that `fix` or `feat` prefix followed by the exclamation mark `!`:

```
feat!: Rolling out the refactor from Perl to TypeScript
```

And to take advantage of that git commit convention to bump a version, just supply the `--conventional` flag and it'll take precedence (and _not_ apply any change if there are no matches)

```
npx semy --conventional
```

if you publish from the `develop` branch, that's all you need, but otherwise you'll always want to provide the `--branch` flag:

```
npx semy --branch=main --conventional
```

#### Revert

Or revert the local package.json back to the same version on the source branch

```
npx semy --revert
```

<div align="center">
  <img width="480" src="media/semy-revert.gif" alt="Semy --revert">
</div>


Or the same, but specify a different branch than the default (develop):

```
npx semy --revert --branch=main
```

#### Simple summary report

See the difference between local and source-of-truth on another branch:
```
npx semy --info

{
  package: 'semy',
  'Local package.json': '1.0.2',
  "main branch's package.json": '1.0.2',
  'versioning options:': { Major: '2.0.0', Minor: '1.1.0', Patch: '1.0.3' }
}
```

Note it also shows you what a Major vs Minor vs Patch would look like

#### OpenAPI File Update

In addition to the version updating to the `package.json` manifest, you can supply a file path to an OpenAPI formatted file (yml or json):

```
npx semy --openapi-path=docs/openapi.yml
```

#### Help docs

Print out the help docs:

```
npx semy --help

Set a semantic version value onto the package.json for a NodeJs project (direct ly or interactively)

Options:
  --type           The kind of semantic version increment. Choices are patch (default), minor, or major.
  --branch         The branch to use as the basis for the current version.
                   Rare that this need be anything other than develop (default) for NodeJs projects
                   (except for single branch projects).
  --revert         Set the version field in the local package.json to match that of the source branch
                   (specified by --branch, defaulting to develop)
  --conventional   An optional way to determine and apply the semver update is to use Conventional Commits:
                   https://www.conventionalcommits.org/en/v1.0.0/
                   Which is git commits whose leading prefixes determin update types:
                     fix:  - means a patch update
                     feat: - means a minor update
                     feat!: or fix!:  - means a major update
  --info           Maybe you only want to compare the local package.json with that of a branch and see what the major/minor/patch updates would be.
  --add-commit     Whether to auto-add the commit after making the semver change (defaults to true).
  --commit-message The commit message (when using --add-commit).
                   Defaults to 'Update version to x.x.x'
                   Note: Use 'x.x.x' in your commit message override if you want it interpolated.

  --openapi-path   An optional path to an OpenAPI formatted file whose version also needs upating.
  --cwd            An optional working directory to specific (defaults to the directory where the script is being executed)
  --dry-run        To do everything except for actually altering the package.json
  --log-level      The threshold logging leve to use (defaults to info).

Examples
  $ semy
  $ semy 1.17.0
  $ semy --type=minor
  $ semy --type=major
  $ semy --type=patch
  $ semy --revert
  $ semy --info
  $ semy --openapi-path=docs/openapi.yml
  $ semy --conventional --add-commit
  $ semy --cwd=../path/to/some/other/repo
  $ semy --commit-message="new version x.x.x"
```

## How this kind of scripting can help

In general you should have human beings involved in the process of setting your [semantic version](https://semver.org/).

Is meaningful semantic versioning important? And if so, how critical is it? Perhaps it's about as important or as trivial as the similar topic of building APIs which honor the meaning of HTTP response codes (ie 404, 200, 500, 401).

To follow the analogy for a bit, it is common to see web services built which fall back to an error code of 500 in a "catch-all" (maybe there's even a "TODO" to handle errors). Failing to use response codes in a way your consumers expect, just leads to confusion and more time wasted troubleshooting errors (for them and for you). Meaningful error handling (both for status codes and error messages) helps build __trust__ between you and your API consumers. They trust they can use your service and have it behave predictably and be easy to troubleshoot when things go wrong.

Similar to Http response codes, semantic versioning is a simple technical contract which builds trust between you and your consumers. The light technical syntax at the heart of semantic versioning communicates these most basic details:

* a backward-compatible bug fix (patch)
* backward compatible new feature (minor)
* breaking new change (major)

Similar to using "Internal server error (500)" Http response codes as a catch-all in applications with poor error-handling, semantic versioning has similar unintentional (or lightly neglectful) abuses. Maybe the most common is automating the versioning to be "patch" changes for every new commit. It's completely understandable given how much of our build, deployment and release processes are highly automated. Version handling just "feels" like it should be automated.

The solutions to this problem are a mix of tools and techniques, including some or many of:

* git release tagging
* use code commit labels to signal major/minor/patch change
* ignoring commits which have only non-publishable files.
* using branch merging conventions to determine whether a major, minor or patch updates

This tool is an attempt to add onto that toolkit some shell scripting focused on easier manual and automated versioning of NodeJs package manifest/config files.

* Better manual versioning - Interactive and flexible scripting options
* Flexible automated usage
    * Pass in an exact version
    * Pass in the major/minor/patch label instead
    * Compare against a specific local/upstream branch
    * Revert to the local/remote branch's version
    * Dry-run, help docs
