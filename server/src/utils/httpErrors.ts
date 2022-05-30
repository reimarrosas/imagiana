abstract class HttpError extends Error {
  statusCode!: number;

  constructor(name: string, message: string, statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }

  public override toString() {
    return `Error ${this.statusCode}: ${this.name} --- ${this.message}`;
  }
}

export class HttpBadRequest extends HttpError {
  constructor(message: string = "Request data is invalid!") {
    super("Bad Request", message, 400);
  }
}

export class HttpUnauthorized extends HttpError {
  constructor(message: string = "User is unauthenticated!") {
    super("Unauthorized", message, 401);
  }
}

export class HttpForbidden extends HttpError {
  constructor(message: string = "User Access Forbidden!") {
    super("Forbidden", message, 403);
  }
}

export class HttpNotFound extends HttpError {
  constructor(message: string = "Requested resource Not Found!") {
    super("Not Found", message, 404);
  }
}

export class HttpConflict extends HttpError {
  constructor(message: string = "Request conflicts with current state!") {
    super("Conflict", message, 409);
  }
}

export class HttpInternal extends HttpError {
  constructor(message: string = "Something Broke!") {
    super("Internal Server Error", message, 500);
  }
}
