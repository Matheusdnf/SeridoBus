module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@react-native-async-storage/async-storage|other-lib-to-mock)/',
  ],
};
