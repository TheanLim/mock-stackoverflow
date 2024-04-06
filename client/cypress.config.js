const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        dbTeardown(){
            require('child_process').execSync('node ../server/destroy.js');
            return null;
        },
        dbSeed(){
            require('child_process').execSync('node ../server/init.js');
            return null;
        }
      });
    },
  },

  component: {
    devServer: {
        framework: "create-react-app",
        bundler: "webpack",
    },
  },
});
