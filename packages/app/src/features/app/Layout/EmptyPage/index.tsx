import React from 'react';
import Layout from 'features/app/Layout';
import { THEMES, Link, Text, Box } from '@monite/ui';

import styles from '../styles.module.scss';

type EmptyPageProps = {
  label?: string;
  renderIcon?: (props: any) => React.ReactNode;
  apiLink?: string;
};

const EmptyPage = ({ label, renderIcon, apiLink = '' }: EmptyPageProps) => {
  return (
    <Layout>
      <div className={styles.emptyPageWrapper}>
        <div className={styles.emptyPageContent}>
          <Box mb={3}>
            {renderIcon &&
              renderIcon({ width: 54, color: THEMES.default.colors.primary })}
          </Box>
          <Box mb={1}>
            <Text textSize="h3" align="center">
              {`${label} page is in development...`}
            </Text>
          </Box>
          <Text align="center">
            We’re working on bringing{' '}
            <Link href={'https://docs.monite.com/page/white-label-sdk'}>
              <Text className={styles.link}>Dashboard</Text>
            </Link>{' '}
            into White Label. Meanwhile you can check our{' '}
            <Link href={apiLink} className={styles.link}>
              <Text className={styles.link}> API docs</Text>
            </Link>{' '}
            to see what you can build!
          </Text>
        </div>
      </div>
    </Layout>
  );
};

export default EmptyPage;
