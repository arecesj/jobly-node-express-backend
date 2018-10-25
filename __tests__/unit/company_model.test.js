process.env.NODE_ENV = 'test';
const db = require('../../db');
const sqlForPartialUpdate = require('../../helpers/partialUpdate');
const Company = require('../../models/company');

//TODO: Middleware MidMaxSize Function

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

/** Test search with no search query but a min and a max */
describe('Company.search() w/ search and max', () => {
  it('Should get back all of the companies and responds with Company Data', async function() {
    const result = await Company.search({
      min_employees: 0,
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
describe('Company.search() w/ search, a max and bad query', () => {
  it('Should get back all of the companies and responds with Company Data', async function() {
    const result = await Company.search({
      min_employees: 100,
      max_employees: 500
    });

    expect(result.length).toBe(0);
  });
});

/** Test search with no search query and only a min */
describe('Company.search() w/ min', () => {
  it('Should get back all of the companies and responds with Company Data', async function() {
    const result = await Company.search({
      min_employees: 0
    });
    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty('handle');
    expect(result[0]).toHaveProperty('name');
    expect(result[0].handle).toBe('JDAB');
    expect(result[0].name).toBe('JD Areces and Bros, LLC');
  });
});

//Test that search returns error on a max and bad query
describe('Company.search() w/ search, a max and bad query', () => {
  it('Should get back all of the companies and responds with Company Data', async function() {
    const result = await Company.search({
      min_employees: 100
    });

    expect(result.length).toBe(0);
  });
});

/** Test search with no search query and only a max */
describe('Company.search() w/ max', () => {
  it('Should get back all of the companies and responds with Company Data', async function() {
    const result = await Company.search({
      max_employees: 100
    });
    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty('handle');
    expect(result[0]).toHaveProperty('name');
    expect(result[0].handle).toBe('JDAB');
    expect(result[0].name).toBe('JD Areces and Bros, LLC');
  });
});

//Test that search returns error on a max and bad query
describe('Company.search() w/ search, a max and bad query', () => {
  it('Should get back all of the companies and responds with Company Data', async function() {
    const result = await Company.search({
      max_employees: 5
    });

    expect(result.length).toBe(0);
  });
});

/** Create Method */

/** Test create with valid company */
describe('Company.create() w/ company name and handle', () => {
  it('Should get back the company name/handle and responds with company name/handle', async function() {
    const result = await Company.create({
      name: "Juan's Deli",
      handle: 'DELI'
    });
    expect(result).toHaveProperty('handle');
    expect(result).toHaveProperty('name');
    expect(result.handle).toBe('DELI');
    expect(result.name).toBe("Juan's Deli");
  });
});

// Test that create returns error on empty string as company
// describe('Company.create() w/ empty string ', async () => {
//   await it('Should get back an error message', async function() {
//     await expect(async () => {
//       await Company.create({ name: 'Deli' });
//     }).toThrow();
//   });
// });

describe('Company.create() w/ empty string ', () => {
  it('Should get back an error message', async function() {
    let message = 'request went through';
    try {
      await Company.create({ name: 'Deli' });
    } catch (err) {
      message = err.message;
    }
    expect(message).toMatch('Add both handle AND name');
  });
});

/** Get One Method */

/** Test get one method with valid company */
describe('Company.getOne() w/ company name and handle', () => {
  it('Should get back the company name/handle and responds with company name/handle', async function() {
    const result = await Company.getOne('JDAB');
    expect(result).toHaveProperty('handle');
    expect(result).toHaveProperty('name');
    expect(result.handle).toBe('JDAB');
    expect(result.name).toBe('JD Areces and Bros, LLC');
  });
});

describe('Company.getOne() w/ wrong handle ', () => {
  it('Should get back an error message', async function() {
    let result = Company.getOne('DDDDDDDDDDD');
    expect(Object.keys(result).length).toBe(0);
  });
});
/** Update Method */

/** Test update method with valid company */
describe('Company.update() w/ company handle and its items', () => {
  it('Should get back the company name/handle and responds with company name/handle', async function() {
    const result = await Company.update('JDAB', { logo_url: '' });
    expect(result).toHaveProperty('handle');
    expect(result).toHaveProperty('name');
    expect(result.handle).toBe('JDAB');
    expect(result.logo_url).toBe('');
  });
});

describe('Company.update() w/ wrong handle ', () => {
  it('Should get back an error message', async function() {
    try {
      await Company.update('dddddddddd', { logo_url: 'ya bro' });
    } catch (err) {
      expect(err.message).toMatch(
        'Please enter correct company handle and associated info'
      );
    }
  });
});

/** Delete Method */

/** Test delete method with valid company */
describe('Company.delete() w/ company handle', () => {
  it('Should get back the message saying company was deleted', async function() {
    const result = await Company.delete('JDAB');
    expect(result.message).toBe('Company deleted');
  });
});

describe('Company.delete() w/ wrong handle ', () => {
  it('Should get back an error message', async function() {
    try {
      await Company.update('dddddddddd');
    } catch (err) {
      expect(err.message).toMatch('Please enter correct company handle');
    }
  });
});

afterEach(async function() {
  await db.query(`DELETE FROM companies`);
});

afterAll(async function() {
  await db.end();
});
