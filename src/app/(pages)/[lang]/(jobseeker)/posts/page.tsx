import categoryService from '@/services/categoryService'
import postService from '@/services/postService'
import professionService from '@/services/professionService'
import React from 'react'
import { headers } from 'next/headers'
import { Metadata } from 'next'
import PostsClient from '@/app/(pages)/[lang]/(jobseeker)/posts/PostsClient'

export const metadata: Metadata = {
  title: "Job Posts",
  description: "All open posts about job ",
};

type Props = {}

export default async function Posts({ }: Props) {
  const header = headers()
  const url = header.get("x-url")
  const searchParams = new URL(url as string).searchParams

  const search = (searchParams.get('search')) ? searchParams.get('search')!! : ''
  // Fetching
  const paginationPosts = await postService.getPosts({
    search
  })
  const categories = await categoryService.getCategories()
  const professions = await professionService.getProfessions()
  return (
    <PostsClient paginationPosts={paginationPosts} categories={categories} professions={professions} />
  )
}