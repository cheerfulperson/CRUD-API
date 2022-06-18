import 'dotenv/config';
import app from './app';

const defaultPort = '4000';

app.start(process.env.PORT || defaultPort);
