export type AuthState = {
  token: string | null;
};

export type State = {
  auth: AuthState;
};
