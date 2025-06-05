const { defineConfig } = require("cypress");
const webpack = require("@cypress/webpack-preprocessor");

module.exports = defineConfig({
  e2e: {
    viewportWidth: 1440,   
    viewportHeight: 900,   
    setupNodeEvents(on, config) {
      const options = {
        webpackOptions: {
          resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
          },
          module: {
            rules: [
              {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
              },
              {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"],
                  },
                },
              },
            ],
          },
        },
      };

      on("file:preprocessor", webpack(options));
      return config;
    },
  },
});
