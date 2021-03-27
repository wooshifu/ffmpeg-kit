import {Session} from "../Session";
import {Log} from "../Log";
import {ExecuteCallback} from "../ExecuteCallback";
import {LogCallback} from "../LogCallback";
import {LogRedirectionStrategy} from "../LogRedirectionStrategy";
import {SessionState} from "../SessionState";
import {ReturnCode} from "../ReturnCode";

export abstract class AbstractSession implements Session {

  protected constructor(sessionId: number, createTime: Date, startTime: Date, command: string, argumentsArray: Array<string>, logRedirectionStrategy: LogRedirectionStrategy);

  getExecuteCallback(): ExecuteCallback;

  getLogCallback(): LogCallback;

  getSessionId(): number;

  getCreateTime(): Date;

  getStartTime(): Date;

  getEndTime(): Promise<Date>;

  getDuration(): Promise<number>;

  getArguments(): Array<string>;

  getCommand(): string;

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
