const db = require('../utils');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.query(`
      SELECT
        app_user.id, app_user.role, app_user.first_name, app_user.last_name,
        app_user.email_address, app_user.password, app_user.date_of_birth, app_user.address
      FROM app_user
      LEFT JOIN address ON app_user.address = address.id
      `);
    return res.status(200).json(users.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error fetching data');
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.query(
      `
      SELECT
        app_user.id,
        app_user.role,
        app_user.first_name,
        app_user.last_name,
        app_user.email_address,
        app_user.date_of_birth
        FROM app_user
        WHERE app_user.id = $1
      `,
      [id]
    );
    return res.status(200).json(user.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error fetching data');
  }
};

exports.getUserAddress = async (req, res) => {
  const { id } = req.params;
  try {
    const address = await db.query(
      `SELECT app_user.id as uid, address.country, address.city, address.street,
              address.street_number, address.postal_code FROM app_user
              INNER JOIN address ON app_user.address = address.id
        WHERE app_user.id = $1`,
      [id]
    );
    return res.status(200).json(address.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error fetching data');
  }
};

exports.modifyUser = async (req, res) => {
  const { id } = req.params;
  const { role, firstName, lastName, emailAddress, dateOfBirth } = req.body;
  try {
    const text = `
      UPDATE app_user
        SET
        role = $1,
        first_name = $2,
        last_name = $3,
        email_address = $4,
        date_of_birth = $5
          WHERE
        app_user.id = $6
        `;
    const values = [role, firstName, lastName, emailAddress, dateOfBirth, id];
    const result = await db.query(text, values);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error fetching data');
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE from app_user WHERE app_user.id = $1',
      [id]
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error fetching data');
  }
};
