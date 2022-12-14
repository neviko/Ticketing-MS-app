export abstract class CustomError extends Error{
    // abstract means - must be implemented in children
    abstract statusCode: number
    abstract serializeErrors(): { message:string, field?:string }[]
    
    
    constructor(message:string){
      super(message);
      // only because we are extending a built in class
      Object.setPrototypeOf(this,CustomError.prototype);
    }
}