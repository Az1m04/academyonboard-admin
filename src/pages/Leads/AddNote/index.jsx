import React, { useEffect, useState } from 'react';
import { Input, Form, Button, Divider, Timeline, message } from 'antd';
import { connect } from 'umi';
import AppIcons from '@/utils/AppIcons';
import classes from './index.less';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EmptyState from '@/components/EmptyState';
import CheckValidation from '@/components/CheckValidation';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import ReactHtmlParser from 'react-html-parser';

const { TextArea } = Input;
dayjs.extend(relativeTime);

const AddNote = ({ dispatch, editLead, notesRecord, loading }) => {
  const [isTouched, setIsTouched] = useState(false);
  const [form] = Form.useForm();
  const getLeadNotes = () => {
    const query = { noteType: 'LEAD' };
    if (editLead?.enquiryId) {
      query.enquiryId = editLead?.enquiryId;
    }
    dispatch({
      type: 'leads/getLeadNotes',
      payload: { pathParams: { leadId: editLead?.leadId }, query },
    });
    form.setFieldsValue({
      noteInfo: editLead?.record?.lastNote?.name,
    });
  };

  useEffect(() => {
    getLeadNotes();
  }, []);

  const getTimelineIcon = () => {
    return (
      <div
        className="flex items-center justify-center w-8 h-8 text-white rounded-full"
        style={{ backgroundColor: '#ffa500' }}
      >
        <AppIcons.CardText />
      </div>
    );
  };

  const onFinish = (values) => {
    const body = {
      ...values,
      noteType: 'LEAD_NOTE',
      enquiryId: editLead?.enquiryId,
    };
    dispatch({
      type: 'leads/addLeadNotes',
      payload: { body, pathParams: { leadId: editLead?.leadId } },
    }).then((res) => {
      if (res?.id) {
        message.success('You have added note successfully');
        form.resetFields();
        getLeadNotes();
        dispatch({
          type: 'leads/setStates',
          payload: {
            visible: false,
            type: null,
            title: null,
            leadId: null,
          },
          key: 'editLead',
        });
      } else {
        message.error('Something went wrong !!');
      }
    });
  };

  return (
    <>
      <Form onFinish={onFinish} hideRequiredMark autoComplete="off" form={form}>
        <div className="p-4">
          <Form.Item
            style={{ margin: '0' }}
            name="noteInfo"
            rules={[{ required: true, message: 'Please add a note first!' }]}
          >
            <TextArea
              onChange={(ev) => {
                if (ev.target.value && !isTouched) {
                  setIsTouched((prev) => !prev);
                } else if (ev.target.value === '' && isTouched) {
                  setIsTouched((prev) => !prev);
                }
              }}
              className=""
              autoSize={{ minRows: 3, maxRows: 6 }}
              placeholder="Type a note here!"
            />
          </Form.Item>
        </div>
        <Divider style={{ margin: '0' }} />
        <div className="flex justify-end p-4">
          <Button
            size="large"
            disabled={!form.getFieldValue('noteInfo')}
            onClick={() => {
              form.resetFields();
            }}
            className="mr-4"
          >
            Reset
          </Button>

          <Button loading={loading} type="primary" size="large" onClick={() => form.submit()}>
            Add
          </Button>
        </div>
      </Form>
      {notesRecord?.length && (
        <div className="flex justify-between p-8 ">
          <span>
            Showing <span className="text-blue-600 pr-1"> {notesRecord?.length} </span>
            of <span className="text-green-600"> {notesRecord?.length} </span>
          </span>
        </div>
      )}

      <CheckValidation
        show={notesRecord?.records?.length > 0}
        fallback={
          <EmptyState
            emptyState={emptyStateSvg}
            emptyHeaderText={<span>No notes have been added yet!</span>}
          />
        }
      />

      <div className={`px-5 ${classes.TimeLineIcon}`}>
        <Timeline className="w-full">
          {notesRecord?.records?.map((rec) => (
            <>
              <Timeline.Item dot={getTimelineIcon()} key={rec?.id}>
                <div className="flex justify-between pl-6">
                  <div className="flex-wrap w-full">
                    <div className="flex justify-between">
                      <div>
                        <span className="font-semibold text-blue-600">
                          {rec?.createdByInfo?.displayName}
                        </span>{' '}
                        <span>has added note</span>
                      </div>
                      <div>
                        <div className="text-right text-gray-400">
                          <div className="text-xs italic text-gray-800">
                            {dayjs(rec?.createdAt).fromNow()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 flex">
                      <p className="m-0">
                        {dayjs(rec?.createdAt).format('MMM D, YYYY')} at{' '}
                        {dayjs(rec?.createdAt).format('h:mm A')}{' '}
                      </p>
                    </div>
                    <div className="w-full richtext-container-div">
                      {ReactHtmlParser(rec?.noteInfo)}
                    </div>
                  </div>
                </div>
              </Timeline.Item>
            </>
          ))}
        </Timeline>
      </div>
    </>
  );
};

export default connect(({ leads, loading }) => ({
  editLead: leads?.editLead,
  notesRecord: leads?.activityRecord,
  loading: loading?.effects['leads/addLeadNotes'],
}))(AddNote);
