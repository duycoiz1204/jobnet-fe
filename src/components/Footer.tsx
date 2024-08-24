import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import Image from 'next/image';

export default async function Footer(): Promise<JSX.Element> {
  const t = await getTranslations();
  return (
    <footer className="grid flex-shrink-0 gap-8 px-6 py-8 md:gap-4 sm:px-8 lg:px-14 xl:px-48 md:grid-cols-2 lg:grid-cols-4 bg-slate-300">
      <div>
        <h4 className="text-lg font-semibold">{t('footer.support.title')}</h4>
        <div className="mt-4 text-sm">
          <Link
            href="#"
            className="transition hover:text-emerald-500 hover:font-semibold"
          >
            {t('footer.support.terms')}
          </Link>
        </div>
        <div className="mt-4 text-sm">
          <Link
            href="#"
            className="transition hover:text-emerald-500 hover:font-semibold"
          >
            {t('footer.support.policy')}
          </Link>
        </div>
        <div className="mt-4 text-sm">
          <Link
            href="#"
            className="transition hover:text-emerald-500 hover:font-semibold"
          >
            {t('footer.support.aboutUs')}
          </Link>
        </div>
        <div className="mt-4 text-sm">
          <Link
            href="#"
            className="transition hover:text-emerald-500 hover:font-semibold"
          >
            {t('footer.support.ques')}
          </Link>
        </div>
        <div className="mt-4 text-sm">
          <Link
            href="#"
            className="transition hover:text-emerald-500 hover:font-semibold"
          >
            {t('footer.support.contact')}
          </Link>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-semibold">{t('footer.link.title')}</h4>
        <div className="mt-4 text-sm">
          <Link
            href="#"
            className="transition hover:text-emerald-500 hover:font-semibold"
          >
            {t('footer.link.home')}
          </Link>
        </div>
        <div className="mt-4 text-sm">
          <Link
            href="#"
            className="transition hover:text-emerald-500 hover:font-semibold"
          >
            {t('footer.link.feature')}
          </Link>
        </div>
        <div className="mt-4 text-sm">
          <Link
            href="#"
            className="transition hover:text-emerald-500 hover:font-semibold"
          >
            {t('footer.link.templateCV')}
          </Link>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-semibold">
          {t('footer.newFeature.title')}
        </h4>
        <div className="mt-4 text-sm">
          <Link
            href="#"
            className="transition hover:text-emerald-500 hover:font-semibold"
          >
            {t('footer.newFeature.notAvaiable')}
          </Link>
        </div>
      </div>
      <div>
        <div className="flex justify-center h-16 p-2 rounded bg-slate-500">
          <Image
            width={500}
            height={500}
            alt=""
            src={'/vite.svg'}
          />
        </div>
        <p className="mt-2 text-center">{t('footer.sologan')}</p>
      </div>
    </footer>
  );
}
