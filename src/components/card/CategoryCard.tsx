import postService from '@/services/postService';
import professionService from '@/services/professionService';
import CategoryType from '@/types/category';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

async function CategoryCard({ data }: { data: CategoryType }) {
  const t = await getTranslations();
  const total = (
    await professionService.getProfessions({ categoryId: data.id })
  ).reduce((acc, profession) => acc + profession.totalPosts, 0);

  return (
    <div className="flex-none px-2 xl:px-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
      <div className="flex flex-col items-center px-2 py-6 transition rounded w-72 xl:px-6 bg-slate-100 hover:bg-slate-200">
        <Image
          width={500}
          height={500}
          alt=""
          src="/vite.svg"
          className="h-[100px]"
        />
        <div className="mt-6 font-bold text-center truncate w-60">
          {data.name}
        </div>
        <div className="mt-1">{t('home.categories.totalPosts', { total })}</div>
      </div>
    </div>
  );
}

export default CategoryCard;
