const fs = require('fs');
const path = require('path');
const reactDocs = require('react-docgen');

const RED_CONSOLE_COLOR = '\x1b[31m';

class BuildBooster {
  constructor(config) {
    this.isRegular = /.\*\../.test(config.source);
    this.source = this.isRegular
      ? config.source.slice(0, config.source.indexOf('/*'))
      : config.source;
    this.type = config.source.slice(config.source.lastIndexOf('.'), config.source.length);
    this.receiver = config.receiver;
  }

  isFileMatches = (file) => path.extname(file) === this.type;

  getFilesWithType = () => this.searchFiles(this.source).join().split(',').filter((file) => this.isFileMatches(file));

  searchFiles = (folder) => {
    const content = fs.readdirSync(folder);

    return content.map((node) => {
      if (fs.lstatSync(`${folder}/${node}`).isFile()) return `${folder}/${node}`;

      return this.searchFiles(`${folder}/${node}`);
    });
  }

  createJSON = (files) => {
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
      if (!fs.existsSync(folder)) fs.mkdirSync(folder);
    });

    fs.writeFileSync(this.receiver, JSON.stringify(meta, null, 2));
  }

  createMetaData() {
    try {
      const files = this.isRegular ? this.getFilesWithType() : [this.source];
      const meta = this.createJSON(files);

      this.saveMeta(meta);
    } catch (error) {
      console.log(RED_CONSOLE_COLOR, error);
    }
  }

  apply(compiler) {
    compiler.hooks.afterEnvironment.tap('BuildBooster Plugin', () => {
      this.createMetaData();
    });
  }
}

module.exports = BuildBooster;
