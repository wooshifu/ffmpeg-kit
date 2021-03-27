declare type StreamInformation = import('../StreamInformation').StreamInformation;

export class MediaInformation {

  static readonly KEY_MEDIA_PROPERTIES: string;
  static readonly KEY_FILENAME: string;
  static readonly KEY_FORMAT: string;
  static readonly KEY_FORMAT_LONG: string;
  static readonly KEY_START_TIME: string;
  static readonly KEY_DURATION: string;
  static readonly KEY_SIZE: string;
  static readonly KEY_BIT_RATE: string;
  static readonly KEY_TAGS: string;

  constructor(properties: Record<string, any>);

  getFilename(): string;

  getFormat(): string;

  getLongFormat(): string;

  getDuration(): string;

  getStartTime(): string;

  getSize(): string;

  getBitrate(): string;

  getTags(): Record<string, any>;

  getStreams(): Array<StreamInformation>;

  getStringProperty(key: string): string;

  getNumberProperty(key: string): number;

  getProperties(key: string): Record<string, any>;

  getMediaProperties(): Record<string, any>;

  getAllProperties(): Record<string, any>;

}
