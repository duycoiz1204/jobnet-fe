'use server';

import { getTranslations } from 'next-intl/server';
import empty from '/empty.png';

export default async function EmptyData({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  const t = await getTranslations();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="object-cover w-48 h-48">
        <img src={empty} />
      </div>
      <h4 className="text-lg font-bold">{title || t('emptyData.title')}</h4>
      <div className="text-slate-400">
        {subtitle || t('emptyData.subtitle')}
      </div>
    </div>
  );
}
