import localFont from 'next/font/local';

export const themeFont = localFont({
  src: [
    {
      path: './Faktum/Faktum-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Faktum/Faktum-RegularItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './Faktum/Faktum-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './Faktum/Faktum-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: './Faktum/Faktum-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './Faktum/Faktum-SemiBoldItalic.woff2',
      weight: '600',
      style: 'italic',
    },
  ],
});
