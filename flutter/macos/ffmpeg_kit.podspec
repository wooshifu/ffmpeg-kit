Pod::Spec.new do |s|
  s.name             = 'ffmpeg_kit'
  s.version          = '4.4.0'
  s.summary          = 'FFmpeg Kit Flutter plugin for iOS.'
  s.description      = 'Based on FFmpeg Kit for iOS.'

  s.homepage         = 'https://github.com/tanersener/ffmpeg-kit'
  s.license          = { :file => '../LICENSE' }
  s.author           = { 'Taner Sener' => 'tanersener@gmail.com' }

  s.requires_arc     = true
  s.static_framework = true

  s.source              = { :path => '.' }
  s.source_files        = 'Classes/**/*'
  s.public_header_files = 'Classes/**/*.h'

  s.dependency 'FlutterMacOS'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }

  s.platform = :osx, '10.11'

end
