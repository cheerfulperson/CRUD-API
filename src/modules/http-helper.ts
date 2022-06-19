import http from 'http';
import {
  DeleteHelper,
  GetHelper,
  PostHelper,
  PutHelper,
} from '../models/crud-helper.model';
import {
  CustomIncomingMessage,
  OmitRouterListener,
  Params,
  ReqCallback,
} from '../models/request-listener.model';
import Router from './router';

class HttpHelper implements GetHelper, PostHelper, DeleteHelper, PutHelper {
  private app: http.Server;

  private existingPathes: string[] = [];

  private listeners: OmitRouterListener[] = [];

  private isSent = false;

  public constructor(app: http.Server) {
    this.app = app;
  }

  public use(path: string, appRouter: Router): void {
    appRouter.routerListeners.forEach((listener) => {
      const childPath = listener.path.startsWith('/')
        ? listener.path
        : `/${listener.path}`;
      switch (listener.method) {
        case 'get':
          this.get(path.concat(childPath), listener.cb);
          break;
        case 'post':
          this.post(path.concat(childPath), listener.cb);
          break;
        case 'put':
          this.put(path.concat(childPath), listener.cb);
          break;
        case 'delete':
          this.delete(path.concat(childPath), listener.cb);
          break;
        default:
          break;
      }
    });
  }

  public get(path: string, cb: ReqCallback): void {
    this.defineMethod('GET', path, cb);
  }

  public post(path: string, cb: ReqCallback): void {
    this.defineMethod('POST', path, cb);
  }

  public put(path: string, cb: ReqCallback): void {
    this.defineMethod('PUT', path, cb);
  }

  public delete(path: string, cb: ReqCallback): void {
    this.defineMethod('DELETE', path, cb);
  }

  public start(port: string | number): void {
    this.app.listen(port, () => {
      console.log(
        '\x1b[35m',
        `Server start on http://localhost:${port}`,
        '\x1b[0m',
      );
      this.intercept();
    });
  }

  private intercept(): void {
    this.app.on(
      'request',
      (req: http.IncomingMessage, res: http.ServerResponse) => {
        const newReq: CustomIncomingMessage = req;
        this.isSent = false;

        this.listeners.forEach((listener) => {
          newReq.params = this.getRequestParams(req, listener.path);

          if (
            this.isPathCoincidence(req.url || '', listener.path)
            && !this.isSent
          ) {
            console.log(newReq.url, newReq.params);
            res.setHeader('Content-Type', 'application/json');
            listener.cb(newReq, res);
            this.isSent = true;
          }
        });

        if (!this.hasExistingPathes(req.url || '') && !this.isSent) {
          this.sendError(res);
        }

        req.once('error', () => {
          this.sendError(res, 500, 'Internal Server Error');
        });
      },
    );
  }

  private defineMethod(method: string, path: string, cb: ReqCallback): void {
    const existingPath = `/api${
      path.startsWith('/') || !path ? path || '' : `/${path}`
    }`;
    this.existingPathes.push(existingPath);
    this.listeners.push({
      path: existingPath,
      cb: (req, res) => {
        if (req.method === method) {
          cb(req, res);
        } else {
          this.sendError(res);
        }
      },
    });
  }

  private sendError(
    res: http.ServerResponse,
    code = 404,
    message = 'Not found',
  ): void {
    this.isSent = true;
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = code;
    res.end(JSON.stringify({ message }));
  }

  private getRequestParams(req: http.IncomingMessage, path: string): Params[] {
    const urlRoute = req.url?.split('/') ?? [];
    const pathRoute = path.split('/');
    const params: Params[] = [];
    pathRoute.forEach((paramName, i) => {
      if (paramName.startsWith(':')) {
        params.push({
          [paramName.slice(1, paramName.length)]: urlRoute[i] || '',
        });
      }
    });
    return params;
  }

  private hasExistingPathes(url: string): boolean {
    let isPathExist = false;
    this.existingPathes.forEach((path) => {
      isPathExist = this.isPathCoincidence(url, path);
    });
    return isPathExist;
  }

  private isPathCoincidence(url: string, path: string): boolean {
    const pathRoute = path.split('/').filter((value) => value);
    const urlRoute = url.split('/').filter((value) => value);

    pathRoute.forEach((route, i) => {
      if (route.startsWith(':') && urlRoute[i]) {
        urlRoute.splice(i, 1, route);
      }
    });

    if (pathRoute.join('/') === urlRoute.join('/')) {
      return true;
    }
    return false;
  }
}

export default HttpHelper;
