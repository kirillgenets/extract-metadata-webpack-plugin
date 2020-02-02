# extract-metadata-webpack-plugin
This plugin does the same as react-docgen, but faster.

## How to install

With NPM:
```
npm i extract-metadata-webpack-plugin --save-dev
```

With Yarn:
```
yarn add extract-metadata-webpack-plugin --dev
```

## How to use
Just import the plugin from node_modules and write the config like that:
```
const ExtractMetadataPlugin = require('extract-metadata-webpack-plugin');
...
...
module.exports = {
  ...
  plugins: [
    new ExtractMetadataPlugin({
      source: 'src/**/*.jsx',
      receiver: 'lib/metadata.json'
    })
  ],
}
```
