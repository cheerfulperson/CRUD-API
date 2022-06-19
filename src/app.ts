import http from 'http';
import HttpHelper from './modules/http-helper';
import getUsersRouter from './resources/users/users';

const server = http.createServer();
const app = new HttpHelper(server);

app.use('users', getUsersRouter);

export default app;
