import Collection from './Collection.js'
import Ledger from '../models/Ledger.js'

export default class LedgersCollection extends Collection {
  constructor(config) {
    super({
      data_collection: 'ledgers',
      data_prefix: 'ledger_',
      data_fields: config?.fields || ['*'],
      collection_model: Ledger
    })
  }
}
