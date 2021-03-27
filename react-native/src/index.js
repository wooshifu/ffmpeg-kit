import {FFmpegKitReactNative} from './FFmpegKit';
import {FFmpegKitReactNativeConfig} from './FFmpegKitConfig';
import {FFprobeKitReactNative} from './FFprobeKit';

export const FFmpegKitConfig = new FFmpegKitReactNativeConfig();
export const FFmpegKit = new FFmpegKitReactNative();
export const FFprobeKit = new FFprobeKitReactNative();

export default FFmpegKit;
