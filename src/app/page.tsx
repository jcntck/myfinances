import Application from "@/Application";
import Link from "next/link";

export default async function Home() {
  const { CreateCategory, GetCategory } = Application.Instance.Category;
  const output = await CreateCategory.execute({ name: `HomePage Category ${Date.now()}` });
  const category = await GetCategory.execute(output.categoryId);
  return (
    <div>
      <h1>Home</h1>
      <p id="category_id">{category.id}</p>
      <p>{category.name}</p>
      <Link href="/about">About</Link>
    </div>
  );
}
