import UploadedDocument from '@/components/UploadedDocument';
import AppIcons from '@/utils/AppIcons';
import { Button, message, Upload } from 'antd';

const { Dragger } = Upload;

const ProductMedia = ({ fileList, setFileList }) => {
  const props = {
    name: 'file',
    multiple: true,
    fileList: [],
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        // eslint-disable-next-line no-console
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const removeDocument = (id) => {
    // eslint-disable-next-line no-console
    console.log(id, 'id');
  };

  const beforeUpload = (content) => {
    setFileList([].concat(fileList, content));
  };

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <div className="mb-3">Media</div>
      <Dragger
        style={{
          borderWidth: 0,
          padding: 0,
          backgroundColor: '#fff',
        }}
        {...props}
        beforeUpload={(content) => {
          beforeUpload(content);
        }}
      >
        <div className="p-10 border-dashed border-2 flex justify-center items-center border-gray-300 rounded-md">
          <div>
            <div className="text-xl text-gray-500 text-center items-center flex justify-center">
              {AppIcons.ArrowUpCircleFill()}
            </div>
            <div className="mt-2 items-center flex justify-center">
              <Button>Add File</Button>
            </div>
            <div className="text-sm mt-1 text-gray-500 text-center items-center flex justify-center">
              <span>or drop files to upload</span>
            </div>
          </div>
        </div>
      </Dragger>

      <UploadedDocument
        fileList={fileList}
        setFileList={setFileList}
        removeDocument={removeDocument}
      />
    </div>
  );
};

export default ProductMedia;
