const { app, dialog, ipcMain, shell, BrowserWindow  } = require('electron')
const path = require('path')
const fs = require('fs')
const config = require('./config')
const Store = require('electron-store')
const remote = require('@electron/remote/main')
remote.initialize()

let mainWindow;

function shuffle (array) {

  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;

  }

  return array;
}

function deleteFile (filename) {
  try {
    fs.unlinkSync(filename);
    return true;
  } catch (ex) {
    throw(ex);
    return false;
  }
};


function createWindow () {

  let file_list;
  let current_image = 0;

  Store.initRenderer();

  // Create the browser window.
  mainWindow = new BrowserWindow({
  
    width: 1024,
    height: 768,
    icon: './resources/photo-slap.ico',
    title: 'photo-slap',

    webPreferences: {      
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  remote.enable(mainWindow.webContents);

  // and load the index.html of the app.
  mainWindow.loadFile(__dirname + '/html/index.html')
  
  if (config.debug && config.debug === true) {
    mainWindow.webContents.openDevTools();
  }

  // ipc functions
  ipcMain.on('open-directories-dialog', function(e) {
      
    const opened_directories = dialog.showOpenDialogSync({ properties: ['openDirectory', 'multiSelections'] });
    if (opened_directories !== null && opened_directories !== undefined && opened_directories.length > 0) {
      mainWindow.send('get-files', opened_directories);
    }
    
  })

  ipcMain.on('expand-adjust', function(e) {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
    mainWindow.setMenuBarVisibility(!mainWindow.isFullScreen());
    mainWindow.setAutoHideMenuBar(mainWindow.isFullScreen());
  })

  ipcMain.on('get-next', function(e) {
    
    if (file_list !== null && file_list !== undefined && file_list.length > 0) {
      current_image++;
      if (current_image >= file_list.length) {
        current_image = 0;
      }
      
      mainWindow.setTitle(file_list[current_image]);
      mainWindow.send('update-display-image', file_list[current_image]);
    }
    
  })

  ipcMain.on('get-prev', function(e) {
    
    if (file_list !== null && file_list !== undefined && file_list.length > 0) {
      current_image--;

      if (current_image < 0) {
        current_image = file_list.length - 1;
      }

      mainWindow.setTitle(file_list[current_image]);
      mainWindow.send('update-display-image', file_list[current_image]);
    }
    
  });

  ipcMain.on('delete-file', function(e) {
    if (current_image === null || current_image === undefined) {
      return;
    }

    if (deleteFile(file_list[current_image])) {
      file_list.splice(current_image, 1);
      mainWindow.setTitle(file_list[current_image]);
      mainWindow.send('update-display-image', file_list[current_image]);
    } else {
      throw('error deleting file');
    }
    
  })

  ipcMain.on('clear-images', function(event) {
    file_list = [];
    current_image = 0;
    mainWindow.setTitle('');

  })

  ipcMain.on('load-files', function(e, files) {
    file_list = [];

    if (files !== null && files.length > 0) {
      current_image = 0;
      file_list = files;

      mainWindow.setTitle(file_list[current_image]);
      mainWindow.send('update-display-image', file_list[current_image]);
    }

  })

  ipcMain.on('shuffle-files', function(e) {    
    if (file_list === null || file_list === undefined || file_list.length === 0) {
      return;
    }

    mainWindow.send('reset-display');
    file_list = shuffle(file_list);
    current_image = 0;
    mainWindow.send('update-display-image', file_list[current_image]);
  })

  ipcMain.on('open-url-in-external', function(e, url) {
    shell.openExternal(url);
  })

  ipcMain.on('close', function(e) {
    app.quit();
  })

      
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


