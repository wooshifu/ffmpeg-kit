import {NativeModules} from 'react-native';

const {FFmpegKitReactNativeModule} = NativeModules;

export class FFmpegKitReactNative {

  /**
   * Asynchronously executes FFmpeg command provided.
   *
   * @param command FFmpeg command
   * @param executeCallback callback to receive execution result
   * @returns returns a unique id that represents this execution
   */
  async executeAsync(command, executeCallback, logCallback, statisticsCallback) {
    let sessionId = await FFmpegKitReactNativeModule.executeFFmpegAsyncWithArguments(this.parseArguments(command));
    // executeCallbackMap.set(sessionId, executeCallback);
    return sessionId;
  }

  /**
   * Asynchronously executes FFmpeg with arguments provided.
   *
   * @param commandArguments FFmpeg command options/arguments as string array
   * @param executeCallback callback to receive execution result
   * @returns returns a unique id that represents this execution
   */
  async executeAsyncWithArguments(commandArguments, executeCallback, logCallback, statisticsCallback) {
    let sessionId = await FFmpegKitReactNativeModule.executeFFmpegAsyncWithArguments(commandArguments);
    // executeCallbackMap.set(executionId, executeCallback);
    return sessionId;
  }

  /**
   * Cancels an ongoing operation.
   */
  cancel(sessionId) {
    if (sessionId === undefined) {
      FFmpegKitReactNativeModule.cancel();
    } else {
      FFmpegKitReactNativeModule.cancelSession(sessionId);
    }
  }

  /**
   * Lists ongoing executions.
   *
   * @return list of ongoing executions
   */
  listSessions() {
    return FFmpegKitReactNativeModule.listSessions();
  }

  /**
   * Parses the given command into arguments.
   *
   * @param command string command
   * @return array of arguments
   */
  parseArguments(command) {
    let argumentList = [];
    let currentArgument = "";

    let singleQuoteStarted = 0;
    let doubleQuoteStarted = 0;

    for (let i = 0; i < command.length; i++) {
      let previousChar;
      if (i > 0) {
        previousChar = command.charAt(i - 1);
      } else {
        previousChar = null;
      }
      let currentChar = command.charAt(i);

      if (currentChar === ' ') {
        if (singleQuoteStarted === 1 || doubleQuoteStarted === 1) {
          currentArgument += currentChar;
        } else if (currentArgument.length > 0) {
          argumentList.push(currentArgument);
          currentArgument = "";
        }
      } else if (currentChar === '\'' && (previousChar == null || previousChar !== '\\')) {
        if (singleQuoteStarted === 1) {
          singleQuoteStarted = 0;
        } else if (doubleQuoteStarted === 1) {
          currentArgument += currentChar;
        } else {
          singleQuoteStarted = 1;
        }
      } else if (currentChar === '\"' && (previousChar == null || previousChar !== '\\')) {
        if (doubleQuoteStarted === 1) {
          doubleQuoteStarted = 0;
        } else if (singleQuoteStarted === 1) {
          currentArgument += currentChar;
        } else {
          doubleQuoteStarted = 1;
        }
      } else {
        currentArgument += currentChar;
      }
    }

    if (currentArgument.length > 0) {
      argumentList.push(currentArgument);
    }

    return argumentList;
  }

  argumentsToString(commandArguments) {
    //@TODO implement this
  }

}
