import {FFprobeSession} from "../FFprobeSession";
import {LogRedirectionStrategy} from "../LogRedirectionStrategy";

class MediaInformationSession extends FFprobeSession {
  #mediaInformation;

  constructor(sessionId, createTime, startTime, command, argumentsArray) {
    super(sessionId, createTime, startTime, command, argumentsArray, LogRedirectionStrategy.NEVER_PRINT_LOGS);
  }

  getMediaInformation() {
    return this.#mediaInformation;
  }

  setMediaInformation(mediaInformation) {
    this.#mediaInformation = mediaInformation;
  }

}

export {
  MediaInformationSession
}
