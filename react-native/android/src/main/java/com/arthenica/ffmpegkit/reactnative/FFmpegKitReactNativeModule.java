/*
 * Copyright (c) 2021 Taner Sener
 *
 * This file is part of FFmpegKit.
 *
 * FFmpegKit is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * FFmpegKit is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with FFmpegKit.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.arthenica.ffmpegkit.reactnative;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.arthenica.ffmpegkit.AbiDetect;
import com.arthenica.ffmpegkit.ExecuteCallback;
import com.arthenica.ffmpegkit.FFmpegKit;
import com.arthenica.ffmpegkit.FFmpegKitConfig;
import com.arthenica.ffmpegkit.FFprobeKit;
import com.arthenica.ffmpegkit.Level;
import com.arthenica.ffmpegkit.LogRedirectionStrategy;
import com.arthenica.ffmpegkit.MediaInformation;
import com.arthenica.ffmpegkit.MediaInformationSession;
import com.arthenica.ffmpegkit.Session;
import com.arthenica.ffmpegkit.SessionState;
import com.arthenica.ffmpegkit.Signal;
import com.arthenica.ffmpegkit.Statistics;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

public class FFmpegKitReactNativeModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

  public static final String LIBRARY_NAME = "ffmpeg-kit-react-native";
  public static final String PLATFORM_NAME = "android";

  // LOG CLASS
  public static final String KEY_LOG_SESSION_ID = "sessionId";
  public static final String KEY_LOG_LEVEL = "level";
  public static final String KEY_LOG_MESSAGE = "message";

  // STATISTICS CLASS
  public static final String KEY_STATISTICS_SESSION_ID = "sessionId";
  public static final String KEY_STATISTICS_VIDEO_FRAME_NUMBER = "videoFrameNumber";
  public static final String KEY_STATISTICS_VIDEO_FPS = "videoFps";
  public static final String KEY_STATISTICS_VIDEO_QUALITY = "videoQuality";
  public static final String KEY_STATISTICS_SIZE = "size";
  public static final String KEY_STATISTICS_TIME = "time";
  public static final String KEY_STATISTICS_BITRATE = "bitrate";
  public static final String KEY_STATISTICS_SPEED = "speed";

  // SESSION CLASS
  public static final String KEY_SESSION_ID = "sessionId";
  public static final String KEY_SESSION_CREATE_TIME = "createTime";
  public static final String KEY_SESSION_START_TIME = "startTime";
  public static final String KEY_SESSION_COMMAND = "command";
  public static final String KEY_SESSION_LOG_REDIRECTION_STRATEGY = "logRedirectionStrategy";
  public static final String KEY_SESSION_TYPE = "type";
  public static final String KEY_SESSION_MEDIA_INFORMATION = "mediaInformation";

  // SESSION TYPE
  public static final int SESSION_TYPE_FFMPEG = 1;
  public static final int SESSION_TYPE_FFPROBE = 2;
  public static final int SESSION_TYPE_MEDIA_INFORMATION = 3;

  // EVENTS
  public static final String EVENT_LOG_CALLBACK_EVENT = "FFmpegKitLogCallbackEvent";
  public static final String EVENT_STATISTICS_CALLBACK_EVENT = "FFmpegKitStatisticsCallbackEvent";
  public static final String EVENT_EXECUTE_CALLBACK_EVENT = "FFmpegKitExecuteCallbackEvent";

  private static final int asyncWriteToPipeConcurrencyLimit = 10;

  private final ReactApplicationContext reactContext;
  private final AtomicBoolean logsEnabled;
  private final AtomicBoolean statisticsEnabled;
  private final ExecutorService asyncWriteToPipeExecutorService;

  public FFmpegKitReactNativeModule(@Nullable ReactApplicationContext reactContext) {
    super(reactContext);

    this.reactContext = reactContext;
    this.logsEnabled = new AtomicBoolean(false);
    this.statisticsEnabled = new AtomicBoolean(false);
    this.asyncWriteToPipeExecutorService = Executors.newFixedThreadPool(asyncWriteToPipeConcurrencyLimit);

    if (reactContext != null) {
      reactContext.addLifecycleEventListener(this);
    }
  }

  @NonNull
  @Override
  public String getName() {
    return "FFmpegKitReactNativeModule";
  }

  @Override
  public void onHostResume() {
  }

  @Override
  public void onHostPause() {
  }

  @Override
  public void onHostDestroy() {
    this.asyncWriteToPipeExecutorService.shutdown();
  }

  // ArchDetect

  @ReactMethod
  public void getArch(final Promise promise) {
    promise.resolve(AbiDetect.getAbi());
  }

  // FFmpegKitConfig

  @ReactMethod
  public void enableRedirection(final Promise promise) {
    enableLogs();
    enableStatistics();
    FFmpegKitConfig.enableRedirection();

    promise.resolve(null);
  }

  @ReactMethod
  public void disableRedirection(final Promise promise) {
    FFmpegKitConfig.disableRedirection();

    promise.resolve(null);
  }

  @ReactMethod
  public void enableLogs(final Promise promise) {
    enableLogs();

    promise.resolve(null);
  }

  @ReactMethod
  public void disableLogs(final Promise promise) {
    disableLogs();

    promise.resolve(null);
  }

  @ReactMethod
  public void enableStatistics(final Promise promise) {
    enableStatistics();

    promise.resolve(null);
  }

  @ReactMethod
  public void disableStatistics(final Promise promise) {
    disableStatistics();

    promise.resolve(null);
  }

  @ReactMethod
  public void setFontconfigConfigurationPath(final String path, final Promise promise) {
    FFmpegKitConfig.setFontconfigConfigurationPath(path);

    promise.resolve(null);
  }

  @ReactMethod
  public void setFontDirectory(final String fontDirectoryPath, final ReadableMap fontNameMap, final Promise promise) {
    if (reactContext != null) {
      FFmpegKitConfig.setFontDirectory(reactContext, fontDirectoryPath, toMap(fontNameMap));
      promise.resolve(null);
    } else {
      promise.reject("INVALID_CONTEXT", "React context is not initialized.");
    }
  }

  @ReactMethod
  public void setFontDirectoryList(final ReadableArray readableArray, final ReadableMap fontNameMap, final Promise promise) {
    if (reactContext != null) {
      FFmpegKitConfig.setFontDirectoryList(reactContext, Arrays.asList(toArgumentsArray(readableArray)), toMap(fontNameMap));
      promise.resolve(null);
    } else {
      promise.reject("INVALID_CONTEXT", "React context is not initialized.");
    }
  }

  @ReactMethod
  public void registerNewFFmpegPipe(final Promise promise) {
    if (reactContext != null) {
      promise.resolve(FFmpegKitConfig.registerNewFFmpegPipe(reactContext));
    } else {
      promise.reject("INVALID_CONTEXT", "React context is not initialized.");
    }
  }

  @ReactMethod
  public void closeFFmpegPipe(final String ffmpegPipePath, final Promise promise) {
    FFmpegKitConfig.closeFFmpegPipe(ffmpegPipePath);

    promise.resolve(null);
  }

  @ReactMethod
  public void getFFmpegVersion(final Promise promise) {
    promise.resolve(FFmpegKitConfig.getFFmpegVersion());
  }

  @ReactMethod
  public void isLTSBuild(final Promise promise) {
    promise.resolve(FFmpegKitConfig.isLTSBuild());
  }

  @ReactMethod
  public void getBuildDate(final Promise promise) {
    promise.resolve(FFmpegKitConfig.getBuildDate());
  }

  @ReactMethod
  public void setEnvironmentVariable(final String variableName, final String variableValue, final Promise promise) {
    FFmpegKitConfig.setEnvironmentVariable(variableName, variableValue);

    promise.resolve(null);
  }

  @ReactMethod
  public void ignoreSignal(final Double signalValue, final Promise promise) {
    Signal signal = null;

    if (signalValue.intValue() == Signal.SIGINT.getValue()) {
      signal = Signal.SIGINT;
    } else if (signalValue.intValue() == Signal.SIGQUIT.getValue()) {
      signal = Signal.SIGQUIT;
    } else if (signalValue.intValue() == Signal.SIGPIPE.getValue()) {
      signal = Signal.SIGPIPE;
    } else if (signalValue.intValue() == Signal.SIGTERM.getValue()) {
      signal = Signal.SIGTERM;
    } else if (signalValue.intValue() == Signal.SIGXCPU.getValue()) {
      signal = Signal.SIGXCPU;
    }

    if (signal != null) {
      FFmpegKitConfig.ignoreSignal(signal);

      promise.resolve(null);
    } else {
      promise.reject("INVALID_SIGNAL", "Signal value not supported.");
    }
  }

  @ReactMethod
  public void getLogLevel(final Promise promise) {
    promise.resolve(toInt(FFmpegKitConfig.getLogLevel()));
  }

  @ReactMethod
  public void setLogLevel(final Double level, final Promise promise) {
    if (level != null) {
      FFmpegKitConfig.setLogLevel(Level.from(level.intValue()));
      promise.resolve(null);
    } else {
      promise.reject("INVALID_LEVEL", "Invalid level value.");
    }
  }

  @ReactMethod
  public void getSessionHistorySize(final Promise promise) {
    promise.resolve(FFmpegKitConfig.getSessionHistorySize());
  }

  @ReactMethod
  public void setSessionHistorySize(final Double sessionHistorySize, final Promise promise) {
    if (sessionHistorySize != null) {
      FFmpegKitConfig.setSessionHistorySize(sessionHistorySize.intValue());
      promise.resolve(null);
    } else {
      promise.reject("INVALID_SIZE", "Invalid session history size value.");
    }
  }

  @ReactMethod
  public void getSession(final Double sessionId, final Promise promise) {
    if (sessionId != null) {
      final Session session = FFmpegKitConfig.getSession(sessionId.longValue());
      if (session == null) {
        promise.reject("SESSION_NOT_FOUND", "Session not found.");
      } else {
        promise.resolve(toMap(session));
      }
    } else {
      promise.reject("INVALID_SESSION", "Invalid session id.");
    }
  }

  @ReactMethod
  public void getLastSession(final Promise promise) {
    final Session session = FFmpegKitConfig.getLastSession();
    promise.resolve(toMap(session));
  }

  @ReactMethod
  public void getLastCompletedSession(final Promise promise) {
    final Session session = FFmpegKitConfig.getLastCompletedSession();
    promise.resolve(toMap(session));
  }

  @ReactMethod
  public void getSessions(final Promise promise) {
    promise.resolve(toSessionArray(FFmpegKitConfig.getSessions()));
  }

  @ReactMethod
  public void getSessionsByState(final Double sessionState, final Promise promise) {
    if (sessionState != null) {
      promise.resolve(toSessionArray(FFmpegKitConfig.getSessionsByState(toSessionState(sessionState.intValue()))));
    } else {
      promise.reject("INVALID_SESSION_STATE", "Invalid session state value.");
    }
  }

  @ReactMethod
  public void getLogRedirectionStrategy(final Promise promise) {
    promise.resolve(toInt(FFmpegKitConfig.getLogRedirectionStrategy()));
  }

  @ReactMethod
  public void setLogRedirectionStrategy(final Double logRedirectionStrategy, final Promise promise) {
    if (logRedirectionStrategy != null) {
      FFmpegKitConfig.setLogRedirectionStrategy(toLogRedirectionStrategy(logRedirectionStrategy.intValue()));
      promise.resolve(null);
    } else {
      promise.reject("INVALID_LOG_REDIRECTION_STRATEGY", "Invalid log redirection strategy value.");
    }
  }

  @ReactMethod
  public void messagesInTransmit(final Double sessionId, final Promise promise) {
    if (sessionId != null) {
      promise.resolve(FFmpegKitConfig.messagesInTransmit(sessionId.longValue()));
    } else {
      promise.reject("INVALID_SESSION", "Invalid session id.");
    }
  }

  @ReactMethod
  public void getPlatform(final Promise promise) {
    promise.resolve(PLATFORM_NAME);
  }

  @ReactMethod
  public void writeToPipe(final String inputPath, final String namedPipePath, final Promise promise) {
    final AsyncWriteToPipeTask asyncTask = new AsyncWriteToPipeTask(inputPath, namedPipePath, promise);
    asyncWriteToPipeExecutorService.submit(asyncTask);
  }

  @ReactMethod
  public void executeFFmpegWithArguments(final ReadableArray readableArray, final Promise promise) {
    FFmpegKit.executeAsync(toArgumentsArray(readableArray), session -> {
      promise.resolve(session.getSessionId());
    });
  }

  @ReactMethod
  public void executeFFmpegAsyncWithArguments(final ReadableArray readableArray, final Promise promise) {

    FFmpegKit.executeAsync(FFmpegKitReactNativeModule.toArgumentsArray(readableArray), new ExecuteCallback() {

      @Override
      public void apply(Session session) {
        final DeviceEventManagerModule.RCTDeviceEventEmitter jsModule = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);

        final WritableMap executeMap = Arguments.createMap();
        executeMap.putDouble("executionId", (double) session.getSessionId());
        executeMap.putInt("returnCode", session.getReturnCode().getValue());

        jsModule.emit(EVENT_EXECUTE_CALLBACK_EVENT, executeMap);
      }
    });
  }

  @ReactMethod
  public void executeFFprobeWithArguments(final ReadableArray readableArray, final String secondArgument, final String thirdArgument, final Promise promise) {

    Log.i(LIBRARY_NAME, String.format("FFprobe called with first argument %s", FFmpegKit.argumentsToString(toArgumentsArray(readableArray))));
    Log.i(LIBRARY_NAME, String.format("FFprobe called with second argument %s", secondArgument));
    Log.i(LIBRARY_NAME, String.format("FFprobe called with third argument %s", thirdArgument));

    FFprobeKit.executeAsync(toArgumentsArray(readableArray), session -> {
      promise.resolve(session.getReturnCode().getValue());
    });

    promise.resolve(12345);
  }

  @ReactMethod
  public void cancel() {
    FFmpegKit.cancel();
  }

  @ReactMethod
  public void cancelSession(final Double sessionId) {
    if (sessionId != null) {
      FFmpegKit.cancel(sessionId.longValue());
    } else {
      FFmpegKit.cancel();
    }
  }

  @ReactMethod
  public void getMediaInformation(final String path, final Promise promise) {
    FFprobeKit.getMediaInformationAsync(path, session -> {
      promise.resolve(toMap(((MediaInformationSession) session).getMediaInformation()));
    });
  }

  protected void enableLogs() {
    if (logsEnabled.compareAndSet(false, true)) {
      FFmpegKitConfig.enableLogCallback(this::emitLogEvent);
    }
  }

  protected void disableLogs() {
    if (logsEnabled.compareAndSet(true, false)) {
      FFmpegKitConfig.enableLogCallback(log -> {
      });
    }
  }

  protected void enableStatistics() {
    if (statisticsEnabled.compareAndSet(false, true)) {
      FFmpegKitConfig.enableStatisticsCallback(this::emitStatisticsEvent);
    }
  }

  protected void disableStatistics() {
    if (statisticsEnabled.compareAndSet(true, false)) {
      FFmpegKitConfig.enableStatisticsCallback(statistics -> {
      });
    }
  }

  protected void emitLogEvent(final com.arthenica.ffmpegkit.Log log) {
    final DeviceEventManagerModule.RCTDeviceEventEmitter jsModule = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);

    jsModule.emit(EVENT_LOG_CALLBACK_EVENT, toMap(log));
  }

  protected void emitStatisticsEvent(final Statistics statistics) {
    final DeviceEventManagerModule.RCTDeviceEventEmitter jsModule = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);

    jsModule.emit(EVENT_STATISTICS_CALLBACK_EVENT, toMap(statistics));
  }

  protected static int toInt(final Level level) {
    return (level == null) ? Level.AV_LOG_TRACE.getValue() : level.getValue();
  }

  protected static WritableMap toMap(final Session session) {
    if (session == null) {
      return null;
    }

    final WritableMap sessionMap = Arguments.createMap();

    sessionMap.putDouble(KEY_SESSION_ID, session.getSessionId());
    sessionMap.putDouble(KEY_SESSION_CREATE_TIME, toLong(session.getCreateTime()));
    sessionMap.putDouble(KEY_SESSION_START_TIME, toLong(session.getStartTime()));
    sessionMap.putString(KEY_SESSION_COMMAND, session.getCommand());
    sessionMap.putDouble(KEY_SESSION_LOG_REDIRECTION_STRATEGY, toInt(session.getLogRedirectionStrategy()));

    if (session.isFFprobe()) {
      if (session instanceof MediaInformationSession) {
        final MediaInformationSession mediaInformationSession = (MediaInformationSession) session;
        final MediaInformation mediaInformation = mediaInformationSession.getMediaInformation();
        if (mediaInformation != null) {
          sessionMap.putMap(KEY_SESSION_MEDIA_INFORMATION, toMap(mediaInformation));
        }
        sessionMap.putDouble(KEY_SESSION_TYPE, SESSION_TYPE_MEDIA_INFORMATION);
      } else {
        sessionMap.putDouble(KEY_SESSION_TYPE, SESSION_TYPE_FFPROBE);
      }
    } else {
      sessionMap.putDouble(KEY_SESSION_TYPE, SESSION_TYPE_FFMPEG);
    }

    return sessionMap;
  }

  protected static long toLong(final Date date) {
    if (date != null) {
      return date.getTime();
    } else {
      return 0;
    }
  }

  protected static int toInt(final LogRedirectionStrategy logRedirectionStrategy) {
    switch (logRedirectionStrategy) {
      case ALWAYS_PRINT_LOGS:
        return 1;
      case PRINT_LOGS_WHEN_NO_CALLBACKS_DEFINED:
        return 2;
      case PRINT_LOGS_WHEN_GLOBAL_CALLBACK_NOT_DEFINED:
        return 3;
      case PRINT_LOGS_WHEN_SESSION_CALLBACK_NOT_DEFINED:
        return 4;
      case NEVER_PRINT_LOGS:
      default:
        return 5;
    }
  }

  protected static LogRedirectionStrategy toLogRedirectionStrategy(final int value) {
    switch (value) {
      case 1:
        return LogRedirectionStrategy.ALWAYS_PRINT_LOGS;
      case 2:
        return LogRedirectionStrategy.PRINT_LOGS_WHEN_NO_CALLBACKS_DEFINED;
      case 3:
        return LogRedirectionStrategy.PRINT_LOGS_WHEN_GLOBAL_CALLBACK_NOT_DEFINED;
      case 4:
        return LogRedirectionStrategy.PRINT_LOGS_WHEN_SESSION_CALLBACK_NOT_DEFINED;
      case 5:
      default:
        return LogRedirectionStrategy.NEVER_PRINT_LOGS;
    }
  }

  protected static SessionState toSessionState(final int value) {
    switch (value) {
      case 1:
        return SessionState.CREATED;
      case 2:
        return SessionState.RUNNING;
      case 3:
        return SessionState.FAILED;
      case 4:
      default:
        return SessionState.COMPLETED;
    }
  }

  protected static WritableArray toStringArray(final List<String> list) {
    final WritableArray array = Arguments.createArray();

    if (list != null) {
      for (String item : list) {
        array.pushString(item);
      }
    }

    return array;
  }

  protected static Map<String, String> toMap(final ReadableMap readableMap) {
    final Map<String, String> map = new HashMap<>();

    if (readableMap != null) {
      final ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
      while (iterator.hasNextKey()) {
        final String key = iterator.nextKey();
        final ReadableType type = readableMap.getType(key);

        if (type == ReadableType.String) {
          map.put(key, readableMap.getString(key));
        }
      }
    }

    return map;
  }

  protected static WritableMap toMap(final com.arthenica.ffmpegkit.Log log) {
    final WritableMap logMap = Arguments.createMap();

    logMap.putDouble(KEY_LOG_SESSION_ID, log.getSessionId());
    logMap.putDouble(KEY_LOG_LEVEL, toInt(log.getLevel()));
    logMap.putString(KEY_LOG_MESSAGE, log.getMessage());

    return logMap;
  }

  protected static WritableMap toMap(final Statistics statistics) {
    final WritableMap statisticsMap = Arguments.createMap();

    if (statistics != null) {
      statisticsMap.putDouble(KEY_STATISTICS_SESSION_ID, statistics.getSessionId());
      statisticsMap.putDouble(KEY_STATISTICS_VIDEO_FRAME_NUMBER, statistics.getVideoFrameNumber());
      statisticsMap.putDouble(KEY_STATISTICS_VIDEO_FPS, statistics.getVideoFps());
      statisticsMap.putDouble(KEY_STATISTICS_VIDEO_QUALITY, statistics.getVideoQuality());
      statisticsMap.putDouble(KEY_STATISTICS_SIZE, statistics.getSize());
      statisticsMap.putDouble(KEY_STATISTICS_TIME, statistics.getTime());
      statisticsMap.putDouble(KEY_STATISTICS_BITRATE, statistics.getBitrate());
      statisticsMap.putDouble(KEY_STATISTICS_SPEED, statistics.getSpeed());
    }

    return statisticsMap;
  }

  protected static WritableArray toSessionArray(final List<Session> sessions) {
    final WritableArray sessionArray = Arguments.createArray();

    for (int i = 0; i < sessions.size(); i++) {
      sessionArray.pushMap(toMap(sessions.get(i)));
    }

    return sessionArray;
  }

  protected static WritableMap toMap(final MediaInformation mediaInformation) {
    WritableMap map = Arguments.createMap();

    if (mediaInformation != null) {
      JSONObject allProperties = mediaInformation.getAllProperties();
      if (allProperties != null) {
        map = toMap(allProperties);
      }
    }

    return map;
  }

  protected static WritableMap toMap(final JSONObject jsonObject) {
    final WritableMap map = Arguments.createMap();

    if (jsonObject != null) {
      Iterator<String> keys = jsonObject.keys();
      while (keys.hasNext()) {
        String key = keys.next();
        Object value = jsonObject.opt(key);
        if (value != null) {
          if (value instanceof JSONArray) {
            map.putArray(key, toList((JSONArray) value));
          } else if (value instanceof JSONObject) {
            map.putMap(key, toMap((JSONObject) value));
          } else if (value instanceof String) {
            map.putString(key, (String) value);
          } else if (value instanceof Number) {
            if (value instanceof Integer) {
              map.putInt(key, (Integer) value);
            } else {
              map.putDouble(key, ((Number) value).doubleValue());
            }
          } else if (value instanceof Boolean) {
            map.putBoolean(key, (Boolean) value);
          } else {
            Log.i(LIBRARY_NAME, String.format("Can not map json key %s using value %s:%s", key, value.toString(), value.getClass().toString()));
          }
        }
      }
    }

    return map;
  }

  protected static WritableArray toList(final JSONArray array) {
    final WritableArray list = Arguments.createArray();

    for (int i = 0; i < array.length(); i++) {
      Object value = array.opt(i);
      if (value != null) {
        if (value instanceof JSONArray) {
          list.pushArray(toList((JSONArray) value));
        } else if (value instanceof JSONObject) {
          list.pushMap(toMap((JSONObject) value));
        } else if (value instanceof String) {
          list.pushString((String) value);
        } else if (value instanceof Number) {
          if (value instanceof Integer) {
            list.pushInt((Integer) value);
          } else {
            list.pushDouble(((Number) value).doubleValue());
          }
        } else if (value instanceof Boolean) {
          list.pushBoolean((Boolean) value);
        } else {
          Log.i(LIBRARY_NAME, String.format("Can not map json value %s:%s", value.toString(), value.getClass().toString()));
        }
      }
    }

    return list;
  }

  protected static String[] toArgumentsArray(final ReadableArray readableArray) {
    final List<String> arguments = new ArrayList<>();
    for (int i = 0; i < readableArray.size(); i++) {
      final ReadableType type = readableArray.getType(i);

      if (type == ReadableType.String) {
        arguments.add(readableArray.getString(i));
      }
    }

    return arguments.toArray(new String[0]);
  }

}
