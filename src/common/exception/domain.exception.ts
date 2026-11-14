import { ApplicationException } from "./application.exception"

export class BadException extends ApplicationException {
    constructor(message: string = "BadRequest", cause?: unknown) {
        super(message, 400, { cause })

    }
}
export class NotFoundException extends ApplicationException {
    constructor(message: string = "NotFOund", cause?: unknown) {
        super(message, 404, { cause })
    }
}
export class UnAuthorizedException extends ApplicationException {
    constructor(message: string = "UnAuthorized", cause?: unknown) {
        super(message, 401, { cause })
    }
}
export class ForbiedenException extends ApplicationException {
    constructor(message: string = "Forbieden", cause?: unknown) {
        super(message, 403, { cause })
    }
}
export class ConflictException extends ApplicationException {
    constructor(message: string = "Conflict", cause?: unknown) {
        super(message, 409, { cause })
    }
}
export class TooManyException extends ApplicationException {
    constructor(message: string = "TooMany", cause?: unknown) {
        super(message, 429, { cause })
    }
}