import React, { useState, useEffect } from 'react';
import { useDispatch, connect, useParams, history } from 'umi';
import PhoneNumber from '@/components/PhoneNumber';
import { Form, Input, Row, Col, Select, Divider, Checkbox } from 'antd';
import { debounce } from 'lodash-es';
import { callApi } from '@/utils/apiUtils';
import Reference from '../ClientLeads/AddClientLead/Reference';
import { getClientType, productList } from '../ClientLeads/AddClientLead';
import Address from '@/components/Address';

const BasicDetailsForm = ({
  form,
  leadData,
  getAllEnabledStudentList,
  staffList,
  onCountryChange,
  setOnCountryChange,
  setType,
  type,
  setSingleClientLeadData,
}) => {
  const [chooseFromLead, setChooseFromLead] = useState(false);
  const [sourceType, setSourceType] = useState();
  const [renderReferred, setRenderReferred] = useState();
  const [socialMediaReferred, setSocialMediaReferred] = useState();
  const [optionRefChange, setOptionRefChange] = useState(false);
  const [lookingFor, setLookingFor] = useState();
  const [formLead, setFormLead] = useState();
  const { Option } = Select;
  const { clientId } = useParams();
  const dispatch = useDispatch();
  const getClients = (search) => {
    dispatch({
      type: 'leads/getClientLeadData',
      payload: {
        query: {
          viewSize: 10000,
          startIndex: 0,
          leadTypeId: 'LEAD_CUSTOMER',
          keyword: search,
          isLead: true,
        },
      },
    });
  };

  const debounceSearch = debounce(getClients, 400);

  const getParticularLeadData = (leadId) => {
    return dispatch({
      type: 'leads/getParticularStudentLeadData',
      payload: {
        pathParams: {
          leadId,
        },
      },
    }).then((res) => {
      setSingleClientLeadData(res);
      if (res?.leadDataSource?.sourceType) setSourceType(res?.leadDataSource?.sourceType);
      setOnCountryChange(res?.company?.primaryAddress?.countryGeoId);
      setType(getClientType(res?.company?.type));
      const clientData = { ...res };
      if (clientData?.leadDataSource?.sourceType)
        setSourceType(clientData?.leadDataSource?.sourceType);
      if (
        clientData?.leadDataSource?.description === 'Others' ||
        clientData?.leadDataSource?.description === 'Current Staff' ||
        clientData?.leadDataSource?.description === 'Old Staff' ||
        clientData?.leadDataSource?.description === 'Friend' ||
        clientData?.leadDataSource?.description === 'Current Student' ||
        clientData?.leadDataSource?.description === 'Old Student'
      ) {
        setRenderReferred(clientData?.leadDataSource?.description);
        clientData.referredBy = clientData?.leadDataSource?.description;
        clientData.leadReferencedBy = { id: clientData?.leadReference?.partyId };
      }
      if (
        clientData?.leadDataSource?.sourceType === 'Social Media' &&
        clientData?.leadDataSource?.description === 'Other Sources'
      ) {
        setSocialMediaReferred('Others');
      }
      if (res?.lookingFor?.length > 1) {
        clientData.lookingFor = 'Service And Software';
        setLookingFor('Service And Software');
        clientData.services = res?.lookingFor?.map((purpose) => purpose?.description);
      } else if (res?.lookingFor?.length === 1) {
        clientData.lookingFor = 'Software';
        setLookingFor('Software');
      }

      form.setFieldsValue({
        ...clientData,
        source: res?.leadDataSource?.sourceType,
        clientName: res?.company?.name,
        company: {
          totalBranches: res?.company?.companyTotalBranches,
        },
        designation: res?.designation,
        address: {
          ...res?.company?.primaryAddress,
          addressLine1: res?.company?.primaryAddress?.address1,
          stateCode: res?.company?.primaryAddress?.stateProvinceGeoId,
          countryCode: res?.company?.primaryAddress?.countryGeoId,
        },
        salutation: res?.personalTitle,
        firstName: res?.firstName,
        lastName: res?.lastName,
        middleName: res?.middleName,
        alternatePhone: {
          phone:
            res?.personContactDetails?.alternatePhone &&
            `${res?.personContactDetails?.alternatePhone?.areaCode}${res?.personContactDetails?.alternatePhone?.contactNumber}`,
          countryCode:
            res?.personContactDetails?.alternatePhone?.countryCode &&
            res?.personContactDetails?.alternatePhone?.countryCode,
        },
        clientPrimaryPhone: {
          phone:
            res?.personContactDetails?.partyTelecom &&
            `${res?.personContactDetails?.partyTelecom?.areaCode}${res?.personContactDetails?.partyTelecom?.contactNumber}`,
          countryCode:
            res?.personContactDetails?.partyTelecom &&
            res?.personContactDetails?.partyTelecom?.countryCode,
        },
        clientPrimaryEmail: res?.email,
        // lookingFor: res?.lookingFor?.map((data) => data?.description),
        SocialMedia:
          res?.leadDataSource?.sourceType === 'Social Media'
            ? res?.leadDataSource?.description
            : undefined,
        onlineReference:
          res?.leadDataSource?.sourceType === 'Online'
            ? res?.leadDataSource?.description
            : undefined,
        offlineReference:
          res?.leadDataSource?.sourceType === 'Offline'
            ? res?.leadDataSource?.description
            : undefined,
        printedMedia:
          res?.leadDataSource?.sourceType !== undefined && res?.leadDataSource?.description,
      });
    });
  };
  useEffect(() => {
    getClients('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (clientId) {
      setFormLead(clientId);
      setChooseFromLead(true);
      getParticularLeadData(clientId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  return (
    <div className="">
      <div className="mb-5 bg-white rounded-lg shadow">
        <div className="flex justify-between">
          <p className="px-5 pt-5 text-base font-semibold text-gray-800">
            {(type && type) || 'Company'} details
          </p>
          <div className="px-5 pt-5">
            <Checkbox
              checked={chooseFromLead}
              onChange={(ev) => {
                setChooseFromLead(ev.target.checked);
              }}
              className={`${chooseFromLead === false && 'absolute z-10'} `}
            >
              <span className={`font-semibold`}>Choose from lead</span>
            </Checkbox>
            <span
              className={`${
                chooseFromLead === false &&
                'animate-ping relative inline-flex h-3 w-3.5 bg-yellow-500 opacity-100 mr-32 mt-1 pl-1 '
              }  `}
            ></span>
            {chooseFromLead && (
              <Select
                style={{ width: '250px' }}
                showSearch
                value={formLead}
                filterOption={false}
                onSearch={debounceSearch}
                notFoundContent={null}
                getPopupContainer={(node) => node.parentNode}
                onSelect={(id) => {
                  history.push(`/clients/invite/${id}`);
                  getClients('');
                }}
              >
                {leadData?.records?.map((data) => (
                  <Option key={data?.id}>
                    <span className="border-b">
                      <p className="m-0 capitalize font-medium">{data?.displayName}</p>
                      <p className="m-0 font-medium" style={{ color: 'rgb(27, 86, 143)' }}>
                        {data?.primaryEmail?.toLowerCase()}
                      </p>
                      <p className="m-0 font-medium text-yellow-600">{data?.formattedPhone}</p>
                    </span>
                  </Option>
                ))}
              </Select>
            )}
          </div>
        </div>
        <Divider />
        <div className="px-5 pb-3">
          <Row gutter={16}>
            <Col lg={8} xl={8} md={8} sm={24} xs={24}>
              <div className="block mb-2 font-medium text-gray-800">
                {(type && type) || 'Company'} name
              </div>
              <Form.Item
                name="clientName"
                rules={[
                  {
                    required: true,
                    message: `Please enter ${(type && type) || 'company'} name!`,
                  },
                ]}
              >
                <Input
                  disabled={!clientId}
                  size="large"
                  placeholder={`Enter ${(type && type?.toLowerCase()) || 'company'} name here`}
                  maxLength={100}
                />
              </Form.Item>
            </Col>

            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <span className="block mb-2 font-medium text-gray-800">Email </span>
              <Form.Item
                name="primaryEmail"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Email can't be blank!",
                  },
                  ({ getFieldError }) => ({
                    validator(rule, value) {
                      const a = getFieldError('email');
                      if (
                        a.includes("'email' is not a valid email") ||
                        !value ||
                        value.length < 2
                      ) {
                        return Promise.resolve();
                      }
                      return callApi(
                        {
                          uriEndPoint: {
                            uri: '/user/isExistingLoginId',
                            method: 'GET',
                            version: '/xapi/v1',
                          },
                          query: {
                            user_id: value,
                          },
                        },
                        {
                          disableNotifications: true,
                        },
                      )
                        .then(() => Promise.resolve())

                        .catch(() =>
                          Promise.reject(
                            new Error('Email already exists. Try again with another email!'),
                          ),
                        );
                    },
                  }),
                  {
                    message: 'Please enter a valid email address!',
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  },
                ]}
              >
                <Input
                  size="large"
                  disabled={!clientId}
                  type="email"
                  placeholder="john.doe@domain.com"
                />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <span className="block mb-2 font-medium text-gray-800">Phone</span>
              <PhoneNumber
                clientDisable={!clientId}
                countryCode={['primaryPhone', 'countryCode']}
                rules={[
                  {
                    required: true,
                    message: "Phone number can't be blank!",
                    min: 10,
                    len: 10,
                  },
                ]}
                form={form}
                name={['primaryPhone', 'phone']}
                placeholder="#####-#####"
              />
            </Col>
          </Row>
          <Address
            mainHeading="Street/Village"
            secondaryHeadingVisibility={false}
            pinCodeHeading="PIN code"
            stateHeading="State"
            type="address"
            onCountryChange={onCountryChange}
            setOnCountryChange={setOnCountryChange}
            form={form}
            clientDisable={!clientId}
          />
        </div>
      </div>
      <div className="mb-5 bg-white rounded-lg shadow">
        <p className="px-5 pt-5 text-base font-semibold text-gray-800">Person of contact details</p>
        <Divider />
        <div className="px-5 pb-3">
          <Row gutter={16}>
            <Col lg={3} xl={3} md={12} sm={18} xs={24}>
              <span className="block mb-2 font-medium text-gray-800">Title</span>
              <Form.Item
                name="salutation"
                rules={[
                  {
                    required: true,
                    message: 'Please select Title!',
                  },
                ]}
                initialValue="Mr"
              >
                <Select
                  disabled={!clientId}
                  size="large"
                  placeholder="Title"
                  getPopupContainer={(node) => node.parentNode}
                >
                  <Option value="Mr">Mr</Option>
                  <Option value="Miss">Miss</Option>
                  <Option value="Mrs">Mrs</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col lg={7} xl={7} md={12} sm={18} xs={24}>
              <span className="block mb-2 font-medium text-gray-800">First name</span>
              <Form.Item
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: 'Please enter first name! ',
                  },
                  {
                    pattern: /^[a-zA-Z ]*$/,
                    message: 'Please enter text only',
                  },
                ]}
              >
                <Input
                  disabled={!clientId}
                  size="large"
                  placeholder="First name of contact person"
                />
              </Form.Item>
            </Col>
            <Col lg={7} xl={7} md={12} sm={18} xs={24}>
              <span className="block mb-2 font-medium text-gray-800">Middle name (Optional)</span>
              <Form.Item
                name="middleName"
                rules={[
                  {
                    pattern: /^[a-zA-Z ]*$/,
                    message: 'Please enter text only',
                  },
                ]}
              >
                <Input
                  disabled={!clientId}
                  size="large"
                  placeholder="Middle name of contact person"
                />
              </Form.Item>
            </Col>
            <Col lg={7} xl={7} md={12} sm={18} xs={24}>
              <span className="block mb-2 font-medium text-gray-800">Last name </span>
              <Form.Item
                name="lastName"
                rules={[
                  {
                    pattern: /^[a-zA-Z ]*$/,
                    message: 'Please enter text only',
                  },
                ]}
              >
                <Input
                  disabled={!clientId}
                  size="large"
                  placeholder="Last name of contact person"
                />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm={24} xs={24} style={{ marginBottom: 0, paddingBottom: 0 }}>
              <span className="block mb-2 font-medium text-gray-800">Email </span>
              <Form.Item
                name="clientPrimaryEmail"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Email can't be blank!",
                  },
                  ({ getFieldError }) => ({
                    validator(rule, value) {
                      const a = getFieldError('email');
                      if (
                        a.includes("'email' is not a valid email") ||
                        !value ||
                        value.length < 2
                      ) {
                        return Promise.resolve();
                      }
                      return callApi(
                        {
                          uriEndPoint: {
                            uri: '/user/isExistingLoginId',
                            method: 'GET',
                            version: '/xapi/v1',
                          },
                          query: {
                            user_id: value,
                          },
                        },
                        {
                          disableNotifications: true,
                        },
                      )
                        .then(() => Promise.resolve())

                        .catch(() =>
                          Promise.reject(
                            new Error('Email already exists. Try again with another email!'),
                          ),
                        );
                    },
                  }),
                  {
                    message: 'Please enter a valid email address!',
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  },
                ]}
              >
                <Input
                  disabled={!clientId}
                  size="large"
                  type="email"
                  placeholder="john.doe@domain.com"
                />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={12} sm={18} xs={24}>
              <span className="block mb-2 font-medium text-gray-800">Phone</span>
              <PhoneNumber
                clientDisable={!clientId}
                countryCode={['clientPrimaryPhone', 'countryCode']}
                rules={[
                  {
                    required: true,
                    message: "Phone number can't be blank!",
                    min: 10,
                    len: 10,
                  },
                ]}
                form={form}
                name={['clientPrimaryPhone', 'phone']}
                placeholder="#####-#####"
              />
            </Col>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <span className="block mb-2 font-medium text-gray-800">Alternate (Optional)</span>
              <PhoneNumber
                clientDisable={!clientId}
                countryCode={['alternatePhone', 'countryCode']}
                rules={[
                  {
                    required: true,
                    message: "Phone number can't be blank!",
                    min: 10,
                    len: 10,
                  },
                ]}
                form={form}
                name={['alternatePhone', 'phone']}
                placeholder="#####-#####"
              />
            </Col>
            <Col lg={8} xl={8} md={8} sm={24} xs={24}>
              <span className="block mb-2 font-medium text-gray-800 ">Designation</span>
              <Form.Item
                name="designation"
                rules={[{ required: true, message: 'Please enter designation' }]}
              >
                <Input disabled={!clientId} size="large" placeholder="Enter designation here" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
      <Reference
        dispatch={dispatch}
        totalBranches={['company', 'totalBranches']}
        lookingFor={lookingFor}
        setLookingFor={setLookingFor}
        form={form}
        optionRefChange={optionRefChange}
        setOptionRefChange={setOptionRefChange}
        staffList={staffList}
        sourceType={sourceType}
        setSourceType={setSourceType}
        renderReferred={renderReferred}
        setRenderReferred={setRenderReferred}
        socialMediaReferred={socialMediaReferred}
        setSocialMediaReferred={setSocialMediaReferred}
        getAllEnabledStudentList={getAllEnabledStudentList}
        productList={productList}
        clientDisable={!clientId}
      />
    </div>
  );
};

export default connect(({ leads, loading, student, staff }) => ({
  leadData: leads?.clientLeadData,
  loading: loading?.effects['leads/getClientLeadData'],
  staffList: staff?.staffList,
  getAllEnabledStudentList: student?.getAllEnabledStudentList,
}))(BasicDetailsForm);
