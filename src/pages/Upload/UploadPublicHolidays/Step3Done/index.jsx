import { ArrowLeftOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import { Button } from 'antd-mobile';
import React from 'react';

const Step3Done = ({ setStep }) => {
  return (
    <Result
      status="success"
      title="Public holidays successfully imported !"
      subTitle={
        <div className="text-gray-700">
          Be patient public holidays will automatically reflect when you select particular public
          holiday option !
        </div>
      }
      extra={
        <Button
          onClick={() => {
            setStep(0);
          }}
          icon={<ArrowLeftOutlined />}
        >
          Import Again
        </Button>
      }
    />
  );
};

export default Step3Done;
