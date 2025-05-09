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
      connectString: '172.16.71.234:1521/XEPDB1', // Change this based on your Oracle setup
      poolMin: 30,
      poolMax: 50,
      poolIncrement: 1
    });
    console.log('✅ Oracle connection pool created');
  }
  return oracle_pool;
}

export default initPool;

/*
Ivan,Davis,57
David,Smith,127
Ivan,Brown,53
Eve,Moore,149
Bob,Johnson,129
Heidi,Brown,149
Carol,Taylor,117
Bob,Anderson,146
David,Johnson,127
Frank,Smith,139
Eve,Brown,143
Carol,Davis,141
Alice,Smith,117
Grace,Anderson,66
Heidi,Taylor,137
Frank,Moore,78
Heidi,Anderson,132
Bob,Miller,132
Heidi,Moore,81
Bob,Johnson,147
*/
