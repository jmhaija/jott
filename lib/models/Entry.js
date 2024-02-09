import Model from './Model.js'
import NormalType from '../attributes/NormalType.js'

export default class Entry extends Model {
  constructor(id) {
    super({
      instance_id: id ? id : null,
      data_collection: 'entries',
      data_prefix: 'entry_',
      data_props: [
        {
          prop: 'id',
          autogen: true,
          required: true,
          mutable: false
        },
        {
          prop: 'account',
          autogen: false,
          required: true,
          mutable: false
        },
        {
          prop: 'amount',
          autogen: false,
          required: true,
          mutable: false,
          validate: val => typeof val === 'number'
        },
        { 
          prop: 'type',
          autogen: false,
          required: true,
          mutable: false,
          validate: val => val instanceof NormalType
        },
        {
          prop: 'reference',
          autogen: false,
          required: true,
          mutable: false
        },
        { 
          prop: 'note',
          autogen: false,
          required: false,
          mutable: false
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
