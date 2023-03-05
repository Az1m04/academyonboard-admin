import { Modal, Popconfirm, Skeleton, Upload } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { makeUrl } from '@/utils/apiUtils';
import apiEndPoints from '@/utils/apiEndPoints';
import styles from './index.less';

const { Dragger } = Upload;

const Attachments = ({
  onSuccess,
  id,
  loadingAttachments,
  type,
  attachments,
  removeAttachment,
}) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [previewModal, setPreviewModal] = useState(false);

  const settings = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    headers: {
      accessToken: localStorage.getItem('accessToken'),
    },
  };

  return (
    <Skeleton loading={loadingAttachments}>
      <div className=" mt-4 mb-4 rounded-md bg-white shadow">
        <div className="text-base font-medium p-4 border-b"> Media</div>
        <div className="mt-4 p-4 w-full flex-wrap flex ">
          {attachments?.map((attachment) => (
            <div
              style={{
                padding: 10,
              }}
              className={styles.Image}
              key={attachment?.contentId}
            >
              <img
                style={{
                  height: 160,
                  width: 150,
                  borderRadius: 4,
                }}
                src={attachment?.downloadUrl}
                alt={attachment?.contentName}
              />
              <div className={styles.ActionButtons}>
                <div className="flex">
                  <div className="text-lg font-bold text-gray-900">
                    <span
                      onClick={() => {
                        setPdfUrl(attachment?.downloadUrl);
                        setPreviewModal(true);
                      }}
                    >
                      <EyeOutlined />
                    </span>
                  </div>
                  <div className="text-lg pl-4 font-bold text-red-900">
                    <Popconfirm
                      title="Are you sure to delete this attachment?"
                      okType="danger"
                      onConfirm={() => {
                        removeAttachment(attachment);
                      }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined />
                    </Popconfirm>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Dragger
            action={makeUrl({
              ...apiEndPoints.common.addAttachment.v1,
              pathParams: {
                id,
                type,
              },
            })}
            headers={{ accessToken: localStorage.getItem('accessToken') }}
            onError={() => {}}
            onSuccess={onSuccess}
            {...settings}
          >
            <div
              style={{
                height: 140,
                width: 160,
                borderRadius: 4,
              }}
              className="items-center ml-2 flex justify-center"
            >
              <div className="items-center text-center">
                <div>
                  <PlusOutlined className="text-lg" />
                </div>
                <div className="text-blue-500 text-xs"> Add media</div>
                <div className="text-xs"> or drop files to upload</div>
              </div>
            </div>
          </Dragger>
        </div>
      </div>

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
    </Skeleton>
  );
};

export default Attachments;
