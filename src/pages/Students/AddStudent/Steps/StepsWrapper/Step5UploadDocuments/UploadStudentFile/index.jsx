import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Form } from 'antd';
import React from 'react';

const UploadStudentFile = ({
  setContents,
  contents,
  typeId,
  buttonTitle,
  enableDisableUploadButton,
  disabled,
}) => {
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className="flex">
      <Form.Item
        name="uploadItems"
        rules={[
          {
            required: true,
            message: `Please upload your ID proof `,
          },
        ]}
      >
        <Upload
          beforeUpload={async (data) => {
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
          multiple={false}
          disabled={
            disabled || enableDisableUploadButton === undefined || enableDisableUploadButton === ''
            // contents?.length > 0
            //   ? true
            //   : null ||
            // (enableDisableUploadButton === undefined && true) ||
            // (enableDisableUploadButton === '' && true)
          }
        >
          <Button
            type="primary"
            size="large"
            disabled={
              disabled ||
              enableDisableUploadButton === undefined ||
              enableDisableUploadButton === ''
              // contents?.length > 0
              //   ? true
              //   : null ||
              // (enableDisableUploadButton === '' && true) ||
              // (enableDisableUploadButton === undefined && true)
            }
          >
            {buttonTitle}
            <UploadOutlined className="text-xl font-extrabold " />
          </Button>
        </Upload>
      </Form.Item>
    </div>
  );
};

export default UploadStudentFile;
