const url = [
  'https://lido.fi',
  'https://v3.lido.fi',
  'https://v3.lido.fi/testnet',
  'https://lido.fi/institutional',
  'https://lido.fi/faq',
  'https://lido.fi/governance',
  'https://lido.fi/lego',
  'https://lido.fi/lidoconnect',
  'https://lido.fi/lido-multichain',
  'https://lido.fi/lido-ecosystem',
  'https://lido.fi/scorecard',
  'https://lido.fi/steth-in-defi'
].sort();
module.exports = {
  ci: {

    collect: {
      additive: true,
      url: url,
      // Number of runs to perform per URL
      numberOfRuns: 1,
      // Use desktop configuration
      settings: {
        // Skip the slow PWA category by default
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        // Set a reasonable timeout
        maxWaitForLoad: 10000,
      },
    },
    //assert: {
    //  // Add assertions for each category
    //  assertions: {
    //    'categories:performance': ['warn', { minScore: 0.8 }],
    //    'categories:accessibility': ['warn', { minScore: 0.9 }],
    //    'categories:best-practices': ['warn', { minScore: 0.9 }],
    //    'categories:seo': ['warn', { minScore: 0.9 }],
    //    // Common performance metrics
    //    'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
    //    'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
    //    'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
    //    'total-blocking-time': ['warn', { maxNumericValue: 300 }],
    //  },
    //},
    upload: {
      // Upload the report to a server or save it locally
      target: 'temporary-public-storage',
    },
  },
};
