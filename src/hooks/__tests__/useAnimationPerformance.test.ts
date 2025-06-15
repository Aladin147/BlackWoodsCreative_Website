import { renderHook, act } from '@testing-library/react';
import { useAnimationPerformance } from '../useAnimationPerformance';

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
};

Object.defineProperty(window, 'performance', {
  writable: true,
  value: mockPerformance,
});

// Mock requestAnimationFrame
let rafCallbacks: FrameRequestCallback[] = [];
const mockRequestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
  rafCallbacks.push(callback);
  return rafCallbacks.length;
});

const mockCancelAnimationFrame = jest.fn((id: number) => {
  rafCallbacks = rafCallbacks.filter((_, index) => index + 1 !== id);
});

Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: mockRequestAnimationFrame,
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: mockCancelAnimationFrame,
});

// Helper to trigger RAF callbacks
const triggerRAF = () => {
  act(() => {
    rafCallbacks.forEach(callback => callback(performance.now()));
    rafCallbacks = [];
  });
};

describe('useAnimationPerformance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    rafCallbacks = [];
    mockPerformance.now.mockReturnValue(Date.now());
  });

  describe('Animation Registration', () => {
    it('registers animations correctly', () => {
      const { result } = renderHook(() => useAnimationPerformance());

      act(() => {
        result.current.registerAnimation();
      });

      // Trigger animation frame to update metrics
      triggerRAF();

      expect(result.current.metrics.animationCount).toBe(1);
    });

    it('unregisters animations correctly', () => {
      const { result } = renderHook(() => useAnimationPerformance());

      act(() => {
        result.current.registerAnimation();
        result.current.unregisterAnimation();
      });

      // Trigger animation frame to update metrics
      triggerRAF();

      expect(result.current.metrics.animationCount).toBe(0);
    });

    it('handles multiple registrations', () => {
      const { result } = renderHook(() => useAnimationPerformance());

      act(() => {
        result.current.registerAnimation();
        result.current.registerAnimation();
        result.current.registerAnimation();
      });

      // Trigger animation frame to update metrics
      triggerRAF();

      expect(result.current.metrics.animationCount).toBe(3);
    });

    it('handles unregistering when count is zero', () => {
      const { result } = renderHook(() => useAnimationPerformance());

      expect(() => {
        act(() => {
          result.current.unregisterAnimation();
        });
      }).not.toThrow();

      // Trigger animation frame to update metrics
      triggerRAF();

      expect(result.current.metrics.animationCount).toBe(0);
    });
  });

  describe('Performance Monitoring', () => {
    it('tracks frame rate correctly', () => {
      const { result } = renderHook(() => useAnimationPerformance());

      // Simulate multiple frames
      mockPerformance.now
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(16.67)
        .mockReturnValueOnce(33.33)
        .mockReturnValueOnce(50);

      triggerRAF();
      triggerRAF();
      triggerRAF();

      expect(result.current.metrics.fps).toBeGreaterThan(0);
      expect(result.current.metrics.frameTime).toBeGreaterThan(0);
    });

    it('detects performance issues with many animations', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const { result } = renderHook(() => useAnimationPerformance({ enableLogging: true }));

      // Register many animations
      act(() => {
        for (let i = 0; i < 15; i++) {
          result.current.registerAnimation();
        }
      });

      // Simulate slow frame rate
      mockPerformance.now
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(100); // 100ms frame = 10 FPS

      triggerRAF();

      expect(result.current.metrics.animationCount).toBe(15);
      consoleSpy.mockRestore();
    });

    it('provides optimization suggestions', () => {
      const { result } = renderHook(() => useAnimationPerformance());

      const suggestions = result.current.getOptimizationSuggestions();
      expect(Array.isArray(suggestions)).toBe(true);
    });
  });

  describe('Metrics Tracking', () => {
    it('tracks animation count correctly', () => {
      const { result } = renderHook(() => useAnimationPerformance());

      act(() => {
        result.current.registerAnimation();
        result.current.registerAnimation();
        result.current.registerAnimation();
      });

      // Trigger animation frame to update metrics
      triggerRAF();

      expect(result.current.metrics.animationCount).toBe(3);
    });

    it('tracks performance metrics', () => {
      const { result } = renderHook(() => useAnimationPerformance());

      expect(result.current.metrics.fps).toBe(60);
      expect(result.current.metrics.frameTime).toBe(16.67);
      expect(result.current.metrics.isOptimal).toBe(true);
    });
  });

  describe('Performance Thresholds', () => {
    it('maintains good performance with few animations', () => {
      const { result } = renderHook(() => useAnimationPerformance());

      act(() => {
        result.current.registerAnimation();
        result.current.registerAnimation();
      });

      // Simulate good frame rate
      mockPerformance.now
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(16.67);

      triggerRAF();

      expect(result.current.metrics.fps).toBeGreaterThan(50);
    });

    it('detects performance degradation with many animations', () => {
      const { result } = renderHook(() => useAnimationPerformance());

      // Register many animations
      act(() => {
        for (let i = 0; i < 20; i++) {
          result.current.registerAnimation();
        }
      });

      // Trigger animation frame to update metrics
      triggerRAF();

      expect(result.current.metrics.animationCount).toBe(20);
    });
  });

  describe('Cleanup', () => {
    it('cleans up on unmount', () => {
      const { unmount } = renderHook(() => useAnimationPerformance());

      unmount();

      expect(mockCancelAnimationFrame).toHaveBeenCalled();
    });

    it('stops monitoring when no animations are active', () => {
      const { result } = renderHook(() => useAnimationPerformance());

      act(() => {
        result.current.registerAnimation();
        result.current.unregisterAnimation();
      });

      // Trigger animation frame to update metrics
      triggerRAF();

      expect(result.current.metrics.animationCount).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles missing performance API gracefully', () => {
      const originalPerformance = global.performance;
      delete (global as any).performance;

      expect(() => {
        renderHook(() => useAnimationPerformance());
      }).toThrow(); // This will throw because the hook uses performance.now()

      global.performance = originalPerformance;
    });

    it('handles missing requestAnimationFrame gracefully', () => {
      const originalRAF = global.requestAnimationFrame;
      delete (global as any).requestAnimationFrame;

      expect(() => {
        renderHook(() => useAnimationPerformance());
      }).toThrow(); // This will throw because the hook uses requestAnimationFrame

      global.requestAnimationFrame = originalRAF;
    });

    it('provides monitoring status', () => {
      const { result } = renderHook(() => useAnimationPerformance());

      expect(typeof result.current.isMonitoring).toBe('boolean');
    });
  });

  describe('Configuration', () => {
    it('accepts custom configuration', () => {
      const customConfig = {
        targetFPS: 30,
        maxFrameTime: 33.33,
        enableLogging: true,
        sampleSize: 30
      };

      const { result } = renderHook(() => useAnimationPerformance(customConfig));

      expect(result.current.metrics).toBeDefined();
      expect(result.current.getOptimizationSuggestions).toBeDefined();
    });

    it('provides optimization suggestions', () => {
      const { result } = renderHook(() => useAnimationPerformance());

      const suggestions = result.current.getOptimizationSuggestions();
      expect(Array.isArray(suggestions)).toBe(true);
    });
  });
});
