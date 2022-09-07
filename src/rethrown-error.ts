/**  RethrownError can be used rethrow an error while annotating it with a custom message.

The .stack property of a new Error is a plain string and can be modified to say what you like before it is thrown.
Replacing an errors stack property completely can get really confusing for debugging though.
When the original thrown error and the error handler are in separate locations, you might be able to trace the source of the original error but not trace the handler where the error was actually trapped. 
To avoid this it's good to keep some references to both the original and new error in the stack. It's also useful to have access to the complete original error if there was additional metadata stored in it.
That's why this class keeps the original stack and error.
*/
export default class RethrownError extends Error {
  private _original_error: Error;
  private _stack_before_rethrow: string;

  constructor(message: string, error: Error) {
    super(message);
    this.name = this.constructor.name;
    if (!error) throw new Error('RethrownError requires a message and error');
    this.original_error = error;
    this.stack_before_rethrow = this.stack;

    this._removeNewlyCreatedStack();

    // Append the given error's stack to the given message
    this.stack = this.stack + '\n' + error.stack;
  }

  // This is a hack to get rid of most of the new stack,
  // except of the given message and the line where RethrownError was declared (this is the first line after the message, thus message_lines + 1).
  // (We don't care about the RethrownError's stack, but only the original error's one)
  private _removeNewlyCreatedStack() {
    const message_lines = (this.message.match(/\n/g) ?? []).length + 1;
    return this.stack
      .split('\n')
      .slice(0, message_lines + 1)
      .join('\n');
  }

  public get original_error(): Error {
    return this._original_error;
  }
  public set original_error(value: Error) {
    this._original_error = value;
  }

  public get stack_before_rethrow(): string {
    return this._stack_before_rethrow;
  }
  public set stack_before_rethrow(value: string) {
    this._stack_before_rethrow = value;
  }
}
