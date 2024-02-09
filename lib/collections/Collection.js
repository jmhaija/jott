import JottError from '../core/JottError.js'
import QueryBuilder from '../services/QueryBuilder.js'

export default class Collection {
  #config
  #query
  #collectionData
  
  constructor(config) {
    this.#config = config
    this.#query = new QueryBuilder({
      prefix: config.data_prefix
    })
  }

  all() {
    this.#query = this.#query.retrieveAll().fromCollection(this.#config.data_collection)
    return this
  }

  where(prop) {
    this.#query = this.#query.retrieve(this.#config.data_fields).fromCollection(this.#config.data_collection).where(prop)
    return this
  }

  and(prop) {
    this.#query = this.#query.and(prop)
    return this
  }

  or(prop) {
    this.#query = this.#query.or(prop)
    return this
  }

  is(value) {
    this.#query = this.#query.is(value)
    return this
  }

  isNot(value) {
    this.#query = this.#query.isNot(value)
    return this
  }

  isGreaterThan(value) {
    this.#query = this.#query.isGreaterThan(value)
    return this
  }

  isLessThan(value) {
    this.#query = this.#query.isLessThan(value)
    return this
  }

  limitTo(limit) {
    this.#query = this.#query.limitTo(limit)
    return this
  }

  getQuery() {
    return this.#query
  }

  mapRows(rows) {
    this.#collectionData = rows
    return this
  }

  getCollectionData(index) {
    if (index !== undefined) {
      return this.#collectionData[index]
    }
    return this.#collectionData
  }

  toModel(representation) {
    const dataModel = Array.isArray(representation) ? representation : this.getCollectionData(representation)
    if (!dataModel) {
      throw new JottError(`Supplied data model is not of valid format, must be a data array or a collection index`)
    }
    const instance = new this.#config.collection_model()
    return instance.mapProperties(dataModel)
  }
}
