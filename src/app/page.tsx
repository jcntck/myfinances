import Application from "@/Application";
import Link from "next/link";

export default async function Home(): Promise<JSX.Element> {
  const { CreateCategory, GetCategory } = Application.Instance.Category;
  const output = await CreateCategory.execute({ name: "Teste" });
  const category = await GetCategory.execute(output.categoryId);
  return (
    <div>
      <h1>Home</h1>
      <p>{category.id}</p>
      <p>{category.name}</p>
      <Link href="/about">About</Link>
    </div>
  );
}
