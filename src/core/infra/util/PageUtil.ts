export default class PageUtil {
  static calculateOffset(page: number, size: number): number {
    return (page - 1) * size;
  }

  static calculatePage(totalItems: number, size: number): number {
    if (totalItems === 0) return 1;
    return Math.ceil(totalItems / size);
  }
}
