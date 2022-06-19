import { User } from '../models/user.model';

class Store {
  public users: User[] = [];

  public getUserById(id: string): User | undefined {
    return this.users.find((user: User) => user.id === id);
  }
}

const store = new Store();

export default store;
