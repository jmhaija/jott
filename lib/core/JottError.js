export default class JottError extends Error {
  constructor(message) {
    super(message)
    this.name = 'JOTT ERROR'
  }
}
