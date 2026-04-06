export class InvalidCredentialsException extends Error {
  constructor() {
    super('Credenciales inválidas');
    this.name = 'InvalidCredentialsException';
  }
}

export class UserNotFoundException extends Error {
  constructor(email?: string) {
    super(email ? `Usuario con email ${email} no encontrado` : 'Usuario no encontrado');
    this.name = 'UserNotFoundException';
  }
}

export class UserAlreadyExistsException extends Error {
  constructor(email?: string) {
    super(email ? `Usuario con email ${email} ya existe` : 'El usuario ya existe');
    this.name = 'UserAlreadyExistsException';
  }
}

export class InvalidTokenException extends Error {
  constructor(message = 'Token inválido') {
    super(message);
    this.name = 'InvalidTokenException';
  }
}

export class ExpiredTokenException extends Error {
  constructor() {
    super('Token expirado');
    this.name = 'ExpiredTokenException';
  }
}