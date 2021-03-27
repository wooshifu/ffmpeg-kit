import {NativeModules} from 'react-native';

const {FFmpegKitReactNativeModule} = NativeModules;

class ArchDetect {

  static async getArch() {
    return FFmpegKitReactNativeModule.getArch();
  }

}

export {
  ArchDetect
}
