# Console Logger

A wrapper around the native Console API but which supports top-down threshold (levels) based control

## Why?

The functionality in tools like this or other similar libraries out there are to allow you to silence logging statements in your application by a single config change (especially when you have your logging threshold level controlled by an environment variable, this is as easy as a re-deploy without any application code changes).

Why does this matter? Because you can leave logger statements in your application permanently, but not have to remove them when you're done debugging (therefore you can use them again in the future when you have to check production logs).

You control all of this functionality by simply changing the threshold level. That way you can operate at a normal "info" or "warn" level when things are going well, but when there's a problem you can toggle the overall level to
something much lower, which activates all those low-level `logger.trace` or `logger.debug` statements - and redeploy your application with full logging enabled.

Logging events can be expensive for high-traffic applications, so being able to toggle verbose logging on/off with a single config value.

# Installation

```
npm install @vanillas/console-logger
```

# Usage

Try it out in the NodeJs shell either next to a `node_modules/` directory where `@vanillas/console-logger` has been installed, _or_ try using [replem](https://www.npmjs.com/package/replem) as a global NPM package so you can load any NPM package into a NodeJs shell.

```
$ replem @vanillas/console-logger:logger

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
