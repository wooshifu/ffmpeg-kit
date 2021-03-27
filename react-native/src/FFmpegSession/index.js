import {AbstractSession} from "../AbstractSession";

class FFmpegSession extends AbstractSession {

  constructor(sessionId, createTime, startTime, command, argumentsArray, logRedirectionStrategy) {
    super(sessionId, createTime, startTime, command, argumentsArray, logRedirectionStrategy);
  }

  getStatisticsCallback() {
    //@TODO implement this later
  }

  /**
   * Returns all statistics entries generated for this session. If there are asynchronous
   * messages that are not delivered yet, this method waits for them until the given timeout.
   *
   * @param waitTimeout wait timeout for asynchronous messages in milliseconds
   * @return list of statistics entries generated for this session
   */
  getAllStatistics(waitTimeout) {
    //@TODO implement this later
  }

  /**
   * Returns all statistics entries delivered for this session. Note that if there are
   * asynchronous messages that are not delivered yet, this method will not wait for
   * them and will return immediately.
   *
   * @return list of statistics entries received for this session
   */
  getStatistics() {
    //@TODO implement this later
  }

  /**
   * Returns the last received statistics entry.
   *
   * @return the last received statistics entry or null if there are not any statistics entries
   * received
   */
  getLastReceivedStatistics() {
    let statistics = this.getStatistics();

    if (statistics.length > 0) {
      return statistics[0];
    } else {
      return undefined;
    }
  }

  isFFmpeg() {
    return true;
  }

  isFFprobe() {
    return false;
  }

}

export {
  FFmpegSession
}
