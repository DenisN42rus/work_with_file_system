const path = require('path');
const fs = require('fs');

const oldDirectory = process.argv[2] ? path.join(__dirname, process.argv[2]) : path.join(__dirname, 'files');
const newDirectory = process.argv[3] ? path.join(__dirname, process.argv[3]) : path.join(__dirname, 'newFiles');

if (!fs.existsSync(newDirectory)) {
  fs.mkdirSync(newDirectory);
}

const makeDir = (dir) => {
  if (!fs.existsSync(`${newDirectory}/${dir}`)) {
    fs.mkdirSync(`${newDirectory}/${dir}`);
  }
};

const moveFile = (dir, file) => {
  const firstChar = file[0].toUpperCase();
  const oldPath = path.join(dir, file);
  const newPath = path.join(newDirectory, firstChar, file);

  makeDir(firstChar);
  fs.renameSync(oldPath, newPath);
};

const readDir = (dir) => {
  const files = fs.readdirSync(dir);

  files.forEach(item => {
    const dirPath = path.join(dir, item);
    const state = fs.statSync(dirPath);
    if (state.isDirectory()) {
      readDir(dirPath);
    } else {
      moveFile(dir, item);
    }
  });
};

const deleteDir = () => {
  fs.rmdirSync(oldDirectory, {
    recursive: true
  });
};

(() => {
  readDir(oldDirectory);

  if (process.argv[4] === 'delete') {
    deleteDir();
  }
})();
