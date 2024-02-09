import AccountType from '../attributes/AccountType.js'
import NormalType from '../attributes/NormalType.js'
import AccountStatus from '../attributes/AccountStatus.js'
import Model from './Model.js'

export default class Account extends Model {
  constructor(id) {
    super({
      instance_id: id ? id : null,
      data_collection: 'accounts',
      data_prefix: 'account_',
      data_props: [
        { 
          prop: 'id',
          autogen: true,
          required: true,
          mutable: false
        },
        {
          prop: 'ledger',
          autogen: false,
          required: true,
          mutable: false
        },
        {
          prop: 'name',
          autogen: false,
          required: true,
          mutable: false
        },
        {
          prop: 'description',
          autogen: false,
          required: false,
          mutable: true
        },
        {
          prop: 'type',
          autogen: false,
          required: true,
          mutable: false,
          validate: val => val instanceof AccountType
        },
        { 
          prop: 'normal',
          autogen: false,
          required: true,
          mutable: false,
          validate: val => val instanceof NormalType
        },
        { 
          prop: 'status',
          autogen: false,
          required: true,
          mutable: true,
          validate: val => val instanceof AccountStatus
        },
        { prop: 'external',
          autogen: false,
          required: false,
          mutable: false
        },
        { prop: 'balance',
          autogen: true,
          required: true,
          mutable: true,
          validate: val => typeof val === 'number'
        },
        { 
          prop: 'transaction_limit',
          autogen: false,
          required: true,
          mutable: true,
          validate: val => typeof val === 'number'
        },
        { 
          prop: 'allow_negative',
          autogen: false,
          required: false,
          mutable: true
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
  }
}
