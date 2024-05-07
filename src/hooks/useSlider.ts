export default function useSlider() {
  const moveToNextSlide = (sliderRef: React.RefObject<HTMLDivElement>) => {
    const slider = sliderRef.current;
    if (slider) {
      const { scrollLeft, clientWidth, scrollWidth } = slider;
      slider.scrollTo({
        left:
          scrollLeft + clientWidth < scrollWidth ? scrollLeft + clientWidth : 0,
        behavior: 'smooth',
      });
    }
  };

  const moveToPrevSlide = (sliderRef: React.RefObject<HTMLDivElement>) => {
    const slider = sliderRef.current;
    if (slider) {
      const { scrollLeft, clientWidth, scrollWidth } = slider;
      slider.scrollTo({
        left: scrollLeft != 0 ? scrollLeft - clientWidth : scrollWidth,
        behavior: 'smooth',
      });
    }
  };

  return {
    moveToNextSlide,
    moveToPrevSlide,
  };
}
