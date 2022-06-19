import { validate } from 'uuid';
import store from '../../modules/store';
import Router from '../../modules/router';
import { User, UserInfo } from '../../models/user.model';

const appRouter = new Router();

function checkRequiredInfo(reqBody: Partial<UserInfo>): string[] {
  const invalidMessages: string[] = [];

  if (!reqBody.username || typeof reqBody.username !== 'string') {
    invalidMessages.push('Invalid username');
  }

  if (!reqBody.hobbies || !Array.isArray(reqBody.hobbies)) {
    invalidMessages.push('Invalid hobbies');
  }

  if (!reqBody.age || typeof reqBody.age !== 'number') {
    invalidMessages.push('Invalid age');
  }

  Object.keys(reqBody).forEach((key) => {
    if (key !== 'username' && key !== 'hobbies' && key !== 'age') {
      invalidMessages.push(`Unexpected property ${key}`);
    }
  });

  return invalidMessages;
}

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

appRouter.post('', (req, res) => {
  try {
    const reqBody: Partial<UserInfo> = JSON.parse(req.body || '');
    const invalidMessages = checkRequiredInfo(reqBody);

    if (invalidMessages.length === 0) {
      const newUser: User = store.addUser(<UserInfo>reqBody);
      res.statusCode = 201;
      res.end(JSON.stringify(newUser));
    } else {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: invalidMessages }));
    }
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
});

appRouter.put(':userid', (req, res) => {
  try {
    const reqBody: Partial<UserInfo> = JSON.parse(req.body || '');
    const invalidMessages = checkRequiredInfo(reqBody);
    const userId = req.params?.find((param) => param.userid)?.userid || '';
    if (!validate(userId)) {
      invalidMessages.push('Invalid userid');
    }

    if (invalidMessages.length === 0) {
      const updatedUser: User | undefined = store.updateUser(
        userId,
        <UserInfo>reqBody,
      );
      if (updatedUser) {
        res.end(JSON.stringify(updatedUser));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'User not found' }));
      }
    } else {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: invalidMessages }));
    }
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
});

appRouter.delete(':userid', (req, res) => {
  const userId = req.params?.find((param) => param.userid)?.userid || '';
  if (validate(userId)) {
    const user: User | undefined = store.getUserById(userId);
    if (user) {
      res.setHeader('content-type', 'none');
      res.statusCode = 204;
      store.deleteUser(userId);
      res.end();
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
