import { IKeyValueObject } from './types';
import { Sync } from './storage';
import Store from './store';

class OptionsStore extends Store {
  constructor(newStoreData: IKeyValueObject = null) {
    super('options', newStoreData);
  }

  getOption = async (key: string): Promise<object> => {
    if (!!key) {
      if (!this.count()) {
        await this._sync();
      }
      return this._storeData[key] as IKeyValueObject;
    } else {
      throw new TypeError('getOption: `key` cannot be empty!');
    }
  };

  setOption = async (key: string, value: object) => {
    if (!!key) {
      this._storeData[key] = value;
      await Sync.set(this._storeKeyName, this._storeData);
    } else {
      throw new TypeError('setOption: `key` cannot be empty!');
    }
  };
}

export default OptionsStore;
