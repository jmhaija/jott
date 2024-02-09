import Model from './Model.js'
import Account from './Account.js'
import Currency from '../attributes/Currency.js'
import JottError from '../core/JottError.js'

export default class Ledger extends Model {
  constructor(id, client) {
    super({
      instance_id: id ? id : null,
      data_collection: 'ledgers',
      data_prefix: 'ledger_',
      data_props: [
        { 
          prop: 'id',
          autogen: true,
          required: true,
          mutable: false
        },
        {
          prop: 'name',
          autogen: false,
          required: true,
          mutable: true
        },
        { 
          prop: 'market',
          autogen: false,
          required: false,
          mutable: true
        },
        { 
          prop: 'region',
          autogen: false,
          required: false,
          mutable: true
        },
        { 
          prop: 'product',
          autogen: false,
          required: false,
          mutable: true
        },
        { 
          prop: 'class',
          autogen: false,
          required: false,
          mutable: true
        },
        { 
          prop: 'currency',
          autogen: false,
          required: true,
          mutable: false,
          validate: val => val instanceof Currency
        },
        {
          prop: 'transaction_limit',
          autogen: false,
          required: true,
          mutable: true,
          validate: val => typeof val === 'number'
        },
        {
          prop: 'created',
          autogen: true,
          required: true,
          mutable: false
        },
        { 
          prop: 'modified',
          autogen: true,
          required: true,
          mutable: false
        }
      ]
    })
    
    this.client = client
  }

  account(id) {
    if (!this.id) {
      throw new JottError(`Ledger must be persisted before calling account()`)
    }

    const account = new Account(id)
    return (id && this.client) ? this.client.syncInstance(account, [
      {
        property: 'ledger',
        value: this.id
      }
    ]) : account
  }
}
