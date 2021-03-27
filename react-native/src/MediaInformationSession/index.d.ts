import {FFprobeSession} from "../FFprobeSession";
import {MediaInformation} from "../MediaInformation";

export class MediaInformationSession extends FFprobeSession {

  constructor(sessionId: number, createTime: Date, startTime: Date, command: string, argumentsArray: Array<string>);

  getMediaInformation(): MediaInformation;

  setMediaInformation(mediaInformation: MediaInformation): void;

}
