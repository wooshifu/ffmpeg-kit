export class Log {

  constructor(sessionId: number, level: number, message: String);

  getSessionId(): number;

  getLevel(): number;

  getMessage(): String;

}
