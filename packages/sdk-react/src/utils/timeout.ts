/**
 * Returns a timeout value that is sensitive to the environment.
 * If the environment variable `TESTS` is set, the timeout is set to 0.
 * Otherwise, the timeout is set to the provided value.
 *
 * @param timeout - Desired timeout value.
 *
 * @returns The real timeout value based on the platform.
 */
export const environmentSensitiveTimeout = (timeout: number): number => {
  if (process.env.TESTS) {
    return 0;
  }

  return timeout;
};
