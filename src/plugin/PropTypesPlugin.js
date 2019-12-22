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
    if (!fs.existsSync(this._source)) {
      console.error(`The path ${this._source} does not exist.`);
      return;
    }

    if (!fs.existsSync(this._receiver)) {
      console.error(`The path ${this._receiver} does not exist.`);
      return;
    }

    return true;
  }

  _getPropTypes(receiver) {
    const source = fs.readFileSync(this._source);

    const propTypes = source.slice(
      getStringEndIndex(source, this._propTypesString),
      source.lastIndexOf('}') - 1,
    ).toString().trimRight();

    return propTypes.split(',')
      .filter((item) => !receiver.includes(item))
      .map((item) => { console.log(appendCommaToString(item)); return appendCommaToString(item)})
      .join('');
  }

  _getReceiverWithPropTypes() {
    const receiver = fs.readFileSync(this._receiver);
    const propTypes = this._getPropTypes(receiver);

    const beforePropTypes = receiver.slice(
      0,
      getStringEndIndex(receiver, this._propTypesString),
    );
    const afterPropTypes = receiver.slice(
      getStringEndIndex(receiver, this._propTypesString),
      receiver.length,
    );

    return beforePropTypes + propTypes + afterPropTypes;
  }

  _copyPropTypes() {
    if (!this._isConfigValid()) return;

    const receiverWithPropTypes = this._getReceiverWithPropTypes();
    fs.writeFileSync(this._receiver, receiverWithPropTypes);
  }

  apply(compiler) {
    compiler.hooks.afterEnvironment.tap('Hello World Plugin', (stats) => {
      this._copyPropTypes();
    });
  }
}

module.exports = PropTypesPlugin;
