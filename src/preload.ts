// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import {
  contextBridge,
  ipcRenderer,
  GetApiType,
} from 'electron-typescript-ipc';

export type Api = GetApiType<
  {
    getDataFromStore: (str: string) => Promise<string>;
  },
  {
    showAlert: (text: string) => Promise<void>;
  }
>;

const api: Api = {
  invoke: {
    getDataFromStore: async (key: string) => {
      return await ipcRenderer.invoke<Api>('getDataFromStore', key);
    },
  },
  on: {
    showAlert: (listener) => {
      ipcRenderer.on<Api>('showAlert', listener);
    },
  },
};

contextBridge.exposeInMainWorld('myAPI', api);

declare global {
  interface Window {
    myAPI: Api;
  }
}
