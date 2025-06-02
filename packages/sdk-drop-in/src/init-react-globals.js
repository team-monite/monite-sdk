// eslint-disable-next-line no-restricted-imports
import React from 'react';
import * as ReactDOM from 'react-dom';

// Make React available globally for @monite/sdk-react
window.React = React;
window.ReactDOM = ReactDOM;

console.log('React globals initialized:', {
  React: !!window.React,
  ReactDOM: !!window.ReactDOM,
});
