process.env.NODE_ENV = 'test';
const db = require('../../db');
const sqlForPartialUpdate = require('../../helpers/partialUpdate');

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

describe('partialUpdate()', () => {
  it('should generate a proper partial update query with just 1 field', async function() {
    const result = await sqlForPartialUpdate(
      'companies',
      { name: 'Victor takes over' },
      'handle',
      'JDAB'
    );
    console.log('TESTING RESULT IN __TESTS__:', result);
    expect(result.values[0]).toBe('Victor takes over');
    expect(result.values[1]).toBe('JDAB');
  });
});

afterEach(async function() {
  await db.query(`DELETE FROM companies`);
});

afterAll(async function() {
  await db.end();
});
