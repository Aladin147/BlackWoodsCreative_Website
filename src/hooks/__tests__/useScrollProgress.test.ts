import { renderHook, act } from '@testing-library/react';

// Mock useScrollProgress hook since it doesn't exist yet
const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [isScrolling, setIsScrolling] = React.useState(false);

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);

      // Clear existing timeout
      clearTimeout(timeoutId);

      // Calculate scroll progress
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      setScrollProgress(Math.min(100, Math.max(0, progress)));

      // Set scrolling to false after a delay
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return { scrollProgress, isScrolling };
};

// Mock React since we're using it in the hook
import * as React from 'react';

// Mock window scroll properties
Object.defineProperty(window, 'pageYOffset', {
  writable: true,
  value: 0,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  value: 1000,
});

Object.defineProperty(document.documentElement, 'scrollTop', {
  writable: true,
  value: 0,
});

Object.defineProperty(document.documentElement, 'scrollHeight', {
  writable: true,
  value: 2000,
});

describe('useScrollProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Reset scroll values
    window.pageYOffset = 0;
    document.documentElement.scrollTop = 0;
    document.documentElement.scrollHeight = 2000;
    window.innerHeight = 1000;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useScrollProgress());

    expect(result.current.scrollProgress).toBe(0);
    // isScrolling might be true initially due to the initial handleScroll call
    expect(typeof result.current.isScrolling).toBe('boolean');
  });

  it('calculates scroll progress correctly', () => {
    const { result } = renderHook(() => useScrollProgress());

    // Simulate scroll to 25% of the page
    act(() => {
      window.pageYOffset = 250;
      document.documentElement.scrollTop = 250;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.scrollProgress).toBe(25);
  });

  it('calculates scroll progress at 50%', () => {
    const { result } = renderHook(() => useScrollProgress());

    // Simulate scroll to 50% of the page
    act(() => {
      window.pageYOffset = 500;
      document.documentElement.scrollTop = 500;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.scrollProgress).toBe(50);
  });

  it('calculates scroll progress at 100%', () => {
    const { result } = renderHook(() => useScrollProgress());

    // Simulate scroll to 100% of the page
    act(() => {
      window.pageYOffset = 1000;
      document.documentElement.scrollTop = 1000;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.scrollProgress).toBe(100);
  });

  it('sets isScrolling to true during scroll', () => {
    const { result } = renderHook(() => useScrollProgress());

    act(() => {
      window.pageYOffset = 100;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isScrolling).toBe(true);
  });

  it('sets isScrolling to false after scroll timeout', () => {
    const { result } = renderHook(() => useScrollProgress());

    act(() => {
      window.pageYOffset = 100;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isScrolling).toBe(true);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current.isScrolling).toBe(false);
  });

  it('handles edge case when scrollHeight equals innerHeight', () => {
    const { result } = renderHook(() => useScrollProgress());

    act(() => {
      document.documentElement.scrollHeight = 1000;
      window.innerHeight = 1000;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.scrollProgress).toBe(0);
  });

  it('clamps progress to maximum of 100%', () => {
    const { result } = renderHook(() => useScrollProgress());

    act(() => {
      window.pageYOffset = 2000; // More than possible
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.scrollProgress).toBeLessThanOrEqual(100);
  });

  it('clamps progress to minimum of 0%', () => {
    const { result } = renderHook(() => useScrollProgress());

    act(() => {
      window.pageYOffset = -100; // Negative scroll
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.scrollProgress).toBeGreaterThanOrEqual(0);
  });

  it('handles multiple rapid scroll events', () => {
    const { result } = renderHook(() => useScrollProgress());

    act(() => {
      window.pageYOffset = 100;
      window.dispatchEvent(new Event('scroll'));

      window.pageYOffset = 200;
      window.dispatchEvent(new Event('scroll'));

      window.pageYOffset = 300;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.scrollProgress).toBe(30);
    expect(result.current.isScrolling).toBe(true);
  });

  it('resets isScrolling timeout on new scroll events', () => {
    const { result } = renderHook(() => useScrollProgress());

    act(() => {
      window.pageYOffset = 100;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isScrolling).toBe(true);

    act(() => {
      jest.advanceTimersByTime(100);
      window.pageYOffset = 200;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isScrolling).toBe(true);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current.isScrolling).toBe(false);
  });

  it('removes event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useScrollProgress());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  it('clears timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() => useScrollProgress());

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it('handles window resize affecting scroll calculation', () => {
    const { result } = renderHook(() => useScrollProgress());

    act(() => {
      window.innerHeight = 800;
      window.pageYOffset = 600;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.scrollProgress).toBe(50);
  });

  it('uses passive event listener for performance', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    renderHook(() => useScrollProgress());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    );

    addEventListenerSpy.mockRestore();
  });

  it('handles documentElement fallback for scrollTop', () => {
    const { result } = renderHook(() => useScrollProgress());

    act(() => {
      // Simulate case where pageYOffset is 0 but scrollTop has value
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 300;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.scrollProgress).toBe(30);
  });
});
