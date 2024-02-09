import Postgres from '../../lib/drivers/Postgres.js'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

export default {
  async main() {
    await this.checkEnvironment()
    await this.installTables()
    return 'jott installation complete!'
  },

  async checkEnvironment() {
    [
      'PGHOST',
      'PGUSER',
      'PGPASSWORD',
      'PGDATABASE',
      'PGSCHEMA',
      'PGPORT'
    ].forEach(param => {
      if (!process.env[param]) {
        throw new Error(`Environment variable ${param} is missing from the .env file`)
      }
    })
    
  },

  async installTables() {
    try {
      const sql = fs
                  .readFileSync('./bin/install/tables.sql')
                  .toString()
                  .replaceAll('<db_user>', process.env.PGUSER)
                  .replaceAll('<db_schema>', process.env.PGSCHEMA)
      const client = new Postgres()
      await client.connect()
      await client.query(sql)
      await client.disconnect()
    } catch (err) {
      throw new Error(`Could not complete installation; please make sure your database details are correct in your .env file`)
    }
  }
}
