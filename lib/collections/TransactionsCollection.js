import Collection from './Collection.js'
import Transaction from '../models/Transaction.js'

export default class TransactionsCollection extends Collection {
  constructor(config) {
    super({
      data_collection: 'transactions',
      data_prefix: 'transaction_',
      data_fields: config?.fields || ['*'],
      collection_model: Transaction
    })
  }
}
