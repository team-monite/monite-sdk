export const mockResponse = <T>(data: T): Promise<T> => {
  const response = new Promise<T>((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });

  return response;
};
