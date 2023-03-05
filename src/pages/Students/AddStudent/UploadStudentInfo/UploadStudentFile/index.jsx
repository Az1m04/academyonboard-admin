/* eslint-disable no-console */
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React, { useEffect } from 'react';

const UploadStudentFile = ({ setContents, contents, typeId, buttonTitle }) => {
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
            beforeUpload={async (data) => {
              console.log(`data`, data);
              await toBase64(data)
                .then((res) => {
                  const obj = {
                    encodedFile: res,
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
            <Button type="primary" size="large">
              {buttonTitle}
              <UploadOutlined className="text-xl font-extrabold " />
            </Button>
          </Upload>
        </div>
      </div>
    </div>
  );
};

export default UploadStudentFile;
