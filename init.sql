CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(255) NOT NULL,
  row_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE address (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  country VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  street VARCHAR(100) NOT NULL,
  street_number INT NOT NULL,
  postal_code INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE app_user (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email_address VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  address uuid,
  FOREIGN KEY(address) REFERENCES address(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  GDPR boolean DEFAULT FALSE
);

CREATE TABLE post (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  app_user_id uuid,
  FOREIGN KEY(app_user_id) REFERENCES app_user(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comment (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  app_user_id uuid,
  post_id uuid,
  FOREIGN KEY(app_user_id) REFERENCES app_user(id) ON DELETE CASCADE,
  FOREIGN KEY(post_id) REFERENCES post(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update modified_at timestamp
CREATE OR REPLACE FUNCTION update_modified_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified_at = current_timestamp;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
CREATE TRIGGER address_modified_at_trigger
BEFORE UPDATE ON address
FOR EACH ROW
EXECUTE FUNCTION update_modified_at();

CREATE TRIGGER app_user_modified_at_trigger
BEFORE UPDATE ON app_user
FOR EACH ROW
EXECUTE FUNCTION update_modified_at();

CREATE TRIGGER post_modified_at_trigger
BEFORE UPDATE ON post
FOR EACH ROW
EXECUTE FUNCTION update_modified_at();

CREATE TRIGGER comment_modified_at_trigger
BEFORE UPDATE ON comment
FOR EACH ROW
EXECUTE FUNCTION update_modified_at();

-- Create audit log table
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Use OLD.id for DELETE operations
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_log (table_name, row_id, action)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP);
  ELSE
    INSERT INTO audit_log (table_name, row_id, action)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP);
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
CREATE TRIGGER app_user_changes
AFTER INSERT OR UPDATE OR DELETE ON app_user
FOR EACH ROW
EXECUTE PROCEDURE log_changes();

CREATE TRIGGER post_changes
AFTER INSERT OR UPDATE OR DELETE ON post
FOR EACH ROW
EXECUTE PROCEDURE log_changes();

CREATE TRIGGER comment_changes
AFTER INSERT OR UPDATE OR DELETE ON comment
FOR EACH ROW
EXECUTE PROCEDURE log_changes();

CREATE TRIGGER address_changes
AFTER INSERT OR UPDATE OR DELETE ON address
FOR EACH ROW
EXECUTE PROCEDURE log_changes();

INSERT INTO address (country, city, street, street_number, postal_code)
VALUES ('Sweden', 'Gothenburg', 'Drottninggatan', 28, 41340);

INSERT INTO app_user (role, first_name, last_name, email_address, password, date_of_birth)
VALUES
  ('user', 'Dev', 'Ops', 'dev.ops@example.com', 'securePassw0rd', '1998-07-22'),
  ('user', 'Cloud', 'Native', 'cloud.native@example.com', 'Cl0udN@tive', '1995-03-15'),
  ('user', 'Agile', 'Method', 'agile.method@example.com', 'AgileDev123', '1992-11-08'),
  ('user', 'Test', 'Driven', 'test.driven@example.com', 'T3stDr1v3n', '1999-05-01'),
  ('user', 'Full', 'Stack', 'full.stack@example.com', 'FullSt@ckDev', '1990-09-12'),
  ('user', 'Front', 'End', 'front.end@example.com', 'Fr0nt3nd!', '1997-04-28'),
  ('user', 'Back', 'End', 'back.end@example.com', 'B@ck3nd!', '1993-12-16'),
  ('user', 'Data', 'Science', 'data.science@example.com', 'D@t@Sci3nc3', '1996-08-05'),
  ('user', 'Machine', 'Learning', 'machine.learning@example.com', 'M@ch1n3L3@rn', '1991-02-19'),
  ('admin', 'Software', 'Engineer', 'software.engineer@example.com', 'S0ftw@r3Eng', '1994-10-26');
