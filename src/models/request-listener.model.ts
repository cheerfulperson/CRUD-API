import { IncomingMessage, ServerResponse } from 'http';

export interface RequestListener {
  req: IncomingMessage;
  res: ServerResponse;
}

export type ReqCallback = (req: IncomingMessage, res: ServerResponse) => void;
