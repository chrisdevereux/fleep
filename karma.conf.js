module.exports = function(config) {
  config.set({
    frameworks: ["mocha", "karma-typescript"],

    files: [
      { pattern: "src/**/*.ts" },
      { pattern: "src/**/*.tsx" },
    ],

    exclude: [
      '**/__stories__/**'
    ],

    preprocessors: {
      "**/*.ts": ["karma-typescript"],
      "**/*.tsx": ["karma-typescript"],
    },

    reporters: ["dots", "karma-typescript"],

    browsers: ["ChromeHeadless"],

    singleRun: true,
    
    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.json",
      reports: {
        html: { subdirectory: 'html' },
        lcovonly: { subdirectory: 'lcov' }
      }
    },
  })
}