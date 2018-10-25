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
describe('User.getAll() w/ no search terms', () => {
  it('Should get back all of the companies and responds with Company Data', async function() {
    const result = await Company.getAll();

    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty('handle');
    expect(result[0]).toHaveProperty('name');
    expect(result[0].handle).toBe('JDAB');
    expect(result[0].name).toBe('JD Areces and Bros, LLC');
  });
});

/** Search Methods */
describe('User.search() w/ just search', () => {
  it('Should get back all of the companies and responds with Company Data', async function() {
    const result = await Company.search({ search: 'Bros' });

    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty('handle');
    expect(result[0]).toHaveProperty('name');
    expect(result[0].handle).toBe('JDAB');
    expect(result[0].name).toBe('JD Areces and Bros, LLC');
  });
});

//Test that search returns error on with bad query
describe('User.getAll() w/ just search and bad query', () => {
  it('Should not get back all of the companies and responds with Company Data', async function() {
    const result = await Company.search({ search: 'hhhhh' });

    expect(result.length).toBe(0);
  });
});

describe('User.getAll() w/ search and min', () => {
  it('Should get back all of the companies and responds with Company Data', async function() {
    const result = await Company.search({ search: 'Bros', min_employees: 1 });

    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty('handle');
    expect(result[0]).toHaveProperty('name');
    expect(result[0].handle).toBe('JDAB');
    expect(result[0].name).toBe('JD Areces and Bros, LLC');
  });
});

//Test that search returns error on a min and bad query
describe('User.getAll() w/ search, a min and bad query', () => {
  it('Should get back all of the companies and responds with Company Data', async function() {
    const result = await Company.search({
      search: 'juanito',
      min_employees: 5
    });

    expect(result.length).toBe(0);
  });
});

describe('User.getAll() w/ search and max', () => {
  it('Should get back all of the companies and responds with Company Data', async function() {
    const result = await Company.search({
      search: 'bro',
      max_employees: 300
    });
    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty('handle');
    expect(result[0]).toHaveProperty('name');
    expect(result[0].handle).toBe('JDAB');
    expect(result[0].name).toBe('JD Areces and Bros, LLC');
  });
});

//Test that search returns error on a max and bad query
describe('User.getAll() w/ search, a max and bad query', () => {
  it('Should get back all of the companies and responds with Company Data', async function() {
    const result = await Company.search({
      search: 'juanito',
      max_employees: 300
    });

    expect(result.length).toBe(0);
  });
});

//TODO: Min + Max, Min, Max, Middleware MidMaxSize Function
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
