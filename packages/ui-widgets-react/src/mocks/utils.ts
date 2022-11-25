export const geMockPagination = (
  page?: string | null,
  pageLimit: number = 2
) => {
  const currentPage = page ? parseInt(page) : 0;

  const prevPage = currentPage !== 0 ? `${currentPage - 1}` : undefined;
  const nextPage = currentPage < pageLimit ? `${currentPage + 1}` : undefined;

  return { prevPage, nextPage };
};
