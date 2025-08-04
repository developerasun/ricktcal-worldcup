import { HttpStatus } from '@/constants';

interface IHttpExceptionOptions extends ErrorOptions {
  path?: string;
  code?: HttpStatus;
}

class HttpException extends Error {
  #status: undefined | HttpStatus = undefined;
  #path: undefined | string;

  constructor(message?: string, options?: IHttpExceptionOptions) {
    super(message, options);
    this.#status = options?.code;
    this.#path = options?.path;
  }

  // @dev inherit this context
  short = () => {
    return {
      message: this.message,
      code: this.#status,
      path: this.#path,
    };
  };

  full() {
    const _ = this.short();
    return {
      ..._,
      stack: this.stack,
      cause: this.cause,
    };
  }
}

export class UnAuthorizedException extends HttpException {
  constructor(message?: string, options?: IHttpExceptionOptions) {
    super(message, options);
  }
}

export class BadRequestException extends HttpException {
  constructor(message?: string, options?: IHttpExceptionOptions) {
    super(message, options);
  }
}

export class NotFoundException extends HttpException {
  constructor(message?: string, options?: IHttpExceptionOptions) {
    super(message, options);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message?: string, options?: IHttpExceptionOptions) {
    super(message, options);
  }
}
