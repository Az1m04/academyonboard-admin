import React, { useEffect } from 'react';
import { Form, Button, Select, message, Divider, Timeline } from 'antd';
import { connect, history } from 'umi';
import classes from './index.less';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CheckValidation from '@/components/CheckValidation';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import EmptyState from '@/components/EmptyState';
import AppIcons from '@/utils/AppIcons';
import ReactHtmlParser from 'react-html-parser';
import { debounce } from 'lodash';

dayjs.extend(relativeTime);

const EditLeadOwner = ({ dispatch, staffList, editLead, loading, ownerRecord }) => {
  const [form] = Form.useForm();
  const { Option } = Select;

  const getStaffList = (key) =>
    dispatch({
      type: 'staff/getStaffList',
      payload: {
        query: {
          statusId: 'PARTYINV_ACCEPTED',
          viewSize: 1000,
          keyword: key,
          showAdmin: true,
        },
      },
    });

  const debounceSearch = debounce(getStaffList, 400);

  useEffect(() => {
    getStaffList('');
  }, []);

  const getActivity = () => {
    const query = { activityType: 'lead_owner' };
    if (editLead?.enquiryId) {
      query.enquiryId = editLead?.enquiryId;
    }
    dispatch({
      type: 'leads/getActivity',
      payload: {
        pathParams: { leadId: editLead?.leadId },
        query,
      },
    });
    form.setFieldsValue({
      owner: { id: editLead?.record?.owner?.id },
    });
  };

  useEffect(() => {
    getActivity();
  }, [dispatch, form]);

  const getTimelineIcon = () => {
    return (
      <div
        className="flex items-center justify-center w-8 h-8 text-white rounded-full"
        style={{ backgroundColor: '#ffa500' }}
      >
        <AppIcons.PersonSquare />
      </div>
    );
  };

  const onOwnerSelect = (values) => {
    // eslint-disable-next-line no-console

    dispatch({
      type: 'leads/setLeadOwner',
      payload: {
        body: { ...values, enquiryId: editLead?.enquiryId },
        pathParams: { leadId: editLead?.leadId },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        message.success('You have set owner successfully');
        getActivity();
        history.push('/leads/students/leads/all');
        dispatch({
          type: 'student/getAllStudentList',
          payload: {
            query: {},
          },
        });
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
      <Form form={form} hideRequiredMark autoComplete="off" onFinish={onOwnerSelect}>
        <div className="p-4">
          <span className="block"> Select owner</span>
          <Form.Item
            name={['owner', 'id']}
            rules={[{ required: true, message: 'Please select a owner first' }]}
          >
            <Select
              filterOption={false}
              showSearch
              onSearch={debounceSearch}
              notFoundContent={null}
              style={{ width: '100%' }}
              placeholder="select a owner"
              size="large"
            >
              {staffList?.records?.map((item) => {
                return (
                  <Option key={item?.partyId} value={item?.partyId}>
                    {item?.displayName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </div>
        <Divider style={{ margin: '0' }} />
        <div className="flex justify-end p-4">
          <Button
            size="large"
            onClick={() => {
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
            }}
            className="mr-4"
          >
            Reset
          </Button>

          <Button loading={loading} type="primary" size="large" onClick={() => form.submit()}>
            Set
          </Button>
        </div>
      </Form>

      <div className="flex justify-between p-8 ">
        <span>
          Showing <span className="text-blue-600 pr-1">{ownerRecord?.records?.length}</span>
          of <span className="text-green-600">{ownerRecord?.totalCount}</span>
        </span>
      </div>

      <CheckValidation
        show={ownerRecord?.records?.length > 0}
        fallback={
          <EmptyState
            emptyState={emptyStateSvg}
            emptyHeaderText={<span>No owner have been set yet!</span>}
          />
        }
      />

      <div className={`px-5 ${classes.TimeLineIcon}`}>
        <Timeline className="w-full">
          {ownerRecord?.records?.map((rec) => (
            <>
              <Timeline.Item dot={getTimelineIcon()} key={rec?.ownerId}>
                <div className="flex justify-between pl-6">
                  <div className="flex-wrap w-full">
                    <div className="flex justify-between">
                      <div>
                        <span className="font-semibold text-blue-600">
                          {rec?.author?.displayName}
                        </span>{' '}
                        <span>{rec?.description}</span>
                      </div>
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
                    <div className="w-full richtext-container-div">
                      {ReactHtmlParser(rec?.dataDescription)}
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

export default connect(({ leads, user, loading, staff }) => ({
  editLead: leads?.editLead,
  currentUser: user?.currentUser,
  ownerRecord: leads?.activityRecord,
  staffList: staff.staffList,
  loading: loading?.effects['leads/setLeadOwner'],
}))(EditLeadOwner);
