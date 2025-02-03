import '@testing-library/jest-dom';
import 'text-encoding';
import 'whatwg-fetch';


global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
global.alert = jest.fn();

// Imituojame BroadcastChannel
global.BroadcastChannel = jest.fn().mockImplementation(() => ({
  postMessage: jest.fn(),
  close: jest.fn(),
}));