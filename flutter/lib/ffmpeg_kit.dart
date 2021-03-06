
import 'dart:async';

import 'package:flutter/services.dart';

class FFmpegKit {
  static const MethodChannel _channel =
      const MethodChannel('ffmpeg_kit');

  static Future<String> getPlatformVersion() async {
    final String version = await _channel.invokeMethod('getPlatformVersion');
    return version;
  }
}
