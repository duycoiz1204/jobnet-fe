'use client';

import { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import useSlider from '@/hooks/useSlider';

export default function RecruiterHome() {
  const { data: session } = useSession();
  const t = useTranslations();

  const { moveToNextSlide, moveToPrevSlide } = useSlider();
  const parnerSliderRef = useRef<HTMLDivElement>(null);

  return (
    <div className="pt-[100px] px-3">
      <div className="my-2">
        <img src="/banner.png" alt="banner" />
      </div>
      <div className="flex justify-center my-10">
        <Link
          href={`${
            session?.user ? '/recruiter/posts/new' : '/recruiter/signin'
          }`}
        >
          <Button size="lg">{t('recruiter.home.button.hiring')}</Button>
        </Link>
      </div>
      <div className="lg:px-[150px] my-10">
        <div className="my-5 text-center">
          <h2 className=" text-[20px] font-semibold my-3">
            {t('recruiter.home.intro.title')}
          </h2>
          <p>{t('recruiter.home.intro.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 gap-10 my-10 lg:grid-cols-2">
          <Item
            title={t('recruiter.home.features.feature1.title')}
            desc={t('recruiter.home.features.feature1.desc')}
          />
          <Item
            title={t('recruiter.home.features.feature2.title')}
            desc={t('recruiter.home.features.feature2.desc')}
          />
          <Item
            title={t('recruiter.home.features.feature3.title')}
            desc={t('recruiter.home.features.feature3.desc')}
          />
          <Item
            title={t('recruiter.home.features.feature4.title')}
            desc={t('recruiter.home.features.feature4.desc')}
          />
          <Item
            title={t('recruiter.home.features.feature5.title')}
            desc={t('recruiter.home.features.feature5.desc')}
          />
          <Item
            title={t('recruiter.home.features.feature6.title')}
            desc={t('recruiter.home.features.feature6.desc')}
          />
        </div>

        <div className="flex flex-col-reverse h-auto my-10 lg:flex-row gap-y-5">
          <div>
            <div className="mb-5">
              <span className="text-[28px] font-semibold">
                {t('recruiter.home.aboutUs.title')}
              </span>
              <div className="w-[100px] h-[4px] bg-[#000000]"></div>
            </div>
            <p className="pr-3 text-justify">
              {t('recruiter.home.aboutUs.desc')}
            </p>
          </div>
          <div className="h-full">
            <img className="h-full" src="Coding2.jpg" alt="logo" />
          </div>
        </div>

        <div className="h-auto my-10">
          <div className="mb-5">
            <span className="text-[28px] font-semibold">
              {t('recruiter.home.partners')}
            </span>
          </div>
          <div className="flex items-center justify-between w-full h-[100px]">
            <div
              className="text-3xl"
              onClick={() => moveToPrevSlide(parnerSliderRef)}
            >
              <FaAngleLeft />
            </div>

            <div
              className="flex h-full mt-6 overflow-hidden lg:-mx-4 justify-evenly flex-nowrap"
              ref={parnerSliderRef}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div
                  key={num}
                  className="flex justify-center flex-none lg:basis-1/5 basis-2/5"
                >
                  <img
                    className="h-[100px] w-[100px] "
                    src="square.png"
                    alt="logo"
                  />
                </div>
              ))}
            </div>

            <div
              className="ml-2 text-3xl"
              onClick={() => moveToNextSlide(parnerSliderRef)}
            >
              <FaAngleRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Item({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-center gap-2 lg:gap-0">
      <img className="w-[100px] h-[100px]" src="/square.png" alt="logo" />
      <div className="flex flex-col ml-3 justify-evenly">
        <span className="text-[18px] font-semibold">{title}</span>
        <span className="text-justify">{desc}</span>
      </div>
    </div>
  );
}
