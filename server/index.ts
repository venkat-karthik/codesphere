import express, { type Request, Response, NextFunction } from "express";
import * as Sentry from "@sentry/node";
import session from "express-session";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { VideoServer } from "./videoServer";
import dotenv from 'dotenv';
import pdfResourcesRouter from './routes/pdfResources';
import connectPgSimple from 'connect-pg-simple';
import MemoryStore from 'memorystore';

dotenv.config();

const app = express();
const isProd = process.env.NODE_ENV === 'production';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// Trust reverse proxy (Railway, Render, Vercel, etc.) — required for
// secure cookies and accurate IP-based rate limiting
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://*"], // allow external images (profile pics, etc.)
      connectSrc: ["'self'", "https://*.rapidapi.com", "https://api.openai.com", "https://api.x.ai", "wss://*.locaulvault.com", "ws://*"],
      frameSrc: ["'self'", "https://checkout.razorpay.com", "https://js.stripe.com"],
    }
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter for auth endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' },
});

app.use('/api/', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Session middleware
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret || sessionSecret === 'codesphere_dev_secret' || sessionSecret === 'codesphere_super_secret_change_in_production') {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be set to a strong random value in production!');
  } else {
    console.warn('⚠️  SESSION_SECRET is using a weak default — set a strong value before deploying to production.');
  }
}

app.use(session({
  secret: sessionSecret || 'codesphere_dev_secret_do_not_use_in_prod',
  resave: false,
  saveUninitialized: false,
  // Use PostgreSQL session store in production to survive restarts
  store: (() => {
    if (isProd && process.env.DATABASE_URL) {
      const PgSession = connectPgSimple(session);
      return new PgSession({
        conString: process.env.DATABASE_URL,
        tableName: 'session',
        createTableIfMissing: true,
      });
    }
    // Dev: memorystore (no leak, but not shared across processes)
    const MStore = MemoryStore(session);
    return new MStore({ checkPeriod: 86400000 });
  })(),
  cookie: {
    secure: isProd,
    httpOnly: true,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  }
}));

app.use('/api/pdfs', pdfResourcesRouter);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);
  
  // Initialize video server for WebSocket connections
  const videoServer = new VideoServer(server);
  console.log("🎥 Video conferencing server initialized");

  // Make videoServer accessible to routes for real-time broadcasts
  (app as any).videoServer = videoServer;

  if (process.env.SENTRY_DSN) {
    app.use(Sentry.Handlers.errorHandler());
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || '5000', 10);
  const host = isProd ? '0.0.0.0' : '127.0.0.1';
  server.listen(port, host, () => {
    log(`serving on port ${port}`);
    log(`http://localhost:${port}`);
  });
})();
