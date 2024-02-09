import JottError from "../core/JottError.js"

export default class AccountType extends String {
  #types = ['consumer', 'merchant', 'institution', 'aggregate', 'custodial']

  constructor(val) {
    super(val)
    if (!this.#types.includes(val)) {
      throw new JottError(`'${val}' is not a valid AccountType; must be one of: ${this.#types.join(', ')}`)
    }
  }
}
