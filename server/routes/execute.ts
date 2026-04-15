import { Router } from "express";
import { requireAuth } from "../middleware";

const router = Router();

// Code execution
router.post("/", requireAuth, async (req, res) => {
  try {
    const { code, language, stdin = '' } = req.body;
    if (!code?.trim()) return res.status(400).json({ message: "Code is required" });

    const JUDGE0_URL = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com';
    const JUDGE0_KEY = process.env.JUDGE0_API_KEY;

    if (!JUDGE0_KEY) {
      return res.json({ 
        output: simulateExecution(code, language), 
        error: null, 
        status: 'Simulated' 
      });
    }

    const LANG_IDS: Record<string, number> = {
      javascript: 63, python: 71, java: 62, cpp: 54, c: 50,
      typescript: 74, rust: 73, go: 60, ruby: 72, php: 68,
    };
    const languageId = LANG_IDS[language?.toLowerCase()] || 63;

    // Send to Judge0
    const toB64 = (s: string) => Buffer.from(s).toString('base64');
    
    const submitRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify({
        source_code: toB64(code),
        language_id: languageId,
        stdin: toB64(stdin),
      }),
    });

    if (!submitRes.ok) {
      const errText = await submitRes.text();
      console.error('Judge0 error:', errText);
      return res.json({ output: simulateExecution(code, language), error: null, status: 'Simulated (Judge0 unavailable)' });
    }

    const result = await submitRes.json();
    const fromB64 = (s: string | null) => s ? Buffer.from(s, 'base64').toString('utf-8') : '';

    return res.json({
      output: fromB64(result.stdout),
      error: fromB64(result.stderr) || fromB64(result.compile_output),
      status: result.status?.description || 'Unknown',
      time: result.time,
      memory: result.memory,
    });
  } catch (error) {
    console.error('Code execution error:', error);
    return res.status(500).json({ message: "Code execution failed" });
  }
});

function simulateExecution(code: string, language: string): string {
  // Basic JS simulation for demo purposes
  if (language === 'javascript' || !language) {
    try {
      const logs: string[] = [];
      const fakeConsole = { log: (...args: any[]) => logs.push(args.map(String).join(' ')) };
      const fn = new Function('console', code);
      fn(fakeConsole);
      return logs.join('\n') || '(no output)';
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  }
  return `[Simulation] Add JUDGE0_API_KEY to .env for real ${language} execution.`;
}

export default router;
