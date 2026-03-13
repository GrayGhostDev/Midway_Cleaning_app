import coreWebVitals from 'eslint-config-next/core-web-vitals';

export default [
  ...coreWebVitals,
  {
    rules: {
      // Downgrade to warn: project has legitimate patterns (hydration,
      // loading states, pagination reset) that trigger this rule.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];
