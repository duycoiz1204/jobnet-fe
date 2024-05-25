import { useEffect, useRef, useState } from 'react';

function UseClickOutSide() {
  const [clickOutSide, setClickOutSide] = useState<boolean>(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const isFirstClick = useRef(true);

  useEffect(() => {
    const dom = nodeRef.current;
    const handleClickOutSide = (e: MouseEvent) => {
      if (dom && !dom.contains(e.target as Node)) {
        if (isFirstClick.current) {
          isFirstClick.current = false;
        } else {
          setClickOutSide(true);
        }
      }
    };

    document.addEventListener('click', handleClickOutSide);
    return () => {
      document.removeEventListener('click', handleClickOutSide);
    };
  }, []);

  return {
    nodeRef,
    clickOutSide,
    setClickOutSide,
  };
}

export default UseClickOutSide;
