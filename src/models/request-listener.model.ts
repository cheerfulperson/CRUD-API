import { IncomingMessage, ServerResponse } from 'http';

export type Params = { [key: string]: string };

export interface CustomIncomingMessage extends IncomingMessage {
  params?: Params[];
}

export interface RequestListener {
  req: CustomIncomingMessage;
  res: ServerResponse;
}

export type ReqCallback = (
  req: CustomIncomingMessage,
  res: ServerResponse,
) => void;

export interface RouterListener {
  method: string;
  path: string;
  cb: ReqCallback;
}

export type OmitRouterListener = Omit<RouterListener, 'method'>;
