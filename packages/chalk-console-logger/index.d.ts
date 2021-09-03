import { ThresholdLevel, ConsoleLogger } from "@vanillas/console-logger"

export type {
  LogLevels,
  ThresholdLevel,
  ThresholdLevels,
  NumericThresholdLevel
} from "@vanillas/console-logger"

/**
 * A light abstraction around the native browser/node [Console API](https://developer.mozilla.org/en-US/docs/Web/API/console), yet is driven by a thre
shold level to decide whether to silence lower-threshold logging statements.
 *
 * @augments ConsoleLogger
 * @typedef {Object<string, function|ThresholdLevel>} ChalkConsoleLogger
 * @property {function} trace The most verbose logging statements to trace specific locations (or even line numbers) in the code or you can use it to log full data sets, request/response payloads or all params passed into a function (with the intent of being used for full replay)
 * @property {function} debug Standard debugging statements, but less expensive than full trace logging (this overlaps with trace logging in practice for many applications, so it just depends on how strict you interpret the difference between trace and debug logging)
 * @property {function} info Normal non-verbose runtime messages (ie logging out the application name, version number and light config details)
 * @property {function} warn To log warning messages (often implemented over a long troubleshooting session where the condition of data is unknown and suspected to be the cause of a bug)
 * @property {function} error To log errors caught during the life of the application
 * @property {function} fatal To log events which caused the application to crash (ideal in a global catch-all error handler)
 * @property {ThresholdLevel} level The current logger threshold level (defaults to `info`)
 * @property {function} setThreshold Should be modified when the logger is initially created (defaults to "info", but can be "trace", "debug", "info",
 "warn", "error" or "fatal")
 */
export interface ChalkConsoleLogger extends ConsoleLogger { }
