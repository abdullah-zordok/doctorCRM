export type PaginationInput = {
  page?: number;
  pageSize?: number;
};

export type Pagination = {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function getPagination(input: PaginationInput): Pagination {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize
  };
}

export function getPaginationMeta(pagination: Pick<Pagination, "page" | "pageSize">, total: number): PaginationMeta {
  return {
    page: pagination.page,
    pageSize: pagination.pageSize,
    total,
    totalPages: Math.ceil(total / pagination.pageSize)
  };
}

export function toPaginatedData<T>(items: T[], pagination: Pick<Pagination, "page" | "pageSize">, total: number) {
  return {
    items,
    meta: getPaginationMeta(pagination, total)
  };
}
