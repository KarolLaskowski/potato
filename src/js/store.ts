import { IKeyValueObject, IStore } from './common';
import { Sync } from './storage';

class Store implements IStore {
  protected _storeData: IKeyValueObject;
  protected _storeName: string;
  protected _storeKeyName: string;

  constructor(storeName: string, newStoreData: IKeyValueObject = null) {
    if (!storeName) {
      throw new TypeError('Store name is obligatory!');
    }
    this._storeName = storeName;
    this._storeKeyName = `${this._storeName}_synced`;
    if (newStoreData) {
      this.save(newStoreData);
    } else {
      this._storeData = this._storeData || {};
    }
  }

  protected _sync = async () => {
    const dataFromDb: IKeyValueObject = await Sync.get(this._storeKeyName);
    const newMergedData = {
      ...dataFromDb,
      ...this._storeData,
    };
    this._storeData = newMergedData;
    await Sync.set(this._storeKeyName, this._storeData);
  };

  count = () => {
    return Object.keys(this._storeData).length;
  };

  get = async (): Promise<IKeyValueObject> => {
    if (!this.count()) {
      await this._sync();
    }
    return (this._storeData || {}) as IKeyValueObject;
  };

  save = async (newStoreData: IKeyValueObject) => {
    this._storeData = newStoreData;
    await Sync.set(this._storeKeyName, newStoreData);
  };
}

export default Store;
