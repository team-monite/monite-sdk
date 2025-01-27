import { useState } from 'react';

import { Skeleton, styled } from '@mui/material';

export interface ImageWithSkeletonProps {
  url?: string;
  alt?: string;
}

const StyledImg = styled('img')({
  width: '100%',
  height: '100%',
});

export const ImageWithSkeleton = ({ url, alt }: ImageWithSkeletonProps) => {
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  return (
    <>
      {url && (
        <StyledImg src={url} onLoad={() => setIsImgLoaded(true)} alt={alt} />
      )}
      {!isImgLoaded && (
        <Skeleton
          variant="rectangular"
          sx={{ height: '100%', width: '100%' }}
        />
      )}
    </>
  );
};
