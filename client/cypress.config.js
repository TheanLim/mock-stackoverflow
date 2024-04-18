const { defineConfig } = require("cypress");

module.exports = defineConfig({
    video: true,
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
        charts: true,
        reportPageTitle: 'Stackoverflow Continuous Integration Report',
        embeddedScreenshots: true,
        inlineAssets: true,
        saveAllAttempts: false,
        videoOnFailOnly: true,
    },
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
            require('cypress-mochawesome-reporter/plugin')(on);
            on('task', {
                dbTeardown() {
                    require('child_process').execSync('node ../server/destroy.js');
                    return null;
                },
                dbSeed() {
                    require('child_process').execSync('node ../server/init.js');
                    return null;
                }
            });
        },
    },

    component: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
            require('cypress-mochawesome-reporter/plugin')(on);
        },
        devServer: {
            framework: "create-react-app",
            bundler: "webpack",
        },
    },
});
