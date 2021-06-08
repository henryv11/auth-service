import { CreateUser, filterUser, FilterUser, PublicUser, publicUser, UpdateUser, User, user } from './schemas';
import { Repository as R } from '../../lib';

export default class UserRepository extends R<typeof publicUser, typeof filterUser> {
  constructor() {
    super(publicUser, {
      id: (id, where) => where.and`id = ${id}`,
      username: (username, where) => where.and`username = ${username}`,
      password: (password, where) => where.and`password = ${password}`,
    });
  }

  create(user: CreateUser, conn = this.query) {
    return conn<PublicUser>(
      R.sql`INSERT INTO ${this.table} (username, password)
              VALUES (${user.username}, ${user.password})
              RETURNING ${this.columns}`,
    ).then(R.firstRow);
  }

  update(update: UpdateUser, filter: FilterUser, conn = this.query) {
    return conn<PublicUser>(
      R.sql`UPDATE ${this.table}
              ${R.sql.set(this.translateColumns(update))}
              ${this.where(filter)}
              RETURNING ${this.columns}`,
    ).then(R.firstRow);
  }
}
