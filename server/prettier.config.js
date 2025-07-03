export default {
  printWidth: 100,
  singleQuote: true,
  overrides: [
    {
      files: '**/*.html',
      options: {
        parser: 'html',
      },
    },
  ],
};
