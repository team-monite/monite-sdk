import React, { useEffect, useState } from 'react';

import { useComponentsContext } from '../../../core/context/ComponentsContext';
import PdfViewer from './PdfViewer';

export interface PdfViewerWithAPIProps {
  id: string;
}

const PdfViewerWithAPI = ({ id }: PdfViewerWithAPIProps) => {
  const [pdfLink, setPDFLink] = useState('');

  const { monite } = useComponentsContext() || {};

  useEffect(() => {
    (async () => {
      const data = await monite.api!.receivable.getReceivablePdfLink(id);
      setPDFLink(data);
    })();
  }, [monite]);

  return <PdfViewer file={pdfLink} />;
};

export default PdfViewerWithAPI;
