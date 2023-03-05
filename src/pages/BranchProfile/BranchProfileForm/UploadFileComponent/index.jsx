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
                    encoded_file: res,
                    name: data?.name,
                    typeId,
                  };
                  setContents([].concat(obj, contents));
                })
                .catch(() => {});

              return false;
            }}
            fileList={[]}
          >
            <Button type="primary" size="large" block icon={<UploadOutlined />}>
              {buttonTitle}
            </Button>
          </Upload>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
