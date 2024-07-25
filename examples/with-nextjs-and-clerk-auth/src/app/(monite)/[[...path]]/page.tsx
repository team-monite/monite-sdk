'use client';

import React from 'react';

import { MoniteScopedProviders } from '@monite/sdk-react';
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

const AccountBalance = ({
  title,
  number,
  balance,
}: {
  title: string;
  number: string;
  balance: string;
}) => {
  return (
    <Stack
      direction="row"
      justifyContent="stretch"
      alignItems="flex-start"
      className="Monite-Cash-On-Accounts-Account-Balance"
    >
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        className="Monite-Cash-On-Accounts-Account-Balance-Account-Name"
        sx={{
          flexGrow: 2,
        }}
      >
        <h4>{title}</h4>
        <aside>Checking ...{number}</aside>
      </Stack>
      <h3>{balance}</h3>
    </Stack>
  );
};

export default function DefaultPage() {
  return (
    <MoniteScopedProviders>
      <Box className="Monite-AbsoluteContainer Monite-Dashboard">
        <Stack
          direction="column"
          justifyContent="space-between"
          alignItems="stretch"
          sx={{}}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              marginBottom: 3,
            }}
          >
            <Typography variant="h2">Dashboard</Typography>
            <aside>{<Button variant="contained">Quick actions</Button>}</aside>
          </Stack>

          <Tabs value="overview" variant="standard" sx={{ marginBottom: 3 }}>
            <Tab id="overview" label="Overview" value="overview" />

            <Tab id="user-view" label="Your view" value="user-view" />

            <Tab
              id="project-rebranding"
              label="Project 'Rebranding'"
              value="project-rebranding"
            />
          </Tabs>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card
                variant="elevation"
                sx={{ padding: 3, marginLeft: '2px' }}
                className="Monite-Demo-Cash-On-Accounts"
              >
                <Stack
                  direction="row"
                  justifyContent="stretch"
                  alignItems="flex-start"
                  className="Monite-Cash-On-Accounts-Header"
                >
                  <svg
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="Monite-Demo-Cash-On-Accounts-Icon"
                  >
                    <rect width="40" height="40" rx="10" fill="#F4F4FE" />
                    <path
                      d="M26.9399 17.9592C27.0471 17.9592 27.1533 17.9381 27.2523 17.8971C27.3514 17.8561 27.4414 17.7959 27.5172 17.7201C27.593 17.6443 27.6531 17.5543 27.6941 17.4553C27.7352 17.3562 27.7562 17.25 27.7562 17.1428V14.6939C27.7563 14.5226 27.7024 14.3556 27.6023 14.2167C27.5021 14.0777 27.3607 13.9739 27.1982 13.9198L19.8512 11.4708C19.6836 11.415 19.5023 11.415 19.3347 11.4708L11.9877 13.9198C11.8252 13.9739 11.6838 14.0777 11.5837 14.2167C11.4835 14.3556 11.4296 14.5226 11.4297 14.6939V17.1428C11.4297 17.25 11.4508 17.3562 11.4918 17.4553C11.5328 17.5543 11.5929 17.6443 11.6687 17.7201C11.7445 17.7959 11.8345 17.8561 11.9336 17.8971C12.0326 17.9381 12.1388 17.9592 12.246 17.9592H13.0623V23.8239C12.5862 23.9916 12.1737 24.3026 11.8813 24.7141C11.589 25.1257 11.4312 25.6176 11.4297 26.1224V27.7551C11.4297 27.8623 11.4508 27.9685 11.4918 28.0675C11.5328 28.1666 11.5929 28.2566 11.6687 28.3324C11.7445 28.4082 11.8345 28.4683 11.9336 28.5093C12.0326 28.5503 12.1388 28.5714 12.246 28.5714H26.9399C27.0471 28.5714 27.1533 28.5503 27.2523 28.5093C27.3514 28.4683 27.4414 28.4082 27.5172 28.3324C27.593 28.2566 27.6531 28.1666 27.6941 28.0675C27.7352 27.9685 27.7562 27.8623 27.7562 27.7551V26.1224C27.7547 25.6176 27.5969 25.1257 27.3046 24.7141C27.0122 24.3026 26.5997 23.9916 26.1236 23.8239V17.9592H26.9399ZM26.1236 26.9388H13.0623V26.1224C13.0626 25.906 13.1486 25.6985 13.3017 25.5454C13.4547 25.3924 13.6622 25.3063 13.8787 25.3061H25.3072C25.5237 25.3063 25.7312 25.3924 25.8842 25.5454C26.0373 25.6985 26.1234 25.906 26.1236 26.1224V26.9388ZM14.695 23.6735V17.9592H16.3276V23.6735H14.695ZM17.9603 23.6735V17.9592H21.2256V23.6735H17.9603ZM22.8583 23.6735V17.9592H24.4909V23.6735H22.8583ZM13.0623 16.3265V15.2822L19.593 13.105L26.1236 15.2822V16.3265H13.0623Z"
                      fill="#3737FF"
                    />
                  </svg>

                  <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="stretch"
                    className="Monite-Cash-On-Accounts-Header-Label"
                  >
                    <h3>Cash on accounts</h3>
                    <aside>3 accounts</aside>
                  </Stack>

                  <h2 className="Monite-Cash-On-Accounts-Header-Balance">
                    $ 127,347.80
                  </h2>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="stretch"
                  alignItems="flex-start"
                >
                  <span className="Monite-Cash-On-Accounts-Empty-Space"></span>
                  <Stack
                    direction="column"
                    justifyContent="stretch"
                    alignItems="flex-start"
                    className="Monite-Cash-On-Accounts-List"
                    sx={{ flexGrow: 2 }}
                  >
                    <AccountBalance
                      title="American Express"
                      number="8779"
                      balance="$ 97,347.80"
                    />
                    <AccountBalance
                      title="Mercury"
                      number="2190"
                      balance="$ 10,000.00"
                    />
                    <AccountBalance
                      title="JP Morgan Case"
                      number="5467"
                      balance="$ 20,000.00"
                    />
                  </Stack>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card variant="elevation" sx={{ padding: 3, marginRight: '2px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <svg
                      width="41"
                      height="40"
                      viewBox="0 0 41 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        width="40"
                        height="40"
                        rx="12"
                        fill="#F4F4FE"
                      />
                      <path
                        d="M28.3894 17.55C28.3063 17.3851 28.1791 17.2464 28.022 17.1494C27.8649 17.0523 27.684 17.0006 27.4994 17H22.4994V11C22.5101 10.7807 22.4484 10.564 22.3236 10.3832C22.1989 10.2025 22.0182 10.0679 21.8094 10C21.6086 9.93399 21.3921 9.93324 21.1908 9.99792C20.9896 10.0626 20.8141 10.1894 20.6894 10.36L12.6894 21.36C12.5891 21.5049 12.529 21.6737 12.5149 21.8493C12.5009 22.0249 12.5334 22.2011 12.6094 22.36C12.6793 22.5418 12.8008 22.6992 12.9589 22.8129C13.117 22.9266 13.3048 22.9916 13.4994 23H18.4994V29C18.4995 29.2109 18.5663 29.4164 18.6903 29.587C18.8142 29.7576 18.9889 29.8847 19.1894 29.95C19.2898 29.9812 19.3942 29.998 19.4994 30C19.6572 30.0005 19.8128 29.9635 19.9536 29.8923C20.0944 29.821 20.2163 29.7174 20.3094 29.59L28.3094 18.59C28.4171 18.4408 28.4816 18.2648 28.4957 18.0813C28.5098 17.8978 28.473 17.714 28.3894 17.55ZM20.4994 25.92V22C20.4994 21.7348 20.394 21.4805 20.2065 21.2929C20.0189 21.1054 19.7646 21 19.4994 21H15.4994L20.4994 14.08V18C20.4994 18.2653 20.6047 18.5196 20.7923 18.7071C20.9798 18.8947 21.2342 19 21.4994 19H25.4994L20.4994 25.92Z"
                        fill="#3737FF"
                      />
                    </svg>
                  </Grid>
                  <Grid item xs={5}>
                    xs=5
                  </Grid>
                  <Grid item xs={5}>
                    xs=6
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </MoniteScopedProviders>
  );
}
