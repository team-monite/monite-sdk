// Non-module script to ensure React is available before any ES modules load
// This is a temporary workaround for @monite/sdk-react expecting React as a global

console.log('Pre-initializing React placeholder...');

// Create a temporary React placeholder that will be replaced by the real React
window.React = window.React || {
  createElement: function() { 
    console.log('React.createElement called before React was loaded');
    return null; 
  },
  createContext: function() {
    console.log('React.createContext called before React was loaded');
    return { Provider: function() { return null; }, Consumer: function() { return null; } };
  },
  useState: function() {
    console.log('React.useState called before React was loaded');
    return [null, function() {}];
  },
  useEffect: function() {
    console.log('React.useEffect called before React was loaded');
  },
  useMemo: function() {
    console.log('React.useMemo called before React was loaded');
    return null;
  },
  useCallback: function() {
    console.log('React.useCallback called before React was loaded');
    return function() {};
  }
};

window.ReactDOM = window.ReactDOM || {
  render: function() {
    console.log('ReactDOM.render called before ReactDOM was loaded');
  }
};

console.log('React placeholder initialized'); 