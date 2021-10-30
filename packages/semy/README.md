# Semy

<h1 align="center">
	<img width="200" src="logo.png" alt="Semy">
</h1>

Set a semantic version value onto the package.json for a NodeJs project (directly or interactively)

(pronounced "SEM-ee")

## Usage

Easiest is to launch it interactively, and it'll guide you through the choices:

```
npx semy
```

#### Directlly

Simplest is to set the version directly (non-ineteractive) in one-shot:

```
npx semy 1.12.0
```

#### Patch, Minor or Major

Create a patch version change directly (non-interactive):

```
npx semy --type=patch
```

Or a minor version change: 

```
npx semy --type=minor
```

Or a major version change: 

```
npx semy --type=major
```

And although it's recommended to use the `--type=patch|minor|major` flag instead, you can optionally specify `--patch`, `--minor` or `--major` (would get weird if you combined them though, so it's not listed in the `--help` docs).

#### Different Branch

Packages (not apps) are often single-branched projects or when they are not, you still publish only from one branch (this ain't Java). And while `develop` is a common branch to settle on as the default, just use the `--branch` flag to specify a different one to use as the basis for the published `package.json`.

```
npx semy --branch=main
```

#### Revert

Or revert the local package.json back to the same version on the source branch

```
npx semy --revert
```

Or the same, but specify a different branch than the default (develop):

```
npx semy --revert --branch=main
```

#### Help docs

Print out the help docs:

```
npx semy --help

Set a semantic version value onto the package.json for a NodeJs project

Options:
  --type           The kind of semantic version increment. Choices are patch (default), minor, or major.
  --branch         The branch to use as the basis for the current version.
                   Rare that this need be anything other than develop (default) for NodeJs projects
                   (except for single branch projects).
  --revert         Set the version field in the local package.json to match that of the source branch
                   (specified by --branch, defaulting to develop)
  --info           Maybe you only want to compare the local {cyan package.json} with that of a branch and see what the major/minor/patch updates would be.
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
  $ semy --cwd=../path/to/some/other/repo
```
