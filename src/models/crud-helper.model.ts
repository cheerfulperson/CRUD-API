import { ReqCallback } from './request-listener.model';

export interface GetHelper {
  get(path: string, cb: ReqCallback): void;
}

export interface PostHelper {
  post(path: string, cb: ReqCallback): void;
}

export interface PutHelper {
  put(path: string, cb: ReqCallback): void;
}

export interface DeleteHelper {
  delete(path: string, cb: ReqCallback): void;
}
