export const getMockPagination = (
  page?: string | null,
  pageLimit: number = 2
) => {
  const currentPage = page ? parseInt(page) : 0;

  const prevPage = currentPage !== 0 ? `${currentPage - 1}` : undefined;
  const nextPage = currentPage < pageLimit ? `${currentPage + 1}` : undefined;

  return { prevPage, nextPage };
};

type PaginationResult<T> = readonly [
  T[],
  {
    prevPage: string | undefined;
    nextPage: string | undefined;
  }
];

export const filterByPageAndLimit = <T>(
  { page, limit }: { page: string | null; limit: number },
  fixtures: T[]
): PaginationResult<T> => {
  const { prevPage, nextPage } = getMockPagination(page, fixtures.length - 1);

  const currentPage = Number(nextPage ?? '1') - 1;

  const totalPages = Math.ceil(fixtures.length / limit);

  const fixturesPaginated = fixtures.slice(
    currentPage * limit,
    currentPage * limit + limit
  );

  return [
    fixturesPaginated,
    {
      prevPage,
      nextPage: currentPage < totalPages - 1 ? nextPage : undefined,
    },
  ] as const;
};
