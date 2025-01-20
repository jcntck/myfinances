import UseCase from "@/core/application/usecase/UseCase";
import Pageable from "@/core/application/util/Pageable";

async function* generator(usecase: UseCase<any, Pageable<any>>, size: number, params?: any) {
  let finished = false;
  let page = 1;
  while (!finished) {
    const response = await usecase.execute({
      page,
      size,
      ...params,
    });
    finished = response.currentPage === response.totalPages;
    yield* response.items;
    page++;
  }
}

export async function getAllPaginatedRecords(usecase: UseCase<any, Pageable<any>>, size: number, params?: any) {
  let results = [];
  for await (const result of generator(usecase, size, params)) {
    results.push(result);
  }
  return results;
}
