'use strict'

const app = require('app')
const ipc = require('ipc')
const BrowserWindow = require('browser-window')
const Menu = require('menu')
const MenuItem = require('menu-item')

// Report crashes to our server.
require('crash-reporter').start()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow = null

let execUser = (code) => mainWindow && mainWindow.webContents && mainWindow.webContents.executeJavaScript(code, true)

app.on('window-all-closed', () => {
	if (process.platform != 'darwin') {
		app.quit()
	}
})

const template = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Open Document',
				accelerator: 'CmdOrCtrl+O',
				click: () => execUser('document.getElementById("fileInput").click()'),
			},
			{
				label: 'Print Document',
				accelerator: 'CmdOrCtrl+P',
				click: () => execUser('SecondaryToolbar.printClick()'),
			},
			{
				label: 'Quit',
				accelerator: 'CmdOrCtrl+Q',
				click: () => mainWindow.close(),
			},
		],
	},
	{
		label: 'View',
		submenu: [
			{
				label: 'Enter Fullscreen',
				accelerator: 'F11',
				click: () => execUser('SecondaryToolbar.presentationModeClick()'),
			},
			{
				label: 'Exit Fullscreen',
				accelerator: 'Esc',
				click: () => execUser('document.exitFullscreen()'),
			},
			{
				label: 'Toggle Developer Tools',
				accelerator: 'Alt+CmdOrCtrl+I',
				click: () => mainWindow.toggleDevTools(),
			},
			{
				label: 'Zoom in',
				accelerator: 'Plus',
				click: () => execUser('PDFViewerApplication.zoomIn()'),
			},
			{
				label: 'Zoom out',
				accelerator: '-',
				click: () => execUser('PDFViewerApplication.zoomOut()'),
			},
		],
	},
]

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', () => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		icon: 'pdfjs.png',
		'auto-hide-menu-bar': true, //menu needed for accels working
		'web-preferences': {'web-security': false, 'overlay-scrollbars': true},
	})
	
	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)
	
	let filearg = ''
	if (process.argv.length > 2) { // node foobar.js arg0 arg1 ...
		filearg = process.argv[2]
	}
	
	// and load the index.html of the app.
	mainWindow.loadUrl(`file://${__dirname}/pdf.js/build/generic/web/viewer.html?file=${filearg}`)
	
	mainWindow.on('closed', () => {
		mainWindow = null
	})
	
	mainWindow.webContents.executeJavaScript(`
	'use strict'
	
	if (document.webkitExitFullscreen && !document.exitFullscreen) {
		document.exitFullscreen = document.webkitExitFullscreen
	}
	`)
	//PDFViewerApplication.pdfViewer.isInPresentationMode
})