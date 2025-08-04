// logger.ts

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'log';

const COLORS: Record<LogLevel, string> = {
  debug: '\x1b[36m', // cyan
  info: '\x1b[32m', // green
  log: '\x1b[34m', // blue
  warn: '\x1b[33m', // yellow
  error: '\x1b[31m', // red
};

const RESET = '\x1b[0m';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  log: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
const IS_PROD = process.env.NODE_ENV === 'production';

function baseLog(level: LogLevel, ...args: any[]) {
  if (IS_PROD && level === 'debug') return;

  const currentLevelValue = LOG_LEVELS[CURRENT_LEVEL];
  const messageLevelValue = LOG_LEVELS[level];

  if (messageLevelValue < currentLevelValue) return;

  const timestamp = new Date().toISOString();
  const prefix = `${COLORS[level]}[${level.toUpperCase()}] ${timestamp}${RESET}`;

  const output = [prefix, ...args];

  switch (level) {
    case 'debug':
      console.debug(...output);
      break;
    case 'info': // fallthrough
    case 'log':
      console.log(...output);
      break;
    case 'warn':
      console.warn(...output);
      break;
    case 'error':
      console.error(...output);
      break;
  }
}

export const logger = {
  log: (...args: any[]) => baseLog('log', ...args),
  info: (...args: any[]) => baseLog('info', ...args),
  debug: (...args: any[]) => baseLog('debug', ...args),
  warn: (...args: any[]) => baseLog('warn', ...args),
  error: (...args: any[]) => baseLog('error', ...args),
};
