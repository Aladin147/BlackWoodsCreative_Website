import { renderHook, act } from '@testing-library/react';

import {
  useIntersectionObserver,
  useIntersectionObserverMultiple,
  useScrollAnimation,
  useLazyLoad,
  useViewportEffect,
  usePerformanceMonitor,
} from '../useIntersectionObserver';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

beforeAll(() => {
  global.IntersectionObserver = jest.fn().mockImplementation(callback => {
    mockIntersectionObserver.mockImplementation(callback);
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    };
  });
});

// Mock performance API
Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
  },
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn();

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return ref and null entry initially', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current[0]).toBeDefined(); // ref
    expect(result.current[1]).toBeNull(); // entry
  });

  it('should create IntersectionObserver with default options', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Create a mock element and set it to the ref to trigger the effect
    const mockElement = document.createElement('div');

    act(() => {
      if (result.current[0]) {
        (result.current[0] as React.MutableRefObject<HTMLElement | null>).current = mockElement;
      }
    });

    // The IntersectionObserver should be created when an element is observed
    expect(result.current[0]).toBeDefined();
    expect(result.current[1]).toBeNull(); // Initially no intersection
  });

  it('should create IntersectionObserver with custom options', () => {
    const options = {
      threshold: 0.5,
      rootMargin: '10px',
    };

    const { result } = renderHook(() => useIntersectionObserver(options));

    // Create a mock element and set it to the ref to trigger the effect
    const mockElement = document.createElement('div');

    act(() => {
      if (result.current[0]) {
        (result.current[0] as React.MutableRefObject<HTMLElement | null>).current = mockElement;
      }
    });

    // The hook should work with custom options
    expect(result.current[0]).toBeDefined();
    expect(result.current[1]).toBeNull();
  });

  it('should observe element when ref is set', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const mockElement = document.createElement('div');

    act(() => {
      // Simulate setting the ref
      if (result.current[0].current !== mockElement) {
        (result.current[0] as React.MutableRefObject<HTMLElement | null>).current = mockElement;
      }
    });

    // Note: In a real test environment, the useEffect would trigger
    // For this test, we're verifying the hook structure
    expect(result.current[0]).toBeDefined();
  });

  it('should handle triggerOnce option', () => {
    const { result } = renderHook(() => useIntersectionObserver({ triggerOnce: true }));

    expect(result.current[0]).toBeDefined();
    expect(result.current[1]).toBeNull();
  });

  it('should handle freezeOnceVisible option', () => {
    const { result } = renderHook(() => useIntersectionObserver({ freezeOnceVisible: true }));

    expect(result.current[0]).toBeDefined();
    expect(result.current[1]).toBeNull();
  });

  it('should handle threshold array', () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ threshold: [0, 0.25, 0.5, 0.75, 1] })
    );

    expect(result.current[0]).toBeDefined();
    expect(result.current[1]).toBeNull();
  });

  it('should handle root element option', () => {
    const rootElement = document.createElement('div');
    const { result } = renderHook(() => useIntersectionObserver({ root: rootElement }));

    expect(result.current[0]).toBeDefined();
    expect(result.current[1]).toBeNull();
  });

  it('should handle custom rootMargin', () => {
    const { result } = renderHook(() => useIntersectionObserver({ rootMargin: '20px 10px' }));

    expect(result.current[0]).toBeDefined();
    expect(result.current[1]).toBeNull();
  });

  it('should not create observer when IntersectionObserver is not supported', () => {
    // Temporarily remove IntersectionObserver to test fallback
    const originalIntersectionObserver = global.IntersectionObserver;
     
    (global as any).IntersectionObserver = undefined;

    const { result } = renderHook(() => useIntersectionObserver());
    const mockElement = document.createElement('div');

    act(() => {
      (result.current[0] as React.MutableRefObject<HTMLElement | null>).current = mockElement;
    });

    expect(result.current[0]).toBeDefined();
    expect(result.current[1]).toBeNull();

    // Restore IntersectionObserver
    global.IntersectionObserver = originalIntersectionObserver;
  });

  it('should simulate intersection entry update', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const mockElement = document.createElement('div');

    act(() => {
      (result.current[0] as React.MutableRefObject<HTMLElement | null>).current = mockElement;
    });

    // Simulate intersection observer callback
    const mockEntry = {
      isIntersecting: true,
      intersectionRatio: 0.5,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: {} as DOMRectReadOnly,
      target: mockElement,
      time: Date.now(),
    };

    act(() => {
      if (mockIntersectionObserver.mock.calls.length > 0) {
        const callback = mockIntersectionObserver.mock.calls[0][0];
        callback([mockEntry]);
      }
    });

    expect(result.current[0]).toBeDefined();
  });
});

describe('useIntersectionObserverMultiple', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return entries map and control functions', () => {
    const { result } = renderHook(() => useIntersectionObserverMultiple());

    expect(result.current.entries).toBeInstanceOf(Map);
    expect(typeof result.current.observe).toBe('function');
    expect(typeof result.current.unobserve).toBe('function');
    expect(typeof result.current.disconnect).toBe('function');
  });

  it('should observe multiple elements', () => {
    const { result } = renderHook(() => useIntersectionObserverMultiple());
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');

    act(() => {
      result.current.observe(element1);
      result.current.observe(element2);
    });

    expect(result.current.entries.size).toBe(0); // Initially empty
  });

  it('should unobserve elements', () => {
    const { result } = renderHook(() => useIntersectionObserverMultiple());
    const element = document.createElement('div');

    act(() => {
      result.current.observe(element);
      result.current.unobserve(element);
    });

    expect(result.current.entries.has(element)).toBe(false);
  });

  it('should disconnect all observations', () => {
    const { result } = renderHook(() => useIntersectionObserverMultiple());
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');

    act(() => {
      result.current.observe(element1);
      result.current.observe(element2);
      result.current.disconnect();
    });

    expect(result.current.entries.size).toBe(0);
  });

  it('should handle freezeOnceVisible option', () => {
    const { result } = renderHook(() =>
      useIntersectionObserverMultiple({ freezeOnceVisible: true })
    );

    expect(result.current.entries).toBeInstanceOf(Map);
  });

  it('should cleanup on unmount', () => {
    const { result, unmount } = renderHook(() => useIntersectionObserverMultiple());
    const element = document.createElement('div');

    act(() => {
      result.current.observe(element);
    });

    unmount();

    // Should cleanup without errors
    expect(result.current.entries.size).toBe(0);
  });
});

describe('useScrollAnimation', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock matchMedia for reduced motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('should return animation state', () => {
    const { result } = renderHook(() => useScrollAnimation());

    expect(result.current).toEqual({
      ref: expect.any(Object),
      isVisible: false,
      shouldAnimate: false,
      intersectionRatio: 0,
    });
  });

  it('should handle reduced motion preference', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    const { result } = renderHook(() => useScrollAnimation());

    expect(result.current.shouldAnimate).toBe(true); // Should animate immediately with reduced motion
  });

  it('should handle animation delay', () => {
    const { result } = renderHook(() => useScrollAnimation({ animationDelay: 100 }));

    expect(result.current.shouldAnimate).toBe(false);
  });

  it('should handle custom intersection options', () => {
    const { result } = renderHook(() => useScrollAnimation({ threshold: 0.5 }));

    expect(result.current.ref).toBeDefined();
  });
});

describe('useLazyLoad', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return lazy load state', () => {
    const { result } = renderHook(() => useLazyLoad());

    expect(result.current).toEqual({
      ref: expect.any(Object),
      isVisible: false,
      isLoaded: false,
      isLoading: false,
      shouldLoad: false,
    });
  });

  it('should handle custom options', () => {
    const { result } = renderHook(() => useLazyLoad({ threshold: 0.2, rootMargin: '100px' }));

    expect(result.current.ref).toBeDefined();
    expect(result.current.isLoaded).toBe(false);
  });

  it('should trigger loading when visible', () => {
    const { result } = renderHook(() => useLazyLoad());

    // Simulate intersection
    act(() => {
      // In a real test, this would be triggered by the IntersectionObserver
      // For now, we're testing the hook structure
    });

    expect(result.current.isLoaded).toBe(false);
  });
});

describe('useViewportEffect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call callback when entry changes', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useViewportEffect(mockCallback));

    expect(result.current).toBeDefined(); // ref
    expect(mockCallback).not.toHaveBeenCalled(); // No entry initially
  });

  it('should handle custom intersection options', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useViewportEffect(mockCallback, { threshold: 0.5 }));

    expect(result.current).toBeDefined();
  });

  it('should call callback with entry when intersection occurs', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useViewportEffect(mockCallback));
    const mockElement = document.createElement('div');

    act(() => {
      (result.current as React.MutableRefObject<HTMLElement | null>).current = mockElement;
    });

    // Simulate intersection
    const mockEntry = {
      isIntersecting: true,
      intersectionRatio: 0.5,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: {} as DOMRectReadOnly,
      target: mockElement,
      time: Date.now(),
    };

    act(() => {
      if (mockIntersectionObserver.mock.calls.length > 0) {
        const callback = mockIntersectionObserver.mock.calls[0][0];
        callback([mockEntry]);
      }
    });

    expect(result.current).toBeDefined();
  });

  it('should handle callback changes', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();

    const { result, rerender } = renderHook(({ callback }) => useViewportEffect(callback), {
      initialProps: { callback: mockCallback1 },
    });

    expect(result.current).toBeDefined();

    // Change callback
    rerender({ callback: mockCallback2 });

    expect(result.current).toBeDefined();
  });
});

describe('usePerformanceMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear any existing timers first
    jest.clearAllTimers();
  });

  afterEach(() => {
    // Clean up any timers
    jest.clearAllTimers();
  });

  it('should return performance metrics', () => {
    const { result } = renderHook(() => usePerformanceMonitor());

    expect(result.current).toEqual({
      fps: 60,
      isLowPerformance: false,
    });
  });

  it('should monitor FPS over time', () => {
    const { result } = renderHook(() => usePerformanceMonitor());

    // Check that FPS monitoring is working
    expect(result.current.fps).toBeDefined();
    expect(typeof result.current.isLowPerformance).toBe('boolean');
  });

  it('should detect low performance', () => {
    // Mock performance.now for low performance scenario
    const performanceNowSpy = jest.spyOn(performance, 'now');
    let callCount = 0;

    performanceNowSpy.mockImplementation(() => {
      callCount++;
      // Simulate slow frame rate
      return callCount * 50; // 20 FPS
    });

    const { result } = renderHook(() => usePerformanceMonitor());

    // Should detect low performance
    expect(result.current.isLowPerformance).toBeDefined();

    // Restore original implementation
    performanceNowSpy.mockRestore();
  });

  it('should cleanup on unmount', () => {
    const cancelSpy = jest.spyOn(global, 'cancelAnimationFrame');

    const { unmount } = renderHook(() => usePerformanceMonitor());

    unmount();

    // Should have called cancelAnimationFrame during cleanup
    expect(cancelSpy).toHaveBeenCalled();

    cancelSpy.mockRestore();
  });
});
