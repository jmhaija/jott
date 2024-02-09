import JottError from "../core/JottError.js"

export default class TransactionStatus extends String {
  #types = ['posted', 'pending', 'cancelled', 'failed']

  constructor(val) {
    super(val)
    if (!this.#types.includes(val)) {
      throw new JottError(`'${val}' is not a valid TransactionStatus; must be one of: ${this.#types.join(', ')}`)
    }
  }
}
