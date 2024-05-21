import { LoadingGenerateJD } from '../loader/Loader';
import LoadingSkeleton from './LoadingSkeleton';

const GenerateSkeleton = () => {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 flex items-center bg-transparent justify-center w-full h-full z-10]">
        <LoadingGenerateJD show={true} />
      </div>
      <div className="flex flex-col h-full p-6 rounded-lg bg-slate-300">
        <div className="h-[50px] mb-6">
          <LoadingSkeleton width="100%" height="100%" borderRadius="4px" />
        </div>
        <div className="mb-4 text-xl font-semibold text-black">
          <LoadingSkeleton width="30%" height="20px" borderRadius="4px" />
        </div>
        <div className="h-[150px] mb-6">
          <LoadingSkeleton width="100%" height="100%" borderRadius="4px" />
        </div>
        <div className="mb-4 text-xl font-semibold text-black">
          <LoadingSkeleton width="30%" height="20px" borderRadius="4px" />
        </div>
        <div className="h-[150px] mb-6">
          <LoadingSkeleton width="100%" height="100%" borderRadius="4px" />
        </div>
        <div className="mb-4 text-xl font-semibold text-black">
          <LoadingSkeleton width="30%" height="20px" borderRadius="4px" />
        </div>
        <div className="h-[150px]">
          <LoadingSkeleton width="100%" height="100%" borderRadius="4px" />
        </div>
      </div>
    </div>
  );
};

export default GenerateSkeleton;
