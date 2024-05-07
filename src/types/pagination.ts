export default interface PaginationType<T> {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  data: T[];
}
