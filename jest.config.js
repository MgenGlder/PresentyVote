module.exports = {
    preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js"
    },
    moduleFileExtensions: [
        'js',
        'ts',
        'json',
        'vue'
    ],
    transformIgnorePatterns: [
        "/node_modules/vuetify/"
    ],
    transform: {
        '.*\\.(vue)$': 'vue-jest'
    },
    testURL: 'http://localhost/'
  }
  
  //https://github.com/nrwl/nx/issues/812

  // To get to work, remove the transformIgnorePatterns property