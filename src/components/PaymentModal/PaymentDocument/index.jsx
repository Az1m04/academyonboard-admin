import { Modal } from 'antd';
import React, { useState } from 'react';
import { PreviewIcon, DeleteIcon } from '@/utils/AppIcons';
import Icon from '@ant-design/icons';
import uploadedImg from '@/assets/file-types/uploadedImage.png';

const PaymentDocument = ({ fileList, setFilelist, removeDocument }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [previewModal, setPreviewModal] = useState(false);

  const fileSizeConvertor = (size) => {
    if (size && size / 1024 / 1024 > 0) {
      const newSize = (size / 1024 / 1024).toFixed(2);
      return `${newSize} MB`;
    }
    return null;
  };

  return (
    <div className="w-full pl-4 pr-4">
      <div className="text-base text-gray-900 font-semibold p-2 border-b">Uploaded documents</div>
      {fileList?.map((uploadedDoc) => (
        <div
          className="flex items-center justify-between mt-2 mb-2 border rounded-lg bg-gray-100 border-dashed"
          key={uploadedDoc.id}
        >
          <div className="p-2">
            <img src={uploadedImg} width={40} alt="upload-image1" />
          </div>
          <div className="p-2 flex-auto flex">
            <div className="text-xs text-blue-800 font-semibold leading-none">
              {uploadedDoc.name}
              <div className="font-normal">
                {document.shortText}
                {<div>{fileSizeConvertor(uploadedDoc?.size)}</div>}
              </div>
            </div>
          </div>
          <div className="flex  px-2">
            <div>
              <Icon
                component={PreviewIcon}
                onClick={() => {
                  setPreviewModal(true);
                  if (uploadedDoc?.download_url) {
                    setPdfUrl(uploadedDoc?.download_url);
                  } else {
                    setPdfUrl(URL.createObjectURL(uploadedDoc));
                  }
                }}
              />
            </div>
            <div>
              <Icon
                component={DeleteIcon}
                onClick={() => {
                  let pData;
                  if (uploadedDoc?.download_url) {
                    pData = fileList.filter((p) => p.id !== uploadedDoc.id);
                    if (removeDocument) {
                      removeDocument(uploadedDoc?.id);
                    }
                  } else {
                    pData = fileList.filter((p) => p.uid !== uploadedDoc.uid);
                  }
                  setFilelist(pData);
                }}
              />
            </div>
          </div>
        </div>
      ))}

      <Modal
        onCancel={() => setPreviewModal(false)}
        visible={previewModal}
        width="80%"
        title="Document Perview"
        footer={null}
        bodyStyle={{ margin: 0, padding: 0, height: '75vh' }}
      >
        <iframe
          title="Documents Preview"
          src={pdfUrl}
          className="h-full text-center w-full"
          frameBorder="0"
        />
      </Modal>
    </div>
  );
};

export default PaymentDocument;
