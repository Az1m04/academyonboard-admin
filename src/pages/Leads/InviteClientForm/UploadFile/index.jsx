/* eslint-disable no-console */
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React, { useEffect } from 'react';

const UploadFile = ({ setContents, contents, typeId, buttonTitle, disabled }) => {
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  useEffect(() => {
    console.log(`contents`, contents);
  }, [contents]);
  return (
    <div>
      <div className="">
        <div className="flex">
          <Upload
            disabled={disabled}
            beforeUpload={async (data) => {
              await toBase64(data)
                .then((res) => {
                  const obj = {
                    encodedFile: res,
                    name: data?.name,
                    typeId,
                    url: URL.createObjectURL(data),
                  };
                  setContents([].concat(obj, contents));
                })
                .catch(() => {});

              return false;
            }}
            fileList={[]}
          >
            <Button disabled={disabled} type="primary" size="large" block icon={<UploadOutlined />}>
              {buttonTitle}
            </Button>
          </Upload>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
