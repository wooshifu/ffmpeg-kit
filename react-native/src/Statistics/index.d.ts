export class Statistics {

  constructor(sessionId: number, videoFrameNumber: number, videoFps: number, videoQuality: number, size: number, time: number, bitrate: number, speed: number);

  getSessionId(): number;

  setSessionId(sessionId: number): void;

  getVideoFrameNumber(): number;

  setVideoFrameNumber(videoFrameNumber: number): void;

  getVideoFps(): number;

  setVideoFps(videoFps: number): void;

  getVideoQuality(): number;

  setVideoQuality(videoQuality: number): void;

  getSize(): number;

  setSize(size: number): void;

  getTime(): number;

  setTime(time: number): void;

  getBitrate(): number;

  setBitrate(bitrate: number): void;

  getSpeed(): number;

  setSpeed(speed: number): void;

}
