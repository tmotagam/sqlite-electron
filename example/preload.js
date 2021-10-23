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
    const res = await ipcRenderer.invoke('potd', path)
    document.getElementById('pout').innerText = 'Output: ' + res;
  },
  equery: async () => {
    const query = document.getElementById('singlequery').value
    const fetch = document.getElementById('fetch').value
    const values = document.getElementById('value').value
    try {
      const arr = JSON.parse("[" + values + "]");
      const res = await ipcRenderer.invoke('executeQuery', query, fetch, arr[0]);
      document.getElementById('pout1').innerText = 'Output: ' + res;
    } catch (error) {
      document.getElementById('pout1').innerText = 'Output: ' + error;
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
  }
})