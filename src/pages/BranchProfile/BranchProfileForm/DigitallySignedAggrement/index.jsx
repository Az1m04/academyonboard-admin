import { Col, Row } from 'antd';
import React from 'react';
import SignatureCanvas from 'react-signature-canvas';

const DigitalySignedAggrement = () => {
  return (
    <Row gutter={16}>
      <Col
        xs={24}
        sm={24}
        md={24}
        lg={24}
        xl={24}
        className="flex justify-center items-center border-2"
      >
        <SignatureCanvas
          penColor="blue"
          canvasProps={{
            width: 800,
            height: 200,
            border: '1px solid black',
            className: 'sigCanvas',
          }}
        />
      </Col>
    </Row>
  );
};

export default DigitalySignedAggrement;
