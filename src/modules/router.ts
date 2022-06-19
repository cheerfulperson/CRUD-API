import {
  DeleteHelper,
  GetHelper,
  PostHelper,
  PutHelper,
} from '../models/crud-helper.model';
import { ReqCallback, RouterListener } from '../models/request-listener.model';

class Router implements GetHelper, PostHelper, DeleteHelper, PutHelper {
  public routerListeners: RouterListener[] = [];

  public get(path: string, cb: ReqCallback): void {
    this.pushData(
      {
        path,
        cb,
      },
      'get',
    );
  }

  public post(path: string, cb: ReqCallback): void {
    this.pushData(
      {
        path,
        cb,
      },
      'post',
    );
  }

  public put(path: string, cb: ReqCallback): void {
    this.pushData(
      {
        path,
        cb,
      },
      'put',
    );
  }

  public delete(path: string, cb: ReqCallback): void {
    this.pushData(
      {
        path,
        cb,
      },
      'delete',
    );
  }

  private pushData(data: Omit<RouterListener, 'method'>, method: string): void {
    this.routerListeners.push({
      method,
      ...data,
    });
  }
}

export default Router;
