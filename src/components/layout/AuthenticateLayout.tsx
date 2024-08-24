import { useTranslations } from 'next-intl';
import Image from 'next/image';

type LayoutSize = 'xs' | 'sm' | 'md' | 'lg';
interface AuthenticationNode {
  welcome: string;
  introduction?: string;
  intendedFor: string;
  padding?: string;
  children: React.ReactNode;
  backgroundImage: string;
  layoutSize?: LayoutSize;
  verify?: boolean;
}

export default function AuthenticateLayout({
  children,
  welcome,
  introduction,
  intendedFor,
  padding,
  backgroundImage,
  layoutSize = 'sm',
  verify = false,
}: AuthenticationNode) {
  const t = useTranslations();
  return (
    <div
      className={`flex items-center justify-center ${
        layoutSize === 'lg' ? 'py-8 mx-auto h-[100%]' : 'h-screen pb-5 '
      } md:px-2 lg:px-0 md:bg-slate-200`}
    >
      <div
        className={`${
          layoutSize === 'xs'
            ? 'max-w-[450px]'
            : layoutSize === 'sm'
            ? 'max-w-[950px]'
            : layoutSize === 'md'
            ? 'max-w-[1050px]'
            : layoutSize === 'lg'
            ? 'max-w-[1440px] w-[90%]'
            : ''
        } w-full md:shadow-md h-full md:h-min bg-white md:grid md:gap-6 lg:gap-8 ${
          verify ? 'grid-cols-1' : 'grid-cols-2'
        } py-8 px-6 sm:px-24 md:px-6 lg:px-8 rounded-xl`}
      >
        {!verify && (
          <div className="relative hidden py-4 bg-gray-100 rounded-md md:block">
            <div className="absolute top-4 left-4">
              <Image
                width={500}
                height={500}
                alt=""
                src={'/vite.svg'}
                className="w-14 h-14"
              />
            </div>
            <div
              className={`${
                layoutSize === 'lg' ? 'space-y-40' : 'gap-y-10'
              } px-4 pt-28`}
            >
              <div className="h-[200px] mx-auto">
                <Image
                  width={500}
                  height={500}
                  alt=""
                  src={backgroundImage}
                  className="object-contain w-full h-full rounded-lg"
                />
              </div>
              <div
                className={`p-4 space-y-6 ${
                  layoutSize === 'md' ? 'mt-10' : 'mt-8'
                } rounded-lg bg-slate-700`}
              >
                {layoutSize === 'lg' ? (
                  <p className="text-white">
                    Cùng xây dựng một hồ sơ thông tin doanh nghiệp hoàn hảo để
                    tuyển dụng được những ứng viên phù hợp với doanh nghiệp của
                    bạn. Hãy để chúng tôi giúp bạn làm điều đó!
                  </p>
                ) : (
                  <p className="text-white">
                    Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự
                    nghiệp lý tưởng. Hãy để chúng tôi giúp bạn làm điều đó!
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <Image
                    width={500}
                    height={500}
                    alt=""
                    src={'/vite.svg'}
                    className="w-10 h-10 rounded-full"
                  ></Image>
                  <div className="flex flex-col text-white">
                    <p className="font-bold">My Team</p>
                    <p>Web Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`${padding} ${layoutSize === 'lg' && 'pr-8'}`}>
          <p className="text-2xl font-bold text-emerald-500">{t(welcome)}</p>
          <p className="pt-2 font-semibold text-gray-700">{t(introduction)}</p>
          <p className={`${padding} text-lg`}>{t(intendedFor)}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
