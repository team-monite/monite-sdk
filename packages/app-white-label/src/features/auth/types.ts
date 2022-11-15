export type LoginFormValues = {
  email: string;
  password: string;
};

export type ContextValue = {
  token: string | null;
  onLogin: (data: LoginFormValues) => Promise<string | null>;
  onLogout: () => void;
};
