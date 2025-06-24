// jest.setup.js
import '@react-native-async-storage/async-storage/jest/async-storage-mock';

import "react-native-url-polyfill/auto"; // Polyfill necessário para o Supabase
require("dotenv").config({
  path: ".env",
});
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));