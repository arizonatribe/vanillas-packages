# A History Lesson on Express Middleware and Controllers

In contrast to traditional MVC frameworks, ExpressJs emerged in the early 2010's with a lighter approache to "controllers". Essentially, everything traditional MVC interpreted as decorators (including even the controller "handler" function) were just a series of functions you could chain together onto a route.

Frameworks like NestJs and others revert back to the traditional MVC design pattern of controller handler functions "decorated" with higher-order functions. That pattern is clean and probably finds its cleanest implementation in NestJs. If that's what you're looking for, it's recommended you scaffold out an NestJs application (Nest is built on top of Express too, btw).

If you're looking for traditional idiomatic ExpressJs, then the concept of a "controller" is really just another middleware function (sometimes called the "handler"). That particular piece of middleware is always the last in the chain of middleware functions for a given route. Traditional ExpressJs is just to interpret everything as a chain of middleware functions (even functions which fetch data from a database and marshall them into JSON payloads or server-rendered views.
