import {AbstractSession} from "../AbstractSession";

class FFprobeSession extends AbstractSession {

  constructor(sessionId, createTime, startTime, command, argumentsArray, logRedirectionStrategy) {
    super(sessionId, createTime, startTime, command, argumentsArray, logRedirectionStrategy);
  }

  isFFmpeg() {
    return false;
  }

  isFFprobe() {
    return true;
  }

}

export {
  FFprobeSession
}
