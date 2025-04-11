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

import oracledb from 'oracledb';

let oracle_pool = null;

async function initPool() {
  if (!oracle_pool) {
    // Initialize the Oracle client with the path to Instant Client
    try {
      oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_23_7' }); // Update this with your actual Instant Client path
      console.log('✅ Oracle Instant Client loaded');
    } catch (err) {
      console.error('❌ Failed to load Oracle Instant Client:', err);
      return;
    }

    // Create the connection pool
    oracle_pool = await oracledb.createPool({
      user: 'contest_user',
      password: 'abc123',
      connectString: 'localhost/xe', // Change this based on your Oracle setup
      poolMin: 30,
      poolMax: 50,
      poolIncrement: 1
    });
    console.log('✅ Oracle connection pool created');
  }
  return oracle_pool;
}

export default initPool;
