// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import {
  contextBridge,
  createIpcRenderer,
  GetApiType,
} from 'electron-typescript-ipc';

const ipcRenderer = createIpcRenderer<Api>();

export type Api = GetApiType<
  {
    twiceNumber: (num: number) => Promise<number>;
    repeatString: (str: string) => Promise<string>;
  },
  {
    showAlert: (text: string) => Promise<void>;
    printNumber: (num: number) => Promise<void>;
  }
>;

const api: Api = {
  invoke: {
    twiceNumber: async (num: number) => {
      return await ipcRenderer.invoke('twiceNumber', num);
    },
    repeatString: async (str: string) => {
      return await ipcRenderer.invoke('repeatString', str);
    },
  },
  on: {
    showAlert: (listener) => {
      ipcRenderer.on('showAlert', listener);
    },
    printNumber: (listener) => {
      ipcRenderer.on('printNumber', listener);
    },
  },
};

contextBridge.exposeInMainWorld('myAPI', api);

declare global {
  interface Window {
    myAPI: Api;
  }
}
