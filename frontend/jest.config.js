module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['/node_modules/(?!@testing-library/react)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Pakeisk setupFiles į setupFilesAfterEnv
};
