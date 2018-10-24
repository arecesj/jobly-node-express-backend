CREATE TABLE companies (
      handle TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      num_employees INTEGER,
      description TEXT,
      logo_url TEXT);

-- CREATE TABLE jobs (
--   id INTEGER PRIMARY KEY AUTO_INCREMENT,
--   title TEXT NOT NULL,
--   salary FLOAT NOT NULL,
--   equity FLOAT NOT NULL CHECK (equity > 0) CHECK (equity < 1),
--   company_handle 
-- )