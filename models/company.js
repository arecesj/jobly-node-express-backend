const db = require('../db');
const sqlForPartialUpdate = require('../helpers/partialUpdate');

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

  /** Allows search for all companies, can include search, min, and max. Returns a filtered list of handles and names */
  static async search(query) {
    let { search, min_employees, max_employees } = query;

    // TODO: write helper function for below
    if (min_employees === undefined) {
      min_employees = 0;
    }
    if (max_employees === undefined) {
      max_employees = 3000000;
    }

    // TODO: write helper function for WHERE clause
    const searchResult = await db.query(
      `SELECT handle, name
      FROM companies
      WHERE num_employees >= $2 AND num_employees <= $3 AND name iLIKE $1 OR handle iLIKE $1
      `,
      [`%${search}%`, min_employees, max_employees]
    );
    return searchResult.rows[0];
  }

  /** Create new company */
  static async create(query) {
    let { handle, name } = query;

    const newCompany = await db.query(
      `INSERT INTO companies (handle, name) 
      VALUES ($1, $2)
      RETURNING handle, name`,
      [handle, name]
    );

    return newCompany.rows[0];
  }

  /** Get a company by its handle */
  static async getOne(query) {
    const result = await db.query(
      `SELECT handle, name, num_employees, description, logo_url
      FROM companies
      WHERE handle=$1`,
      [query]
    );

    return result.rows[0];
  }

  /** Edit a company by its handle. */
  static async update(handle, query) {
    const formatUpdateDB = await sqlForPartialUpdate(
      'companies',
      query,
      'handle',
      handle
    );

    const updatedCompany = await db.query(
      formatUpdateDB.query,
      formatUpdateDB.values
    );

    return updatedCompany.rows[0];
  }

  /** Delete a company by its handle. */
  static async delete(handle) {
    const deleteCompany = await db.query(
      `DELETE FROM companies WHERE handle=$1`,
      [handle]
    );
    return { message: 'Company deleted' };
  }
}

module.exports = Company;