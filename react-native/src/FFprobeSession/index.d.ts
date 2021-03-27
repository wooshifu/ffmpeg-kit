import {AbstractSession} from "../AbstractSession";
import {LogRedirectionStrategy} from "../LogRedirectionStrategy";
import {Session} from "../Session";

export class FFprobeSession extends AbstractSession implements Session {

  constructor(sessionId: number, createTime: Date, startTime: Date, command: string, argumentsArray: Array<string>, logRedirectionStrategy: LogRedirectionStrategy);

  isFFmpeg(): boolean;

  isFFprobe(): boolean;

}
