import AppIcons from '@/utils/AppIcons';
import { Button, Upload } from 'antd';
import React from 'react';

const { Dragger } = Upload;
const CollectionImage = () => {
  return (
    <div className="bg-white rounded-md shadow p-4">
      <div className="pb-2 font-semibold text-gray-900">Collection image</div>
      <Dragger
        style={{
          borderWidth: 0,
          padding: 0,
          backgroundColor: '#fff',
        }}
        beforeUpload={() => {
          return false;
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
    </div>
  );
};

export default CollectionImage;
