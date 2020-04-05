const { app, BrowserWindow, Menu, ipcMain, webContents } = require("electron");
const path = require("path");
const { exec } = require("child_process");

require("update-electron-app")({
  repo:
    "Neckotone/https://github.com/Neckotone/comulusUi/tree/master/comulusUi",
  updateInterval: "1 hour",
});

let windows =[];

let newWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

if (process.env.NODE_ENV !== "production") {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "../node_modules", ".bin", "electron"),
  });
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "/views/index.html"));

  const mainMenu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(mainMenu);
  mainWindow.on("closed", () => {
    app.quit();
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

ipcMain.on('new-path', (e, data)=>{
  createNewWindow(1200, 800, 'Follow a New Path', '/views/pathwindow.html');
})

ipcMain.on("loging:devhub", (e, data) => {
   exec("sfdx force:auth:web:login -a CCIDevHub", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
     let ventanas = webContents.getAllWebContents()
     windows.forEach(wind => {
      ejse.data('loggedDevhub', true)
       wind.webContents.send('devhubloged', true)
     });
  });
  
});

const templateMenu = [
  {
    label: "File",
    submenu: [
      {
        label: "New Path",
        accelerator: process.platform == "darwin" ? "command+N" : "Ctrl+N",
        click() {
          createNewWindow(
            1200,
            800,
            "Follow a New Path",
            "/views/pathwindow.html"
          );
        },
      },
    ],
  },
];

if (process.platform == "darwin") {
  templateMenu.unshift({
    label: app.getName(),
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

function createNewWindow(width, height, title, direccion) {
  newWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    width: width,
    height: height,
    title: title,
  });

  const mainMenu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(mainMenu);
  newWindow.loadFile(path.join(__dirname, direccion));
  newWindow.webContents.openDevTools();
  newWindow.on("closed", () => {
    newWindow = null;
  });

  windows.push(newWindow);
}
