var Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('build/resources/main/static')
    .setPublicPath('/')

    .addEntry('app', './src/main/resources/static/js/index.js')

    .enableSingleRuntimeChunk()

    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())

    .enableSassLoader()
    .autoProvidejQuery()
;

var webpackConfig = Encore.getWebpackConfig();
module.exports = webpackConfig;
