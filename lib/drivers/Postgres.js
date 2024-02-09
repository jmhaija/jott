import pg from 'pg'
const { Client } = pg

export default class Postgres {
  constructor() {
    this.client = new Client()
  }

  async connect() {
    return await this.client.connect()
  }

  async disconnect() {
    return await this.client.end()
  }

  async query(query, parameters) {
    return await this.client.query(query, parameters)
  }

  getRowsFromQuery(response) {
    return response.rows ? response.rows : false 
  }

  getFirstRowFromQuery(response) {
    return response.rows[0] ? response.rows[0] : false
  }
}
