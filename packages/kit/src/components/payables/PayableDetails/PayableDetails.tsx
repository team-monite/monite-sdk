import React, { useCallback, useRef } from 'react';
import styled from '@emotion/styled';

import {
  Button,
  Flex,
  FormField,
  Text,
  IconButton,
  ModalLayout,
  UMultiply,
  Header,
  Tag,
  Box,
} from '@monite/ui';

import PdfViewer from '../../payment/PdfViewer/PdfViewer';

import PayableDetailsForm, {
  PayablesDetailsFormProps,
} from './PayableDetailsForm';

export interface PayablesDetailsProps extends PayablesDetailsFormProps {}

export const FormItem = styled(FormField)`
  margin-bottom: 24px;
`;

const StyledHeaderContent = styled(Flex)`
  align-items: center;
  gap: 24px;
`;

const StyledHeaderActions = styled(Flex)`
  align-items: center;
  gap: 12px;
`;

const StyledContent = styled(Flex)`
  padding: 40px;
  background-color: #f3f3f3;
  gap: 76px;
`;

const StyledSection = styled(Box)`
  width: 50%;
`;

const PayableDetails = ({
  onSubmit,
  payable,
  tags,
  counterparts,
}: PayablesDetailsProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const submitForm = useCallback(() => {
    formRef.current?.dispatchEvent(new Event('submit', { bubbles: true }));
  }, [formRef]);

  return (
    <ModalLayout
      fullScreen
      header={
        <Header
          leftBtn={
            <IconButton color={'black'}>
              <UMultiply size={18} />
            </IconButton>
          }
          actions={
            <StyledHeaderActions>
              <Button onClick={submitForm} color={'secondary'}>
                Save
              </Button>
              <Button onClick={submitForm}>Submit</Button>
            </StyledHeaderActions>
          }
        >
          <StyledHeaderContent>
            <Text textSize={'h3'}>Mindspace GmbH</Text>
            <Tag color={'draft'}>Draft</Tag>
          </StyledHeaderContent>
        </Header>
      }
    >
      <StyledContent>
        <StyledSection>
          {!!payable.file && <PdfViewer file={payable.file.url} />}
        </StyledSection>
        <StyledSection sx={{ flexGrow: 1 }}>
          <PayableDetailsForm
            ref={formRef}
            tags={tags}
            counterparts={counterparts}
            onSubmit={onSubmit}
            payable={payable}
          />
        </StyledSection>
      </StyledContent>
    </ModalLayout>
  );
};

export default PayableDetails;
