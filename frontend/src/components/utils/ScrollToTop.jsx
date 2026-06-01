import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Reset global window scroll position
    window.scrollTo(0, 0);

    // 2. Reset any scrolling layout viewport <main> elements immediately
    const mainElements = document.getElementsByTagName('main');
    for (let i = 0; i < mainElements.length; i++) {
      mainElements[i].scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
