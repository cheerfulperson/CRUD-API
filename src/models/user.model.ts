export interface UserInfo {
  username: string;
  age: number;
  hobbies: string[];
}

export interface User extends UserInfo {
  id: string;
}
