import Ledger from '../models/Ledger.js'
import Collection from '../collections/Collection.js'

export default class Jott {
  constructor(Store, Driver) {
    this.client = new Store(new Driver())
  }

  sayHello() {
    console.log('Hello!')
  }

  async connect() {
    return await this.client.connect()
  }

  async disconnect() {
    await this.client.disconnect()
  }

  async sync(resource) {
    if (resource instanceof Collection) {
      return await this.client.fetchCollection(resource)
    }
    return await this.client.syncInstance(resource)
  }

  async ledger(id) {
    const ledger = new Ledger(id, this.client)
    return (id && this.client) ? this.client.syncInstance(ledger) : ledger
  }
}
