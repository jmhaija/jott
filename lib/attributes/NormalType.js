import JottError from "../core/JottError.js"

export default class NormalType extends String {
  #types = ['debit', 'credit']

  constructor(val) {
    super(val)
    if (!this.#types.includes(val)) {
      throw new JottError(`NormalType can be either 'debit' or 'credit' (got '${val}')`)
    }
  }
}
