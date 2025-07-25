import { useState } from 'react';

import {
  DiscardChangesContextProvider,
  useDiscardChangesContext,
} from '@/core/context/DiscardChangesContext';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { Dialog } from '@/ui/Dialog';
import { IconWrapper } from '@/ui/iconWrapper';
import { PageHeader } from '@/ui/PageHeader';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Close } from '@mui/icons-material';
import { Box, Tab, Tabs, DialogContent } from '@mui/material';

import { twMerge } from 'tailwind-merge';

import { DocumentNumber, LayoutAndLogo, OtherSettings } from './components';
import { DiscardChangesModal } from './components/DiscardChangesModal';

type TabType = 'documentDesign' | 'documentNumber' | 'otherSettings';

export type TemplateSettingsProps = {
  /** Flag that controls whether settings are shown inside a fullscreen dialog or not */
  isDialog?: boolean;
  /** Flag that controls whether dialog is open or not. It's meant to be passed in when isDialog is true */
  isOpen?: boolean;
  /** Callback function that is called when you close the dialog. It's meant to be passed in when isDialog is true */
  handleCloseDialog?: () => void;
};

export const TemplateSettings = (props: TemplateSettingsProps) => (
  <DiscardChangesContextProvider>
    <TemplateSettingsBase {...props} />
  </DiscardChangesContextProvider>
);

const TemplateSettingsBase = ({
  isDialog,
  isOpen,
  handleCloseDialog,
}: TemplateSettingsProps) => {
  const { componentSettings } = useMoniteContext();
  const { shouldShowChangesModal, handleShowModal } =
    useDiscardChangesContext();
  const { i18n } = useLingui();
  const [activeTabItem, setActiveTabItem] = useState<TabType>('documentDesign');
  const [temporaryTabItem, setTemporaryTabItem] = useState<TabType | null>(
    null
  );
  const [isDiscardChangesModalOpen, setIsDiscardChangesModalOpen] =
    useState(false);

  const handleClose = () => {
    if (shouldShowChangesModal) {
      setIsDiscardChangesModalOpen(true);
    } else {
      handleCloseDialog?.();
    }
  };

  const content = (
    <div
      className={twMerge(
        'mtw:flex mtw:flex-col mtw:w-full mtw:gap-10 mtw:pb-8',
        isDialog && 'mtw:max-w-[1080px] mtw:place-self-center'
      )}
    >
      <Tabs
        value={activeTabItem}
        variant="standard"
        aria-label={t(i18n)`Template settings tabs`}
        onChange={(_, value) => {
          if (shouldShowChangesModal) {
            setIsDiscardChangesModalOpen(true);
            setTemporaryTabItem(value);
          } else {
            setActiveTabItem(value);
          }
        }}
      >
        <Tab
          id="document-design-tab"
          aria-controls="document-design-tabpanel"
          label={t(i18n)`Layout and logo`}
          value="documentDesign"
        />
        {componentSettings?.templateSettings
          ?.enableDocumentNumberCustomisationTab && (
          <Tab
            id="document-number-tab"
            aria-controls="document-number-tabpanel"
            label={t(i18n)`Document number`}
            value="documentNumber"
          />
        )}
        {componentSettings?.templateSettings
          ?.enableOtherSettingsCustomisationTab && (
          <Tab
            id="other-settings-tab"
            aria-controls="other-settings-tabpanel"
            label={t(i18n)`Other settings`}
            value="otherSettings"
          />
        )}
      </Tabs>

      {activeTabItem === 'documentDesign' && (
        <Box
          role="tabpanel"
          id="document-design-tabpanel"
          aria-labelledby="document-design-tab"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'inherit',
            minHeight: '0',
          }}
        >
          <LayoutAndLogo shouldApplyDialogStyles={isDialog} />
        </Box>
      )}

      {activeTabItem === 'documentNumber' &&
        componentSettings?.templateSettings
          ?.enableDocumentNumberCustomisationTab && (
          <Box
            role="tabpanel"
            id="document-number-tabpanel"
            aria-labelledby="document-number-tab"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: 'inherit',
              minHeight: '0',
            }}
          >
            <DocumentNumber />
          </Box>
        )}

      {activeTabItem === 'otherSettings' &&
        componentSettings?.templateSettings
          ?.enableOtherSettingsCustomisationTab && (
          <Box
            role="tabpanel"
            id="other-settings-tabpanel"
            aria-labelledby="other-settings-tab"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: 'inherit',
              minHeight: '0',
            }}
          >
            <OtherSettings />
          </Box>
        )}
    </div>
  );

  return (
    <>
      {isDialog ? (
        <Dialog open={Boolean(isOpen)} fullScreen onClose={handleClose}>
          <header className="mtw:flex mtw:gap-6 mtw:items-center mtw:px-8 mtw:py-6">
            <IconWrapper
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <Close />
            </IconWrapper>

            <h2 className="mtw:text-2xl mtw:font-semibold mtw:leading-8 mtw:text-neutral-10">
              {t(i18n)`Edit template settings`}
            </h2>
          </header>
          <DialogContent sx={{ px: 4, py: 0 }}>{content}</DialogContent>
        </Dialog>
      ) : (
        <>
          <PageHeader
            className="-Header"
            title={<>{t(i18n)`Template settings`}</>}
          />

          {content}
        </>
      )}

      <DiscardChangesModal
        open={isDiscardChangesModalOpen}
        onClose={() => {
          setIsDiscardChangesModalOpen(false);
          if (temporaryTabItem) setTemporaryTabItem(null);
        }}
        onContinue={() => {
          setIsDiscardChangesModalOpen(false);
          handleShowModal(false);
          if (temporaryTabItem) {
            setTemporaryTabItem(null);
            setActiveTabItem(temporaryTabItem);
          }

          if (isDialog && handleCloseDialog && !temporaryTabItem) {
            handleCloseDialog();
          }
        }}
      />
    </>
  );
};
