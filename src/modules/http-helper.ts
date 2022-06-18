import http from 'http';
import { ReqCallback } from '../models/request-listener.model';

class HttpHelper {
  private app: http.Server;

  public constructor(app: http.Server) {
    this.app = app;
  }

  public get(path: string, cb: ReqCallback): void {
    this.intercept((req, res) => {
      cb(req, res);
    });
  }

  public start(port: string | number): void {
    this.app.listen(port, () => {
      console.log(
        '\x1b[32m',
        `Server start on http://localhost:${port}`,
        '\x1b[32m',
      );
    });
  }

  private intercept(cb: ReqCallback): void {
    this.app.on(
      'request',
      (req: http.IncomingMessage, res: http.ServerResponse) => {
        console.log(req.url?.startsWith('api') || req.url?.startsWith('/api'));
        res.setHeader('Content-Type', 'application/json');
        cb(req, res);
      },
    );
  }
}

export default HttpHelper;
