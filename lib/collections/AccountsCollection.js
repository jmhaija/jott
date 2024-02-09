import Collection from './Collection.js'
import Account from '../models/Account.js'

export default class AccountsCollection extends Collection {
  constructor(config) {
    super({
      data_collection: 'accounts',
      data_prefix: 'account_',
      data_fields: config?.fields || ['*'],
      collection_model: Account
    })
  }
}
