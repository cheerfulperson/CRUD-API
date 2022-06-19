import { validate, v4 } from 'uuid';
import store from '../../modules/store';
import Router from '../../modules/router';
import { User } from '../../models/user.model';

const appRouter = new Router();

appRouter.get('', (req, res) => {
  res.write(JSON.stringify({ users: store.users }));
  res.end();
});

appRouter.get(':userid', (req, res) => {
  const userId = req.params?.find((param) => param.userid)?.userid || '';
  if (validate(userId)) {
    const user: User | undefined = store.getUserById(userId);
    if (user) {
      res.end(JSON.stringify(user));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } else {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: 'Invalid userid' }));
  }
});

export default appRouter;
