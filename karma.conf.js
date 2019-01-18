module.exports = function(config) {
  config.set({
    frameworks: ["mocha", "karma-typescript"],

    files: [
      { pattern: "src/**/*.ts" },
      { pattern: "src/**/*.tsx" },
      { pattern: "test/*.ts" },
    ],

    preprocessors: {
      "**/*.ts": ["karma-typescript"],
      "**/*.tsx": ["karma-typescript"],
    },

    reporters: ["dots", "karma-typescript"],

    browsers: ["ChromeHeadless"],

    singleRun: true,
    
    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.json"
    }
  })
}