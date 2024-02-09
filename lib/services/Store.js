import QueryBuilder from './QueryBuilder.js'
import JottError from '../core/JottError.js'

export default class Store {
  constructor(driver) {
    this.driver = driver
  }

  async connect() {
    await this.driver.connect()
  }

  async disconnect() {
    await this.driver.disconnect()
  }

  async fetchCollection(collection) {
    const query = collection.getQuery().toPreparedObject()
    try {
      return collection.mapRows(
        this.driver.getRowsFromQuery(
          await this.driver.query(query.sql, query.params)
        )
      )
    } catch (err) {
      throw new JottError(err)
    }
  }

  async syncInstance(instance, conditions) {
    const stateHandlers = {
      prestine: () => this.createRecord(instance, conditions),
      identified: () => this.fetchRecord(instance, conditions),
      instantiated: () => this.updateRecord(instance, conditions)
    }

    return await stateHandlers[instance.getState()](instance)
  }

  async createRecord(instance) {
    const serializedMap = instance.serializeProperties()
    const recordData = instance.getConfigMetaData()
    const query = new QueryBuilder()
    const prepObj = query.create(serializedMap).inCollection(recordData.collection).thenReturn().toPreparedObject()
    
    try {
      return instance.mapProperties(
        this.driver.getFirstRowFromQuery(
          await this.driver.query(prepObj.sql, prepObj.params)
        )
      )
    } catch (err) {
      throw new JottError(err)
    }
  }

  async fetchRecord(instance, conditions) {
    const recordData = instance.getConfigMetaData()
    const query = new QueryBuilder({ prefix: recordData.prefix })
    let statement = query.retrieveAll().fromCollection(recordData.collection).where('id').is(recordData.id)
    if (conditions) {
      conditions.forEach(condition => {
        statement = statement.and(condition.property).is(condition.value)
      })
    }
    const prepObj = statement.limitTo(1).toPreparedObject()

    try {
      return instance.mapProperties(
        this.driver.getFirstRowFromQuery(
          await this.driver.query(prepObj.sql, prepObj.params)
        )
      )
    } catch (err) {
      throw new JottError(err)
    }
  }

  async updateRecord(instance) {
    const recordData = instance.getConfigMetaData()
    const query = new QueryBuilder({ prefix: recordData.prefix })
    let mutatedData = instance.getMutatedData()
    mutatedData.modified = Math.floor(Date.now() / 1000)
    const prepObj = query.update(mutatedData).inCollection(recordData.collection).where('id').is(recordData.id).thenReturn().toPreparedObject()
    try {
      return (
        Object.keys(mutatedData).length === 1 ?
        instance :
        instance.mapProperties(
          this.driver.getFirstRowFromQuery(
            await this.driver.query(prepObj.sql, prepObj.params)
          )
        )
      )
    } catch(err) {
      throw new JottError(err)
    }
  }
}
