import Application from "@/Application";
import Link from "next/link";

export default async function Home({ categoryId }: { categoryId: string }) {
  const { GetCategory } = Application.Instance.Category;
  const category = await GetCategory.execute(categoryId);
  return (
    <div>
      <h1>Home</h1>
      <p id="category_id">{category.id}</p>
      <p id="category_name">{category.name}</p>
      <Link href="/about">About</Link>
    </div>
  );
}
