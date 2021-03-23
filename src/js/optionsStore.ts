import { IKeyValueObject } from './common';
import { Sync } from './storage';
import Store from './store';

class OptionsStore extends Store {
  constructor(newStoreData: IKeyValueObject = null) {
    super('options', newStoreData);
  }

  getOption = async (key: string): Promise<object> => {
    if (!key) {
      if (!this.count()) {
        await this._sync();
      }
      return (this._storeData || {}) as IKeyValueObject;
    }
    throw new TypeError('`key` cannot be empty!');
  };

  setOption = async (key: string, value: object) => {
    if (!key) {
      this._storeData[key] = value;
      await Sync.set(this._storeKeyName, this._storeData);
    }
    throw new TypeError('`key` cannot be empty!');
  };
}

export default OptionsStore;
