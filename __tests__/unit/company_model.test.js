process.env.NODE_ENV = 'test';
const db = require('../../db');
const sqlForPartialUpdate = require('../../helpers/partialUpdate');
const Company = require('../../models/company');

beforeAll(async function() {
  await db.query(`DROP TABLE IF EXISTS companies`);
  await db.query(
    `CREATE TABLE companies (
      handle TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      num_employees INTEGER,
      description TEXT,
      logo_url TEXT)`
  );
});

beforeEach(async function() {
  await db.query(
    `INSERT INTO companies (
      handle, name, num_employees, description, logo_url)
      VALUES ($1, $2, $3, $4, $5)`,
    [
      'JDAB',
      'JD Areces and Bros, LLC',
      10,
      'Keeping Victor out of jail and away from guns since 1991',
      'https://i.ytimg.com/vi/a8rPMdIiciY/hqdefault.jpg'
    ]
  );
});

/** Get All Method */
describe('User.getAll()', () => {
  it('Should get back all of the companies and responds with Company Data', async function() {
    const result = await Company.getAll();
  });
});

/** Search Method */

/** Create Method */

/** Get One Method */

/** Update Method */

/** Delete Method */

afterEach(async function() {
  await db.query(`DELETE FROM companies`);
});

afterAll(async function() {
  await db.end();
});
