import dotenv from 'dotenv';
dotenv.config();

import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
neonConfig.webSocketConstructor = ws;

async function report() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

  // All tables
  const tables = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);

  console.log('\n📦 TABLES IN DATABASE\n' + '─'.repeat(40));
  const counts: Record<string, number> = {};
  for (const row of tables.rows) {
    const count = await pool.query(`SELECT COUNT(*) FROM "${row.table_name}"`);
    counts[row.table_name] = parseInt(count.rows[0].count);
    console.log(`  ${row.table_name.padEnd(25)} ${counts[row.table_name]} rows`);
  }

  // Column details per table
  const cols = await pool.query(`
    SELECT table_name, column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position
  `);

  console.log('\n📋 COLUMN DETAILS\n' + '─'.repeat(40));
  let lastTable = '';
  for (const col of cols.rows) {
    if (col.table_name !== lastTable) {
      console.log(`\n  [${col.table_name}]`);
      lastTable = col.table_name;
    }
    const nullable = col.is_nullable === 'YES' ? '?' : ' ';
    console.log(`    ${nullable} ${col.column_name.padEnd(25)} ${col.data_type}`);
  }

  // Sample data counts
  console.log('\n📊 SEEDED DATA SUMMARY\n' + '─'.repeat(40));
  const roadmapRows = await pool.query('SELECT title, difficulty FROM roadmaps ORDER BY id');
  console.log(`\n  Roadmaps (${roadmapRows.rows.length}):`);
  roadmapRows.rows.forEach(r => console.log(`    - ${r.title} [${r.difficulty}]`));

  const resourceRows = await pool.query('SELECT title, category, difficulty FROM resources ORDER BY id');
  console.log(`\n  Resources (${resourceRows.rows.length}):`);
  resourceRows.rows.forEach(r => console.log(`    - ${r.title} [${r.category}/${r.difficulty}]`));

  const problemRows = await pool.query('SELECT title, difficulty, xp_reward, is_daily FROM problems ORDER BY id');
  console.log(`\n  Problems (${problemRows.rows.length}):`);
  problemRows.rows.forEach(r => console.log(`    - ${r.title} [${r.difficulty}] ${r.xp_reward}xp${r.is_daily ? ' ★ DAILY' : ''}`));

  const userRows = await pool.query('SELECT COUNT(*) FROM users');
  console.log(`\n  Users: ${userRows.rows[0].count} (registered via API)`);

  console.log('\n' + '─'.repeat(40));
  console.log('✅ Report complete\n');

  await pool.end();
}

report().catch(err => { console.error(err); process.exit(1); });
