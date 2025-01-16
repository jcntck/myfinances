export default class PageUtil {
  static calculateOffset(page: number, size: number): number {
    return (page - 1) * size;
  }

  static calculatePage(totalItems: number, size: number): any {
    return Math.ceil(totalItems / size);
  }
}
