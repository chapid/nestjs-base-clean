export class DomainException extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class UserAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`El usuario con email '${email}' ya existe`, 'USER_ALREADY_EXISTS');
  }
}

export class InvalidUserNameException extends DomainException {
  constructor() {
    super('El nombre del usuario es requerido y no puede estar vacío', 'INVALID_USER_NAME');
  }
}

export class InvalidEmailException extends DomainException {
  constructor(email: string) {
    super(`El email '${email}' no tiene un formato válido`, 'INVALID_EMAIL');
  }
}

export class UserNotFoundException extends DomainException {
  constructor(identifier: string) {
    super(`No se encontró el usuario: ${identifier}`, 'USER_NOT_FOUND');
  }
}