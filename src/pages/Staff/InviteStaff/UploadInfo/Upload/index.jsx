import { getRandomArbitrary } from '@/utils/utils';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React from 'react';

const UploadFile = ({ disabled, setContents, contents, typeId, buttonTitle }) => {
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
            disabled={disabled}
            beforeUpload={async (data) => {
              await toBase64(data)
                .then((res) => {
                  const obj = {
                    encodedFile: res,
                    name: data?.name,
                    typeId,
                    key: getRandomArbitrary(1, 100000000),
                  };
                  setContents([].concat(obj, contents));
                })
                .catch(() => {});

              return false;
            }}
            fileList={[]}
          >
            <Button disabled={disabled} type="primary" size="large">
              {buttonTitle}
              <UploadOutlined className="text-xl font-extrabold " />
            </Button>
          </Upload>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
