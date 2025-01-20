export default interface Pageable<T> {
  items: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
