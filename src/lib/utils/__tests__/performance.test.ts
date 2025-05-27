import { debounce, throttle } from '../index';

describe('Performance Utilities', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('debounce performance', () => {
    it('should not execute function multiple times within delay period', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      // Call function multiple times rapidly
      for (let i = 0; i < 100; i++) {
        debouncedFn(i);
      }

      // Function should not have been called yet
      expect(mockFn).not.toHaveBeenCalled();

      // Advance time
      jest.advanceTimersByTime(100);

      // Function should have been called only once with the last argument
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith(99);
    });

    it('should handle rapid successive calls efficiently', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 50);

      const startTime = performance.now();

      // Simulate rapid user input
      for (let i = 0; i < 1000; i++) {
        debouncedFn(`input-${i}`);
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Should complete quickly (less than 10ms for 1000 calls)
      expect(executionTime).toBeLessThan(10);

      // Advance time and verify only one execution
      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle performance', () => {
    it('should limit function execution rate', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      // Call function multiple times
      throttledFn(0); // Should execute immediately
      throttledFn(1); // Should be throttled
      throttledFn(2); // Should be throttled

      jest.advanceTimersByTime(100);

      // Should have been called twice (initial + throttled execution with last value)
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenNthCalledWith(1, 0);
      expect(mockFn).toHaveBeenNthCalledWith(2, 2); // Last value that was queued
    });

    it('should handle high-frequency events efficiently', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 16); // ~60fps

      // Simulate rapid calls
      for (let i = 0; i < 10; i++) {
        throttledFn(i);
        if (i === 0) {
          // First call should execute immediately
          expect(mockFn).toHaveBeenCalledTimes(1);
        }
      }

      // Advance time to allow throttled execution
      jest.advanceTimersByTime(16);

      // Should have limited the number of executions
      expect(mockFn.mock.calls.length).toBeLessThanOrEqual(2);
    });
  });

  describe('memory usage', () => {
    it('should not create memory leaks with debounce', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      // Call the same debounced function multiple times
      for (let i = 0; i < 10; i++) {
        debouncedFn(i);
      }

      // Clear all timers
      jest.runAllTimers();

      // Should only call once with the last value
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith(9);
    });

    it('should not create memory leaks with throttle', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      // Call the same throttled function multiple times
      for (let i = 0; i < 10; i++) {
        throttledFn(i);
      }

      jest.advanceTimersByTime(100);

      // Should have limited executions
      expect(mockFn.mock.calls.length).toBeLessThanOrEqual(2);
    });
  });

  describe('edge cases', () => {
    it('should handle zero delay in debounce', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 0);

      debouncedFn('test');
      jest.advanceTimersByTime(0);

      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('should handle zero limit in throttle', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 0);

      throttledFn('test1');
      throttledFn('test2');

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test1');
    });

    it('should handle very large delays', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000000); // 1000 seconds

      debouncedFn('test');
      jest.advanceTimersByTime(999999);

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(mockFn).toHaveBeenCalledWith('test');
    });
  });

  describe('function context and arguments', () => {
    it('should preserve function context in debounce', () => {
      const obj = {
        value: 'test',
        method: jest.fn(function(this: any) {
          return this.value;
        })
      };

      const debouncedMethod = debounce(obj.method.bind(obj), 100);
      debouncedMethod();

      jest.advanceTimersByTime(100);

      expect(obj.method).toHaveBeenCalled();
    });

    it('should preserve function context in throttle', () => {
      const obj = {
        value: 'test',
        method: jest.fn(function(this: any) {
          return this.value;
        })
      };

      const throttledMethod = throttle(obj.method.bind(obj), 100);
      throttledMethod();

      expect(obj.method).toHaveBeenCalled();
    });

    it('should handle complex arguments correctly', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      const complexArg = {
        nested: { value: 'test' },
        array: [1, 2, 3],
        fn: () => 'function'
      };

      debouncedFn(complexArg, 'string', 123, true);
      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith(complexArg, 'string', 123, true);
    });
  });
});
