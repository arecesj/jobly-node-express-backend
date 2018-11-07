process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
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
  await db.query(
    `INSERT INTO companies (
      handle, name, num_employees, description, logo_url)
      VALUES ($1, $2, $3, $4, $5)`,
    [
      'JCS',
      "Juan's Coffee Shop",
      300,
      'Keeping Victor caffeinated since 1991',
      'https://i.ytimg.com/vi/a8rPMdIiciY/hqdefault.jpg'
    ]
  );
  await db.query(
    `INSERT INTO companies (
      handle, name, num_employees, description, logo_url)
      VALUES ($1, $2, $3, $4, $5)`,
    [
      'JCOS',
      "Juan's Cookie Shop",
      500000,
      'Keeping Victor fat and happy since 1991',
      'https://i.ytimg.com/vi/a8rPMdIiciY/hqdefault.jpg'
    ]
  );
});

/** ROUTES WITH FUNCTIONAL PARAMS */
/** GET all companies route */
describe('GET /companies', function() {
  test('Responds with a list of companies in an array', async function() {
    const response = await request(app).get(`/companies`);
    // console.log('WHAT IS RESPONSE:', response.body);
    expect(response.statusCode).toBe(200); //OK
    expect(response.body.companies.length).toBe(3);
    expect(response.body.companies[0]).toEqual({
      handle: 'JDAB',
      name: 'JD Areces and Bros, LLC'
    });
  });
});

/** POST create new company route */
describe('POST /companies', function() {
  test('Creates a new company and responds with company data in an object', async function() {
    const response = await request(app)
      .post(`/companies`)
      .send({
        handle: 'JAB',
        name: "Victor's jabronis"
      });
    // console.log('WHAT IS RESPONSE:', response.body);
    expect(response.statusCode).toBe(200); // OK
    expect(Object.keys(response.body.company).length).toBe(2);
    expect(response.body.company).toEqual({
      handle: 'JAB',
      name: "Victor's jabronis"
    });
  });
});

/** GET company by handle route */
describe('GET /companies/handle', function() {
  test('Responds with a list of company in an object', async function() {
    const response = await request(app).get(`/companies/JDAB`);
    // console.log('WHAT IS RESPONSE:', response.body);
    expect(response.statusCode).toBe(200); // OK
    expect(Object.keys(response.body.company).length).toBe(5);
    expect(response.body.company).toEqual({
      handle: 'JDAB',
      name: 'JD Areces and Bros, LLC',
      num_employees: 10,
      description: 'Keeping Victor out of jail and away from guns since 1991',
      logo_url: 'https://i.ytimg.com/vi/a8rPMdIiciY/hqdefault.jpg'
    });
  });
});
/** PATCH / Edit a company by ID route */
describe('PATCH /companies/handle', function() {
  test('Edits a company and responds with company data in an object', async function() {
    const response = await request(app)
      .patch(`/companies/JDAB`)
      .send({
        handle: 'JDAB',
        name: 'JD Bros and Sisters, A Family Firm'
      });
    // console.log('WHAT IS RESPONSE:', response.body);
    expect(response.statusCode).toBe(200); // OK
    expect(Object.keys(response.body.company).length).toBe(5);
    expect(response.body.company).toEqual({
      handle: 'JDAB',
      name: 'JD Bros and Sisters, A Family Firm',
      num_employees: 10,
      description: 'Keeping Victor out of jail and away from guns since 1991',
      logo_url: 'https://i.ytimg.com/vi/a8rPMdIiciY/hqdefault.jpg'
    });
  });
});

/** DELETE a company by ID route */
describe('DELETE /companies/handle', function() {
  test('Deletes a company and responds with a message confirming', async function() {
    const response = await request(app)
      .delete(`/companies/JDAB`)
      .send({
        handle: 'JDAB'
      });

    // console.log('WHAT IS RESPONSE:', response.body);
    expect(response.statusCode).toBe(200); // OK
    expect(response.body.message).toBe('Company deleted');
  });
});

/**ROUTES WITH DYSFUNCTIONAL FAMILIES AND PARAMS  */

/** Don't POST create new company route */
describe('POST /companies', function() {
  test('Does not create a new company and responds with an error message', async function() {
    const response = await request(app)
      .post(`/companies`)
      .send({
        name: "Victor's jabronis"
      });

    expect(response.statusCode).toBe(400); // bad request
    expect(Object.keys(response.body).length).toBe(2);
    expect(response.body.message).toBe('Add both handle AND name');
  });
});

// /** Don't GET company by handle route */
describe('GET /companies/handle', function() {
  test('Does not get a company based on its handle and responds with an empty object', async function() {
    const response = await request(app).get(`/companies/AYYY`);
    // console.log('WHAT IS DYSFUNC RESPONSE:', response.body);
    expect(response.statusCode).toBe(200); // OK
    expect(Object.keys(response.body).length).toBe(0);
  });
});

// /** Don't PATCH / Edit a company by ID route */
describe('PATCH /companies/handle', function() {
  test('Does not edit a company and responds with an empty object', async function() {
    const response = await request(app)
      .patch(`/companies/AYYY`)
      .send({
        handle: 'AYYY',
        name: 'Hello there'
      });
    // console.log('WHAT IS DYNC RESPONSE:', response.body);
    expect(response.statusCode).toBe(200); // OK
    expect(Object.keys(response.body).length).toBe(0);
  });
});

// /** Don't DELETE a company by ID route */
describe('DELETE /companies/handle', function() {
  test('Does not delete a company and responds with an empty object', async function() {
    const response = await request(app)
      .delete(`/companies/AYYY`)
      .send({
        handle: 'LMAO'
      });

    // console.log('WHAT IS RESPONSE:', response.body);
    expect(response.statusCode).toBe(400); // bad request
    expect(response.body.message).toBe('Please enter correct company handle');
    expect(response.body.error.status).toBe(400); // bad request
  });
});

afterEach(async function() {
  await db.query(`DELETE FROM companies`);
});

afterAll(async function() {
  await db.end();
});
