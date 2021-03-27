import {NativeEventEmitter, NativeModules} from 'react-native';
import {FFmpegSession} from "../FFmpegSession";
import {FFprobeSession} from "../FFprobeSession";
import {FFmpegKitReactNative} from "../FFmpegKit";

const {FFmpegKitReactNativeModule} = NativeModules;

const eventLog = "RNFFmpegLogCallback";
const eventStatistics = "RNFFmpegStatisticsCallback";
const eventExecute = "RNFFmpegExecuteCallback";
const executeCallbackMap = new Map()

function mapToSession(sessionMap) {
  if (sessionMap !== undefined) {
    switch (sessionMap.type) {
      case 2:
        return mapToFFprobeSession(sessionMap);
      case 3:
        return mapToMediaInformationSession(sessionMap);
      case 1:
      default:
        return mapToFFmpegSession(sessionMap);
    }
  } else {
    return undefined;
  }
}

function mapToFFmpegSession(sessionMap) {
  return new FFmpegSession(sessionMap.sessionId,
    sessionMap.createTime,
    sessionMap.startTime,
    sessionMap.command,
    FFmpegKitReactNative.parseArguments(sessionMap.command),
    sessionMap.logRedirectionStrategy);
}

function mapToFFprobeSession(sessionMap) {
  return new FFprobeSession(sessionMap.sessionId,
    sessionMap.createTime,
    sessionMap.startTime,
    sessionMap.command,
    FFmpegKitReactNative.parseArguments(sessionMap.command),
    sessionMap.logRedirectionStrategy);
}

function mapToMediaInformationSession(sessionMap) {
  const mediaInformationSession = new MediaInformationSession(sessionMap.sessionId,
    sessionMap.createTime,
    sessionMap.startTime,
    sessionMap.command,
    FFmpegKitReactNative.parseArguments(sessionMap.command),
    sessionMap.logRedirectionStrategy);

  mediaInformationSession.setMediaInformation(sessionMap.mediaInformation)

  return mediaInformationSession;
}

function getVersion() {
  return "4.4";
}

export class FFmpegKitReactNativeConfig {

  #logCallback = undefined;
  #statisticsCallback = undefined;
  #executeCallback = undefined;

  constructor() {
    const eventEmitter = new NativeEventEmitter(FFmpegKitReactNativeModule);
    this.eventListener = eventEmitter.addListener('EventReminder', process);

    function process(event) {
      console.log(event.eventProperty) // "someValue"
    }

    async function initialize() {
      const version = getVersion();
      const platform = await FFmpegKitReactNativeModule.getPlatform();
      const arch = await FFmpegKitReactNativeModule.getArch();
      await FFmpegKitReactNativeModule.enableRedirection();

      return `${platform}-${arch}-${version}`;
    }

    console.log("Loading ffmpeg-kit-react-native.");
    initialize().then(fullPlatformName => {
      console.log(`Loaded ffmpeg-kit-react-native-${fullPlatformName}.`);
    });
  }

  async enableRedirection() {
    return FFmpegKitReactNativeModule.enableRedirection();
  }

  async disableRedirection() {
    return FFmpegKitReactNativeModule.disableRedirection();
  }

  setFontconfigConfigurationPath(path) {
    return FFmpegKitReactNativeModule.setFontconfigConfigurationPath(path);
  }

  setFontDirectory(path, mapping) {
    return FFmpegKitReactNativeModule.setFontDirectory(path, mapping);
  }

  setFontDirectoryList(fontDirectoryList, mapping) {
    return FFmpegKitReactNativeModule.setFontDirectory(fontDirectoryList, mapping);
  }

  registerNewFFmpegPipe() {
    return FFmpegKitReactNativeModule.registerNewFFmpegPipe();
  }

  closeFFmpegPipe(ffmpegPipePath) {
    return FFmpegKitReactNativeModule.closeFFmpegPipe(ffmpegPipePath);
  }

  getFFmpegVersion() {
    return FFmpegKitReactNativeModule.getFFmpegVersion();
  }

  getVersion() {
    return getVersion();
  }

  isLTSBuild() {
    return FFmpegKitReactNativeModule.isLTSBuild();
  }

  getBuildDate() {
    return FFmpegKitReactNativeModule.getBuildDate();
  }

  setEnvironmentVariable(name, value) {
    return FFmpegKitReactNativeModule.setEnvironmentVariable(name, value);
  }

  ignoreSignal(signal) {
    return FFmpegKitReactNativeModule.ignoreSignal(signal);
  }

  enableLogCallback(logCallback) {
    this.#logCallback = logCallback;
  }

  enableStatisticsCallback(statisticsCallback) {
    this.#statisticsCallback = statisticsCallback;
  }

  enableExecuteCallback(executeCallback) {
    this.#executeCallback = executeCallback;
  }

  getLogLevel() {
    return FFmpegKitReactNativeModule.getLogLevel();
  }

  setLogLevel(logLevel) {
    return FFmpegKitReactNativeModule.setLogLevel(logLevel);
  }

  getSessionHistorySize() {
    return FFmpegKitReactNativeModule.getSessionHistorySize();
  }

  setSessionHistorySize(sessionHistorySize) {
    return FFmpegKitReactNativeModule.setSessionHistorySize(sessionHistorySize);
  }

  async getSession(sessionId) {
    if (sessionId === undefined) {
      return undefined;
    } else {
      const sessionMap = await FFmpegKitReactNativeModule.getSession(sessionId);
      return mapToSession(sessionMap);
    }
  }

  async getLastSession() {
    const sessionMap = await FFmpegKitReactNativeModule.getLastSession();
    return mapToSession(sessionMap);
  }

  async getLastCompletedSession() {
    const sessionMap = await FFmpegKitReactNativeModule.getLastCompletedSession();
    return mapToSession(sessionMap);
  }

  async getSessions() {
    const sessionArray = await FFmpegKitReactNativeModule.getSessions();
    return sessionArray.map(mapToSession);
  }

  async getSessionsByState(sessionState) {
    const sessionArray = await FFmpegKitReactNativeModule.getSessionsByState(sessionState);
    return sessionArray.map(mapToSession);
  }

  async getLogRedirectionStrategy() {
    return FFmpegKitReactNativeModule.getLogRedirectionStrategy();
  }

  async setLogRedirectionStrategy(logRedirectionStrategy) {
    return FFmpegKitReactNativeModule.setLogRedirectionStrategy(logRedirectionStrategy);
  }

  async messagesInTransmit(sessionId) {
    const sessionMap = await FFmpegKitReactNativeModule.messagesInTransmit(sessionId);
    return mapToSession(sessionMap);
  }

  // THE FOLLOWING TWO METHODS ARE REACT-NATIVE SPECIFIC

  async enableLogs() {
    return FFmpegKitReactNativeModule.enableLogs();
  }

  async disableLogs() {
    return FFmpegKitReactNativeModule.disableLogs();
  }

  async enableStatistics() {
    return FFmpegKitReactNativeModule.enableStatistics();
  }

  async disableStatistics() {
    return FFmpegKitReactNativeModule.disableStatistics();
  }

  async getPlatform() {
    return FFmpegKitReactNativeModule.getPlatform();
  }

  async writeToPipe(inputPath, pipePath) {
    return FFmpegKitReactNativeModule.writeToPipe(inputPath, pipePath);
  }

}
