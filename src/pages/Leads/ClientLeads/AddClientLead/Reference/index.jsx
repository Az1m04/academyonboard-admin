import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Select, Divider } from 'antd';
import { debounce } from 'lodash-es';

const Reference = ({
  lookingFor,
  setLookingFor,
  form,
  dispatch,
  staffList,
  sourceType,
  setSourceType,
  renderReferred,
  setRenderReferred,
  socialMediaReferred,
  setSocialMediaReferred,
  getAllEnabledStudentList,
  productList,
  clientDisable,
}) => {
  const { Option } = Select;

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
  const getStaffList = (key) =>
    dispatch({
      type: 'staff/getStaffList',
      payload: {
        query: {
          statusId:
            (renderReferred === 'Current Staff' && 'PARTYINV_ACCEPTED') || 'INV_ACCPTD_DSBLD',
          keyword: key,
        },
      },
    });
  const getStudentsList = (keyword) => {
    dispatch({
      type: 'student/getAllEnabledStudentList',
      payload: { query: { enabled: renderReferred === 'Current Student', keyword } },
    });
  };
  const debounceSearch = debounce(getStaffList, 400);
  const debounceSearchStudent = debounce(getStudentsList, 400);
  useEffect(() => {
    if (renderReferred === 'Current Staff' || renderReferred === 'Old Staff') getStaffList('');
    if (renderReferred === 'Current Student' || renderReferred === 'Old Student')
      getStudentsList('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderReferred]);

  return (
    <div className="mb-5 bg-white rounded-lg shadow">
      <p className="px-5 pt-5 text-base font-semibold text-gray-800">Reference</p>
      <Divider />
      <div className="px-5 pb-5">
        {/* <Row gutter={[12, 0]}>
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            <span className="block mb-2 font-medium text-gray-800  "> Number of branches</span>
            <Form.Item
              name={totalBranches}
              rules={[
                {
                  required: true,
                  message: 'Please enter branch number',
                },
              ]}
            >
              <Input type="number" style={{ width: '100%' }} min={0} size="large" />
            </Form.Item>
          </Col>
        </Row> */}
        <Row gutter={16}>
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            <span className="block mb-2 font-medium text-gray-800 ">Looking for</span>
            <Form.Item
              name={'lookingFor'}
              rules={[
                {
                  required: true,
                  message: 'Please select your choice',
                },
              ]}
            >
              <Select
                style={{ width: '100%' }}
                size="large"
                getPopupContainer={(node) => node.parentNode}
                onChange={(e) => {
                  setLookingFor(e);
                  form?.setFieldsValue({ product: undefined });
                }}
                placeholder="Select purpose"
                disabled={clientDisable}
              >
                <Option value="Software">Software</Option>
                <Option value="Service And Software">Services &amp; Software</Option>
              </Select>
            </Form.Item>
          </Col>
          {lookingFor === 'Service And Software' && (
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <span className="block mb-2 font-medium text-gray-800">Services </span>
              <Form.Item name={'services'}>
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="Select Product"
                  disabled={clientDisable}
                >
                  {productList?.map((item) => (
                    <Select.Option key={item?.id} value={item?.id}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            <p className="font-medium text-gray-800 mb-2 ">Reference &#x00028;optional&#x00029;</p>
            <Form.Item name="source">
              <Select
                disabled={clientDisable}
                size="large"
                placeholder="Please list down the Reference"
                getPopupContainer={(node) => node.parentNode}
                style={{ width: '100%' }}
                onChange={(value) => {
                  setSourceType(value);
                  setSocialMediaReferred(null);
                  setRenderReferred(null);
                  form?.setFieldsValue({
                    leadReferencedBy: { id: undefined },
                    printedMedia: undefined,
                    onlineReference: undefined,
                    offlineReference: undefined,
                    SocialMedia: undefined,
                    branch: { id: undefined },
                    referredBy: undefined,
                  });
                }}
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
          {sourceType === 'Printed Media' && (
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800 mb-2">Printed media</p>
              <Form.Item name="printedMedia">
                <Select
                  size="large"
                  placeholder="Select printed media"
                  getPopupContainer={(node) => node.parentNode}
                  disabled={clientDisable}
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
          {sourceType === 'Online' && (
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800 mb-2">Online</p>
              <Form.Item name="onlineReference">
                <Select
                  size="large"
                  placeholder="Select Online media"
                  getPopupContainer={(node) => node.parentNode}
                  disabled={clientDisable}
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
          {sourceType === 'Offline' && (
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800 mb-2">Offline reference</p>
              <Form.Item name="offlineReference">
                <Select
                  size="large"
                  placeholder="Select Offline reference"
                  getPopupContainer={(node) => node.parentNode}
                  disabled={clientDisable}
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
          {sourceType === 'Social Media' && (
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800 mb-2">Social media reference</p>
              <Form.Item name="SocialMedia">
                <Select
                  disabled={clientDisable}
                  size="large"
                  placeholder="Select social media reference"
                  getPopupContainer={(node) => node.parentNode}
                  onChange={(val) => {
                    setSocialMediaReferred(val);
                    form?.setFieldsValue({
                      referredName: undefined,
                    });
                  }}
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
          {socialMediaReferred === 'Others' && (
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800 mb-2">Other social media</p>
              <Form.Item name={'referredName'}>
                <Input
                  disabled={clientDisable}
                  type="text"
                  size="large"
                  placeholder="Enter social media name"
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
          )}
          {sourceType === 'Branch Reference' && (
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800 mb-2">Select branch</p>
              <Form.Item name={['branch', 'id']}>
                <Select
                  disabled={clientDisable}
                  size="large"
                  className="w-full"
                  placeholder="Select branch here"
                ></Select>
              </Form.Item>
            </Col>
          )}
          {sourceType === 'Referred' && (
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800 mb-2">Referred by</p>
              <Form.Item name="referredBy">
                <Select
                  disabled={clientDisable}
                  size="large"
                  className="w-full"
                  placeholder="Select referred here"
                  onChange={(val) => {
                    setRenderReferred(val);
                    form?.setFieldsValue({
                      leadReferencedBy: { id: undefined },
                      referredName: undefined,
                    });
                  }}
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
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800 mb-2">Current staff</p>
              <Form.Item name={['leadReferencedBy', 'id']}>
                <Select
                  disabled={clientDisable}
                  size="large"
                  placeholder="Reference by"
                  getPopupContainer={(node) => node.parentNode}
                  onSearch={debounceSearch}
                  showSearch
                  filterOption={false}
                >
                  {staffList?.records?.map((item) => (
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
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800 mb-2">Old Staff</p>
              <Form.Item name={['leadReferencedBy', 'id']}>
                <Select
                  disabled={clientDisable}
                  size="large"
                  placeholder="Reference by"
                  getPopupContainer={(node) => node.parentNode}
                  showSearch
                  onSearch={debounceSearch}
                  filterOption={false}
                >
                  {staffList?.records?.map((item) => (
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
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800 mb-2">Friend</p>
              <Form.Item name={'referredName'}>
                <Input
                  disabled={clientDisable}
                  type="text"
                  size="large"
                  placeholder="Enter friend name"
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
          )}
          {renderReferred?.includes('Current Student') && (
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800 mb-2">Current student</p>
              <Form.Item name={['leadReferencedBy', 'id']}>
                <Select
                  disabled={clientDisable}
                  size="large"
                  placeholder="Reference by"
                  getPopupContainer={(node) => node.parentNode}
                  onSearch={debounceSearchStudent}
                  showSearch
                  filterOption={false}
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
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <p className="font-medium text-gray-800 mb-2">Old student</p>
              <Form.Item name={['leadReferencedBy', 'id']}>
                <Select
                  disabled={clientDisable}
                  size="large"
                  placeholder="Reference by"
                  getPopupContainer={(node) => node.parentNode}
                  onSearch={debounceSearchStudent}
                  showSearch
                  filterOption={false}
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
        </Row>
      </div>
    </div>
  );
};

export default Reference;
