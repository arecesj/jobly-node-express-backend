const db = require('../db');
const sqlForPartialUpdate = require('../helpers/partialUpdate');

function makeError(msg, code) {
  let err = new Error(msg);
  err.status = code;
  throw err;
}

/** Collection of related methods for Companies */

class Company {
  /** Get all companies, returns  handle and name for all company objects */
  static async getAll() {
    const companies = await db.query(
      `SELECT handle, name
      FROM companies
      ORDER by handle`
    );
    return companies.rows;
  }

  /** Allows search for all companies, can include search, min, and max.
   * Validates sane values for min < max, if both are given
   * Returns a filtered list of handles and names */
  static async search({ search, min_employees, max_employees }) {
    min_employees = min_employees === undefined ? 0 : min_employees;
    max_employees = max_employees === undefined ? 3000000 : max_employees;
    search = search === undefined ? '' : search;

    if (min_employees && max_employees && min_employees > max_employees) {
      makeError('invalid min/max requirements', 400);
    }

    const searchResult = await db.query(
      `SELECT handle, name
      FROM companies
      WHERE (num_employees >= $2 AND num_employees <= $3)
      AND (name iLIKE $1 OR handle iLIKE $1)
      `,
      [`%${search}%`, min_employees, max_employees]
    );
    return searchResult.rows;
  }

  /** Create new company */
  static async create({ handle, name }) {
    // try {
    const newCompany = await db.query(
      `INSERT INTO companies (handle, name) 
        VALUES ($1, $2)
        RETURNING handle, name`,
      [handle, name]
    );

    return newCompany.rows[0];
    // } catch (err) {
    //   const error = new Error('Cannt create company');
    //   error.status = 400;
    //   throw error;
    // }
  }

  // GET /companies/DFGFDG    =>   404 NOT FOUND

  /** Get a company by its handle */
  static async getOne(handle) {
    const result = await db.query(
      `SELECT handle, name, num_employees, description, logo_url
        FROM companies
        WHERE handle=$1`,
      [handle]
    );

    // raise an error if nothing was found
    // let err = new Error("Not found");
    // err.status = 404
    // throw err;
    // makeError("Not Found", 404);

    return result.rows[0];
  }

  /** Edit a company by its handle. */
  static async update(handle, items) {
    // try {
    const formatUpdateDB = await sqlForPartialUpdate(
      'companies',
      items,
      'handle',
      handle
    );

    const updatedCompany = await db.query(
      formatUpdateDB.query,
      formatUpdateDB.values
    );

    // if no-rows-updated, throwError("No such company", 404);
    // if (result.rows.length === 0)

    return updatedCompany.rows[0];
    // } catch (err) {
    //   throw new Error(
    //     'Please enter correct company handle and associated info'
    //   );
    // }
  }

  /** Delete a company by its handle. */
  static async delete(handle) {
    // try {
    let queried = await db.query(`DELETE FROM companies WHERE handle=$1`, [
      handle
    ]);
    if (queried.rowCount === 0) {
      // if (queried.rows.length === 0) {
      //TODO: We should be able to refactor this later
      let error = new Error('Please enter correct company handle');
      throw error;
    } else {
      return true;
      // return { message: 'Company deleted' };
    }
    // } catch (err) {
    //   let error = new Error('Please enter correct company handle');
    //   error.status = 400;
    //   throw error;
    // }
  }
}

module.exports = Company;
