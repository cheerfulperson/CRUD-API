import http from 'http';
import HttpHelper from './modules/http-helper';

const server = http.createServer();
const app = new HttpHelper(server);

app.get('/api', (req, res) => {
    res.end('{}');
});

export default app;
