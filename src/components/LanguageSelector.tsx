'use client';
import Dropdown from '@/components/Dropdown';
import { Badge } from '@/components/ui/badge';
import { usePathname, useRouter } from '@/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

export default function LanguageSelector(): React.ReactElement {
  const t = useTranslations();
  const locale = useLocale();

  const pathname = usePathname();
  const router = useRouter();
  const handleLanguageChange = (code: string) => {
    router.replace(pathname, { locale: code });
  };

  return (
    <Dropdown
      render={
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-2 transition-all hover:text-emerald-500">
                <div className="h-5 w-7">
                  <Image
                    width={500}
                    height={500}
                    src={locale === 'en' ? '/english.png' : '/vietnam.png'}
                    alt=""
                    className="w-full h-full "
                  />
                </div>
                <Badge className="text-xs border" color="success">
                  {t('languageSelector.buttonChange')}
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent className="w-max">
              <p>{t('header.jobSeeker.notifications')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
      position="bottomRight"
    >
      <Dropdown.Item onItemClick={() => handleLanguageChange('vi')}>
        <div className="flex items-center gap-x-3">
          <div className="flex items-center gap-x-2">
            <Image
              width={500}
              height={500}
              alt=""
              src={'/vietnam.png'}
              className="h-5 w-7"
            />
            <span className="w-[1px] h-6 bg-slate-200"></span>
          </div>
          <span> {t('languageSelector.code.vi')}</span>
        </div>
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item onItemClick={() => handleLanguageChange('en')}>
        <div className="flex items-center gap-x-3">
          <div className="flex items-center gap-x-2">
            <Image
              width={500}
              height={500}
              alt=""
              src={'/english.png'}
              className="h-5 w-7"
            />
            <span className="w-[1px] h-6 bg-slate-200"></span>
          </div>
          <span> {t('languageSelector.code.en')}</span>
        </div>
      </Dropdown.Item>
    </Dropdown>
  );
}
