import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/navigation';
import { BadgeCheck, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TopBusinessCard from '@/components/card/TopBusinessCard';
import HomeCarousel from '@/components/HomeCarousel';
import businessService from '@/services/businessService';
import { auth } from '@/auth';

export default async function Home() {
  const t = await getTranslations();
  const session = await auth();
  const topBusinessesElms = (await businessService.getBusinesses()).data.map(
    (topBusiness) => <TopBusinessCard key={topBusiness.id} data={topBusiness} />
  );
  const categoriesElms: any = [];

  return (
    <div className="pt-20 pb-12 space-y-8">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-0 lg:h-[480px] bg-slate-200 py-10 lg:py-0">
        <div className="flex flex-col justify-center px-6 sm:px-8 lg:px-10 xl:px-20">
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-2">
              <h2 className="text-2xl font-bold md:text-3xl">
                {t('home.welcome.title', { name: session?.user?.name })}
              </h2>
              <p className="mt-2 text-lg font-semibold md:text-xl text-slate-500">
                {t('home.welcome.subtitle')}
              </p>
            </div>
            <p className="font-semibold text-medium">
              {t('home.welcome.emphasis')}
            </p>
          </div>
          <div className="inline-flex items-center max-w-lg mt-6 bg-white rounded-full md:px-4 h-14">
            <div className="flex items-center flex-1">
              <div className="text-xl text-emerald-500">
                <Search />
              </div>
              <input
                className="w-full ml-2 bg-transparent outline-none md:ml-4 placeholder:text-slate-400"
                placeholder={t('home.welcome.searchBar.placeholder')}
                // value={search}
                // onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              className="rounded-full ml-auto translate-x-[6px] bg-emerald-500 hover:bg-emerald-700"
              color="emerald"
              // onClick={handleJobsSearch}
            >
              {t('home.welcome.searchBar.button')}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Image src="/home.png" width={400} height={371} alt="Home image" />
        </div>
      </div>

      <div className="grid gap-8 px-6 sm:px-10 lg:grid-cols-2">
        <div className="p-4 border-2 rounded sm:p-8 border-slate-300 bg-slate-50 min-h-[406px]">
          <h2 className="text-2xl font-bold md:text-3xl">
            {t('home.exploration.title')}
          </h2>
          <p className="h-20 border-l-4 border-emerald-500 xl:w-[480px] mt-4 pl-6">
            {t('home.exploration.subtitle')}
          </p>
          <div className="flex items-center mt-4">
            <div className="text-xl">
              <Search />
            </div>
            <span className="ml-4">{t('home.exploration.search')}</span>
          </div>
          <div className="flex items-center mt-4">
            <div className="text-xl">
              <BadgeCheck />
            </div>
            <span className="ml-4">{t('home.exploration.apply')}</span>
          </div>
          <div className="flex items-center mt-4">
            <div className="text-xl">
              <Bell />
            </div>
            <span className="ml-4">{t('home.exploration.notify')}</span>
          </div>
          <Link href="#" className="block mt-6">
            <Button
              className="bg-emerald-500 hover:bg-emerald-700"
              size="lg"
              // onClick={() => navigate('./categories')}
            >
              {t('home.exploration.category')}
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center p-4 sm:p-8 border-2 rounded border-slate-300 bg-slate-50 min-h-[406px]">
          <Image
            src="/home_second.png"
            width={360}
            height={360}
            alt="Home second image"
          />
        </div>
      </div>

      <HomeCarousel
        title={t('home.topLeadingBusinesses.title')}
        elms={topBusinessesElms}
      />
      <HomeCarousel title={t('home.categories.title')} elms={categoriesElms} />
    </div>
  );
}
