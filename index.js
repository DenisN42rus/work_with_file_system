const path = require('path');
const fs = require('fs');
const Watcher = require('./watcher.js');
const errorHandler = require('./utils/errorHendler.js');
const program = require('./utils/commander.js');

program.parse(process.argv);

const oldDirectory = program.folder;
const newDirectory = program.output

const watcher = new Watcher(() => {
  console.log('Sorting complete. We can remove source folder');
  if (program.delete) {
    deleteDir();
  }
});

if (!fs.existsSync(oldDirectory)) {
  errorHandler(`Not found source folder: ${oldDirectory}`);
}

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
  watcher.startProccess(dir)
  fs.copyFile(oldPath, newPath, err => {
    if (err) {
      errorHandler(err);
      return;
    }
    watcher.endProccess(dir)
  });
};

const readDir = (dir) => {
  watcher.started()
  watcher.startProccess(dir)
  fs.readdir(dir, (err, files) => {
    if (err) {
      errorHandler(err);
      return;
    }

    for (const item of files) {
      const dirPath = path.join(dir, item);
      const state = fs.statSync(dirPath);
      if (state.isDirectory()) {
        readDir(dirPath);
      } else {
        moveFile(dir, item);
      }
    }

    watcher.endProccess(dir)
  });
};

const deleteDir = () => {
  fs.rmdir(oldDirectory, {
    recursive: true
  }, err => {
    if (err) {
      errorHandler(err);
      return;
    }
  });
};

readDir(oldDirectory);
