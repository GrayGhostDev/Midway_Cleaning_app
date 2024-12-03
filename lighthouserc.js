module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // PWA checks
        'installable-manifest': 'off',
        'service-worker': 'off',
        'splash-screen': 'off',
        'themed-omnibox': 'off',
        
        // Other performance metrics
        'server-response-time': ['error', { maxNumericValue: 600 }],
        'mainthread-work-breakdown': ['error', { maxNumericValue: 4000 }],
        'bootup-time': ['error', { maxNumericValue: 2500 }],
        'uses-rel-preload': 'off',
        'uses-rel-preconnect': 'warn',
      },
    },
  },
};
