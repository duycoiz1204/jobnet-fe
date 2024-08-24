import { NavLink } from '@/components/NavLink';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useCollapse from '@/hooks/useCollapse';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import {
  FaArrowLeft,
  FaArrowRight,
  FaBars,
  FaBell,
  FaRocketchat,
} from 'react-icons/fa6';
export default function ADHeader({}: // handleClick,
// icon,
{
  // handleClick: () => void
  // icon: boolean
}): JSX.Element {
  const adminNavLink = ({ isActive }: { isActive: boolean }) =>
    `transition-all hover:text-emerald-500 relative ${
      isActive ? 'text-emerald-500' : ''
    }`;

  const [isVisible, controlVisible] = useCollapse();

  return (
    <>
      <header className="relative top-0 left-0 right-0 flex items-center justify-center h-20 px-2 mr-5 bg-white rounded-bl-lg rounded-br-lg shadow lg:mr-0 md:gap-10 lg:justify-between lg:gap-0 gap-x-5 lg:px-8 hover:shadow-lg">
        <div className="flex items-center gap-x-4 md:gap-x-2">
          {/* <span
            onClick={handleClick}
            className="block p-4 text-2xl leading-none transition-all rounded-lg cursor-pointer text-emerald-500 hover:bg-slate-100"
          >
            {icon ? (
              <FaBars />
            ) : (
              <>
                <span className="hidden sm:block">
                  <FaArrowRight />
                </span>
                <span className="lg:hidden md:hidden">
                  <FaArrowLeft />
                </span>
              </>
            )}
          </span> */}

          <h2 className="hidden ml-4 text-2xl font-bold sm:block">Dashboard</h2>
        </div>

        <div className="flex items-center gap-7">
          <div className="hidden sm:block lg:inline-flex md:hidden items-center max-w-xl w-[330px] px-[10px] py-2 border border-slate-200 bg-slate-100 rounded-full">
            <div className="flex items-center grow">
              <input
                className="w-full ml-4 bg-transparent outline-none placeholder:text-slate-400"
                placeholder="Search something here"
              />
              <div className="pl-4 text-lg opacity-50">
                <FaSearch />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-7">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink href="chat" className={adminNavLink}>
                    <FaRocketchat className="text-2xl" />
                    <span className="shadow-md text-white absolute text-xs p-[2px] rounded-full bg-emerald-500 top-[-50%] right-[-50%]">
                      23
                    </span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    href="notifications"
                    // relative="route"
                    className={adminNavLink}
                  >
                    <FaBell className="text-2xl" />
                    <span className="shadow-md text-white absolute text-xs p-[2px] rounded-full bg-emerald-500 top-[-50%] right-[-50%]">
                      51
                    </span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Thông báo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div
              className="inline-block cursor-pointer lg:hidden sm:block hover:text-emerald-500"
              onClick={controlVisible}
            >
              <FaSearch className="text-2xl" />
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-10 h-10 transition-all border-2 rounded-full cursor-pointer hover:border-emerald-500">
                    <Image
                      width={undefined}
                      height={undefined}
                      alt=""
                      src={'/admin.png'}
                      className="w-full h-full rounded-full"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Join Peter</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex-col items-center justify-center hidden sm:block md:hidden lg:flex">
              <h2 className="font-bold leading-none">Join Peter</h2>
              <span className="text-[#464a53] opacity-75 text-sm">
                Super Admin
              </span>
            </div>
          </div>
        </div>
        {!isVisible ? (
          <div className="z-50 absolute lg:hidden top-[70px] sm:block items-center max-w-xl w-[270px] px-[10px] py-2 border border-slate-200 bg-slate-100 rounded-full">
            <div className="flex items-center grow">
              <input
                className="w-full ml-4 bg-transparent outline-none placeholder:text-slate-400"
                placeholder="Search something here"
              />
              <div className="pl-4 text-lg opacity-50">
                <FaSearch />
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </header>
      {!isVisible && (
        <div
          className="absolute inset-0 bg-black lg:hidden noverlay opacity-20"
          onClick={() => controlVisible()}
        ></div>
      )}
    </>
  );
}
