export type NumericThresholdLevel = 10 | 20 | 30 | 40 | 50 | 60
export type ThresholdLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal"

/**
 * The logging thresholds level names themselves
 *
 * @name ThresholdLevels
 * @type {Array<ThresholdLevel>}
 * @constant
 * @default
 */
export type ThresholdLevels = ThresholdLevel[]

/**
 * The mapping of threshold level names to numeric (hierarchical) values
 *
 * @name LogLevels
 * @typedef {Object<ThresholdLevel, NumericThresholdLevel>}
 * @property {ThresholdLevel} trace
 * @property {ThresholdLevel} debug
 * @property {ThresholdLevel} info
 * @property {ThresholdLevel} warn
 * @property {ThresholdLevel} error
 * @property {ThresholdLevel} fatal
 */
export interface LogLevels {
  [level: ThresholdLevel] NumericThresholdLevel
}

/**
 * A light abstraction around the native browser/node [Console API](https://developer.mozilla.org/en-US/docs/Web/API/console), yet is driven by a thre
shold level to decide whether to silence lower-threshold logging statements.
 *
 * @typedef {Object<string, function|ThresholdLevel>} ConsoleLogger
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
export interface ConsoleLogger {
  readonly level: ThresholdLevel
  trace: ((...args: any[]) => void)
  debug: ((...args: any[]) => void)
  info: ((...args: any[]) => void)
  warn: ((...args: any[]) => void)
  error: ((...args: any[]) => void)
  fatal: ((...args: any[]) => void)
  setLevel?: ((level: ThresholdLevel) => void)
}
