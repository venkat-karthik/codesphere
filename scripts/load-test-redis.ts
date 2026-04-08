/**
 * Redis Cache Load Test Script
 * ─────────────────────────────────────────────────────────
 * Simulates concurrent API requests to the cached leaderboard
 * endpoint to verify Redis performance under load.
 *
 * Usage:
 *   npx tsx scripts/load-test-redis.ts
 *
 * Environment:
 *   APP_URL  — base URL of the running server (default: http://127.0.0.1:5000)
 */

const APP_URL = process.env.APP_URL || 'http://127.0.0.1:5000';
const ENDPOINT = '/api/users/leaderboard';
const CONCURRENCY = 50;  // Simultaneous requests per wave
const WAVES = 5;         // Number of waves

interface RequestResult {
  status: number;
  latencyMs: number;
  error?: string;
}

async function makeRequest(url: string): Promise<RequestResult> {
  const start = performance.now();
  try {
    const res = await fetch(url);
    return {
      status: res.status,
      latencyMs: Math.round((performance.now() - start) * 100) / 100,
    };
  } catch (err: any) {
    return {
      status: 0,
      latencyMs: Math.round((performance.now() - start) * 100) / 100,
      error: err.message,
    };
  }
}

async function runWave(waveNum: number, concurrency: number): Promise<RequestResult[]> {
  console.log(`\n🌊 Wave ${waveNum} — ${concurrency} concurrent requests to ${ENDPOINT}`);
  const promises = Array.from({ length: concurrency }, () =>
    makeRequest(`${APP_URL}${ENDPOINT}`)
  );
  return Promise.all(promises);
}

function printStats(label: string, results: RequestResult[]) {
  const successful = results.filter(r => r.status >= 200 && r.status < 300);
  const failed = results.filter(r => r.status < 200 || r.status >= 300);
  const latencies = successful.map(r => r.latencyMs).sort((a, b) => a - b);

  const avg = latencies.reduce((s, l) => s + l, 0) / latencies.length || 0;
  const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;
  const min = latencies[0] || 0;
  const max = latencies[latencies.length - 1] || 0;

  console.log(`\n📊 ${label}`);
  console.log('─'.repeat(50));
  console.log(`  Total requests : ${results.length}`);
  console.log(`  Successful     : ${successful.length}`);
  console.log(`  Failed         : ${failed.length}`);
  console.log(`  Avg latency    : ${avg.toFixed(2)} ms`);
  console.log(`  Min latency    : ${min.toFixed(2)} ms`);
  console.log(`  p50 latency    : ${p50.toFixed(2)} ms`);
  console.log(`  p95 latency    : ${p95.toFixed(2)} ms`);
  console.log(`  p99 latency    : ${p99.toFixed(2)} ms`);
  console.log(`  Max latency    : ${max.toFixed(2)} ms`);

  if (failed.length > 0) {
    console.log(`\n  ⚠️  Failed request errors:`);
    const errorCounts = new Map<string, number>();
    for (const f of failed) {
      const key = f.error || `HTTP ${f.status}`;
      errorCounts.set(key, (errorCounts.get(key) || 0) + 1);
    }
    for (const [err, count] of errorCounts) {
      console.log(`     - ${err} (x${count})`);
    }
  }

  // Pass/Fail verdict
  const passed = avg < 100 && p95 < 200 && failed.length === 0;
  console.log(`\n  ${passed ? '✅ PASS' : '❌ FAIL'} — Target: avg < 100ms, p95 < 200ms, 0 failures`);
  return passed;
}

async function main() {
  console.log('═'.repeat(50));
  console.log('  🚀 CodeSphere Redis Cache Load Test');
  console.log('═'.repeat(50));
  console.log(`  Server     : ${APP_URL}`);
  console.log(`  Endpoint   : ${ENDPOINT}`);
  console.log(`  Concurrency: ${CONCURRENCY} per wave`);
  console.log(`  Waves      : ${WAVES}`);

  const allResults: RequestResult[] = [];

  for (let i = 1; i <= WAVES; i++) {
    const waveResults = await runWave(i, CONCURRENCY);
    allResults.push(...waveResults);

    // Print per-wave stats
    printStats(`Wave ${i} Results`, waveResults);

    // Small pause between waves
    if (i < WAVES) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log('\n' + '═'.repeat(50));
  const passed = printStats('🏁 AGGREGATE RESULTS', allResults);
  console.log('═'.repeat(50));

  process.exit(passed ? 0 : 1);
}

main().catch(err => {
  console.error('Load test failed:', err);
  process.exit(1);
});
