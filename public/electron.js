const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { spawn } = require('child_process');

const isDev = process.env.NODE_ENV === 'development';
const PORT = 3456; // Fixed port for the app

function getProjectDir() {
  // app.isPackaged is only available after app.whenReady()
  if (isDev || !app.isPackaged) {
    return path.join(__dirname, '..');
  }
  return process.resourcesPath;
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    title: 'Student Offline Database',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Remove menu bar for cleaner look
  mainWindow.setMenuBarVisibility(false);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) {
    console.log('Dev mode: Loading from http://localhost:3000');
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    const url = `http://127.0.0.1:${PORT}`;
    console.log('Production mode: Loading from', url);
    mainWindow.loadURL(url);
  }

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log('Failed to load:', errorCode, errorDescription);
    if (!isDev) {
      console.log(`Retrying in 2 seconds... (Server might still be starting)`);
      setTimeout(() => {
        mainWindow.loadURL(`http://127.0.0.1:${PORT}`);
      }, 2000);
    }
  });

  mainWindow.on('closed', () => {
    app.quit();
  });

  return mainWindow;
}

async function startNextServer() {
  return new Promise((resolve, reject) => {
    const projectDir = getProjectDir();
    const serverPath = path.join(projectDir, 'node_modules', 'next', 'dist', 'bin', 'next');
    
    console.log('Starting Next.js server on port', PORT, '...');
    
    const server = spawn('node', [serverPath, 'start', '-p', PORT.toString()], {
      cwd: projectDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        NODE_ENV: 'production',
      },
    });

    let started = false;

    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('[Next.js]', output.trim());
      if (!started && output.includes('http://localhost:')) {
        started = true;
        // Give it a moment to fully start
        setTimeout(() => resolve(server), 1000);
      }
    });

    server.stderr.on('data', (data) => {
      const output = data.toString();
      console.log('[Next.js]', output.trim());
      // Next.js sometimes prints ready message to stderr
      if (!started && (output.includes('ready') || output.includes('http://localhost:'))) {
        started = true;
        setTimeout(() => resolve(server), 1000);
      }
    });

    server.on('error', (err) => {
      console.error('Failed to start Next.js server:', err);
      reject(err);
    });

    server.on('exit', (code) => {
      console.log('Next.js server exited with code:', code);
      if (!started) {
        reject(new Error(`Server exited with code ${code}`));
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!started) {
        reject(new Error('Server start timeout after 30 seconds'));
      }
    }, 30000);
  });
}

async function main() {
  let nextServer = null;
  
  try {
    if (!isDev) {
      // Start Next.js server in production mode
      nextServer = await startNextServer();
      console.log('Next.js server started successfully');
    }
    
    const mainWindow = createWindow();

    // Handle file operations
    ipcMain.handle('read-file', async (event, filePath) => {
      try {
        const data = await fs.readFile(filePath, 'utf-8');
        return { success: true, data: JSON.parse(data) };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('write-file', async (event, { filePath, data }) => {
      try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('get-data-dir', () => {
      return path.join(getProjectDir(), 'data');
    });

    ipcMain.handle('get-uploads-dir', () => {
      return path.join(getProjectDir(), 'public', 'uploads');
    });

    // Clean up server when app closes
    mainWindow.on('closed', () => {
      if (nextServer) {
        nextServer.kill();
      }
      app.quit();
    });

  } catch (error) {
    console.error('Failed to start application:', error);
    // Show error dialog to user
    const { dialog } = require('electron');
    dialog.showErrorBox(
      'Startup Error',
      `Failed to start the application server.\n\n${error.message}\n\nPlease try running "npm run build" first.`
    );
    app.quit();
  }
}

app.whenReady().then(main);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Kill any child processes on quit
  process.exit(0);
});