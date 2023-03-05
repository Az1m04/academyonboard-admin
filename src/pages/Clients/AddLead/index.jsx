/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import React from 'react';
import { Form, Input, Button, Row, Col, InputNumber, Select, message } from 'antd';
import { connect } from 'dva';
import Layout from '@/components/Structure/Layout';
import Card from '@/components/Structure/Card';
import Page from '@/components/Page';
import FixedFooter from '@/components/FixedFooter';
import PhoneNumber from '@/components/PhoneNumber';
import Address from '@/components/Address';

const AddLead = ({ form, dispatch, loadingBtn }) => {
  const { getFieldDecorator } = form;
  const { Option } = Select;

  const finalAddLeadHandler = (event) => {
    event.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = values;
        data.phone.countryCode = values?.phone?.country_code.replace(/[()]/g, '').split(' ')[1];
        delete values?.phone?.country_code;
        data.phone.areaCode = values?.phone?.phone.replace(/[()-]/g, '').split(' ')[0];
        data.phone.phone = values?.phone?.phone.replace(/[()-]/g, '').split(' ')[1];

        dispatch({
          type: 'client/addClientLeads',
          payload: { body: data },
        }).then((res) => {
          if (res) {
            form.resetFields();
            message.success('You have submitted your details successfully');
          }
        });

        console.log(data);
      }
    });
  };

  const referenceList = [
    {
      label: 'Web Site Enquiry',
      value: 'WEB_SITE',
    },
    {
      label: 'Office Walk In',
      value: 'OFFICE_WALK_IN',
    },
    {
      label: 'Staff Reference',
      value: 'EMPLOYEE',
    },
  ];

  return (
    <Page
      title="Add client lead"
      subTitle={
        <div className="text-sm font-normal text-gray-800">Add your client leads here.</div>
      }
      PrevNextNeeded="N"
    >
      <Form form={form} onSubmit={finalAddLeadHandler} hideRequiredMark scrollToFirstError>
        <Layout>
          <Layout.AnnotatedSection
            title={<div className="text-xl font-semibold text-gray-800">Company details</div>}
            description="Add company details like company name and address in order to add client lead."
          >
            <Card>
              <Card.Section>
                <div className="p-4">
                  <div className="mb-4">
                    <span className="block mb-2 font-medium text-gray-800">Company name</span>
                    <Form.Item colon={false}>
                      {getFieldDecorator('company.name', {
                        rules: [
                          {
                            required: true,
                            message: 'Please enter company name',
                          },
                        ],
                      })(
                        <Input
                          autoFocus
                          placeholder="Enter company name here"
                          maxLength={100}
                          size="large"
                        />,
                      )}
                    </Form.Item>
                  </div>
                  <div className="mb-4">
                    <Address
                      mainHeading="Street/Village"
                      secondaryHeadingVisibility={false}
                      pinCodeHeading="PIN code"
                      stateHeading="Province"
                      type="address"
                      form={form}
                    />
                  </div>
                </div>
              </Card.Section>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
        <Layout>
          <Layout.AnnotatedSection
            title={<div className="text-xl font-semibold text-gray-800">Point of contact</div>}
            description="Add point of contact like name, phone no and email in order to add client
                      lead."
          >
            <Card>
              <Card.Section>
                <div>
                  <div className="p-4">
                    <div className="mb-4">
                      <Row gutter={[24, 12]}>
                        <Col xl={4} lg={8} md={24} sm={24} xs={24}>
                          <span className="block mb-2 font-medium text-gray-800">Title</span>
                          <Form.Item colon={false}>
                            {getFieldDecorator('personalTitle', {
                              rules: [
                                {
                                  required: true,
                                  message: 'Please enter your title',
                                },
                              ],
                            })(<Input placeholder="Enter title" maxLength={100} size="large" />)}
                          </Form.Item>
                        </Col>
                        <Col xl={10} lg={8} md={24} sm={24} xs={24}>
                          <span className="block mb-2 font-medium text-gray-800">First name</span>
                          <Form.Item colon={false}>
                            {getFieldDecorator('firstName', {
                              rules: [
                                {
                                  required: true,
                                  message: 'Please enter first name',
                                },
                              ],
                            })(
                              <Input
                                placeholder="Enter first name here"
                                maxLength={100}
                                size="large"
                              />,
                            )}
                          </Form.Item>
                        </Col>
                        <Col xl={10} lg={8} md={24} sm={24} xs={24}>
                          <span className="block mb-2 font-medium text-gray-800">Last name</span>
                          <Form.Item colon={false}>
                            {getFieldDecorator('lastName', {
                              rules: [
                                {
                                  required: true,
                                  message: 'Please enter last name',
                                },
                              ],
                            })(
                              <Input
                                placeholder="Enter last name here"
                                maxLength={100}
                                size="large"
                              />,
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>

                    <Row gutter={[24, 12]}>
                      <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                        <span className="block mb-2 font-medium text-gray-800">Phone</span>

                        <PhoneNumber
                          nolabel
                          form={form}
                          phoneRequired
                          countries={['IN']}
                          countrycode="IN (+91)"
                        />
                      </Col>

                      <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                        <span className="block mb-2 font-medium text-gray-800">Email</span>
                        <Form.Item colon={false}>
                          {getFieldDecorator('primaryEmail', {
                            rules: [
                              {
                                required: true,
                                message: 'Please enter email',
                              },
                            ],
                          })(<Input placeholder="Enter email here" maxLength={100} size="large" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Card.Section>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>

        <Layout>
          <Layout.AnnotatedSection
            title={<div className="text-xl font-semibold text-gray-800">Reference</div>}
            description="Add reference details like number of branches and access in order to add
                      client lead."
          >
            <div className="mb-6">
              <Card>
                <Card.Section>
                  <div>
                    <div className="p-4">
                      <Row gutter={[24, 12]}>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                          <span className="block mb-2 font-medium text-gray-800">
                            Number of branches
                          </span>
                          <Form.Item colon={false}>
                            {getFieldDecorator('company.totalBranches', {
                              rules: [
                                {
                                  required: true,
                                  message: 'Please enter branch number',
                                },
                              ],
                            })(<InputNumber style={{ width: '100%' }} min={0} size="large" />)}
                          </Form.Item>
                        </Col>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                          <span className="block mb-2 font-medium text-gray-800">Looking for</span>
                          <Form.Item colon={false}>
                            {getFieldDecorator('lookingFor', {
                              rules: [
                                {
                                  required: true,
                                  message: 'Please select your choice',
                                },
                              ],
                            })(
                              <Select style={{ width: '100%' }} size="large" mode="tags">
                                <Option value="Software">Software</Option>
                                <Option value="Service And Software">
                                  Services &amp; Software
                                </Option>
                              </Select>,
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                    <div className="p-4">
                      <Row gutter={[24, 12]}>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                          <span className="block mb-2 font-medium text-gray-800">Reference</span>
                          <Form.Item colon={false}>
                            {getFieldDecorator('source', {
                              rules: [
                                {
                                  required: true,
                                  message: 'Please select reference',
                                },
                              ],
                            })(
                              <Select size="large">
                                {referenceList.map((item) => (
                                  <Option key={item.label} value={item.label}>
                                    {item.label}
                                  </Option>
                                ))}
                              </Select>,
                            )}
                          </Form.Item>
                        </Col>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}></Col>
                      </Row>
                    </div>
                    <div className="pb-5"></div>
                  </div>
                </Card.Section>
              </Card>
            </div>
          </Layout.AnnotatedSection>
        </Layout>

        <FixedFooter classes="text-right">
          <div
            className="flex m-auto"
            style={{
              maxWidth: '80rem',
            }}
          >
            <div className="w-full ">
              <Button loading={loadingBtn} type="primary" htmlType="submit" size="large">
                Add client lead
              </Button>
            </div>
          </div>
        </FixedFooter>
      </Form>
    </Page>
  );
};

export default connect(({ loading }) => ({
  loadingBtn: loading.effects['client/addClientLeads'],
}))(AddLead);
