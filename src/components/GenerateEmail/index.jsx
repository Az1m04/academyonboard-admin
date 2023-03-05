/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import {
  Button,
  Form,
  Modal,
  Input,
  Switch,
  Steps,
  Upload,
  message,
  Tooltip,
  Drawer,
  Row,
  Col,
} from 'antd';
import classNames from 'classnames';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import CKEditor from '@ckeditor/ckeditor5-react';
import React, { useState, useEffect } from 'react';
import EmailInput from './EmailInput';
import CKEditorConfig from '@/config/appConfig';
import AttachedDocument from '@/components/AttachedDocument';
import styles from './index.less';
import { connect } from 'umi';
import { debounce } from 'lodash';
import EmptyStateContainer from '../EmptyStateContainer';
import { Attachment } from '@/utils/AppIcons';
import RenderTemplates from './RenderTemplates';

CKEditor.editorConfig = () => {
  // misc options
};

const GenerateLeadEmail = ({
  type,
  purpose,
  visible,
  setVisible,
  recordDetails,
  setRecordDetails,
  dispatch,
  studentTemplateData,
  clientTemplateData,
  currentUser,
  selectedRows,
  setSelectedRows,
  setSelectedRowKeys,
  assesmentLink,
  setAssesTestNotificationMode,
}) => {
  const [form] = Form.useForm();
  const [isAddTemplate, setIsAddTemplate] = useState(false);
  const [body, setBody] = useState('');
  const [enableBCC, setEnableBCC] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [subject, setSubject] = useState('');
  const [encodedList, setEncodedList] = useState([]);
  const [fileList, setFilelist] = useState([]);
  const [isTemplateVisible, setIsTemplateVisible] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');

  const showTemplateDrawer = () => {
    setIsTemplateVisible(true);
  };

  const closeTemplateDrawer = () => {
    setIsTemplateVisible(false);
  };

  const getStudentEmailTemplates = () => {
    return dispatch({
      type: 'email/getStudentEmailTemplate',
      payload: {
        pathParams: {
          orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
        },
        query: {
          templateFor: 'STUDENT',
          keyword: templateSearch,
        },
      },
    });
  };
  const getClientEmailTemplates = () => {
    return dispatch({
      type: 'email/getClientEmailTemplate',
      payload: {
        path: {
          orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
        },
        query: {
          templateFor: 'CLIENT',
          keyword: templateSearch,
        },
      },
    });
  };

  const getEmailTemplatesByType = () => {
    switch (type) {
      case 'student':
        return getStudentEmailTemplates();

      case 'client':
        return getClientEmailTemplates();

      default:
        break;
    }
    return '';
  };
  const searchTemplateHandler = () => {
    return getEmailTemplatesByType(type);
  };

  useEffect(() => {
    searchTemplateHandler();
  }, [templateSearch]);

  const action = (value) => {
    setTemplateSearch(value);
  };

  const onTemplateSearchChange = debounce(action, 600);

  const getTemplateHandler = () => {
    getEmailTemplatesByType(type);
  };

  useEffect(() => {
    if (isTemplateVisible) {
      getTemplateHandler();
    }
  }, [isTemplateVisible]);

  const deleteStudentEmailTemplate = (key) => {
    return dispatch({
      type: 'email/deleteStudentEmailTemplate',
      payload: {
        pathParams: {
          orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
          templateId: key,
        },
      },
    });
  };

  const deleteClientEmailTemplate = (key) => {
    return dispatch({
      type: 'email/deleteClientEmailTemplate',
      payload: {
        pathParams: {
          orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
          templateId: key,
        },
      },
    });
  };

  const deleteTemplateHandler = (key) => {
    switch (type) {
      case 'student':
        deleteStudentEmailTemplate(key).then((res) => {
          if (res?.responseMessage === 'success') {
            getEmailTemplatesByType();
            message.success('You have deleted your template successfully');
          } else {
            message.error('Something went wrong!');
          }
        });
        break;
      case 'client':
        deleteClientEmailTemplate(key).then((res) => {
          if (res?.responseMessage === 'success') {
            getEmailTemplatesByType();
            message.success('You have deleted your template successfully');
          } else {
            message.error('Something went wrong!');
          }
        });
        break;
      default:
    }
  };

  useEffect(() => {
    if (selectedRows?.length > 0) {
      form.setFieldsValue({
        to: selectedRows?.map((row) => row?.primaryEmail),
      });
    }
  }, [selectedRows]);

  useEffect(() => {
    if (recordDetails?.length > 0) {
      form.setFieldsValue({
        to: recordDetails?.map((row) => row?.primaryEmail),
      });
    }
  }, [recordDetails]);

  useEffect(() => {
    form.setFieldsValue({
      subject,
    });
  }, [subject]);

  const fileSizeConvertor = (size) => {
    if (size && size / 1024 / 1024 > 0) {
      const newSize = (size / 1024 / 1024).toFixed(2);
      return `${newSize} MB`;
    }
    return null;
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const beforeUpload = async (content) => {
    await toBase64(content).then((res) => {
      const obj = {
        encodedFile: res,
        size: fileSizeConvertor(content.size),
        name: content?.name,
      };
      setFilelist([].concat(obj, fileList));
    });

    setEncodedList([].concat(content, encodedList));
  };

  const createTemplateHandler = () => {
    const values = form.getFieldValue();

    if (!body || values.subject === '') {
      message.error('Please provide a suitable template name (Subject of email) and message');
      return;
    }

    const payloadData = {
      subject: `${values.subject}`,
      description: `${body?.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, ' ')}`,
      attachments: [...fileList],
    };

    const createStudentTemplate = () => {
      return dispatch({
        type: 'email/addStudentEmailTemplate',
        payload: {
          body: payloadData,
          pathParams: {
            orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
          },
          query: { templateFor: type === 'student' ? 'STUDENT' : 'CLIENT' },
        },
      });
    };

    const createClientTemplate = () => {
      return dispatch({
        type: 'email/addClientEmailTemplate',
        payload: {
          body: payloadData,
          pathParams: {
            orgId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
          },
          query: { templateFor: type === 'student' ? 'STUDENT' : 'CLIENT' },
        },
      });
    };

    switch (type) {
      case 'student':
        createStudentTemplate().then((res) => {
          if (res.status === 400) {
            message.error('Template already exists');
          } else {
            setIsTemplateVisible(true);
            message.success('You have added your template successfully');
          }
        });
        break;
      case 'client':
        createClientTemplate().then((res) => {
          if (res.status === 400) {
            message.error('Template already exists');
          } else {
            setIsTemplateVisible(true);
            message.success('You have added your template successfully');
          }
        });
        break;
      default:
    }
  };
  const onFinishHandler = (values) => {
    if (selectedRows?.length > 1) {
      const payload = {
        body: {
          ...values,
          body,
        },
      };
      dispatch({
        type: 'email/sendEmailInBulk',
        payload,
      }).then((res) => {
        if (res) {
          setVisible(false);
          message.success('Email is sent successfully');
        }
        if (setAssesTestNotificationMode) setAssesTestNotificationMode('WEPT_TASK_EMAIL');
      });
    } else if (!body) {
      message.error('Please provide a suitable message');
    } else {
      const payload = {
        pathParams: {
          partyId: recordDetails[0]?.id,
        },
        body: {
          ...values,
          body,
        },
      };

      dispatch({
        type: 'email/sendEmailSingleLead',
        payload,
      }).then((res) => {
        if (res) {
          setVisible(false);
          message.success('Email is sent successfully');
        }
        if (setAssesTestNotificationMode) setAssesTestNotificationMode('WEPT_TASK_EMAIL');
      });
    }
  };

  const showStudentTemplates =
    studentTemplateData?.emailTemplates?.length > 0 ? (
      <div style={{ padding: '1rem' }}>
        <Input
          placeholder="Enter keyword here to search templates"
          onChange={(value) => onTemplateSearchChange(value.target.value)}
        />

        {studentTemplateData.emailTemplates?.map((info) => (
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

  const showClientTemplates =
    clientTemplateData?.emailTemplates?.length > 0 ? (
      <div style={{ padding: '1rem' }}>
        <Input
          placeholder="Enter keyword here to search templates"
          onChange={(value) => onTemplateSearchChange(value.target.value)}
        />

        {clientTemplateData.emailTemplates?.map((info) => (
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
    <Modal
      width={800}
      centered
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
      destroyOnClose
      keyboard={false}
      maskClosable={false}
      title={
        <div className="text-gray-500">
          Generate email
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
        setSubject('');
        setBody('');
        setVisible(false);
        setRecordDetails([]);
        if (setSelectedRows) setSelectedRows([]);
        if (setSelectedRowKeys) setSelectedRowKeys([]);
        form.setFieldsValue('message', null);
      }}
    >
      <Drawer
        title="Templates"
        placement="right"
        onClose={closeTemplateDrawer}
        visible={isTemplateVisible}
        bodyStyle={{ padding: '0.5rem' }}
        width="30rem"
      >
        {type === 'student' ? showStudentTemplates : showClientTemplates}
      </Drawer>
      <Form hideRequiredMark form={form} colon={false} onFinish={onFinishHandler}>
        <div>
          <Steps direction="vertical" size="small" current={0}>
            <Steps.Step
              status={!isEmpty ? 'finish' : 'pending'}
              title={
                <div className={classNames('flex justify-between w-full', styles.stepTitleStyling)}>
                  <div className="text-xs font-semibold text-gray-500 uppercase">Send To</div>
                  <div className="" title="Show Bcc field">
                    <Switch
                      checkedChildren="BCC"
                      unCheckedChildren="BCC"
                      checked={enableBCC}
                      onChange={(e) => setEnableBCC(e)}
                    />
                  </div>
                </div>
              }
              description={
                <div className="mt-4">
                  <EmailInput
                    name="to"
                    label="To"
                    data={
                      selectedRows?.length !== 0 || selectedRows === undefined
                        ? selectedRows
                        : recordDetails
                    }
                    // emailList={selectedRows.map((row) => row.primaryEmail)}
                    form={form}
                    setIsEmpty={setIsEmpty}
                  />
                  <EmailInput name="cc" label="Cc" data={recordDetails} form={form} />
                  {enableBCC && (
                    <EmailInput
                      name="bcc"
                      label="Bcc"
                      data={recordDetails}
                      form={form}
                      allowStyling={true}
                    />
                  )}
                </div>
              }
            />
            <Steps.Step
              status={subject ? 'finish' : 'pending'}
              title={<div className="mb-2 text-xs font-semibold text-gray-500 ">SUBJECT</div>}
              description={
                <>
                  <div>
                    <Form.Item
                      name="subject"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter a valid email subject',
                        },
                      ]}
                    >
                      <Input.TextArea
                        allowClear
                        onChange={(e) => {
                          setSubject(e.target.value);
                        }}
                        placeholder="Enter subject here"
                        autoSize={{ minRows: 1, maxRows: 4 }}
                      />
                    </Form.Item>
                  </div>
                </>
              }
            />
            <Steps.Step
              status={body ? 'finish' : 'pending'}
              // className="app-step-title-full"
              title={
                <div className="flex justify-between w-full">
                  <div className="text-xs font-semibold text-gray-500 uppercase">Message</div>
                  <div className="flex">
                    {body && (
                      <div
                        className="mt-2 mr-2 text-xs font-semibold text-yellow-600 uppercase cursor-pointer"
                        onClick={() => setBody('')}
                      >
                        Clear
                      </div>
                    )}

                    <Button type="link" onClick={showTemplateDrawer}>
                      Add templates
                    </Button>

                    <Upload
                      beforeUpload={(content) => {
                        beforeUpload(content);
                      }}
                      fileList={[]}
                    >
                      <Tooltip placement="topRight" title="Attachment">
                        <div
                          className="mt-1 text-xs font-semibold text-blue-500 uppercase cursor-pointer"
                          style={{
                            transform: 'rotate(270deg)',
                          }}
                        >
                          <Attachment />
                        </div>
                      </Tooltip>
                    </Upload>
                  </div>
                </div>
              }
              description={
                <div>
                  <div className="text-gray-800 rounded">
                    <CKEditor
                      style={{ border: 2 }}
                      onInit={(editor) => {
                        editor.ui
                          .getEditableElement()
                          .parentElement.insertBefore(
                            editor.ui.view.toolbar.element,
                            editor.ui.getEditableElement(),
                          );
                      }}
                      onChange={(event, editor) => {
                        const editorData = editor.getData();
                        setBody(editorData);
                      }}
                      editor={DecoupledEditor}
                      data={body || ''}
                      config={
                        CKEditorConfig.editor &&
                        CKEditorConfig.editor.toolbarType &&
                        CKEditorConfig.editor.toolbarType.email
                      }
                    />
                  </div>
                  <AttachedDocument {...{ fileList, setFilelist, encodedList, setEncodedList }} />
                </div>
              }
            />
          </Steps>
        </div>
        <Row gutter={24}>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <div className="text-left">
              <Button onClick={createTemplateHandler} type="link">
                Save templates
              </Button>
            </div>
          </Col>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <div className="flex justify-end">
              <div>
                <Button
                  type="link"
                  onClick={() => {
                    form.resetFields();
                    setVisible(false);
                    setSubject('');
                    setBody('');
                    setRecordDetails('');
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
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  studentTemplateData: state?.email?.studentEmailTemplates,
  clientTemplateData: state?.email?.clientEmailTemplates,
  currentUser: state?.user?.currentUser,
});

export default connect(mapStateToProps)(GenerateLeadEmail);
