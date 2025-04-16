import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100, // 100 virtual users
  duration: '1s', // test duration
};

export default function () {
  const res = http.post('http://localhost:3000/api/evaluate', JSON.stringify({key: "value"}), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1); // simulate user wait time
}
