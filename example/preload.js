const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', async () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

contextBridge.exposeInMainWorld('api', {
  path: async () => {
    const path = document.getElementById('dbpath').value
    const isuri = document.getElementById('isuri').checked
    try {
      const res = await ipcRenderer.invoke('potd', path, isuri);
      document.getElementById('pout').innerText = 'Output: ' + res;
    } catch (error) {
      document.getElementById('pout').innerText = 'Output: ' + error;
    }
  },
  equery: async () => {
    const query = document.getElementById('singlequery').value
    const values = document.getElementById('value').value
    try {
      const arr = JSON.parse("[" + values + "]");
      const res = await ipcRenderer.invoke('executeQuery', query, arr[0]);
      document.getElementById('pout1').innerText = 'Output: ' + res;
    } catch (error) {
      document.getElementById('pout1').innerText = 'Output: ' + error;
    }
  },
  fetchall: async () => {
    const query = document.getElementById('fetchallquery').value
    const values = document.getElementById('fetchallvalue').value
    try {
      const arr = JSON.parse("[" + values + "]");
      const res = await ipcRenderer.invoke('fetchall', query, arr[0]);
      document.getElementById('poutfa').innerText = 'Output: ' + JSON.stringify(res);
    } catch (error) {
      document.getElementById('poutfa').innerText = 'Output: ' + error;
    }
  },
  fetchone: async () => {
    const query = document.getElementById('fetchonequery').value
    const values = document.getElementById('fetchonevalue').value
    try {
      const arr = JSON.parse("[" + values + "]");
      const res = await ipcRenderer.invoke('fetchone', query, arr[0]);
      document.getElementById('poutfo').innerText = 'Output: ' + JSON.stringify(res);
    } catch (error) {
      document.getElementById('poutfo').innerText = 'Output: ' + error;
    }
  },
  fetchmany: async () => {
    const query = document.getElementById('fetchmanyquery').value
    const values = document.getElementById('fetchmanyvalue').value
    const size = Number(document.getElementById('fetchmanysize').value)
    try {
      const arr = JSON.parse("[" + values + "]");
      const res = await ipcRenderer.invoke('fetchmany', query, size, arr[0]);
      document.getElementById('poutfm').innerText = 'Output: ' + JSON.stringify(res);
    } catch (error) {
      document.getElementById('poutfm').innerText = 'Output: ' + error;
    }
  },
  mquery: async () => {
    const query = document.getElementById('query').value
    const values = document.getElementById('values').value
    try {
      const arr = JSON.parse("[" + values + "]");
      const res = await ipcRenderer.invoke('executeMany', query, arr[0]);
      document.getElementById('pout2').innerText = 'Output: ' + res;
    } catch (error) {
      document.getElementById('pout2').innerText = 'Output: ' + error;
    }
  },
  escript: async () => {
    const spath = document.getElementById('scriptPath').value
    const res = await ipcRenderer.invoke('executeScript', spath);
    document.getElementById('pout3').innerText = 'Output: ' + res;
  },
  load_extension: async () => {
    const path = document.getElementById('extensionPath').value
    const res = await ipcRenderer.invoke('load_extension', path);
    console.log(res);
    document.getElementById('pout4').innerText = 'Output: ' + res;
  },
  backup: async () => {
    const target = document.getElementById('backupPath').value
    const pages = document.getElementById('pages').value
    const name = document.getElementById('name').value
    const sleep = document.getElementById('sleep').value
    const res = await ipcRenderer.invoke('backup', target, pages, name, sleep);
    console.log(res);
    document.getElementById('pout5').innerText = 'Output: ' + res;
  }
})