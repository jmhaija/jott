import Collection from './Collection.js'
import Entry from '../models/Entry.js'

export default class EntriesCollection extends Collection {
  constructor(config) {
    super({
      data_collection: 'entries',
      data_prefix: 'entry_',
      data_fields: config?.fields || ['*'],
      collection_model: Entry
    })
  }
}
