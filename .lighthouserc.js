module.exports = {
  ci: {

    collect: {
      url: ['https://lido.fi'], // <--- Add your target URL(s)
      // Number of runs to perform per URL
      numberOfRuns: 1,
      // Use desktop configuration
      settings: {
        preset: 'desktop',
        // Skip the slow PWA category by default
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        // Set a reasonable timeout
        maxWaitForLoad: 10000,
      },
    },
    assert: {
      // Add assertions for each category
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        // Common performance metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    upload: {
      // Upload the report to a server or save it locally
      target: 'temporary-public-storage',
      // Optionally, you can specify a directory to save the report
      outputDir: 'lighthouse-reports',
    },
  },
};
