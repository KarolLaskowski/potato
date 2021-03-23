import { IKeyValueObject } from './common';
import Store from './store';

class OptionsStore extends Store {
  constructor(newStoreData: IKeyValueObject = null) {
    super('options', newStoreData);
  }
}

export default OptionsStore;
