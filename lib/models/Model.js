import JottError from '../core/JottError.js'

export default class Model {
  #config
  #state
  #propMetaMap = {}
  #propChanges = {}
  #instanceProxy = {
    get(instance, prop, receiver) {
      const value = instance[prop]
      if (value instanceof Function) {
        return function (...args) {
          return value.apply(this === receiver ? instance : this, args)
        }
      }
      return value
    },

    set(instance, prop, value) {
      if (!instance.getPropsMetaData()[prop].mutable) {
        throw new JottError(`Property '${prop}' of ${instance.constructor.name} is not mutable`)
      }

      instance.#propChanges[prop] = value
      return instance[prop] = instance.validatePropValue(value, prop, instance.getPropsMetaData()[prop].validate)
    }
  }

  constructor(config) {
    this.#config = config
    this.#state = config.instance_id ? 'identified' : 'prestine'
    config.data_props.forEach(property => {
      this.#propMetaMap[property.prop] = {
        autogen: property.autogen,
        required: property.required,
        mutable: property.mutable,
        validate: property.validate
      }
    })
  }

  getState() {
    return this.#state
  }

  getConfigMetaData() {
    return {
      id: this.#config.instance_id,
      collection: this.#config.data_collection,
      prefix: this.#config.data_prefix
    }
  }

  getPropsMetaData() {
    return this.#propMetaMap
  }

  getMutatedData() {
    return this.#propChanges
  }

  validatePropValue(value, prop, validate) {
    if (validate !== undefined && !validate(value)) {
        throw new JottError(`'${value}' is not an acceptable value for ${this.constructor.name}.${prop}`)
    }

    return typeof value === 'object' ? value.toString() : value
  }

  mapProperties(data) {
    if (data) {
      this.#config.data_props.forEach((value) => {
        let index = this.#config.data_prefix + value.prop
        this[value.prop] = data[index]
      })

      this.#state = 'instantiated'
      this.#propChanges = {}
      return new Proxy(this, this.#instanceProxy)
    }

    throw new JottError(`Could not map instance properties of ${this.constructor.name} with id of ${this.#config.instance_id} (does it exist?)`)
  }

  serializeProperties() {
    const hash = {}

    this.#config.data_props.forEach(prop => {
      if (!prop.autogen) {
        if (prop.required && this[prop.prop] === undefined) {
          throw new JottError(`Model property '${prop.prop}' is required for ${this.constructor.name} before serialization`)
        }

        if (this[prop.prop]) {
          let index = this.#config.data_prefix + prop.prop
          hash[index] = this.validatePropValue(this[prop.prop], prop.prop, prop.validate)
        }
      }
    })

    return hash
  }
}
