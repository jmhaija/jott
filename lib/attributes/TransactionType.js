import JottError from "../core/JottError.js"

export default class TransactionType extends String {
  #types = ['transfer', 'purchase', 'refund', 'settlement', 'disbursement', 'withdrawal', 'deposit', 'remittance']

  constructor(val) {
    super(val)
    if (!this.#types.includes(val)) {
      throw new JottError(`'${val}' is not a valid TransactionType; must be one of: ${this.#types.join(', ')}`)
    }
  }
}
