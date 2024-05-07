'use client';

import { useRef } from 'react';
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';
import Carousel from './Carousel';
import useSlider from '@/hooks/useSlider';

type Props = {
  title: string;
  elms: any;
};

export default function HomeCarousel({
  title,
  elms,
}: Props): React.ReactElement {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { moveToNextSlide, moveToPrevSlide } = useSlider();

  return (
    <div className="px-6 space-y-2 sm:px-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center">
          <div
            className="p-2 text-emerald-500 hover:text-emerald-600 hover:cursor-pointer"
            onClick={() => moveToPrevSlide(sliderRef)}
          >
            <ArrowBigLeft className="w-8 h-8" />
          </div>
          <div
            className="p-2 text-2xl md:text-3xl text-emerald-500 hover:text-emerald-600 hover:cursor-pointer"
            onClick={() => moveToNextSlide(sliderRef)}
          >
            <ArrowBigRight className="w-8 h-8" />
          </div>
        </div>
      </div>
      <Carousel ref={sliderRef} elms={elms} />
    </div>
  );
}
