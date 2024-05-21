import CategoriesCpn, { CategoriesCompose } from '@/app/(pages)/[lang]/(common)/categories/CategoriesCpn'
import categogyService from '@/services/categogyService'
import professionService from '@/services/professionService'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Categories",
    description: "All job opening post for all Categories",
};

type Props = {}

export default async function page({ }: Props) {
    const categories = await categogyService.getCategories()
    const professions = await professionService.getProfessions()
    const categoriesData = [] as CategoriesCompose[]
    categories.forEach(cate => {
        categoriesData.push({
            category: cate.name as string,
            professions: professions.filter(profession => profession.categoryId == cate.id).map(profess => ({ name: profess.name, total: profess.totalPosts }))
        })
    })
    return (
        <CategoriesCpn categoriesData={categoriesData} />
    )
}