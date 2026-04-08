import 'dotenv/config';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { users } from './shared/schema.js';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

async function main() {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, 'admin@codesphere.com'));
    console.log('Step 1 getUserByEmail OK:', user?.id, user?.email);

    const match = await bcrypt.compare('admin123', user.password);
    console.log('Step 2 bcrypt compare:', match);

    const today = new Date().toDateString();
    const updated = await db.update(users).set({
      streak: 31,
      codeCoins: (user.codeCoins || 0) + 5,
      preferences: { ...(user.preferences as any || {}), lastLoginDate: today },
    } as any).where(eq(users.id, user.id)).returning();
    console.log('Step 3 updateUser OK:', updated[0]?.id);

    console.log('ALL STEPS PASSED');
  } catch(e: any) {
    console.error('FAILED:', e.message);
    console.error(e.stack);
  } finally {
    await pool.end();
  }
}

main();
