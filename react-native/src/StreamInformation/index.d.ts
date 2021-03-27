export class StreamInformation {

  static readonly KEY_INDEX: string;
  static readonly KEY_TYPE: string;
  static readonly KEY_CODEC: string;
  static readonly KEY_CODEC_LONG: string;
  static readonly KEY_FORMAT: string;
  static readonly KEY_WIDTH: string;
  static readonly KEY_HEIGHT: string;
  static readonly KEY_BIT_RATE: string;
  static readonly KEY_SAMPLE_RATE: string;
  static readonly KEY_SAMPLE_FORMAT: string;
  static readonly KEY_CHANNEL_LAYOUT: string;
  static readonly KEY_SAMPLE_ASPECT_RATIO: string;
  static readonly KEY_DISPLAY_ASPECT_RATIO: string;
  static readonly KEY_AVERAGE_FRAME_RATE: string;
  static readonly KEY_REAL_FRAME_RATE: string;
  static readonly KEY_TIME_BASE: string;
  static readonly KEY_CODEC_TIME_BASE: string;
  static readonly KEY_TAGS: string;

  constructor(properties: Record<string, any>);

  getIndex(): number;

  getType(): string;

  getCodec(): string;

  getFullCodec(): string;

  getFormat(): string;

  getWidth(): number;

  getHeight(): number;

  getBitrate(): string;

  getSampleRate(): string;

  getSampleFormat(): string;

  getChannelLayout(): string;

  getSampleAspectRatio(): string;

  getDisplayAspectRatio(): string;

  getAverageFrameRate(): string;

  getRealFrameRate(): string;

  getTimeBase(): string;

  getCodecTimeBase(): string;

  getTags(): Record<string, any>;

  getStringProperty(key): string;

  getNumberProperty(key): number;

  getProperties(key): Record<string, any>;

  getAllProperties(): Record<string, any>;

}
