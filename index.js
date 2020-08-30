const path = require('path');
const fs = require('fs/promises');
const errorHandler = require('./utils/errorHendler.js');
const program = require('./utils/commander.js');

program.parse(process.argv);

const oldDirectory = program.folder;
const newDirectory = program.output;

const isAccessible = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async () => {
  if (!(await isAccessible(oldDirectory))) {
    errorHandler(`Not found source folder: ${oldDirectory}`);
  }

  if (!(await isAccessible(newDirectory))) {
    await fs.mkdir(newDirectory);
  }
};

const makeDir = async (dir) => {
  if (!(await isAccessible(`${newDirectory}/${dir}`))) {
    await fs.mkdir(`${newDirectory}/${dir}`);
  }
};

const moveFile = async (dir, file) => {
  const firstChar = file[0].toUpperCase();
  const oldPath = path.join(dir, file);
  const newPath = path.join(newDirectory, firstChar, file);

  try {
    await makeDir(firstChar);
    await fs.copyFile(oldPath, newPath);
    console.log(file);
  } catch (err) {
    errorHandler(err);
  }
};

const readDir = async (dir) => {
  const files = await fs.readdir(dir);
  for (const item of files) {
    const dirPath = path.join(dir, item);
    const state = await fs.stat(dirPath);
    if (state.isDirectory()) {
      await readDir(dirPath);
    } else {
      await moveFile(dir, item);
    }
  }
};

const deleteDir = async () => {
  await fs.rmdir(oldDirectory, {
    recursive: true
  }).catch(err => {
    errorHandler(err);
  });
};

const sorting = async () => {
  try {
    await readDir(oldDirectory);
    console.log('Sorting complete. We can remove source folder');

    if (program.delete) {
      deleteDir();
    }
  } catch (err) {
    errorHandler(err);
  }
};

createFolderIsNotExist();
sorting();
