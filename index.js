const path = require('path');
const fs = require('fs');
const Watcher = require('./watcher.js');

const oldDirectory = process.argv[2] ? path.join(__dirname, process.argv[2]) : path.join(__dirname, 'files');
const newDirectory = process.argv[3] ? path.join(__dirname, process.argv[3]) : path.join(__dirname, 'newFiles');

const watcher = new Watcher(() => {
  console.log('Sorting complete. We can remove source folder');
  if (process.argv[4] === 'delete') {
    deleteDir();
  }
});

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
      console.log(err);
    }
    watcher.endProccess(dir)
  });
};

const readDir = (dir) => {
  watcher.started()
  watcher.startProccess(dir)
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log(err);
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
  fs.rmdirSync(oldDirectory, {
    recursive: true
  });
};

readDir(oldDirectory);
