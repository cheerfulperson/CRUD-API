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

  public updateUser(userid: string, userData: UserInfo): User | undefined {
    let updatedUser: User | undefined;

    this.users = this.users.map((user: User) => {
      if (user.id === userid) {
        updatedUser = {
          id: userid,
          ...userData,
        };
        return updatedUser;
      }
      return user;
    });

    return updatedUser;
  }

  public deleteUser(userId: string): void {
    const userIndex = this.users.findIndex((value) => value.id === userId);
    this.users.splice(userIndex, 1);
  }
}

const store = new Store();

export default store;
