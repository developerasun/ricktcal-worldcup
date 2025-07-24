export class UnauthorizedException extends Error {
  #status: number = 401;
  constructor() {
    super();
  }
}
