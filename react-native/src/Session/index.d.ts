import {ExecuteCallback} from "../ExecuteCallback";
import {Log} from "../Log";
import {LogCallback} from "../LogCallback";
import {LogRedirectionStrategy} from "../LogRedirectionStrategy";
import {ReturnCode} from "../ReturnCode";
import {SessionState} from "../SessionState";

export interface Session {

  getExecuteCallback(): ExecuteCallback;

  getLogCallback(): LogCallback;

  getSessionId(): number;

  getCreateTime(): Date;

  getStartTime(): Date;

  getEndTime(): Promise<Date>;

  getDuration(): Promise<number>;

  getArguments(): Array<String>;

  getCommand(): String;

  getAllLogs(waitTimeout ?: number): Array<Log>;

  getLogs(): Array<Log>;

  getAllLogsAsString(waitTimeout?: number): Promise<string>;

  getLogsAsString(): Promise<string>;

  getOutput(): Promise<string>;

  getState(): Promise<SessionState>;

  getReturnCode(): Promise<ReturnCode>;

  getFailStackTrace(): Promise<string>;

  getLogRedirectionStrategy(): LogRedirectionStrategy;

  thereAreAsynchronousMessagesInTransmit(): Promise<boolean>;

  isFFmpeg(): boolean;

  isFFprobe(): boolean;

  cancel(): void;

}
