const {app, BrowserWindow, ipcMain, Tray, Menu, MenuItem, protocol} = require('electron')
const path = require('path')

const Monzo = require('./app/monzo');

let tray = undefined
let mainWindow = undefined
let server = undefined

const m = new Monzo();


ipcMain.on('DOMContentLoaded', (event, arg) => {
  let checkBalance = setInterval(function() {
     if (m.balance) {
        tray.setTitle(`${m.balance.balance}`);
        event.sender.send('balance-response', m.balance);
        clearInterval(checkBalance);
     }
  }, 100);
  let checkTransactions = setInterval(function() {
     if (m.transactions) {
        event.sender.send('transactions-response', m.transactions);
        clearInterval(checkTransactions);
     }
  }, 100);
})

const createTray = () => {

  tray = new Tray('monzo.png')
  tray.on('click', function(event) {
    toggleWindow()
    if (mainWindow.isVisible() && process.defaultApp && event.metaKey) {
      mainWindow.openDevTools({mode: 'detach'})
    }
  })

  mainWindow = new BrowserWindow({
    width: 300,
    height: 350,
    show: false,
    frame: false,
    resizable: true,
  })

  mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`);

  mainWindow.on('blur', () => {
    if(!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide()
    }
  })  

}

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const trayPos = tray.getBounds()
  const windowPos = mainWindow.getBounds()
  let x, y = 0
  if (process.platform == 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height)
  } else {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height * 10)
  }


  mainWindow.setPosition(x, y, false)
  mainWindow.show()
  mainWindow.focus()
}

app.on('ready',createTray);


ipcMain.on('show-window', () => {
  showWindow()
})
app.on('open-url', () =>{
  console.log('open', app.getAppPath());
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})