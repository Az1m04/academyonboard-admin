import React, { useEffect } from 'react';
import { Button, Divider, Form, Input, message, Radio, Timeline, Tooltip } from 'antd';
import CheckValidation from '@/components/CheckValidation';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import classes from './index.less';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AppIcons from '@/utils/AppIcons';
import { connect } from 'umi';

dayjs.extend(relativeTime);

const LeadPriority = ({ priorityRecord, dispatch, setActionKey, actionKey, leadData, loading }) => {
  const [form] = Form.useForm();
  const getTimelineIcon = () => {
    return (
      <div
        className="flex items-center justify-center w-8 h-8 text-white rounded-full"
        style={{ backgroundColor: '#ffa500' }}
      >
        <AppIcons.SortUp />
      </div>
    );
  };
  const getActivity = () => {
    dispatch({
      type: 'leads/getActivity',
      payload: {
        pathParams: { leadId: actionKey?.id },
        query: { activityType: 'lead_priority' },
      },
    });
    const record = leadData?.find((lead) => lead?.id === actionKey?.id);
    form.setFieldsValue({
      priority: record?.priority,
      noteInfo: record?.priorityRemark ? record?.priorityRemark : undefined,
    });
  };
  useEffect(() => {
    getActivity();
  }, [actionKey]);

  const onPriorityFinish = (values) => {
    dispatch({
      type: 'leads/addLeadPriority',
      payload: {
        body: {
          priority: values?.priority,
          note: {
            noteInfo: values?.noteInfo,
            noteType: 'PRIORITY_NOTE',
          },
        },
        pathParams: { leadId: actionKey?.id },
      },
    })
      .then((res) => {
        if (res?.id) {
          message.success('You have set priority successfully');
          setActionKey({ id: null, title: null, subTitle: null, key: null });
          getActivity();
          form.setFieldsValue({
            priority: res?.priority,
            noteInfo: res?.priorityRemark ? res?.priorityRemark : undefined,
          });
        }
      })
      .catch((error) => {
        if (error) message.error('Something went wrong');
      });
  };
  return (
    <>
      <Form
        form={form}
        hideRequiredMark
        autoComplete="off"
        onFinish={onPriorityFinish}
        layout="vertical"
      >
        <div className="p-4">
          <span className="block"> Set priority</span>
          <Form.Item
            style={{ margin: '0' }}
            name="priority"
            initialValue={'LOW'}
            rules={[{ required: true, message: 'Please set a priority first !' }]}
          >
            <Radio.Group size="large">
              <Radio value="LOW">Low</Radio>
              <Radio value="MEDIUM">Medium</Radio>
              <Radio value="HIGH">High</Radio>
              <Radio value="VERY_HIGH">Very high</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="noteInfo" label={<p className="mb-0 mt-4">Add remarks</p>}>
            <Input size="middle" placeholder="Add remarks" />
          </Form.Item>
        </div>
        <Divider style={{ margin: '0' }} />

        <div className="flex justify-end p-4 items-center">
          <Button
            size="large"
            onClick={() => {
              setActionKey({ id: null, key: null, title: null, subTitle: null });
            }}
            className="mr-4 flex-none"
          >
            Cancel
          </Button>
          <Button type="primary" size="large" loading={loading} onClick={() => form.submit()}>
            Set
          </Button>
        </div>
      </Form>

      <div className="flex justify-between p-8 ">
        <span>
          Showing <span className="text-blue-600 mr-1">{priorityRecord?.records?.length}</span>
          of <span className="text-green-600">{priorityRecord?.totalCount}</span>
        </span>
      </div>

      <CheckValidation
        show={priorityRecord?.records?.length > 0}
        fallback={
          <EmptyState
            emptyState={emptyStateSvg}
            emptyHeaderText={<span>No priorities have been set yet!</span>}
          />
        }
      />

      <div className={`px-5 ${classes.TimeLineIcon}`}>
        <Timeline className="w-full">
          {priorityRecord?.records?.map((rec) => (
            <Timeline.Item dot={getTimelineIcon()} key={rec.id}>
              <div className="flex justify-between pl-6">
                <div className="flex-wrap w-full">
                  <div className="flex justify-between">
                    <Tooltip
                      title={`Remarks - ${rec?.noteInfo || 'There is no any priority remarks !'}`}
                      getPopupContainer={(node) => node.parentNode}
                      placement="top"
                    >
                      <div>
                        <span className="font-semibold text-blue-600">
                          {rec?.author?.displayName}
                        </span>{' '}
                        <span>{rec?.description}</span>
                      </div>
                    </Tooltip>
                    <div>
                      <div className="text-right text-gray-400">
                        <div className="text-xs italic text-gray-800">
                          {dayjs(rec?.startTime).fromNow()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    <p className="m-0">
                      {dayjs(rec?.startTime).format('MMM D, YYYY')} at{' '}
                      {dayjs(rec?.startTime).format('h:mm A')}
                    </p>
                  </div>
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </>
  );
};

export default connect(({ leads, loading }) => ({
  leadData: leads?.clientLeadData?.records,
  priorityRecord: leads?.activityRecord,
  loading: loading?.effects['leads/addLeadPriority'],
}))(LeadPriority);
