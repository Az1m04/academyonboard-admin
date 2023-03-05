import React, { useEffect } from 'react';
import { Form, Row, Col, Select, AutoComplete, DatePicker, Input } from 'antd';
import { connect } from 'umi';
import moment from 'moment';

const LeadDetails = ({
  form,
  refSize,
  setRefSize,
  setRefChange,
  // setPurposeChange,
  referenceBy,
  purpose,
  // purposeChangeHandler,
  clientList,
  dispatch,
  getOldStaffMembers,
  getAllEnabledStudentList,
  getAllDisabledStudentList,
  renderReferred,
  setRenderReferred,
}) => {
  const { Option } = AutoComplete;

  const referenceList = [
    {
      id: 'Online',
      label: 'Online',
    },
    {
      id: 'Offline',
      label: 'Offline',
    },
    {
      id: 'Social Media',
      label: 'Social media',
    },
    {
      id: 'Branch Reference',
      label: 'Branch reference',
    },
    {
      id: 'Referred',
      label: 'Referred',
    },
    {
      id: 'Printed Media',
      label: 'Printed media',
    },
  ];

  const printedMedia = [
    {
      id: 'Newspaper',
      label: 'Newspaper',
    },
    {
      id: 'Pamphlet',
      label: 'Pamphlet',
    },
    {
      id: 'Hoarding',
      label: 'Hoarding',
    },
  ];
  const onlineRef = [
    {
      id: 'Website',
      label: 'Website',
    },
    {
      id: 'Google Form',
      label: 'Google form',
    },
    {
      id: 'Google Search',
      label: 'Google search',
    },
    {
      id: 'Email',
      label: 'Email',
    },
  ];

  const socialMediaRef = [
    {
      id: 'Whatsapp',
      label: 'Whatsapp',
    },
    {
      id: 'Facebook',
      label: 'Facebook',
    },
    {
      id: 'Instagram',
      label: 'Instagram',
    },
    {
      id: 'LinkedIn',
      label: 'LinkedIn',
    },
    {
      id: 'Justdial',
      label: 'Justdial',
    },
    {
      id: 'Others',
      label: 'Others',
    },
  ];

  const referredBy = [
    {
      id: 'Current Staff',
      label: 'Current staff',
    },
    {
      id: 'Old Staff',
      label: 'Old staff',
    },
    {
      id: 'Friend',
      label: 'Friend',
    },
    {
      id: 'Current Student',
      label: 'Current student',
    },
    {
      id: 'Old Student',
      label: 'Old student',
    },
  ];

  const format = 'ddd MMM DD, YYYY  h:mm a';

  const onOptionChange = (changes) => {
    setRenderReferred('');
    form?.setFieldsValue({
      leadReferencedBy: { id: undefined },
      printedMedia: undefined,
      onlineReference: undefined,
      offlineReference: undefined,
      SocialMedia: undefined,
      branch: { id: undefined },
      referredBy: undefined,
    });
    if (changes === 'Printed Media') {
      setRefChange(false);
      setRefSize([{ lg: 12 }, { xl: 12 }, { md: 12 }, { sm: 24 }, { xs: 24 }]);
      form?.setFieldsValue({
        leadReferencedBy: { id: undefined },
        printedMedia: undefined,
      });
    } else {
      // eslint-disable-next-line no-lonely-if
      if (changes === 'Current Staff' || changes === 'Current Student') {
        setRefChange(true);
        setRefSize([{ lg: 12 }, { xl: 12 }, { md: 12 }, { sm: 24 }, { xs: 24 }]);
      } else {
        setRefChange(false);
        setRefSize([{ lg: 24 }, { xl: 24 }, { md: 24 }, { sm: 24 }, { xs: 24 }]);
        form?.setFieldsValue({
          leadReferencedBy: { id: undefined },
          printedMedia: undefined,
        });
      }
    }

    switch (changes) {
      case 'Online':
        setRefSize([{ lg: 12 }, { xl: 12 }, { md: 12 }, { sm: 24 }, { xs: 24 }]);
        break;
      case 'Offline':
        setRefSize([{ lg: 12 }, { xl: 12 }, { md: 12 }, { sm: 24 }, { xs: 24 }]);
        break;
      case 'Social Media':
        setRefSize([{ lg: 12 }, { xl: 12 }, { md: 12 }, { sm: 24 }, { xs: 24 }]);
        break;
      case 'Branch Reference':
        setRefSize([{ lg: 12 }, { xl: 12 }, { md: 12 }, { sm: 24 }, { xs: 24 }]);
        break;
      case 'Referred':
        setRefSize([{ lg: 12 }, { xl: 12 }, { md: 12 }, { sm: 24 }, { xs: 24 }]);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    dispatch({
      type: 'leads/getClientList',
      payload: {
        query: {
          isAccepted: true,
          clientId: 'OMG',
          viewSize: 1000,
          startIndex: 0,
        },
      },
    });
    dispatch({
      type: 'student/getAllEnabledStudentList',
      payload: { query: { enabled: true } },
    });
    dispatch({
      type: 'student/getAllDisabledStudentList',
      payload: { query: { enabled: false } },
    });
  }, [dispatch]);

  const referred = (val) => {
    setRenderReferred(val);
    if (
      val === 'Current Staff' ||
      val === 'Current Student' ||
      val === 'Old Staff' ||
      val === 'Old Student' ||
      val === 'Friend' ||
      val === 'Others'
    ) {
      form.setFieldsValue({
        leadReferencedBy: { id: undefined },
      });
      setRefSize([{ lg: 8 }, { xl: 8 }, { md: 12 }, { sm: 24 }, { xs: 24 }]);
    } else {
      setRefSize([{ lg: 12 }, { xl: 12 }, { md: 12 }, { sm: 24 }, { xs: 24 }]);
    }
    form.setFieldsValue({
      referredName: undefined,
    });
  };
  return (
    <div className="mt-5">
      {purpose !== 'Add student' && (
        <>
          <Row gutter={16}>
            <Col
              lg={refSize[0]?.lg}
              xl={refSize[1]?.xl}
              md={refSize[2]?.md}
              sm={refSize[3]?.sm}
              xs={refSize[4]?.xs}
            >
              <p className="font-medium text-gray-800 ">Reference &#x00028;optional&#x00029;</p>
              <Form.Item name="source">
                <Select
                  size="large"
                  placeholder="Please list down the Reference"
                  getPopupContainer={(node) => node.parentNode}
                  style={{ width: '100%' }}
                  onChange={onOptionChange}
                >
                  {referenceList?.map((item) => (
                    <Option
                      labelFilter={item?.label}
                      key={item?.id}
                      value={item?.id}
                      title={item?.label}
                    >
                      {item?.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {form.getFieldValue('source')?.includes('Printed Media') && (
              <Col
                lg={refSize[0]?.lg}
                xl={refSize[1]?.xl}
                md={refSize[2]?.md}
                sm={refSize[3]?.sm}
                xs={refSize[4]?.xs}
              >
                <span className="font-medium text-gray-800">Printed media</span>
                <Form.Item name="printedMedia">
                  <Select
                    size="large"
                    placeholder="Select printed media"
                    getPopupContainer={(node) => node.parentNode}
                  >
                    {printedMedia?.map((item) => (
                      <Option
                        labelFilter={item?.label}
                        key={item?.id}
                        value={item?.id}
                        title={item?.label}
                      >
                        {item?.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            {form.getFieldValue('source')?.includes('Online') && (
              <Col
                lg={refSize[0]?.lg}
                xl={refSize[1]?.xl}
                md={refSize[2]?.md}
                sm={refSize[3]?.sm}
                xs={refSize[4]?.xs}
              >
                <span className="font-medium text-gray-800">Online</span>
                <Form.Item name="onlineReference">
                  <Select
                    size="large"
                    placeholder="Select Online media"
                    getPopupContainer={(node) => node.parentNode}
                  >
                    {onlineRef?.map((item) => (
                      <Option
                        labelFilter={item?.label}
                        key={item?.id}
                        value={item?.id}
                        title={item?.label}
                      >
                        {item?.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            {form.getFieldValue('source')?.includes('Offline') && (
              <Col
                lg={refSize[0]?.lg}
                xl={refSize[1]?.xl}
                md={refSize[2]?.md}
                sm={refSize[3]?.sm}
                xs={refSize[4]?.xs}
              >
                <span className="font-medium text-gray-800">Offline reference</span>
                <Form.Item name="offlineReference">
                  <Select
                    size="large"
                    placeholder="Select Offline reference"
                    getPopupContainer={(node) => node.parentNode}
                  >
                    <Option
                      labelFilter="Office Visit"
                      key="Office Visit"
                      value="Office Visit"
                      title="Office visit"
                    >
                      Office visit
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            )}
            {form.getFieldValue('source')?.includes('Social Media') && (
              <Col
                lg={refSize[0]?.lg}
                xl={refSize[1]?.xl}
                md={refSize[2]?.md}
                sm={refSize[3]?.sm}
                xs={refSize[4]?.xs}
              >
                <span className="font-medium text-gray-800">Social media reference</span>
                <Form.Item name="SocialMedia">
                  <Select
                    size="large"
                    placeholder="Select social media reference"
                    getPopupContainer={(node) => node.parentNode}
                    onChange={(val) => referred(val)}
                  >
                    {socialMediaRef?.map((item) => (
                      <Option
                        labelFilter={item?.label}
                        key={item?.id}
                        value={item?.id}
                        title={item?.label}
                      >
                        {item?.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            {renderReferred?.includes('Others') && (
              <Col
                lg={refSize[0]?.lg}
                xl={refSize[1]?.xl}
                md={refSize[2]?.md}
                sm={refSize[3]?.sm}
                xs={refSize[4]?.xs}
              >
                <div className="">Other social media</div>
                <Form.Item name={'referredName'}>
                  <Input
                    type="text"
                    size="large"
                    placeholder="Enter social media name"
                    autoComplete="off"
                  />
                </Form.Item>
              </Col>
            )}
            {form.getFieldValue('source')?.includes('Branch Reference') && (
              <Col
                lg={refSize[0]?.lg}
                xl={refSize[1]?.xl}
                md={refSize[2]?.md}
                sm={refSize[3]?.sm}
                xs={refSize[4]?.xs}
              >
                <div className="">Select branch</div>
                <Form.Item name={['branch', 'id']}>
                  <Select size="large" className="w-full" placeholder="Select branch here">
                    {clientList?.records?.map((val) => (
                      <Option key={val?.id} value={val?.id}>
                        {val?.clientName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            {form.getFieldValue('source')?.includes('Referred') && (
              <Col
                lg={refSize[0]?.lg}
                xl={refSize[1]?.xl}
                md={refSize[2]?.md}
                sm={refSize[3]?.sm}
                xs={refSize[4]?.xs}
              >
                <div className="">Referred by</div>
                <Form.Item name="referredBy">
                  <Select
                    size="large"
                    className="w-full"
                    placeholder="Select branch here"
                    onChange={(val) => referred(val)}
                  >
                    {referredBy?.map((val) => (
                      <Option key={val?.id} value={val?.id}>
                        {val?.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            {renderReferred?.includes('Current Staff') && (
              <Col
                lg={refSize[0]?.lg}
                xl={refSize[1]?.xl}
                md={refSize[2]?.md}
                sm={refSize[3]?.sm}
                xs={refSize[4]?.xs}
              >
                <div className="">Current staff</div>
                <Form.Item name={['leadReferencedBy', 'id']}>
                  <Select
                    size="large"
                    placeholder="Reference by"
                    getPopupContainer={(node) => node.parentNode}
                  >
                    {referenceBy?.map((item) => (
                      <Option
                        labelFilter={item?.displayName}
                        key={item?.partyId}
                        title={item?.displayName}
                      >
                        {item?.displayName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            {renderReferred?.includes('Old Staff') && (
              <Col
                lg={refSize[0]?.lg}
                xl={refSize[1]?.xl}
                md={refSize[2]?.md}
                sm={refSize[3]?.sm}
                xs={refSize[4]?.xs}
              >
                <div className="">Old Staff</div>
                <Form.Item name={['leadReferencedBy', 'id']}>
                  <Select
                    size="large"
                    placeholder="Reference by"
                    getPopupContainer={(node) => node.parentNode}
                  >
                    {getOldStaffMembers?.records?.map((item) => (
                      <Option
                        labelFilter={item?.displayName}
                        key={item?.id}
                        title={item?.displayName}
                      >
                        {item?.displayName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            {renderReferred?.includes('Friend') && (
              <Col
                lg={refSize[0]?.lg}
                xl={refSize[1]?.xl}
                md={refSize[2]?.md}
                sm={refSize[3]?.sm}
                xs={refSize[4]?.xs}
              >
                <div className="">Friend</div>
                <Form.Item name={'referredName'}>
                  <Input
                    type="text"
                    size="large"
                    placeholder="Enter friend name"
                    autoComplete="off"
                  />
                </Form.Item>
              </Col>
            )}
            {renderReferred?.includes('Current Student') && (
              <Col
                lg={refSize[0]?.lg}
                xl={refSize[1]?.xl}
                md={refSize[2]?.md}
                sm={refSize[3]?.sm}
                xs={refSize[4]?.xs}
              >
                <div className="">Current student</div>
                <Form.Item name={['leadReferencedBy', 'id']}>
                  <Select
                    size="large"
                    placeholder="Reference by"
                    getPopupContainer={(node) => node.parentNode}
                  >
                    {getAllEnabledStudentList?.records?.map((item) => (
                      <Option labelFilter={item?.name} key={item?.id} title={item?.name}>
                        {item?.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            {renderReferred?.includes('Old Student') && (
              <Col
                lg={refSize[0]?.lg}
                xl={refSize[1]?.xl}
                md={refSize[2]?.md}
                sm={refSize[3]?.sm}
                xs={refSize[4]?.xs}
              >
                <div className="">Old student</div>
                <Form.Item name={['leadReferencedBy', 'id']}>
                  <Select
                    size="large"
                    placeholder="Reference by"
                    getPopupContainer={(node) => node.parentNode}
                  >
                    {getAllDisabledStudentList?.records?.map((item) => (
                      <Option labelFilter={item?.name} key={item?.id} title={item?.name}>
                        {item?.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>
        </>
      )}
      <Row gutter={16}>
        {purpose !== 'Add student' && (
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            <p className="font-medium text-gray-800 ">Inquiry date/time</p>

            <Form.Item
              name="inquiryDate"
              rules={[{ required: true, message: 'Please enter date/time' }]}
            >
              <DatePicker
                getPopupContainer={(node) => node.parentNode}
                size="large"
                format={format}
                showTime={{ format: 'h:mm' }}
                placeholder="Select date"
                className="w-full"
                disabledDate={(date) => date >= moment()}
              />
            </Form.Item>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default connect(({ leads, student, loading }) => ({
  clientList: leads.clientList,
  getOldStaffMembers: leads.getOldStaffMembers,
  studentsList: student.studentsList,
  getAllEnabledStudentList: student.getAllEnabledStudentList,
  getAllDisabledStudentList: student.getAllDisabledStudentList,
  loading: loading.effects['student/getAllEnabledStudentList'],
}))(LeadDetails);
