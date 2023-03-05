import ImageUpload from '@/components/ImageUpload';
import UploadFile from '@/pages/Leads/InviteClientForm/UploadFile';
import { Col, Row, Form, Input } from 'antd';
import React from 'react';

const UploadBranchDocs = () => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="flex justify-start items-center">
        <p className="font-medium text-gray-800">Company logo</p>
        <ImageUpload />
      </Col>
      <Col xs={24} sm={12} md={24} lg={8} xl={8}>
        <p className="font-medium text-gray-800">Legal documents</p>
        <Form.Item name="legalDocuments">
          <UploadFile />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={24} lg={8} xl={8}>
        <p className="font-medium text-gray-800">GST number</p>
        <Form.Item name="gstNumber">
          <div className="flex">
            <Input size="large" placeholder="enter gst number" />
            <UploadFile />
          </div>
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={24} lg={8} xl={8}>
        <p className="font-medium text-gray-800">PAN number</p>
        <Form.Item name="panNumber">
          <div className="flex">
            <Input size="large" placeholder="enter pan number" />
            <UploadFile />
          </div>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default UploadBranchDocs;
