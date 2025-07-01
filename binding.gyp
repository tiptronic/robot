{
  'targets': [{
    'target_name': 'robotjs',
    'include_dirs': [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
    "cflags!": [ "-fno-exceptions" ],
    "cflags_cc!": [ "-fno-exceptions" ],
    'conditions': [
      ['OS == "mac"', {
        'include_dirs': [
          'System/Library/Frameworks/CoreFoundation.Framework/Headers',
          'System/Library/Frameworks/Carbon.Framework/Headers',
          'System/Library/Frameworks/ApplicationServices.framework/Headers',
          'System/Library/Frameworks/OpenGL.framework/Headers',
        ],
        'link_settings': {
          'libraries': [
            '-framework Carbon',
            '-framework CoreFoundation',
            '-framework ApplicationServices',
            '-framework OpenGL'
          ]
        },
        'xcode_settings': {
          'MACOSX_DEPLOYMENT_TARGET': '10.15',
          'OTHER_CPLUSPLUSFLAGS': ['-std=c++17'],
          'OTHER_LDFLAGS': ['-Wl,-undefined,dynamic_lookup'],
          'CLANG_CXX_LANGUAGE_STANDARD': 'c++17',
          'CLANG_CXX_LIBRARY': 'libc++',
          'ARCHS': ['x86_64', 'arm64']
        }
      }],
    #   ['OS=="mac"', {
    #       "xcode_settings": {
    #         "ARCHS": ["x86_64", "arm64"]
    #       }
    #     }]
      ['OS == "linux"', {
        'link_settings': {
          'libraries': [
            '-lpng',
            '-lz',
            '-lX11',
            '-lXtst'
          ]
        },
        'sources': [
          'src/xdisplay.c'
        ]
      }],
      ["OS=='win'", {
        'defines': ['IS_WINDOWS']
      }]
    ],
    'sources': [
      'src/robotjs.cc',
      'src/deadbeef_rand.c',
      'src/mouse.c',
      'src/keypress.c',
      'src/keycode.c',
      'src/screen.c',
      'src/screengrab.c',
      'src/snprintf.c',
      'src/MMBitmap.c'
    ],
    'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
  }]
}