import { Modal, Popconfirm } from 'antd';
import React, { useState } from 'react';
import uploadedImg from '@/assets/uploadedImage.png';
import { DeleteTwoTone, EyeTwoTone } from '@ant-design/icons';

const AttachedDocument = ({ fileList, setFilelist, encodedList, setEncodedList }) => {
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
    <>
      {fileList?.length > 0 && (
        <div className="w-full ">
          <div className="text-base text-gray-900 font-semibold p-2 border-b">
            Uploaded documents
          </div>
          <div style={{ maxHeight: '23vh', overflow: 'auto' }}>
            {fileList?.map((uploadedDoc, index) => (
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
                <div className="flex items-center px-2">
                  <div
                    onClick={() => {
                      setPreviewModal(true);
                      if (uploadedDoc?.download_url) {
                        setPdfUrl(uploadedDoc?.download_url);
                      } else {
                        setPdfUrl(URL.createObjectURL(encodedList[index]));
                      }
                    }}
                  >
                    <EyeTwoTone twoToneColor="#005be7" />
                  </div>
                  <Popconfirm
                    title="Are you sure you want to delete this attachment?"
                    onConfirm={() => {
                      setFilelist(fileList.filter((p) => fileList.indexOf(p) !== index));
                      setEncodedList(() => encodedList?.filter((_, i) => i !== index));
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <div className="ml-2">
                      <DeleteTwoTone twoToneColor="red" />
                    </div>
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>
          <Modal
            onCancel={() => setPreviewModal(false)}
            visible={previewModal}
            width="80%"
            title="Document Preview"
            footer={null}
            bodyStyle={{ margin: 0, padding: 0, height: '75vh' }}
          >
            <iframe
              title="Document Preview"
              src={pdfUrl}
              className="h-full text-center w-full"
              frameBorder="0"
            />
          </Modal>
        </div>
      )}
    </>
  );
};

export default AttachedDocument;
