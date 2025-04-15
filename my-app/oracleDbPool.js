// import oracledb from 'oracledb';

// let oracle_pool = null;

// async function initPool() {
//   if (!oracle_pool) {
//     oracle_pool = await oracledb.createPool({
//       user: 'contest_user',
//       password: 'abc123',
//       connectString: 'localhost/xe', // change based on your Oracle setup
//       poolMin: 30,
//       poolMax: 50,
//       poolIncrement: 1
//     });
//     console.log("✅ Oracle connection pool created");
//   }
//   return oracle_pool;
// }

// export default initPool;

const oracledb = require('oracledb')
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let oracle_pool = null;

async function initPool() {
  if (!oracle_pool) {

    // Create the connection pool
    oracle_pool = await oracledb.createPool({
      user: 'contest_user',
      password: 'abc123',
      connectString: '192.168.10.12:1521/XEPDB1', // Change this based on your Oracle setup
      poolMin: 30,
      poolMax: 50,
      poolIncrement: 1
    });
    console.log('✅ Oracle connection pool created');
  }
  return oracle_pool;
}

export default initPool;
