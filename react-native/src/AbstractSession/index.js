import {NativeModules} from 'react-native';

import {Session} from "../Session";

const {FFmpegKitReactNativeModule} = NativeModules;

class AbstractSession extends Session {

  /**
   * Defines how long default "getAll" methods wait, in milliseconds.
   */
  static DEFAULT_TIMEOUT_FOR_ASYNCHRONOUS_MESSAGES_IN_TRANSMIT = 5000;

  /**
   * Session identifier.
   */
  #sessionId;

  /**
   * Date and time the session was created.
   */
  #createTime;

  /**
   * Date and time the session was started.
   */
  #startTime;

  /**
   * Command string.
   */
  #command;

  /**
   * Command arguments as an array.
   */
  #argumentsArray;

  /**
   * Session specific log redirection strategy.
   */
  #logRedirectionStrategy;

  constructor(sessionId, createTime, startTime, command, argumentsArray, logRedirectionStrategy) {
    super();

    this.#sessionId = sessionId;
    this.#createTime = createTime;
    this.#startTime = startTime;
    this.#command = command;
    this.#argumentsArray = argumentsArray;
    this.#logRedirectionStrategy = logRedirectionStrategy;
  }

  getExecuteCallback() {
    //@TODO implement this later
  }

  getLogCallback() {
    //@TODO implement this later
  }

  getSessionId() {
    return this.#sessionId;
  }

  getCreateTime() {
    return this.#createTime;
  }

  getStartTime() {
    return this.#startTime;
  }

  getEndTime() {
    //@TODO implement this later
  }

  getDuration() {
    //@TODO implement this later
  }

  getArguments() {
    return this.#argumentsArray;
  }

  getCommand() {
    return this.#command;
  }

  getAllLogs(waitTimeout) {
    //@TODO implement this later
  }

  getLogs() {
    //@TODO implement this later
  }

  getAllLogsAsString(waitTimeout) {
    //@TODO implement this later
  }

  async getLogsAsString() {
    let logs = await this.getLogs();

    let concatenatedString = '';

    logs.forEach(log => concatenatedString += log.getMessage());

    return concatenatedString;
  }

  getOutput() {
    return this.getAllLogsAsString();
  }

  getState() {
    //@TODO implement this later
  }

  getReturnCode() {
    //@TODO implement this later
  }

  getFailStackTrace() {
    //@TODO implement this later
  }

  getLogRedirectionStrategy() {
    return this.#logRedirectionStrategy;
  }

  thereAreAsynchronousMessagesInTransmit() {
    //@TODO implement this later
  }

  isFFmpeg() {
    return false;
  }

  isFFprobe() {
    return false;
  }

  cancel() {
  }

}

export {
  AbstractSession
}
