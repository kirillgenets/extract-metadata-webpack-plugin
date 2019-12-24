const fs = require('fs');

const getStringEndIndex = (source, str) => source.indexOf(str) + str.length;

const appendCommaToString = (string) => (string[string.length - 1] === ',' ? string : `${string},`);

class PropTypesPlugin {
  constructor(config) {
    this._source = config.source;
    this._receiver = config.receiver;

    this._propTypesString = 'propTypes = {';
  }

  _isConfigValid() {
    return true;
  }

  _getPropTypes(receiver) {
    const propTypes = this._source.reduce((acc, path) => {
      const source = fs.readFileSync(path).toString();
      const currentPropTypes = source.slice(
        getStringEndIndex(source, this._propTypesString),
        source.lastIndexOf('}') - 1,
      ).trimRight();

      return acc += currentPropTypes;
    }, '');

    return propTypes.split(',')
      .filter((item) => !receiver.includes(item))
      .map((item) => appendCommaToString(item))
      .join('');
  }

  _createMetaData() {
    if (!this._isConfigValid()) return;

    console.log(fr.readirSync(this._source));
  }

  apply(compiler) {
    compiler.hooks.afterEnvironment.tap('Hello World Plugin', (stats) => {
      this._createMetaData();
    });
  }
}

module.exports = PropTypesPlugin;
