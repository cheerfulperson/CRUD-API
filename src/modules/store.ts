import { v4 } from 'uuid';
import { User, UserInfo } from '../models/user.model';

class Store {
  public users: User[] = [];

  public getUserById(id: string): User | undefined {
    return this.users.find((user: User) => user.id === id);
  }

  public addUser(userData: UserInfo): User {
    const newUser = {
      id: v4(),
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }
}

const store = new Store();

export default store;
