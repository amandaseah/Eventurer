// src/components/common/Image.tsx
import * as React from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** optional fallback image to try before showing the SVG error */
  fallbackSrc?: string;
};


export default function Image({ fallbackSrc, onError, ...rest }: Props) {
  const [src, setSrc] = React.useState(rest.src);
  const [failedOnce, setFailedOnce] = React.useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!failedOnce && fallbackSrc && src !== fallbackSrc) {
      setFailedOnce(true);
      setSrc(fallbackSrc); // try the provided fallback first
      return;
    }
    // final graceful error SVG
    setSrc(ERROR_IMG_SRC);
    onError?.(e);
  };

  return <img {...rest} src={src} onError={handleError} />;
}

/** temporary alias so old imports keep working until u update them everywhere */
export { default as ImageWithFallback } from "./Image";