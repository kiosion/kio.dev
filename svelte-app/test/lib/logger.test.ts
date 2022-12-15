import { describe, expect, it, beforeEach, afterEach, type Mock } from 'vitest';
import { LoggerClass } from '$lib/logger';

interface LocalCtx {
  console: {
    log: Mock<[], void>;
    warn: Mock<[], void>;
    info: Mock<[], void>;
    error: Mock<[], void>;
    clear: Mock<[], void>;
  };
}

describe('Logger', () => {
  beforeEach<LocalCtx>((ctx) => {
    ctx.console = {
      log: vi.fn(() => {}),
      warn: vi.fn(() => {}),
      info: vi.fn(() => {}),
      error: vi.fn(() => {}),
      clear: vi.fn(() => {})
    };

    vi.stubGlobal('console', ctx.console);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it<LocalCtx>('should log a message to the console', async (ctx) => {
    const Logger = new LoggerClass({ ENV: 'development' }),
      methods = ['log', 'warn', 'error'] as const;

    methods.forEach((method) => {
      expect(ctx.console[method]).not.toHaveBeenCalled();
      Logger[method]('This msg should be logged');
      expect(ctx.console[method]).toHaveBeenCalledWith(
        'This msg should be logged'
      );
    });
  });

  it<LocalCtx>('should hide all logs except errors in production', async (ctx) => {
    const Logger = new LoggerClass({ ENV: 'production' }),
      methods = ['log', 'warn', 'info', 'error'] as const;

    methods.forEach((method) => {
      expect(ctx.console[method]).not.toHaveBeenCalled();
      Logger[method](
        `This method should${method === 'error' ? '' : ' not'} be logged}`
      );
      if (method === 'error') {
        expect(ctx.console[method]).toHaveBeenCalledWith(
          'This method should be logged}'
        );
      } else {
        expect(ctx.console[method]).not.toHaveBeenCalled();
      }
    });
  });

  it<LocalCtx>('should check prevWarns/errors when using warn/errorOnce', async (ctx) => {
    const Logger = new LoggerClass({ ENV: 'development' }),
      methods = ['warn', 'error'] as const;

    methods.forEach((method) => {
      expect(ctx.console[method]).not.toHaveBeenCalled();
      Logger[`${method}Once`]('This msg should be logged');
      expect(ctx.console[method]).toHaveBeenCalledWith(
        'This msg should be logged'
      );
      Logger[`${method}Once`]('This msg should be logged');
      expect(ctx.console[method]).toHaveBeenCalledTimes(1);
      Logger[`${method}Once`]('This msg should be logged again');
      expect(ctx.console[method]).toHaveBeenCalledWith(
        'This msg should be logged again'
      );
      expect(ctx.console[method]).toHaveBeenCalledTimes(2);
    });
  });
});
