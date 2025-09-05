import { Button } from '@/ui/components/button';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
// react-pdf-viewer styles are imported in app.css to avoid conflicts when using Dropin
import {
  Worker,
  Viewer,
  ScrollMode,
  SpecialZoomLevel,
} from '@react-pdf-viewer/core';
import {
  pageNavigationPlugin,
  RenderCurrentPageLabelProps,
} from '@react-pdf-viewer/page-navigation';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useRef } from 'react';

interface FileViewerProps {
  url: string;
  mimetype: string;
  name?: string;
  pdfHeight?: number | string;
  showPdfToolbar?: number;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export const FileViewer = ({
  url,
  mimetype,
  name,
  showCloseButton,
  onClose,
}: FileViewerProps) => {
  if (mimetype === 'application/pdf')
    return (
      <PdfFileViewer
        url={url}
        showCloseButton={showCloseButton}
        onClose={onClose}
      />
    );

  return (
    <img
      className="Monite-ImageFileViewer"
      src={url}
      alt={name}
      loading="lazy"
      style={{ width: '100%', objectFit: 'contain' }}
    />
  );
};

const PdfFileViewer = ({
  url,
  showCloseButton,
  onClose,
}: {
  url: string;
  showCloseButton?: boolean;
  onClose?: () => void;
}) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const zoomPluginInstance = zoomPlugin();
  const { i18n } = useLingui();

  return (
    <div
      ref={pdfRef}
      className="mtw:w-full mtw:h-full mtw:p-4 mtw:flex mtw:flex-col mtw:justify-between mtw:max-h-full mtw:border-none mtw:bg-[#F0F2F4]"
    >
      <div className="mtw:flex mtw:items-center mtw:justify-between">
        <div className="mtw:flex mtw:items-center mtw:gap-2 mtw:bg-white mtw:rounded-md mtw:shadow-xs mtw:p-0.5">
          <zoomPluginInstance.ZoomOut>
            {({ onClick }) => (
              <Button variant="ghost" size="icon" onClick={onClick}>
                <ZoomOut />
              </Button>
            )}
          </zoomPluginInstance.ZoomOut>
          <zoomPluginInstance.ZoomPopover />
          <zoomPluginInstance.ZoomIn>
            {({ onClick }) => (
              <Button variant="ghost" size="icon" onClick={onClick}>
                <ZoomIn />
              </Button>
            )}
          </zoomPluginInstance.ZoomIn>
        </div>

        {showCloseButton && (
          <div className="mtw:flex mtw:items-center">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X />
            </Button>
          </div>
        )}
      </div>
      <div className="mtw:h-[85%] mtw:rounded-md">
        <Worker workerUrl="https://js.monite.com/libs/pdf.js/3.4.120/pdf.worker.min.js">
          <Viewer
            fileUrl={url}
            scrollMode={ScrollMode.Page}
            plugins={[pageNavigationPluginInstance, zoomPluginInstance]}
            defaultScale={SpecialZoomLevel.PageFit}
          />
        </Worker>
      </div>
      <div className="mtw:flex mtw:items-center mtw:gap-2 mtw:bg-white mtw:w-fit mtw:rounded-md mtw:shadow-xs mtw:p-0.5">
        <pageNavigationPluginInstance.GoToPreviousPage>
          {({ onClick, isDisabled }) => (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClick}
              disabled={isDisabled}
            >
              <ChevronLeft />
            </Button>
          )}
        </pageNavigationPluginInstance.GoToPreviousPage>

        <pageNavigationPluginInstance.CurrentPageLabel>
          {(props: RenderCurrentPageLabelProps) => (
            <span className="mtw:text-sm mtw:mx-1">
              {`${t(i18n)`Page`} ${props.currentPage + 1} ${t(i18n)`of`} ${
                props.numberOfPages
              }`}
            </span>
          )}
        </pageNavigationPluginInstance.CurrentPageLabel>

        <pageNavigationPluginInstance.GoToNextPage>
          {({ onClick, isDisabled }) => (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClick}
              disabled={isDisabled}
            >
              <ChevronRight />
            </Button>
          )}
        </pageNavigationPluginInstance.GoToNextPage>
      </div>
    </div>
  );
};
