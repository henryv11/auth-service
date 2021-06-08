import { Repository as R } from '../../lib';
import { CreateSession, FilterSession, filterSession, Session, session, UpdateSession } from './schemas';

export default class SessionRepository extends R<typeof session, typeof filterSession> {
  constructor() {
    super(session, {
      id: (id, where) => where.and`id = ${id}`,
      createdAt: (createdAt, where) => where.and`created_at = ${createdAt}`,
      updatedAt: (updatedAt, where) => where.and`updated_at = ${updatedAt}`,
      userId: (userId, where) => where.and`user_id = ${userId}`,
      token: (token, where) => where.and`token = ${token}`,
    });
  }

  create(session: CreateSession, conn = this.query) {
    return conn<Session>(
      R.sql`INSERT INTO ${this.table} (token, user_id)
            ${R.sql.values([[session.token, session.userId]])}
            RETURNING ${this.columns}`,
    ).then(R.firstRow);
  }

  update({ token, userId }: UpdateSession, filters: FilterSession, conn = this.query) {
    return conn<Session>(R.sql`UPDATE ${this.table}
                              ${R.sql.set({ token, user_id: userId })}
                              ${this.where(filters)}
                              RETURNING ${this.columns}`);
  }

  findOne(filters: FilterSession, conn = this.query) {
    return conn<Session>(R.sql`${this.selectSql(filters)} LIMIT 1`).then(R.firstRow);
  }

  findMaybeOne(filters: FilterSession, conn = this.query) {
    return conn<Session>(R.sql`${this.selectSql(filters)} LIMIT 1`).then(R.maybeFirstRow);
  }

  list(filters: FilterSession, conn = this.query) {
    return conn<Session>(this.selectSql(filters)).then(R.allRows);
  }

  private selectSql(filters: FilterSession, columns = this.columns) {
    return R.sql`SELECT ${columns}
                FROM ${this.table}
                WHERE ${this.where(filters)}`;
  }
}
