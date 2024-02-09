import Store from './lib/services/Store.js'
import Postgres from './lib/drivers/Postgres.js'
import Jott from './lib/core/Jott.js'
import dotenv from 'dotenv'
dotenv.config()

export default new Jott(Store, Postgres)
