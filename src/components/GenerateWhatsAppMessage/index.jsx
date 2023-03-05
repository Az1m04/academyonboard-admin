/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Form, Modal, Row, Input, message, Drawer, Select } from 'antd';

import React, { useState, useEffect } from 'react';
import EmptyStateContainer from '../EmptyStateContainer';
import styles from './index.less';
import WhatsAppPhoneNumber from './WhatsAppPhoneNumber';
import { connect } from 'umi';
import CheckValidation from '@/components/CheckValidation';
import { debounce } from 'lodash';
import RenderTemplates from './RenderTemplates';

const GenerateLeadWhatsAppMessage = ({
  type,
  purpose,
  visible,
  setVisible,
  recordDetails,
  setRecordDetails,
  dispatch,
  currentUser,
  studentTemplates,
  clientTemplates,
  selectedRows,
  setSelectedRows,
  setSelectedRowKeys,
  setAssesTestNotificationMode,
}) => {
  const [form] = Form.useForm();
  const [body, setBody] = useState('');
  const [isSaveTemplate, setIsSaveTemplate] = useState(false);
  const [isTemplateVisible, setIsTemplateVisible] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');

  useEffect(() => {
    form.setFieldsValue({
      description: body,
    });
  }, [body, form]);

  useEffect(() => {
    if (visible && selectedRows?.length > 0) {
      form.setFieldsValue({
        userDetails: selectedRows?.map((item) => item?.formattedPhone?.replace(/\s+/g, '')),
      });
    }
  }, [visible, selectedRows]);

  const action = (value) => {
    setTemplateSearch(value);
  };

  const onTemplateSearchChange = debounce(action, 600);

  const showTemplateDrawer = () => {
    setIsTemplateVisible(true);
  };

  const searchLeadHandler = () => {
    dispatch({
      type:
        type === 'student'
          ? 'template/getStudentWhatsAppTemplates'
          : 'template/getClientWhatsAppTemplates',
      payload: {
        pathParams: {
          orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
        },
        query: {
          templateFor: type === 'student' ? 'STUDENT' : 'CLIENT',
          keyword: templateSearch,
        },
      },
    });
  };

  const searchGeneralHandler = () => {
    dispatch({
      type:
        type === 'student'
          ? 'template/getStudentWhatsAppTemplates'
          : 'template/getClientWhatsAppTemplates',
      payload: {
        pathParams: {
          orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
        },
        query: {
          templateFor: type === 'student' ? 'STUDENT' : 'CLIENT',
          keyword: templateSearch,
        },
      },
    });
  };

  useEffect(() => {
    switch (purpose) {
      case 'lead':
        searchLeadHandler();
        break;
      case 'general':
        searchGeneralHandler();
        break;
      default:
    }
  }, [templateSearch]);

  const leadGetTemplateHandler = () => {
    dispatch({
      type:
        type === 'student'
          ? 'template/getStudentWhatsAppTemplates'
          : 'template/getClientWhatsAppTemplates',
      payload: {
        pathParams: {
          orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
        },
        query: { templateFor: type === 'student' ? 'STUDENT' : 'CLIENT' },
      },
    }).then(() => showTemplateDrawer());
  };

  const generalGetTemplateHandler = () => {
    dispatch({
      type:
        type === 'student'
          ? 'template/getStudentWhatsAppTemplates'
          : 'template/getClientWhatsAppTemplates',
      payload: {
        pathParams: {
          orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
        },
        query: { templateFor: type === 'student' ? 'STUDENT' : 'CLIENT' },
      },
    }).then(() => showTemplateDrawer());
  };

  useEffect(() => {
    if (isTemplateVisible) {
      switch (purpose) {
        case 'lead':
          leadGetTemplateHandler();
          break;
        case 'general':
          generalGetTemplateHandler();
          break;
        default:
      }
    }
  }, [isTemplateVisible]);

  const closeTemplateDrawer = () => {
    setIsTemplateVisible(false);
  };

  const leadDeleteTemplateHandler = (key) => {
    dispatch({
      type:
        type === 'student'
          ? 'template/deleteStudentWhatsAppTemplate'
          : 'template/getStudentWhatsAppTemplates',
      payload: {
        pathParams: {
          orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
          templateId: key,
        },
      },
    }).then(() => {
      dispatch({
        type:
          type === 'student'
            ? 'template/getStudentWhatsAppTemplates'
            : 'template/deleteClientWhatsAppTemplate',
        payload: {
          pathParams: {
            orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
          },
          query: { templateFor: type === 'student' ? 'STUDENT' : 'CLIENT' },
        },
      });
      message.info('You have deleted your template successfully');
    });
  };

  const generalDeleteTemplateHandler = (key) => {
    dispatch({
      type:
        type === 'student'
          ? 'template/deleteStudentWhatsAppTemplate'
          : 'template/getStudentWhatsAppTemplates',
      payload: {
        pathParams: {
          orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
          templateId: key,
        },
      },
    }).then(() => {
      dispatch({
        type:
          type === 'student'
            ? 'template/getStudentWhatsAppTemplates'
            : 'template/deleteClientWhatsAppTemplate',
        payload: {
          pathParams: {
            orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
          },
          query: { templateFor: type === 'student' ? 'STUDENT' : 'CLIENT' },
        },
      });
      message.info('You have deleted your template successfully');
    });
  };

  const deleteTemplateHandler = (key) => {
    switch (purpose) {
      case 'lead':
        leadDeleteTemplateHandler(key);
        break;
      case 'general':
        generalDeleteTemplateHandler(key);
        break;
      default:
    }
  };

  const templateBtnHandler = () => {
    setIsSaveTemplate(!isSaveTemplate);
  };

  const saveTemplateHandler = () => {
    const values = form.getFieldValue();

    delete values.message;

    if (
      values?.name === undefined ||
      values?.description === undefined ||
      values?.name === '' ||
      values?.description === ''
    ) {
      message.error('Please provide a suitable template name and message');
      return;
    }

    const leadCreateTemplateHandler = () => {
      dispatch({
        type:
          type === 'student'
            ? 'template/addSudentWhatsAppTemplate'
            : 'template/addClientWhatsAppTemplate',
        payload: {
          body: values,
          pathParams: {
            orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
          },
          query: { templateFor: type === 'student' ? 'STUDENT' : 'CLIENT' },
        },
      }).then((res) => {
        if (res?.statusText === '400') {
          message.error('Template already exists');
        } else {
          setIsSaveTemplate(false);
          showTemplateDrawer();
          message.success('You have added your template successfully');
        }
      });
    };

    const generalCreateTemplateHandler = () => {
      dispatch({
        type:
          type === 'student'
            ? 'template/addSudentWhatsAppTemplate'
            : 'template/addClientWhatsAppTemplate',
        payload: {
          body: values,
          pathParams: {
            orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
          },
          query: { templateFor: type === 'student' ? 'STUDENT' : 'CLIENT' },
        },
      }).then((res) => {
        if (res?.statusText === '400') {
          message.error('Template already exists');
        } else {
          setIsSaveTemplate(false);
          showTemplateDrawer();
          message.success('You have added your template successfully');
        }
      });
    };

    switch (purpose) {
      case 'lead':
        leadCreateTemplateHandler();
        break;
      case 'general':
        generalCreateTemplateHandler();
        break;
      default:
    }
  };

  const showStudentTemplates =
    studentTemplates?.length > 0 ? (
      <div style={{ padding: '1rem' }}>
        <Input
          placeholder="Enter keyword here to search templates"
          onChange={(e) => onTemplateSearchChange(e.target.value)}
        />

        {studentTemplates?.map((info) => (
          <RenderTemplates
            key={info?.id}
            info={info}
            setBody={setBody}
            form={form}
            deleteTemplateHandler={deleteTemplateHandler}
          />
        ))}
      </div>
    ) : (
      <EmptyStateContainer />
    );

  const showClientTemplates =
    clientTemplates?.length > 0 ? (
      <div style={{ padding: '1rem' }}>
        <Input
          placeholder="Enter keyword here to search templates"
          onChange={(e) => onTemplateSearchChange(e.target.value)}
        />
        {clientTemplates?.map((info) => (
          <RenderTemplates
            key={info.id}
            info={info}
            setBody={setBody}
            form={form}
            deleteTemplateHandler={deleteTemplateHandler}
          />
        ))}
      </div>
    ) : (
      <EmptyStateContainer />
    );

  return (
    <>
      <Modal
        className={styles.mainStyling}
        centered
        width={800}
        destroyOnClose
        keyboard={false}
        maskClosable={false}
        title={
          <div className="text-gray-500">
            Generate message
            {recordDetails.length !== 0 &&
              recordDetails?.map((item) => {
                return (
                  <>
                    <span> for</span>
                    <span> {item?.displayName?.toLowerCase()} </span>
                  </>
                );
              })}
          </div>
        }
        visible={visible}
        footer={null}
        onCancel={() => {
          setVisible(false);
          if (setSelectedRows) setSelectedRows([]);
          setRecordDetails([]);
          if (setSelectedRowKeys) setSelectedRowKeys([]);
          form.resetFields();
        }}
      >
        <Drawer
          title="Templates"
          placement="right"
          onClose={closeTemplateDrawer}
          visible={isTemplateVisible}
          bodyStyle={{ padding: '0.2rem' }}
          width="31rem"
        >
          {type === 'student' ? showStudentTemplates : showClientTemplates}
        </Drawer>

        <Form
          layout="vertical"
          hideRequiredMark
          size="large"
          form={form}
          onFinish={(values) => {
            if (selectedRows?.length === 0) {
              const link = document.createElement('a');
              link.href = `https://api.whatsapp.com/send?text=${
                values?.description
              }&phone=${recordDetails[0]?.formattedPhone?.replace(/\s+/g, '')}`;

              link.setAttribute('target', '_blank');
              link.click();
            } else {
              const link = document.createElement('a');
              link.href = `https://api.whatsapp.com/send?text=${
                values?.description
              }&phone=${form.getFieldValue('userDetails')?.toString()}`;
              link.setAttribute('target', '_blank');
              link.click();
            }
            dispatch({
              type: 'leads/flagWhatsApp',
              payload: {
                pathParams: {
                  leadId: recordDetails?.[0]?.id,
                },
                body: {
                  messageType: 'WHATSAPP_MESSAGE',
                  remarks: values?.description,
                  formattedPhone: recordDetails?.[0]?.formattedPhone?.replace(/\s+/g, ''),
                },
              },
            });
            form.resetFields();
            setVisible(false);
            setRecordDetails('');
            setAssesTestNotificationMode('WEPT_TASK_WATSAP_MSG');
          }}
        >
          <div className="text-right">
            <Button type="link" onClick={showTemplateDrawer}>
              Add templates
            </Button>
          </div>
          {isSaveTemplate && (
            <>
              <div className="text-gray-400">Template name</div>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter template name',
                  },
                ]}
              >
                <Input
                  autoComplete="off"
                  style={{ marginBottom: '1rem' }}
                  placeholder="Enter template name"
                />
              </Form.Item>
            </>
          )}

          <Row gutter={24}>
            <Col span={24}>
              {/*  <CheckValidation show={!isSaveTemplate}> */}
              <div className="text-gray-400">Phone</div>
              {selectedRows?.length > 0 ? (
                <Form.Item name="userDetails">
                  <Select
                    size="large"
                    className="w-full"
                    placeholder="Add phone number or search by name"
                    tokenSeparators={[',']}
                    mode="tags"
                    maxTagCount={5}
                    dropdownStyle={{ display: 'none' }}
                  />
                </Form.Item>
              ) : (
                <WhatsAppPhoneNumber
                  data={
                    // eslint-disable-next-line no-nested-ternary
                    type !== 'staff'
                      ? selectedRows?.length !== 0 || selectedRows === undefined
                        ? selectedRows
                        : recordDetails
                      : recordDetails
                  }
                  name="phone"
                  form={form}
                  countryCode={['contacts', 'countryCode']}
                />
              )}

              {/* </CheckValidation> */}
              <div className="text-gray-400">Message</div>
              <Form.Item
                name="description"
                rules={[
                  {
                    required: true,
                    message: 'Message cannot be blank',
                  },
                ]}
              >
                <Input.TextArea
                  allowClear
                  autoCorrect
                  autoSize={{ minRows: 3, maxRows: 3 }}
                  placeholder="Enter message here..."
                  size="large"
                />
              </Form.Item>
              <Row gutter={24}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  {!isSaveTemplate ? (
                    <div className="text-left">
                      <Button onClick={templateBtnHandler} type="link">
                        Save templates
                      </Button>
                    </div>
                  ) : (
                    <div className="text-left">
                      <Button onClick={templateBtnHandler} type="link">
                        Close
                      </Button>
                      <Button type="link" onClick={saveTemplateHandler}>
                        Save
                      </Button>
                    </div>
                  )}
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <CheckValidation show={!isSaveTemplate}>
                    <div className="flex justify-end">
                      <div>
                        <Button
                          type="link"
                          onClick={() => {
                            form.resetFields();
                            setVisible(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                      <div>
                        <Button type="primary" htmlType="submit">
                          Send
                        </Button>
                      </div>
                    </div>
                  </CheckValidation>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default connect(({ user, template }) => ({
  currentUser: user.currentUser,
  studentTemplates: template.studentWhatsAppTemplates,
  clientTemplates: template.clientWhatsAppTemplates,
}))(GenerateLeadWhatsAppMessage);
