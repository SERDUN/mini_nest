export class HttpException extends Error {
  constructor(
    private readonly response: string | object,
    private readonly status: number
  ) {
    super();
  }

  getResponse() {
    return this.response;
  }

  getStatus() {
    return this.status;
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string | object) {
    super(message, 400);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}
