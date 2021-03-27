import {FFmpegSession} from "./FFmpegSession";
import {ExecuteCallback} from "./ExecuteCallback";
import {LogCallback} from "./LogCallback";
import {StatisticsCallback} from "./StatisticsCallback";
import {FFprobeSession} from "./FFprobeSession";
import {Signal} from "./Signal";
import {MediaInformationSession} from "./MediaInformationSession";
import {Level} from "./Level";
import {Session} from "./Session";
import {LogRedirectionStrategy} from "./LogRedirectionStrategy";

declare module 'ffmpeg-kit-react-native' {

  export class FFmpegKitConfig {

    static enableRedirection(): Promise<void>;

    static disableRedirection(): Promise<void>;

    static setFontconfigConfigurationPath(path: string): Promise<void>;

    static setFontDirectory(path: string, mapping?: { [key: string]: string }): Promise<void>;

    static setFontDirectoryList(fontDirectoryList: string[], mapping?: { [key: string]: string }): Promise<void>;

    static registerNewFFmpegPipe(): Promise<string>;

    static closeFFmpegPipe(ffmpegPipePath: string): Promise<void>;

    static getFFmpegVersion(): Promise<string>;

    static getVersion(): string;

    static isLTSBuild(): Promise<boolean>;

    static getBuildDate(): Promise<string>;

    static setEnvironmentVariable(name: string, value: string): Promise<void>;

    static ignoreSignal(signal: Signal): Promise<void>;

    static enableLogCallback(logCallback: LogCallback): void;

    static enableStatisticsCallback(statisticsCallback: StatisticsCallback): void;

    static enableExecuteCallback(executeCallback: ExecuteCallback): void;

    static getLogLevel(): Promise<Level>;

    static setLogLevel(level: Level): Promise<void>;

    static getSessionHistorySize(): Promise<number>;

    static setSessionHistorySize(sessionHistorySize: number): Promise<void>;

    static getSession(sessionId: number): Promise<Session>;

    static getLastSession(): Promise<Session>;

    static getLastCompletedSession(): Promise<Session>;

    static getSessions(): Promise<Session[]>;

    static getSessionsByState(state): Promise<Session[]>;

    static getLogRedirectionStrategy(): Promise<LogRedirectionStrategy>;

    static setLogRedirectionStrategy(logRedirectionStrategy: LogRedirectionStrategy): Promise<void>;

    static messagesInTransmit(sessionId: number): Promise<number>;

    static enableLogs(): Promise<void>;

    static disableLogs(): Promise<void>;

    static enableStatistics(): Promise<void>;

    static disableStatistics(): Promise<void>;

    static getPlatform(): string;

    static writeToPipe(inputPath: string, pipePath: string): Promise<number>;

  }

  export class FFmpegKit {

    static executeAsync(command: string, executeCallback?: ExecuteCallback, logCallback?: LogCallback, statisticsCallback?: StatisticsCallback): Promise<FFmpegSession>;

    static executeAsyncWithArguments(commandArguments: string[], executeCallback?: ExecuteCallback, logCallback?: LogCallback, statisticsCallback?: StatisticsCallback): Promise<FFmpegSession>;

    static cancel(sessionId?: number): Promise<void>;

    static listSessions(): Promise<FFmpegSession[]>;

    static parseArguments(command: string): string[];

    static argumentsToString(commandArguments: string[]): string;

  }

  export class FFprobeKit {

    static executeAsync(command: string, executeCallback?: ExecuteCallback, logCallback?: LogCallback): Promise<FFprobeSession>;

    static executeAsyncWithArguments(commandArguments: string[], executeCallback?: ExecuteCallback, logCallback?: LogCallback): Promise<FFprobeSession>;

    static getMediaInformationAsync(path: string, executeCallback?: ExecuteCallback, logCallback?: LogCallback, waitTimeout?: number): Promise<MediaInformationSession>;

    static getMediaInformationFromCommandAsync(command: string, executeCallback?: ExecuteCallback, logCallback?: LogCallback, waitTimeout?: number): Promise<MediaInformationSession>;

    static getMediaInformationFromCommandArgumentsAsync(commandArguments: string[], executeCallback?: ExecuteCallback, logCallback?: LogCallback, waitTimeout?: number): Promise<MediaInformationSession>;

    static listSessions(): Promise<FFprobeSession[]>;

  }

}
