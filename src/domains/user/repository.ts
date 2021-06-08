import { CreateUser, filterUser, FilterUser, UpdateUser, User, user } from './schemas';
import { Repository as R } from '../../lib';

export default class UserRepository extends R<typeof user, typeof filterUser> {
  constructor() {
    super(user, {
      id: (id, where) => where.and`id = ${id}`,
      username: (username, where) => where.and`username = ${username}`,
      password: (password, where) => where.and`password = ${password}`,
    });
  }

  create(user: CreateUser, conn = this.query) {
    return conn<User>(
      R.sql`INSERT INTO ${this.table} (username, password)
              VALUES (${user.username}, ${user.password})
              RETURNING ${this.columns}`,
    ).then(R.firstRow);
  }

  update({ username, password }: UpdateUser, filter: FilterUser, conn = this.query) {
    return conn<User>(
      R.sql`UPDATE ${this.table}
              ${R.sql.set({
                username,
                password,
              })}
              ${this.where(filter)}
              RETURNING ${this.columns}`,
    ).then(R.firstRow);
  }
}
