export interface AnyObject {
  [key: string]: any | AnyObject
}

export class ErrorWithExtensions extends Error {
  extensions: AnyObject

  constructor(message: string, additionalData?: AnyObject) {
    super(message)

    this.extensions = additionalData ?? {}
  }
}
