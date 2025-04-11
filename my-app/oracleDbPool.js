import oracledb from 'oracledb';

let oracle_pool;

async function initPool() {
  if (!pool) {
    pool = await oracledb.createPool({
      user: 'contest_user',
      password: 'abc123',
      connectString: 'localhost/1521', // change based on your Oracle setup
      poolMin: 30,
      poolMax: 50,
      poolIncrement: 1
    });
    console.log("✅ Oracle connection pool created");
  }
  return oracle_pool;
}

export default initPool;
