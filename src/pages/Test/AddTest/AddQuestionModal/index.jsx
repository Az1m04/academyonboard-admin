/* eslint-disable react/jsx-key */
/* eslint-disable no-nested-ternary */

import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox, Upload, message, Popconfirm } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import AppModal from '@/components/AppModal';
import { Attachment } from '@/utils/AppIcons';
import { connect } from 'umi';
import { DeleteFilled } from '@ant-design/icons';

const Justification = ({ optName }) => {
  const { TextArea } = Input;
  return (
    <>
      <p className="mb-1 ml-6 font-medium text-gray-800">
        Justification &#x00028;Optional&#x00029;
      </p>
      <Form.Item
        name={[optName, 'justification']}
        rules={[
          {
            required: true,
            message: 'Please enter justification',
          },
        ]}
        initialValue=""
        style={{ paddingLeft: '22px' }}
      >
        <TextArea rows={2} placeholder="Enter a answer here" size="middle" />
      </Form.Item>
    </>
  );
};

const AddQuestionModal = ({
  isModalVisible,
  setIsModalVisible,
  setAllModalValues,
  setCorrectOptions,
  correctOptions,
  modalType,
  editModuleValues,
  allModalValues,
  setEditModuleValues,
  editModuleRecordIndex,
  audioContent,
  setAudioContent,
  dispatch,
  audioAttachmentLoading,
  deleteTestContentLoading,
}) => {
  const { TextArea } = Input;

  const [form] = useForm();

  useEffect(() => {
    if (editModuleValues) {
      const [values] = editModuleValues;
      const options = ['A', 'B', 'C', 'D'];
      const getOption = (value) => options.filter((o) => (value === values[o].option ? o : false));
      const data = editModuleValues;
      data[0].answers = values.answers.map((a) => ({ ...a, option: getOption(a.value)[0] }));
      setEditModuleValues(data);
      form.setFieldsValue({ ...values });
      setCorrectOptions(values?.answers?.map(({ option }) => option));
    }
  }, [editModuleValues, form]);

  const onQuestionFinishHandler = (values) => {
    // Setting modal values in state on edit

    if (modalType === 'edit') {
      const array = allModalValues;

      array[editModuleRecordIndex] = {
        ...values,
        answers: correctOptions.map((val) => ({
          option: val,
          value: values[val].option,
          description: values[val].justification,
        })),
      };

      setAllModalValues(array);

      setIsModalVisible(false);
      setCorrectOptions([]);
      setAudioContent(null);
      form.resetFields();
      return;
    }

    // Setting modal values in state on Adding

    setAllModalValues((prev) => {
      return [
        ...prev,
        {
          ...values,
          categoryId: 'MCQ',
          content: values?.content,
          answers: correctOptions.map((val) => ({
            option: val,
            value: values[val].option,
            description: values[val].justification,
          })),
        },
      ];
    });
    setAudioContent(null);
    setIsModalVisible(false);
    setCorrectOptions([]);
    form.resetFields();
  };

  return (
    <>
      {/* Modals */}
      <AppModal
        afterClose={() => {
          form.resetFields();
          setCorrectOptions([]);
        }}
        titleName={modalType === 'edit' ? 'Edit Questions' : 'Add Questions'}
        showModal={isModalVisible}
        setShowModal={() => {
          if (!audioAttachmentLoading || !deleteTestContentLoading) {
            setIsModalVisible(false);
            setAudioContent({ attachment: false, attachted: false, file: {} });
          } else {
            message.error(
              (audioAttachmentLoading && 'file uploading in process') ||
                (deleteTestContentLoading && 'deleting in process'),
            );
          }
        }}
        maskClosable={false}
        destroyOnClose
        footer={
          <div className="flex justify-end">
            <div>
              <Button
                type="link"
                disabled={Boolean(audioAttachmentLoading) || Boolean(deleteTestContentLoading)}
                onClick={() => {
                  setIsModalVisible(false);
                }}
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button
                type="primary"
                disabled={Boolean(audioAttachmentLoading) || Boolean(deleteTestContentLoading)}
                onClick={() => {
                  form?.submit();
                }}
              >
                {modalType === 'edit' ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        }
        width={600}
      >
        <div
          className="p-4"
          style={{ maxHeight: '600px', overflowY: 'scroll', overflowX: 'hidden' }}
        >
          <Form
            form={form}
            initialValues={{
              remember: true,
            }}
            onFinish={(values) => onQuestionFinishHandler({ ...values, content: audioContent })}
            onFinishFailed={(err) => err}
            requiredMark="optional"
          >
            <div className="flex my-2 items-center gap-5 " style={{ height: '20px' }}>
              <Checkbox
                checked={audioContent?.attachment}
                onChange={(e) =>
                  setAudioContent({
                    attachment: e?.target?.checked,
                    attachted: e?.target?.checked,
                    file: {},
                  })
                }
              >
                <span className="m-0 font-medium select-none"> Attach audio file</span>
              </Checkbox>
              {audioContent?.attachted && !audioContent?.file?.length && (
                <>
                  <Upload
                    accept="audio/*"
                    beforeUpload={(file) => {
                      const formData = new FormData();
                      formData.append('file', file);
                      dispatch({
                        type: 'courses/uploadTestContent',
                        payload: {
                          body: formData,
                        },
                      }).then((res) => {
                        if (res?.contentId) {
                          setAudioContent({ attachment: true, attachted: false, file: res });
                        }
                      });
                      return false;
                    }}
                    fileList={[]}
                  >
                    <Button
                      type="text"
                      disabled={Boolean(audioAttachmentLoading)}
                      loading={Boolean(audioAttachmentLoading)}
                      style={{ display: 'flex' }}
                    >
                      {!audioAttachmentLoading && <Attachment />}
                    </Button>
                  </Upload>
                </>
              )}
              {audioContent?.file?.url && (
                <>
                  <audio controls src={audioContent?.file?.url}>
                    Your browser does not support the audio element.
                  </audio>

                  <Popconfirm
                    title="Are you sure to delete this file?"
                    onConfirm={() =>
                      dispatch({
                        type: 'courses/deleteTestContent',
                        payload: {
                          pathParams: {
                            contentId: audioContent?.file?.contentId,
                          },
                        },
                      }).then((res) => {
                        if (res?.responseMessage === 'success') {
                          message.success('File deleted successfully');
                          setAudioContent({ attachment: false, attachted: false, file: {} });
                        }
                      })
                    }
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ loading: Boolean(deleteTestContentLoading) }}
                  >
                    <button type="button" className="text-red-500 hover:text-red-600 outline-none">
                      <DeleteFilled />
                    </button>
                  </Popconfirm>
                </>
              )}
            </div>
            <div>
              <p className="mb-1 font-medium text-gray-800">Question</p>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter  question',
                  },
                ]}
                initialValue=""
              >
                <TextArea rows={2} placeholder="Enter question here" size="middle" />
              </Form.Item>
            </div>
            <div>
              <Checkbox.Group
                style={{ width: '100%' }}
                value={correctOptions}
                onChange={(v) => {
                  // Array of correctOptions
                  setCorrectOptions(v);
                }}
              >
                <label className="flex items-center cursor-pointer space-x-3 mb-3 w-28 ">
                  <Checkbox size="middle" value="A" />
                  <span className=" font-medium text-gray-800">Option A</span>
                </label>

                <Form.Item
                  name={['A', 'option']}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter option A',
                    },
                  ]}
                  initialValue=""
                  className="w-full"
                >
                  <TextArea rows={2} placeholder="Enter answer here" size="middle" />
                </Form.Item>
                {correctOptions?.includes('A') ? <Justification optName="A" /> : null}
                <label className="flex items-center cursor-pointer space-x-3 mb-3 w-28">
                  <Checkbox size="middle" value="B" />
                  <span className=" font-medium text-gray-800">Option B</span>
                </label>

                <Form.Item
                  name={['B', 'option']}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter option B',
                    },
                  ]}
                  initialValue=""
                  className="w-full"
                >
                  <TextArea rows={2} placeholder="Enter answer here" size="middle" />
                </Form.Item>
                {correctOptions?.includes('B') ? <Justification optName="B" /> : null}
                <label className="flex items-center cursor-pointer space-x-3 mb-3 w-28">
                  <Checkbox size="middle" value="C" />
                  <span className=" font-medium text-gray-800">Option C</span>
                </label>

                <Form.Item
                  name={['C', 'option']}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter option C',
                    },
                  ]}
                  initialValue=""
                  className="w-full"
                >
                  <TextArea rows={2} placeholder="Enter answer here" size="middle" />
                </Form.Item>
                {correctOptions?.includes('C') ? <Justification optName="C" /> : null}
                <label className="flex items-center cursor-pointer space-x-3 mb-3 w-28">
                  <Checkbox size="middle" value="D" />
                  <span className=" font-medium text-gray-800">Option D</span>
                </label>
                <Form.Item
                  name={['D', 'option']}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter option D',
                    },
                  ]}
                  initialValue=""
                  className="w-full"
                >
                  <TextArea rows={2} placeholder="Enter answer here" size="middle" />
                </Form.Item>
                {correctOptions?.includes('D') ? <Justification optName="D" /> : null}
              </Checkbox.Group>
            </div>
          </Form>
        </div>
      </AppModal>
    </>
  );
};

export default connect(({ loading }) => ({
  audioAttachmentLoading: loading.effects['courses/uploadTestContent'],
  deleteTestContentLoading: loading.effects['courses/deleteTestContent'],
}))(AddQuestionModal);
