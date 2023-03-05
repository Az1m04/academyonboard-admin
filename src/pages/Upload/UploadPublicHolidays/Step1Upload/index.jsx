import React, { useState } from 'react';
import { Button, message, notification, Upload } from 'antd';
import excel from '@/assets/file-types/excel.svg';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'umi';

const Step1Upload = ({ setStep, dispatch }) => {
  const [loading, setLoading] = useState(false);
  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/templates/public-holidays.xlsx';
    link.download = `public-holidays.xlsx`;
    link.click();
  };
  function onFileChangeHandler(info) {
    if (info.file.status === 'uploading') {
      setLoading(true);
    }
    if (info.file.status === 'done') {
      const data = new FormData();

      data.append('file', info.file.originFileObj);
      dispatch({
        type: 'endUser/uploadPublicHolidays',
        payload: {
          body: data,
        },
      }).then((res) => {
        if (res?.isUploaded === 'ok') {
          setLoading(false);
          setStep(1);
          message.success(`${info.file.name} template uploaded successfully`);
        } else {
          setLoading(false);
          notification.error({
            message: 'There is an error while uploading excel!',
          });
        }
      });
    } else if (info.file.status === 'error') {
      setLoading(false);
      message.error(`${info.file.name} template upload failed.`);
    }
  }

  /**
   * NOTE: @AmitMathur Below code empties the state of the uploadedEnduserList on first render of this component.
   *
   */
  // useEffect(() => {
  //   dispatch({
  //     type: 'product/setStates',
  //     payload: null,
  //     key: 'uploadedEnduserList',
  //   });
  // }, [dispatch, step]);
  return (
    <>
      <div className="text-center">
        <span className=" pt-10 text-gray-700  font-semibold ">
          Use the template below to prepare your data.
        </span>
        <label className="mt-10 flex justify-center items-center cursor-pointer">
          <img src={excel} className="h-6" />
          <span className="text-indigo-700 font-semibold pr-2" onClick={() => downloadTemplate()}>
            Download Template
          </span>
        </label>
        <div className="mt-10 ">
          <div className="text-gray-700 mb-10 font-semibold">
            Once you finished entering data in template,click on the button below to <br></br>upload
            prepared excel sheet.
          </div>
          <Upload
            accept=".xlsx"
            name="template"
            multiple={false}
            showUploadList={false}
            onChange={onFileChangeHandler}
          >
            <Button loading={loading} icon={<UploadOutlined />}>
              Click to Upload
            </Button>
          </Upload>
        </div>
      </div>
    </>
  );
};

export default connect(({ endUser }) => ({
  // uploadedEnduserList: endUser.uploadedEnduserList,
  uploadPublicHolidays: endUser.uploadPublicHolidays,
}))(Step1Upload);
