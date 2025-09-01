import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
// react-pdf-viewer styles are imported in app.css to avoid conflicts when using Dropin
import {
  Worker,
  Viewer,
  ScrollMode,
  SpecialZoomLevel,
} from '@react-pdf-viewer/core';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import {
  pageNavigationPlugin,
  RenderCurrentPageLabelProps,
} from '@react-pdf-viewer/page-navigation';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { useRef } from 'react';

interface FileViewerProps {
  url: string;
  mimetype: string;
  name?: string;
}

export const FileViewer = ({ url, mimetype, name }: FileViewerProps) => {
  if (mimetype === 'application/pdf') return <PdfFileViewer url={url} />;

  return <ImageFileViewer url={url} name={name || ''} />;
};

export const ImageFileViewer = ({
  url,
  name,
}: {
  url: string;
  name: string;
}) => {
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

export const PdfFileViewer = ({ url }: { url: string }) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const zoomPluginInstance = zoomPlugin();
  const getFilePluginInstance = getFilePlugin();
  const { i18n } = useLingui();

  return (
    <div
      className="Monite-PdfFileViewer"
      ref={pdfRef}
      style={{
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        border: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '0 8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <zoomPluginInstance.ZoomOut />
          <zoomPluginInstance.ZoomPopover />
          <zoomPluginInstance.ZoomIn />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <getFilePluginInstance.DownloadButton />
          <pageNavigationPluginInstance.GoToPreviousPage />

          <pageNavigationPluginInstance.CurrentPageLabel>
            {(props: RenderCurrentPageLabelProps) => (
              <span style={{ fontSize: '0.75rem', margin: '0 4px' }}>{`${
                props.currentPage + 1
              } ${t(i18n)`of`} ${props.numberOfPages}`}</span>
            )}
          </pageNavigationPluginInstance.CurrentPageLabel>
          <pageNavigationPluginInstance.GoToNextPage />
        </div>
      </div>
      <div
        style={{
          height: '100%',
          backgroundColor: '#F0F2F4',
          borderRadius: '8px',
        }}
      >
        <Worker workerUrl="https://js.monite.com/libs/pdf.js/3.4.120/pdf.worker.min.js">
          <Viewer
            fileUrl={url}
            scrollMode={ScrollMode.Page}
            plugins={[
              pageNavigationPluginInstance,
              zoomPluginInstance,
              getFilePluginInstance,
            ]}
            defaultScale={SpecialZoomLevel.PageFit}
          />
        </Worker>
      </div>
    </div>
  );
};
