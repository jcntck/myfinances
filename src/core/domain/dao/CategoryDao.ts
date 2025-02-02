import Pageable from "@/core/application/util/Pageable";

export type CategoryDTO = {
  id: string;
  name: string;
};

export default interface CategoryDAO {
  list({ name, page, size }: { name?: string; page: number; size: number }): Promise<Pageable<CategoryDTO>>;
}
