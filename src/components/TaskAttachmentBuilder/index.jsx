import { Button, Popover, Spin, Message, message, Upload, Modal } from 'antd';
import React, { useState } from 'react';
import { hostname } from '@/utils/apiUtils';
import Axios from 'axios';
import CheckValidation from '@/components/CheckValidation';
import { CloudArrowUpFill, Paperclip } from 'react-bootstrap-icons';

import styles from '../LinksBuilder/index.less';

/**
 * Allows entry of multiple links, supports editing and removal of added links.
 */
const TaskAttachmentBuilder = ({ savedFiles, setSavedFiles }) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  /**
   * @beforeUpload {func}: This method used to validate the upload image size
   */
  function beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Message.error('Image must smaller than 2MB!');
    }
    return isLt2M;
  }

  /**
   * @onFileChangeHandler {func}: This method used to upload the prfofile logo.
   */
  function onFileChangeHandler(info) {
    if (info.file.status === 'uploading') {
      setImageLoading(true);
    }
    if (info.file.status === 'done') {
      const data = new FormData();
      data.append('file', info.file.originFileObj);

      Axios.post(`${hostname()}/xapi/v1/content/files/upload`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          accessToken: localStorage.getItem('accessToken'),
        },
      }).then((res) => {
        setImageLoading(false);
        const array = [...savedFiles];

        array.push({
          id: res?.data?.contentId,
          uid: res?.data?.contentId,
          name: res?.data?.fileName,
          url: res?.data?.url,
        });

        if (info?.file?.type === 'application/pdf') {
          array[array.length - 1].url = res?.data?.thumbNailUrl;
        }
        setSavedFiles(array);
        message.success(`${info.file.name} file uploaded successfully`);
      });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line no-param-reassign
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleCancel = () => setPreviewVisible(false);

  /**
   * @deleteContent {func}: This method used to delete selected project content
   */

  const deleteContent = (file) => {
    if (file.uid) {
      const copiedArray = [...savedFiles];
      const index = savedFiles.findIndex((rec) => rec.uid === file.uid);
      copiedArray.splice(index, 1);
      setSavedFiles(copiedArray);
    }
  };

  const renderLinksManagerForm = () => {
    return (
      <div className={`min-w-lg max-w-lg ${styles.LinkDisplayWrapper}`}>
        <Spin spinning={imageLoading}>
          <div className="p-4 ">
            <CheckValidation
              show={savedFiles?.length > 0}
              fallback={<span className="text-gray-500 font-normal"> No Files uploaded </span>}
            >
              <Upload
                listType="picture-card"
                fileList={savedFiles}
                onPreview={handlePreview}
                onRemove={deleteContent}
              />
              <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </CheckValidation>
          </div>
          <div className="bg-blue-100 p-4 text-center text-blue-600">
            <Upload
              name="avatar"
              multiple={false}
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={onFileChangeHandler}
            >
              <div style={{ display: 'flex', alignItems: 'center' }} className="w-full">
                <CloudArrowUpFill className="mr-2" />
                Upload
              </div>
            </Upload>
          </div>
        </Spin>
      </div>
    );
  };

  return (
    <div>
      <Popover
        content={renderLinksManagerForm}
        trigger="click"
        placement="bottomLeft"
        overlayClassName="app-popup"
      >
        <Button style={{ display: 'flex' }} type="dashed" icon={<Paperclip className="text-lg" />}>
          <span className="pl-2">Files ({savedFiles.length})</span>
        </Button>
      </Popover>
    </div>
  );
};

export default TaskAttachmentBuilder;
