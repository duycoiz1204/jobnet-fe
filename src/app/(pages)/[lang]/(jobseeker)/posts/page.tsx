import categoryService from '@/services/categoryService'
import postService from '@/services/postService'
import professionService from '@/services/professionService'
import React from 'react'
import { headers } from 'next/headers'
import { Metadata } from 'next'
import PostsClient from '@/app/(pages)/[lang]/(jobseeker)/posts/PostsClient'
import locationService from '@/services/locationService'

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
  console.log("Search: ", search);
  
  // Fetching
  const posts = await postService.getElasticPosts({
    search
  })
  const paginationPosts = {
    totalElements: posts.length, 
    totalPages: Math.ceil(posts.length / 5),
    currentPage: 1,
    hasNextPage: Math.ceil(posts.length / 5) !== 1,
    data: posts.slice(0, 5)
  }
  const categories = await categoryService.getCategories()
  const professions = await professionService.getProfessions()
  const locations = locationService.getLocations();

  return (
    <PostsClient posts={posts} paginationPosts={paginationPosts} categories={categories} professions={professions} locations={locations} />
  )
}