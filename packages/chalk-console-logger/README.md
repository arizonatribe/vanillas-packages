# Chalk Console Logger

A wrapper around the native Console API but which supports top-down threshold (levels) based control and injects an instance of the [chalk](https://www.npmjs.com/package/chalk) into any functions passed into the [@vanillas/console-logger](https://www.npmjs.com/package/@vanillas/console-logger) methods.

# Installation

```
npm install @vanillas/chalk-console-logger
```

# Usage

Try it out in the NodeJs shell either next to a `node_modules/` directory where `@vanillas/console-logger` has been installed, _or_ try using [replem](https://www.npmjs.com/package/replem) as a global NPM package so you can load any NPM package into a NodeJs shell.

```
$ replem @vanillas/chalk-console-logger:logger

Installed into REPL context:
 - @vanillas/console-logger@1.0.0 as logger

> logger.level
'info'
> logger.setLevel("trace")
> logger.trace("Some very verbose logging statement")
Some very verbose logging statement
> logger.setLevel("debug")
> logger.trace("Some very verbose logging statement")
> logger.debug("Some slightly less verbose logging statement")
Some slightly less verbose logging statement
> logger.setLevel("warn")
> logger.info("Normal stuff to log to stdout")
> logger.error("something broke"
something broke
```

The only thing happening in this example is writing normal logging statements but the ones _below_ the current logger threshold level never show up.

A NodeJs shell is just a quick way to demonstrate functionality for a simple package like this one, but in a front-end or back-end JavaScript/TypeScript appliction you instead just `import` this package and use it in the same manner demonstrated in the shell.
