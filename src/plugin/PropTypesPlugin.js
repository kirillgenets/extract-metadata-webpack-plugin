const fs = require('fs');
const path = require('path');
const reactDocs = require('react-docgen');

const RED_CONSOLE_COLOR = '\x1b[31m';

class PropTypesPlugin {
  constructor(config) {
    this.source = config.source;
    this.type = config.type;
    this.receiver = config.receiver;
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

  createMetaDataJSON = (files) => {
    const meta = {};

    files.forEach((file) => {
      const source = fs.readFileSync(file).toString();
      const docs = reactDocs.parse(source);

      meta[file] = docs;
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

    fs.writeFileSync(this.receiver, JSON.stringify(meta, null, 2));
  }

  createMetaData() {
    try {
      const files = this.getFilesWithType();
      const meta = this.createMetaDataJSON(files);

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
