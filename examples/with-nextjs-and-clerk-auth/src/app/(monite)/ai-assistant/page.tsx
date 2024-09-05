'use client';

import { useState } from 'react';

import Image from 'next/image';

import {
  Box,
  Button,
  Card,
  CardContent,
  createSvgIcon,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import aiStub from './ai-stub-793.png';

export default function AiAssistantPage() {
  const [replyShown, setReplyShown] = useState(false);

  const onCardClick = () => {
    // Do nothing on click - Alex told not to show fake response
    // setReplyShown(true);
  };

  return (
    <Box className="Monite-PageContainer Monite-AiAssistant">
      <Stack direction="column" sx={{ width: '100%', height: '100%' }}>
        <Typography variant="h2">AI Assistant</Typography>
        <Box flexGrow={2}>
          {!replyShown && (
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              gap={2}
              sx={{ width: '100%', height: '100%' }}
            >
              <Typography
                variant="subtitle2"
                sx={{ width: '100%', maxWidth: '720px' }}
              >
                Some examples of what you can do:
              </Typography>
              <Stack direction="row" gap={2} sx={{ maxWidth: '720px' }}>
                <AiCard
                  Icon={Icon1}
                  title="Find documents quickly"
                  body="Type any prompt and we’ll look for all related documents and show you relevant information organised."
                  onClick={onCardClick}
                />
                <AiCard
                  Icon={Icon2}
                  title="Automate & schedule"
                  body="Schedule payments, emails and notifications. Create new
                      documents, approval policies or any other items."
                  onClick={onCardClick}
                />
                <AiCard
                  Icon={Icon3}
                  title="Generate custom reports"
                  body="Choose what information to combine is a custom-made
                      reports tailored to exact needs of your business."
                  onClick={onCardClick}
                />
              </Stack>
            </Stack>
          )}

          {replyShown && (
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              gap={2}
              sx={{ width: '100%', height: '100%' }}
            >
              <Image src={aiStub} alt="" onClick={() => setReplyShown(false)} />
            </Stack>
          )}
        </Box>
        <Stack alignItems="center" justifyContent="center">
          <SearchBar />
        </Stack>
      </Stack>
    </Box>
  );
}

const AiCard = ({
  Icon,
  title,
  body,
  onClick,
}: {
  Icon: typeof Icon1;
  title: string;
  body: string;
  onClick: () => void;
}) => {
  return (
    <Card onClick={onClick}>
      <CardContent sx={{ p: 2 }}>
        <Stack direction="column" alignItems="flex-start" gap={2}>
          <Icon sx={{ width: '40px', height: '40px' }} />
          <Typography variant="body1">{title}</Typography>
          <Typography variant="body2">{body}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('Search term:', searchTerm);
    // Add your search handling logic here
  };

  return (
    <TextField
      className="Monite-AiSearchField"
      variant="outlined"
      placeholder="What we can help you with?"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      fullWidth
      sx={{ maxWidth: '720px', background: '#ffffff', borderRadius: '4px' }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              variant="outlined"
              size="small"
              className="Monite-withShadow"
              onClick={handleSearch}
              style={{ textTransform: 'none' }} // Ensures "Send" text is not all caps
            >
              Send
            </Button>
          </InputAdornment>
        ),
      }}
    />
  );
};

const Icon1 = createSvgIcon(
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="20" fill="#EBEBFF" />
    <path
      d="M29.7075 28.2899L25.9975 24.6099C27.4376 22.8143 28.135 20.5352 27.9463 18.2412C27.7576 15.9472 26.6971 13.8127 24.983 12.2765C23.2688 10.7404 21.0313 9.91941 18.7304 9.98237C16.4295 10.0453 14.2402 10.9875 12.6126 12.615C10.985 14.2426 10.0429 16.4319 9.97993 18.7328C9.91697 21.0337 10.738 23.2713 12.2741 24.9854C13.8102 26.6996 15.9448 27.76 18.2388 27.9487C20.5328 28.1374 22.8119 27.44 24.6075 25.9999L28.2875 29.6799C28.3804 29.7736 28.491 29.848 28.6129 29.8988C28.7347 29.9496 28.8655 29.9757 28.9975 29.9757C29.1295 29.9757 29.2602 29.9496 29.382 29.8988C29.5039 29.848 29.6145 29.7736 29.7075 29.6799C29.8877 29.4934 29.9885 29.2442 29.9885 28.9849C29.9885 28.7256 29.8877 28.4764 29.7075 28.2899ZM18.9975 25.9999C17.613 25.9999 16.2596 25.5894 15.1085 24.8202C13.9573 24.051 13.0601 22.9578 12.5303 21.6787C12.0005 20.3996 11.8619 18.9921 12.132 17.6343C12.4021 16.2764 13.0687 15.0291 14.0477 14.0502C15.0267 13.0712 16.274 12.4045 17.6318 12.1344C18.9897 11.8643 20.3972 12.0029 21.6762 12.5327C22.9553 13.0626 24.0486 13.9598 24.8178 15.1109C25.5869 16.2621 25.9975 17.6154 25.9975 18.9999C25.9975 20.8564 25.26 22.6369 23.9472 23.9497C22.6345 25.2624 20.854 25.9999 18.9975 25.9999Z"
      fill="#3737FF"
    />
  </svg>,
  'Icon1'
);
const Icon2 = createSvgIcon(
  <svg
    width="41"
    height="40"
    viewBox="0 0 41 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.664062" width="40" height="40" rx="20" fill="#EBEBFF" />
    <path
      d="M28.5573 17.5498C28.4742 17.3849 28.3471 17.2462 28.19 17.1491C28.0329 17.052 27.852 17.0004 27.6673 16.9998H22.6673V10.9998C22.6781 10.7805 22.6163 10.5637 22.4916 10.383C22.3669 10.2023 22.1862 10.0676 21.9773 9.9998C21.7766 9.93374 21.56 9.933 21.3588 9.99768C21.1576 10.0624 20.982 10.1891 20.8573 10.3598L12.8573 21.3598C12.7571 21.5047 12.6969 21.6734 12.6829 21.849C12.6688 22.0246 12.7014 22.2008 12.7773 22.3598C12.8473 22.5415 12.9687 22.6989 13.1268 22.8126C13.2849 22.9263 13.4728 22.9914 13.6673 22.9998H18.6673V28.9998C18.6675 29.2107 18.7343 29.4161 18.8582 29.5867C18.9822 29.7574 19.1569 29.8844 19.3573 29.9498C19.4578 29.9809 19.5622 29.9978 19.6673 29.9998C19.8251 30.0002 19.9808 29.9633 20.1216 29.892C20.2623 29.8208 20.3842 29.7172 20.4773 29.5898L28.4773 18.5898C28.5851 18.4406 28.6496 18.2646 28.6637 18.0811C28.6778 17.8976 28.641 17.7137 28.5573 17.5498ZM20.6673 25.9198V21.9998C20.6673 21.7346 20.562 21.4802 20.3744 21.2927C20.1869 21.1052 19.9326 20.9998 19.6673 20.9998H15.6673L20.6673 14.0798V17.9998C20.6673 18.265 20.7727 18.5194 20.9602 18.7069C21.1478 18.8944 21.4021 18.9998 21.6673 18.9998H25.6673L20.6673 25.9198Z"
      fill="#3737FF"
    />
  </svg>,
  'Icon2'
);

const Icon3 = createSvgIcon(
  <svg
    width="41"
    height="40"
    viewBox="0 0 41 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.335938" width="40" height="40" rx="20" fill="#EBEBFF" />
    <path
      d="M18.5059 18.55C18.5866 18.6744 18.694 18.7794 18.8203 18.8572C18.9465 18.9351 19.0885 18.9838 19.2359 19C19.384 19.015 19.5336 18.9967 19.6737 18.9466C19.8139 18.8964 19.941 18.8156 20.0459 18.71L21.1759 17.57L22.5059 19.57C22.5988 19.7039 22.7229 19.813 22.8676 19.888C23.0123 19.9629 23.173 20.0014 23.3359 20C23.5325 20.0022 23.7249 19.9428 23.8859 19.83C24.1052 19.6834 24.2576 19.4561 24.31 19.1976C24.3624 18.9392 24.3107 18.6705 24.1659 18.45L22.1659 15.45C22.0852 15.3255 21.9779 15.2206 21.8516 15.1428C21.7254 15.0649 21.5834 15.0162 21.4359 15C21.2879 14.985 21.1383 15.0033 20.9982 15.0534C20.858 15.1036 20.7309 15.1844 20.6259 15.29L19.4959 16.43L18.1659 14.43C18.1002 14.3074 18.0095 14.1998 17.8998 14.1143C17.7901 14.0287 17.6638 13.9669 17.5288 13.933C17.3939 13.899 17.2534 13.8935 17.1162 13.917C16.9791 13.9404 16.8483 13.9922 16.7323 14.0691C16.6163 14.146 16.5177 14.2462 16.4426 14.3633C16.3676 14.4805 16.3178 14.6121 16.2965 14.7496C16.2752 14.8871 16.2828 15.0275 16.3189 15.1619C16.3549 15.2963 16.4187 15.4216 16.5059 15.53L18.5059 18.55ZM29.3359 22H28.3359V12H29.3359C29.6012 12 29.8555 11.8946 30.043 11.7071C30.2306 11.5196 30.3359 11.2652 30.3359 11C30.3359 10.7348 30.2306 10.4804 30.043 10.2929C29.8555 10.1054 29.6012 10 29.3359 10H11.3359C11.0707 10 10.8164 10.1054 10.6288 10.2929C10.4413 10.4804 10.3359 10.7348 10.3359 11C10.3359 11.2652 10.4413 11.5196 10.6288 11.7071C10.8164 11.8946 11.0707 12 11.3359 12H12.3359V22H11.3359C11.0707 22 10.8164 22.1054 10.6288 22.2929C10.4413 22.4804 10.3359 22.7348 10.3359 23C10.3359 23.2652 10.4413 23.5196 10.6288 23.7071C10.8164 23.8946 11.0707 24 11.3359 24H19.3359V25.15L14.7859 28.15C14.5993 28.2655 14.4558 28.4393 14.3777 28.6445C14.2996 28.8496 14.2912 29.0748 14.3537 29.2852C14.4163 29.4957 14.5464 29.6797 14.7239 29.8089C14.9014 29.938 15.1165 30.0052 15.3359 30C15.5325 30.0022 15.7249 29.9428 15.8859 29.83L19.3359 27.55V29C19.3359 29.2652 19.4413 29.5196 19.6288 29.7071C19.8164 29.8946 20.0707 30 20.3359 30C20.6012 30 20.8555 29.8946 21.043 29.7071C21.2306 29.5196 21.3359 29.2652 21.3359 29V27.55L24.7859 29.83C24.947 29.9428 25.1393 30.0022 25.3359 30C25.5496 29.9984 25.7571 29.9283 25.928 29.8002C26.099 29.672 26.2244 29.4925 26.2859 29.2879C26.3474 29.0832 26.3417 28.8643 26.2698 28.6631C26.1978 28.462 26.0633 28.2892 25.8859 28.17L21.3359 25.17V24H29.3359C29.6012 24 29.8555 23.8946 30.043 23.7071C30.2306 23.5196 30.3359 23.2652 30.3359 23C30.3359 22.7348 30.2306 22.4804 30.043 22.2929C29.8555 22.1054 29.6012 22 29.3359 22ZM26.3359 22H14.3359V12H26.3359V22Z"
      fill="#3737FF"
    />
  </svg>,
  'Icon3'
);
