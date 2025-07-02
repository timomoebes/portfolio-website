import { getBlogPosts } from "@/lib/cms"
import BlogSection from "./BlogSection"

export default async function BlogSectionServer({ id }: { id?: string }) {
  const posts = await getBlogPosts()
  
  return <BlogSection id={id} posts={posts} />
}