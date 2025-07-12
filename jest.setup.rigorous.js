import '@testing-library/jest-dom';

// RIGOROUS TESTING SETUP - MINIMAL MOCKING APPROACH
// Philosophy: Only mock what absolutely cannot be tested in JSDOM environment
// DO NOT mock internal application logic, React components, or business logic

// ===== BROWSER APIs THAT CANNOT BE TESTED =====

// Mock IntersectionObserver (browser API that can't be tested)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver (browser API that can't be tested)
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia (browser API that can't be tested)
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

// Mock scrollTo (browser API that can't be tested)
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Mock scrollIntoView (browser API that can't be tested)
Element.prototype.scrollIntoView = jest.fn();

// Mock requestAnimationFrame (browser API that can't be tested)
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

// Mock crypto API (browser API that can't be tested)
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: jest.fn().mockImplementation(arr => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }),
    randomUUID: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
  },
});

// ===== EXTERNAL NETWORK CALLS =====

// Mock fetch (external network calls only)
global.fetch = jest.fn();

// ===== NEXT.JS SPECIFIC MOCKS =====

// Mock Next.js Image component (framework-specific)
jest.mock('next/image', () => ({
  __esModule: true,
  default: props => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

// ===== WHAT WE DO NOT MOCK =====
// - React components (test real components)
// - Internal utilities (test real implementations)
// - State management (test real state changes)
// - Business logic (test real behavior)
// - Framer Motion (test real animations where possible)
// - Internal API routes (test real implementations)

// ===== TEST ENVIRONMENT SETUP =====

// Clean up after each test to ensure independence
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
  document.body.innerHTML = '';
  
  // Reset fetch mock
  if (global.fetch.mockClear) {
    global.fetch.mockClear();
  }
});

// ===== RIGOROUS TEST HELPERS =====

// Helper to create realistic test data
global.createRealisticTestData = {
  email: () => `user.${Math.random().toString(36).substr(2, 9)}@example.com`,
  name: () => ['John Doe', 'Jane Smith', 'Alex Johnson', 'Maria Garcia'][Math.floor(Math.random() * 4)],
  message: () => 'This is a realistic test message with proper length and content.',
  phone: () => '+1-555-' + Math.floor(Math.random() * 9000 + 1000),
  company: () => ['Acme Corp', 'Tech Solutions Inc', 'Creative Agency', 'Digital Studio'][Math.floor(Math.random() * 4)],
};

// Helper to simulate user interactions
global.simulateUserInteraction = {
  delay: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)),
  realClick: async (element) => {
    // Simulate real user click with proper timing
    element.focus();
    await global.simulateUserInteraction.delay(50);
    element.click();
    await global.simulateUserInteraction.delay(50);
  },
  realType: async (element, text) => {
    // Simulate real user typing with proper timing
    element.focus();
    for (let char of text) {
      await global.simulateUserInteraction.delay(10);
      // Simulate keydown, keypress, input, keyup events
      element.value += char;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
};

// Helper to test error scenarios
global.testErrorScenarios = {
  networkError: () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
  },
  serverError: () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal server error' }),
    });
  },
  validationError: () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Validation failed' }),
    });
  },
};

// Console override for debugging (not silencing)
const originalConsole = { ...console };
global.restoreConsole = () => {
  Object.assign(console, originalConsole);
};

// Test quality enforcement
beforeEach(() => {
  // Ensure each test starts with a clean state
  jest.clearAllMocks();
  
  // Warn about potential anti-patterns
  const testName = expect.getState().currentTestName;
  if (testName && testName.includes('renders without crashing')) {
    console.warn('⚠️  Test name suggests testing implementation details rather than behavior');
  }
});
