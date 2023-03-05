import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, Select, Avatar } from 'antd';
import { connect } from 'umi';
import { getInitials } from '@/utils/common';
import classNames from 'classnames';
import styles from '../index.less';

const StudentOtherServices = ({
  displayServicesDropBox,
  setDisplayServicesDropBox,
  courseDetailsForm,
  selectedService,
  setSelectedService,
  referenceBy,
}) => {
  const [otherServiceOn, setOtherServiceOn] = useState(false);

  const serviceCategory = [
    {
      id: 'IELTS_TEST_BOOKING',
      label: 'IELTS Test Booking ',
    },
    {
      id: 'PTE_TEST_BOOKING',
      label: 'PTE Test Booking ',
    },
    {
      id: 'AIR_TICKET_BOOKING',
      label: 'Air Ticket Booking ',
    },
    {
      id: 'PASSPORT_APPOINT',
      label: 'Passport Appoint ',
    },
    {
      id: 'PCC_APPOINT',
      label: 'PCC Appoint ',
    },
    {
      id: 'MEETING_WITH',
      label: 'Meeting with ',
    },
    {
      id: 'OTHERS',
      label: 'Others ',
    },
  ];

  const serviceSelection = (value) => {
    setSelectedService(value);
    courseDetailsForm.setFieldsValue({
      emp_name: undefined,
    });
  };

  if (otherServiceOn) {
    courseDetailsForm.setFieldsValue({
      otherServices: 'OTHERS',
    });
  }

  useEffect(() => {
    courseDetailsForm.setFieldsValue({
      service_category: selectedService,
    });
  }, [selectedService, courseDetailsForm]);

  const prefixServiceSelector = (
    <Form.Item name="otherServices" initialValue="OTHERS" style={{ margin: '0' }}>
      <Select
        showSearch
        style={{ width: '110px', paddingLeft: 10 }}
        className={classNames(styles?.selectStyling)}
        placeholder="Enter other computer course"
        getPopupContainer={(node) => node.parentNode}
        onSelect={(val) => {
          if (val === 'OTHERS') {
            setDisplayServicesDropBox(true);
          } else {
            // setSelectedService(val);
            setDisplayServicesDropBox(false);
            courseDetailsForm?.setFieldsValue({
              service_Other: undefined,
            });
          }
        }}
        onChange={(value) => setSelectedService(value)}
      >
        {serviceCategory &&
          serviceCategory?.map((element) => (
            <Select.Option key={element?.id} value={element?.id}>
              {element?.label}
            </Select.Option>
          ))}
      </Select>
    </Form.Item>
  );

  return (
    <div className="mt-5">
      <Row gutter={[24, 12]}>
        <Col lg={24} xl={24} md={24} sm={24} xs={24}>
          {!displayServicesDropBox ? (
            <>
              <p className="font-medium text-gray-800">Service category</p>
              <Form.Item
                name="service_category"
                rules={[
                  {
                    required: true,
                    message: 'Please select the service category',
                  },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Please select the service category"
                  style={{ width: '100%' }}
                  getPopupContainer={(node) => node.parentNode}
                  onSelect={(val) => {
                    if (val === 'OTHERS') {
                      setSelectedService('');
                      setOtherServiceOn(true);
                      setDisplayServicesDropBox(true);
                    } else setDisplayServicesDropBox(false);
                  }}
                  onChange={serviceSelection}
                >
                  {serviceCategory?.map((item) => (
                    <Select.Option value={item?.id} key={item?.id}>
                      {item?.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          ) : (
            <>
              <p className="font-medium text-gray-800">Service category</p>
              <Form.Item
                name="service_Other"
                rules={[
                  {
                    required: true,
                    message: 'Please enter service category',
                  },
                ]}
              >
                <Input
                  autoComplete="off"
                  type="text"
                  size="large"
                  addonBefore={prefixServiceSelector}
                  placeholder="Please enter service category"
                />
              </Form.Item>
            </>
          )}
        </Col>
        {selectedService?.includes('MEETING_WITH') && (
          <Col lg={24} xl={24} md={24} sm={24} xs={24}>
            <>
              <p className="font-medium text-gray-800">Select name of employee</p>
              <Form.Item name="emp_name">
                <Select
                  size="large"
                  placeholder="Please select name of the employee"
                  optionLabelProp="label"
                  style={{ width: '100%' }}
                  getPopupContainer={(node) => node.parentNode}
                >
                  {referenceBy?.map((item) => (
                    <Select.Option value={item?.partyId} label={item?.name} key={item?.partyId}>
                      <div className="flex space-x-2">
                        <div className="py-1">
                          <Avatar style={{ background: '#0d6efd' }}>
                            {getInitials(item?.name)}
                          </Avatar>
                        </div>
                        <div className="py-2">{item?.name}</div>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default connect(({ leads }) => ({
  staffMembersData: leads.staffMembersData,
}))(StudentOtherServices);
