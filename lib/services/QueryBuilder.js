import JottError from '../core/JottError.js'

export default class QueryBuilder {
  #collection
  #statement
  #fields
  #limit = false
  #returning = false
  #conjunctions = []
  #properties = []
  #operators = []
  #values = []
  #index = 0
  #offset = 0
  #lastCall = 'none'
  #patterns = {
    SELECT(collection, fields) {
      return `SELECT ${fields.join(', ')} FROM ${collection}`
    },

    INSERT(collection, fields) {
      return `INSERT INTO ${collection} (${fields.join(', ')}) VALUES (${fields.map((element, index) => '$' + (index + 1)).join(', ')})`
    },

    UPDATE(collection, fields) {
      return `UPDATE ${collection} SET ${fields.map( (element, index) => element + ' = $' + (index + 1) ).join(', ')}`
    }
  }
  #addConditions = (sql, conjunctions, properties, operators) => {
    for(let i = 0; i < conjunctions.length; i++) {
      sql += ` ${conjunctions[i]} ${this.config?.prefix ? this.config.prefix + properties[i] : properties[i]} ${operators[i]} $${this.#offset + i + 1}`
    }
    return sql
  }

  constructor(config) {
    this.config = config
  }

  retrieveAll() {
    return this.retrieve(['*'])
  }

  retrieve(fields) {
    if (this.#lastCall !== 'none') {
      throw new JottError(`retrieve() should be the first thing called prior to any conditions`)
    }

    this.#statement = 'SELECT'
    this.#fields = fields
    this.#lastCall = 'statement'
    return this
  }

  create(resource) {
    this.#statement = 'INSERT'
    this.#fields = Object.keys(resource)
    this.#values = Object.values(resource)
    this.#offset = 2
    this.#lastCall = 'statement'
    return this
  }

  update(resource) {
    this.#statement = 'UPDATE'
    this.#fields = Object.keys(resource).map(field => this.config?.prefix ? this.config.prefix + field : field)
    this.#properties = Object.keys(resource)
    this.#values = Object.values(resource)
    this.#offset = 2
    this.#lastCall = 'statement'
    return this
  }

  fromCollection(collection) {
    return this.collection(collection)
  }

  inCollection(collection) {
    return this.collection(collection)
  }

  collection(collection) {
    if (this.#lastCall !== 'statement') {
      throw new JottError(`A statement such as retrieve(), create() or update() must be called prior to defining a collection`)
    }

    this.#collection = collection
    this.#lastCall = 'collection'
    return this
  }

  where(prop) {
    if (this.#lastCall !== 'collection') {
      throw new JottError(`where() should be the first conjunction`)
    }

    this.#conjunctions[this.#index] = 'WHERE'
    this.#properties[this.#index] = prop
    this.#lastCall = 'conjunction'
    return this
  }

  and(prop) {
    if (this.#lastCall !== 'operator') {
      throw new JottError(`Tried calling and() before completing previous condition`)
    }

    this.#conjunctions[this.#index] = 'AND'
    this.#properties[this.#index] = prop
    this.#lastCall = 'conjunction'
    return this
  }

  or(prop) {
    if (this.#lastCall !== 'operator') {
      throw new JottError(`Tried calling or() before completing previous condition`)
    }

    this.#conjunctions[this.#index] = 'OR'
    this.#properties[this.#index] = prop
    this.#lastCall = 'conjunction'
    return this
  }

  is(value) {
    if (this.#lastCall !== 'conjunction') {
      throw new JottError(`Nothing to equate to; call a conjunction such as where(), and() or or() first`)
    }

    this.#operators[this.#index] = '='
    this.#values[this.#offset + this.#index] = value
    this.#index++
    this.#lastCall = 'operator'
    return this
  }

  isNot(value) {
    if (this.#lastCall !== 'conjunction') {
      throw new JottError(`Nothing to compare to as isNot(); call a conjunction such as where(), and() or or() first`)
    }

    this.#operators[this.#index] = '!='
    this.#values[this.#offset + this.#index] = value
    this.#index++
    this.#lastCall = 'operator'
    return this
  }

  isGreaterThan(value) {
    if (this.#lastCall !== 'conjunction') {
      throw new JottError(`Nothing to compare to as isGreaterThan(); call a conjunction such as where(), and() or or() first`)
    }

    this.#operators[this.#index] = '>'
    this.#values[this.#offset + this.#index] = value
    this.#index++
    this.#lastCall = 'operator'
    return this
  }

  isLessThan(value) {
    if (this.#lastCall !== 'conjunction') {
      throw new JottError(`Nothing to compare to as isLessThan(); call a conjunction such as where(), and() or or() first`)
    }

    this.#operators[this.#index] = '<'
    this.#values[this.#offset + this.#index] = value
    this.#index++
    this.#lastCall = 'operator'
    return this
  }

  limitTo(limit) {
    if (this.#statement === 'INSERT' || this.#lastCall !== 'operator') {
      throw new JottError(`Limit cannot be set in this type of or point in the statement`)
    }

    this.#limit = Number(limit)
    return this
  }

  thenReturn(fields) {
    if (this.#statement === 'SELECT') {
      throw new JottError(`You are already retrieving from a collection, there is no need to use thenReturn()`)
    }

    this.#returning = fields ? fields.join(', ') : '*'
    return this
  }

  toPreparedObject() {
    if (
        (this.#statement === 'SELECT' && this.#lastCall !== 'operator' && this.#lastCall !== 'collection') ||
        (this.#statement === 'INSERT' && this.#lastCall !== 'collection') ||
        (this.#statement === 'UPDATE' && this.#lastCall !== 'operator')
      ) {
      throw new JottError(`Cannot generate an incomplete statement (last call is ${this.#lastCall})`)
    }

    let sql = this.#patterns[this.#statement](
                this.#collection,
                this.#fields
              )
    
    if (this.#statement !== 'INSERT') {
      sql = this.#addConditions(sql, this.#conjunctions, this.#properties, this.#operators)
    }
    
    if (this.#limit) {
      sql += ` LIMIT ${this.#limit}`
    }

    if (this.#returning) {
      sql += ` RETURNING ${this.#returning}`
    }

    return {
      sql: `${sql};`,
      params: this.#values
    }
  }

  toSQL() {
    let sql = this.toPreparedObject().sql
    for(let i = 0; i < (this.#offset + this.#index); i++) {
      sql = sql.replace(`$${i+1}`, isNaN(this.#values[i]) ? `'${this.#values[i]}'` : this.#values[i] ) 
    }
    return sql
  }
}
