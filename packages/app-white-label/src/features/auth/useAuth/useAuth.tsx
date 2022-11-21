import React from 'react';
import { AuthContext } from '../AuthProvider';

import { ContextValue } from '../types';

const useAuth = () => {
  return React.useContext<ContextValue | null>(AuthContext);
};

export default useAuth;
