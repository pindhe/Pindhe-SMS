const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const sqlite3 = require('sqlite3').verbose();
const { User, sequelize } = require('../models');

const databasePath = path.resolve(
  process.cwd(),
  process.env.DB_STORAGE || './database.sqlite'
);

const demoUsers = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@pindhe-sms.com',
    password: 'admin123',
    role: 'super_admin',
  },
  {
    firstName: 'Demo',
    lastName: 'Teacher',
    email: 'teacher@pindhe-sms.com',
    password: 'teacher123',
    role: 'teacher',
  },
  {
    firstName: 'Demo',
    lastName: 'Parent',
    email: 'parent@pindhe-sms.com',
    password: 'parent123',
    role: 'parent',
  },
  {
    firstName: 'Demo',
    lastName: 'Student',
    email: 'student@pindhe-sms.com',
    password: 'student123',
    role: 'student',
  },
];

const migrateStaffForeignKey = async () => {
  const database = new sqlite3.Database(databasePath);
  const run = (sql, params = []) => new Promise((resolve, reject) => {
    database.run(sql, params, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
  const get = (sql, params = []) => new Promise((resolve, reject) => {
    database.get(sql, params, (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
  const all = (sql, params = []) => new Promise((resolve, reject) => {
    database.all(sql, params, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });

  try {
    const userTable = await get(
      'SELECT sql FROM sqlite_master WHERE type = ? AND name = ?',
      ['table', 'Users']
    );
    if (!userTable) {
      throw new Error('Users table was not created');
    }

    const foreignKeys = await all('PRAGMA foreign_key_list(Users)');
    if (!foreignKeys.some((foreignKey) => foreignKey.table === 'Staff')) {
      return;
    }

    const correctedSql = userTable.sql.replace(
      /REFERENCES\s+[`"]?Staff[`"]?\s*\(\s*[`"]?id[`"]?\s*\)/i,
      'REFERENCES `Staffs` (`id`)'
    );
    if (correctedSql === userTable.sql) {
      throw new Error('Unable to correct the Users.staffId foreign key');
    }

    const migratingSql = correctedSql.replace(
      /^CREATE TABLE\s+[`"]?Users[`"]?/i,
      'CREATE TABLE `Users_migrating`'
    );
    if (migratingSql === correctedSql) {
      throw new Error('Unable to prepare the Users table migration');
    }

    await run('PRAGMA foreign_keys = OFF');
    await run('BEGIN IMMEDIATE TRANSACTION');
    try {
      await run(migratingSql);
      await run('INSERT INTO `Users_migrating` SELECT * FROM `Users`');
      await run('DROP TABLE `Users`');
      await run('ALTER TABLE `Users_migrating` RENAME TO `Users`');
      await run('COMMIT');
      console.log('Corrected Users.staffId foreign key.');
    } catch (error) {
      await run('ROLLBACK');
      throw error;
    } finally {
      await run('PRAGMA foreign_keys = ON');
    }
  } finally {
    await new Promise((resolve, reject) => {
      database.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
};

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await migrateStaffForeignKey();

    for (const demoUser of demoUsers) {
      const existingUser = await User.findOne({
        where: { email: demoUser.email },
      });

      if (existingUser) {
        console.log(`Demo user already exists: ${demoUser.email}`);
        continue;
      }

      await User.create(demoUser);
      console.log(`Created demo user: ${demoUser.email}`);
    }
  } finally {
    await sequelize.close();
  }
};

seed().catch((error) => {
  console.error('Unable to seed demo users:', error);
  process.exitCode = 1;
});
