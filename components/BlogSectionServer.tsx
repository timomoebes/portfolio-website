import { getBlogPosts } from "@/lib/cms"
import BlogSection from "./BlogSection"

export default async function BlogSectionServer({ id }: { id?: string }) {
  const posts = (await getBlogPosts()).map((post) => ({
    ...post,
    read_time: post.readTime,
    created_at: post.date,
    updated_at: post.date,
  }))
  
  return <BlogSection id={id} posts={posts} />
}