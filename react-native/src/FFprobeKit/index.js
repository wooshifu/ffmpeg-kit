import {NativeModules} from 'react-native';

const {FFmpegKitReactNativeModule} = NativeModules;

export class FFprobeKitReactNative {

  async executeAsync(command, executeCallback, logCallback) {
    let executionId = await FFmpegKitReactNativeModule.executeFFmpegAsyncWithArguments(this.parseArguments(command));
    executeCallbackMap.set(executionId, executeCallback);
    return executionId;
  }

  async executeAsyncWithArguments(commandArguments, executeCallback, logCallback) {
    let executionId = await FFmpegKitReactNativeModule.executeFFmpegAsyncWithArguments(commandArguments);
    executeCallbackMap.set(executionId, executeCallback);
    return executionId;
  }

  /**
   * Returns media information for given file.
   *
   * @param path path or uri of media file
   * @return media information class
   */
  getMediaInformationAsync(path, executeCallback, logCallback, waitTimeout) {
    return FFmpegKitReactNativeModule.getMediaInformation(path).then(properties => new MediaInformation(properties));
  }

  getMediaInformationFromCommandAsync(command, executeCallback, logCallback, waitTimeout) {
    //@TODO implement this later
  }

  getMediaInformationFromCommandArgumentsAsync(commandArguments, executeCallback, logCallback, waitTimeout) {
    //@TODO implement this later
  }

  listSessions() {
    return FFmpegKitReactNativeModule.listSessions();
  }

}
