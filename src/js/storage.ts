import { IKeyValueObject } from './common';

async function get(key: string, storage: chrome.storage.StorageArea) {
  if (key) {
    const p = new Promise<IKeyValueObject>(function (resolve, reject) {
      storage.get(key, function (result) {
        resolve(JSON.parse(result[key]));
      });
    });
    return await p;
  } else {
    throw new TypeError('Key cannot be empty');
  }
}

async function set(
  key: string,
  value: IKeyValueObject,
  storage: chrome.storage.StorageArea
) {
  if (key) {
    const p = new Promise<IKeyValueObject>(function (resolve, reject) {
      storage.set({ [key]: JSON.stringify(value) }, () => {
        resolve(value);
      });
    });
    return await p;
  } else {
    throw new TypeError('Key cannot be empty');
  }
}

function getLocal(key: string) {
  return get(key, chrome.storage.local);
}
function setLocal(key: string, value: IKeyValueObject) {
  return set(key, value, chrome.storage.local);
}
function getSync(key: string) {
  return get(key, chrome.storage.sync);
}
function setSync(key: string, value: IKeyValueObject) {
  return set(key, value, chrome.storage.sync);
}

const Sync = {
  get: getSync,
  set: setSync,
};

const Local = {
  get: getLocal,
  set: setLocal,
};

export { Sync, Local };
