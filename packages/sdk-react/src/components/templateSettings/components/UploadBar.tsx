import { useEffect, useState } from 'react';

type Props = {
  shouldStartProgress: boolean;
  isError: boolean;
  isSuccess: boolean;
};

export const UploadBar = ({
  shouldStartProgress,
  isError,
  isSuccess,
}: Props) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    if (shouldStartProgress) {
      intervalId = setInterval(() => {
        setProgress((prevState) => {
          if (prevState < 98) {
            return prevState + 2;
          }

          if (prevState === 98) {
            return prevState + 1;
          }

          return prevState;
        });
      }, 200);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [shouldStartProgress]);

  if (isSuccess) {
    return (
      <div className="mtw:w-[262px] mtw:h-[6px] mtw:bg-success-50 mtw:rounded-md" />
    );
  }

  if (isError) {
    return (
      <div className="mtw:w-[262px] mtw:h-[6px] mtw:bg-danger-100 mtw:rounded-md" />
    );
  }

  return (
    <div className="mtw:w-[262px] mtw:h-[6px] mtw:bg-neutral-90 mtw:rounded-md">
      <div
        className="mtw:bg-primary-60 mtw:h-full mtw:rounded-md"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
