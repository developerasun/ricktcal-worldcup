'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

type Props = {
  url: string;
};

function ReactSwagger({ url }: Props) {
  const { theme, setTheme } = useTheme();
  const originalTheme = useRef<string | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    originalTheme.current = theme;
    // force light mode
    setTheme('light');
    console.log(pathname.startsWith('/apidoc'));
    console.log({ originalTheme });
  }, []);

  useEffect(() => {
    return () => {
      // restore theme on page move
      if (originalTheme.current) {
        setTheme(originalTheme.current);
      }
    };
  }, [pathname]);

  return <SwaggerUI url={url} />;
}

export default ReactSwagger;
