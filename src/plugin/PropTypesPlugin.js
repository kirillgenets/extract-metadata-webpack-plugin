const fs = require('fs');
const path = require('path');

const RED_CONSOLE_COLOR = '\x1b[31m';
const getStringEndIndex = (source, str) => source.indexOf(str) + str.length;
const appendCommaToString = (string) => (string[string.length - 1] === ',' ? string : `${string},`);

class PropTypesPlugin {
  constructor(config) {
    this.source = config.source;
    this.type = config.type;
    this.receiver = config.receiver;

    this.propTypesString = 'propTypes = {';
  }

  getPropTypes(file) {
    const source = fs.readFileSync(file).toString();
    return source.slice(
        getStringEndIndex(source, this.propTypesString),
        source.lastIndexOf('}') - 1,
      )
      .split(',')
      .map((propType) => propType.trim());
  }

  getPropTypesObject = (propTypesArr) => {
    const object = {};

    propTypesArr.forEach((propType) => {
      if (!propType) return;

      const pair = propType.split(': ');
      const key = pair[0];
      const value = pair[1].split('.');

      object[key] = {
        type: {
          name: value[1]
        },
        required: value[2] === 'isRequired',
        description: ''
      }
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
      const propTypes = this.getPropTypes(file);

      meta[file] = {
        description: '',
        displayName: file.slice(file.lastIndexOf('/') + 1, file.indexOf(this.type)),
        props: this.getPropTypesObject(propTypes)
      }
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
        fs.mkdirSync(folder)
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
