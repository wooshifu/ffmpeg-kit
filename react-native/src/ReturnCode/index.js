class ReturnCode {

  static SUCCESS = 0;

  static CANCEL = 255;

  #value;

  constructor(value) {
    this.#value = value;
  }

  static isSuccess(returnCode) {
    return (returnCode !== undefined && returnCode.getValue() === ReturnCode.SUCCESS);
  }

  static isCancel(returnCode) {
    return (returnCode !== undefined && returnCode.getValue() === ReturnCode.CANCEL);
  }

  getValue() {
    return this.#value;
  }

  isSuccess() {
    return (this.#value === ReturnCode.SUCCESS);
  }

  isError() {
    return ((this.#value !== ReturnCode.SUCCESS) && (this.#value !== ReturnCode.CANCEL));
  }

  isCancel() {
    return (this.#value === ReturnCode.CANCEL);
  }

}

export {
  ReturnCode
}
