import {AbstractSession} from "../AbstractSession";
import {Statistics} from "../Statistics";
import {LogRedirectionStrategy} from "../LogRedirectionStrategy";
import {Session} from "../Session";
import {StatisticsCallback} from "../StatisticsCallback";

export class FFmpegSession extends AbstractSession implements Session {

  constructor(sessionId: number, createTime: Date, startTime: Date, command: string, argumentsArray: Array<string>, logRedirectionStrategy: LogRedirectionStrategy);

  getStatisticsCallback(): StatisticsCallback;

  getAllStatistics(waitTimeout?: number): Promise<Array<Statistics>>;

  getStatistics(): Promise<Array<Statistics>>;

  getLastReceivedStatistics(): Promise<Statistics>;

  isFFmpeg(): boolean;

  isFFprobe(): boolean;

}
