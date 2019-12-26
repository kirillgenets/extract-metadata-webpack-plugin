const fs = require('fs');
const path = require('path');

const RED_CONSOLE_COLOR = '\x1b[31m';
const COMPLICATED_PROP_TYPES = [
  'shape',
  'oneOf',
  'arrayOf',
  'objectOf',
  'instanceOf',
  'oneOfType',
  'exact',
];

const getStringEndIndex = (source, str) => source.indexOf(str) + str.length;

class PropTypesPlugin {
  constructor(config) {
    this.source = config.source;
    this.type = config.type;
    this.receiver = config.receiver;

    this.propTypesString = 'propTypes = {';
  }

  getPropTypes = (source, start) => (
    source.slice(
      getStringEndIndex(source, start),
      source.lastIndexOf('}') - 1,
    )
      .split(',')
      .map((propType) => propType.trim())
  )

  getPropTypeObject = (value) => ({
    type: {
      name: value[1].includes('(') ? value[1].slice(0, value[1].indexOf('(')) : value[1],
    },
    required: value[2] === 'isRequired',
    description: '',
  })

  getAllPropTypesObject = (propTypesArr) => {
    const object = {};

    propTypesArr.forEach((propType) => {
      if (!propType) return;

      const pair = propType.split(': ');
      const key = pair[0];
      const value = pair[1].split('.');

      object[key] = this.getPropTypeObject(value);
    });

    return object;
  }

  isFileMatches = (file) => path.extname(file) === this.type;

  inspectTreeForFiles = (item) => {
    const content = fs.readdirSync(item);

    return content.map((node) => {
      if (fs.lstatSync(`${item}/${node}`).isFile()) return `${item}/${node}`;

      return this.inspectTreeForFiles(`${item}/${node}`);
    });
  }

  getFilesWithType = () => (
    this.inspectTreeForFiles(this.source)
      .join()
      .split(',')
      .filter((file) => this.isFileMatches(file))
  );

  createAllMetaDataObject(files) {
    const meta = {};

    files.forEach((file) => {
      const source = fs.readFileSync(file).toString();
      const propTypes = this.getPropTypes(source, this.propTypesString);

      meta[file] = {
        description: '',
        displayName: file.slice(file.lastIndexOf('/') + 1, file.indexOf(this.type)),
        props: this.getAllPropTypesObject(propTypes),
      };
    });

    return meta;
  }

  saveMeta(meta) {
    const folders = this.receiver.slice(0, this.receiver.lastIndexOf('/')).split('/');
    const folderPaths = folders.map((folder, index) => {
      if (folders[index - 1]) return `${folders[index - 1]}/${folder}`;
      return folder;
    });

    folderPaths.forEach((folder) => {
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
      }
    });

    fs.writeFileSync(this.receiver, JSON.stringify(meta));
  }

  createMetaData() {
    try {
      const files = this.getFilesWithType();
      const meta = this.createAllMetaDataObject(files);

      this.saveMeta(meta);
    } catch (error) {
      console.log(RED_CONSOLE_COLOR, error);
    }
  }

  apply(compiler) {
    compiler.hooks.afterEnvironment.tap('PropTypes Plugin', () => {
      this.createMetaData();
    });
  }
}

module.exports = PropTypesPlugin;
