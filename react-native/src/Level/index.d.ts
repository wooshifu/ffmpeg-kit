export class Level {
  static readonly AV_LOG_STDERR: number;
  static readonly AV_LOG_QUIET: number;
  static readonly AV_LOG_PANIC: number;
  static readonly AV_LOG_FATAL: number;
  static readonly AV_LOG_ERROR: number;
  static readonly AV_LOG_WARNING: number;
  static readonly AV_LOG_INFO: number;
  static readonly AV_LOG_VERBOSE: number;
  static readonly AV_LOG_DEBUG: number;
  static readonly AV_LOG_TRACE: number;

  static logLevelToString(number: number): string;
}
