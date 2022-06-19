import http from 'http';
import {
  DeleteHelper,
  GetHelper,
  PostHelper,
  PutHelper,
} from '../models/crud-helper.model';
import { ReqCallback } from '../models/request-listener.model';
import Router from './router';

class HttpHelper implements GetHelper, PostHelper, DeleteHelper, PutHelper {
  private app: http.Server;

  public constructor(app: http.Server) {
    this.app = app;
  }

  public use(path: string, appRouter: Router): void {
    appRouter.routerListeners.forEach((listener) => {
      switch (listener.method) {
        case 'get':
          this.get(path.concat(listener.path), listener.cb);
          break;
        case 'post':
          this.post(path.concat(listener.path), listener.cb);
          break;
        case 'put':
          this.put(path.concat(listener.path), listener.cb);
          break;
        case 'delete':
          this.delete(path.concat(listener.path), listener.cb);
          break;
        default:
          break;
      }
    });
  }

  public get(path: string, cb: ReqCallback): void {
    this.intercept(path, (req, res) => {
      if (req.method === 'GET') {
        cb(req, res);
      } else {
        this.sendError(res);
      }
    });
  }

  public post(path: string, cb: ReqCallback): void {
    this.intercept(path, (req, res) => {
      if (req.method === 'POST') {
        cb(req, res);
      } else {
        this.sendError(res);
      }
    });
  }

  public put(path: string, cb: ReqCallback): void {
    this.intercept(path, (req, res) => {
      if (req.method === 'PUT') {
        cb(req, res);
      } else {
        this.sendError(res);
      }
    });
  }

  public delete(path: string, cb: ReqCallback): void {
    this.intercept(path, (req, res) => {
      if (req.method === 'DELETE') {
        cb(req, res);
      } else {
        this.sendError(res);
      }
    });
  }

  public start(port: string | number): void {
    this.app.listen(port, () => {
      console.log(
        '\x1b[35m',
        `Server start on http://localhost:${port}`,
        '\x1b[0m',
      );
    });
  }

  private intercept(path: string, cb: ReqCallback): void {
    this.app.on(
      'request',
      (req: http.IncomingMessage, res: http.ServerResponse) => {
        const existingPath = `/api${path.startsWith('/') ? path : `/${path}`}`;

        res.setHeader('Content-Type', 'application/json');

        if (req.url === existingPath) {
          console.log(req.url);
          cb(req, res);
        } else {
          this.sendError(res);
        }
      },
    );
  }

  private sendError(
    res: http.ServerResponse,
    code = 404,
    message = 'Not found',
  ): void {
    res.statusCode = code;
    res.end(JSON.stringify({ message }));
  }
}

export default HttpHelper;
