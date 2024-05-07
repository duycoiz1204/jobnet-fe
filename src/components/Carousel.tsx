import { forwardRef } from 'react';

interface SliderProps {
  className?: string;
  elms: JSX.Element[];
}

const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  { elms, className = '' },
  ref
): JSX.Element {
  return (
    <div
      ref={ref}
      className={`flex -mx-4 overflow-hidden flex-nowrap ${className}`}
    >
      {elms}
    </div>
  );
});

export default Slider;
