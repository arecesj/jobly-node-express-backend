const express = require('express');
const router = new express.Router();
const Company = require('../models/company');
//do we want to add any JSON schema to test things beforehand?
//If so, download jsonschema

/** Middleware */
function minMaxSize(req, res, next) {
  try {
    let min = +req.query.min_employees;
    console.log(min);
    let max = +req.query.max_employees;
    if (min < max || isNaN(min) || isNaN(max)) {
      return next();
    } else {
      throw new Error('Ya failure!');
    }
  } catch (err) {
    return next({ status: 400, message: 'invalid min/max requirements' });
  }
}

/** ROUTES */

/** Get all Companies, result is JSON and looks like {companies: [companyData, ...]} */
router.get('/', minMaxSize, async function(req, res, next) {
  let companies;

  try {
    //TODO: Refactoring switch/case
    /** If there is no query (req.query) string */
    if (Object.keys(req.query).length === 0) {
      companies = await Company.getAll();
    } else {
      companies = await Company.search(req.query);
    }

    if (companies.length === 0) {
      // {companies: []}      {company: undefined}
      throw new Error('No companies matched your search');
    }

    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});

/** POST create a  Companies, result is JSON and looks like {company: companyData} */
router.post('/', async function(req, res, next) {
  try {
    const { handle, name } = req.body;
    const company = await Company.create({
      handle,
      name
    });

    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/** Get company by its ID, result is JSON and looks like {company: companyData} */

router.get('/:handle', async function(req, res, next) {
  try {
    const company = await Company.getOne(req.params.handle);

    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/** Patch company by its ID, result is JSON and looks like {company: companyData} */
router.patch('/:handle', async function(req, res, next) {
  try {
    const company = await Company.update(req.params.handle, req.body);

    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/** Delete company by its ID, result is JSON and looks like {message: "Company deleted"} */
router.delete('/:handle', async function(req, res, next) {
  try {
    const company = await Company.delete(req.params.handle);
    // return res.json(company);
    return { message: 'Company deleted' };
  } catch (err) {
    return next(err);
  }
});

module.exports = { router, minMaxSize };
