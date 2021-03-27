export class ReturnCode {

  static readonly SUCCESS: number;

  static readonly CANCEL: number;

  constructor(value: number);

  static isSuccess(returnCode: ReturnCode): boolean;

  static isCancel(returnCode: ReturnCode): boolean;

  getValue(): number;

  isSuccess(): boolean;

  isError(): boolean;

  isCancel(): boolean;

}
