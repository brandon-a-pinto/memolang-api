export class InvalidUserError extends Error {
  constructor() {
    super('Invalid user')
    this.name = 'InvalidUserError'
  }
}
