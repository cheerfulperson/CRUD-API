import store from '../../modules/store';
import Router from '../../modules/router';

const appRouter = new Router();

appRouter.get('', (req, res) => {
  res.end(JSON.stringify({ users: store.users }));
});

export default appRouter;
