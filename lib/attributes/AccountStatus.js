import JottError from "../core/JottError.js"

export default class AccountStatus extends String {
  #types = ['active', 'restricted', 'suspended', 'closed']

  constructor(val) {
    super(val)
    if (!this.#types.includes(val)) {
      throw new JottError(`'${val}' is not a valid AccountStatus; must be one of: ${this.#types.join(', ')}`)
    }
  }
}
