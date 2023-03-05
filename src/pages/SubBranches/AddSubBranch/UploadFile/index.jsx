/* eslint-disable no-console */
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React from 'react';

const UploadFile = ({ setContents, contents, typeId, buttonTitle }) => {
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  return (
    <div>
      <div className="">
        <div className="flex">
          <Upload
            beforeUpload={async (data) => {
              await toBase64(data)
                .then((res) => {
                  const obj = {
                    encodedFile: res,
                    thumbUrl: URL.createObjectURL(data),
                    name: data?.name,
                    typeId,
                    uid: data?.uid,
                  };
                  setContents([].concat(obj, contents));
                })
                .catch(() => {});

              return false;
            }}
            fileList={[]}
          >
            <Button
              disabled={
                typeId === 'PAN_CARD' || typeId === 'GST_NUMBER'
                  ? (typeId === 'PAN_CARD' &&
                      contents?.find((item) => item?.typeId === 'PAN_CARD')) ||
                    (typeId === 'GST_NUMBER' &&
                      contents?.find((item) => item?.typeId === 'GST_NUMBER'))
                  : null
              }
              type="primary"
              size="large"
              block
              icon={<UploadOutlined />}
            >
              {buttonTitle}
            </Button>
          </Upload>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
