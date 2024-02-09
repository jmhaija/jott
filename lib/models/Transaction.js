import Model from './Model.js'
import TransactionType from '../attributes/TransactionType.js'
import TransactionStatus from '../attributes/TransactionStatus.js'

export default class Transaction extends Model {
  constructor(id) {
    super({
      instance_id: id ? id : null,
      data_collection: 'transactions',
      data_prefix: 'transactions_',
      data_props: [
        {
          prop: 'id',
          autogen: true,
          required: true,
          mutable: false
        },
        { 
          prop: 'type',
          autogen: false,
          required: true,
          mutable: false,
          validate: val => val instanceof TransactionType
        },
        { 
          prop: 'status',
          autogen: false,
          required: true,
          mutable: true,
          validate: val => val instanceof TransactionStatus
        },
        { 
          prop: 'description',
          autogen: false,
          required: false,
          mutable: true
        },
        { 
          prop: 'category',
          autogen: false,
          required: false,
          mutable: false
        },
        { 
          prop: 'reference',
          autogen: false,
          required: true,
          mutable: false
        },
        { 
          prop: 'entries',
          autogen: false,
          required: true,
          mutable: false,
          validate: val => val.isArray()
        },
        { 
          prop: 'created',
          autogen: true,
          required: true,
          mutable: false
        }
      ]
    })
  }
}
