import React, { useEffect } from 'react';
import { Form, Button, Select, Divider, Timeline, message } from 'antd';
import classes from './index.less';
import dayjs from 'dayjs';
import { connect } from 'umi';
import relativeTime from 'dayjs/plugin/relativeTime';
import CheckValidation from '@/components/CheckValidation';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import EmptyState from '@/components/EmptyState';
import AppIcons from '@/utils/AppIcons';
import ReactHtmlParser from 'react-html-parser';
import { debounce } from 'lodash';

dayjs.extend(relativeTime);
const ClientLeadOwner = ({
  dispatch,
  staffList,
  loading,
  ownerRecord,
  actionKey,
  setActionKey,
  leadData,
}) => {
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
    dispatch({
      type: 'leads/getActivity',
      payload: {
        pathParams: { leadId: actionKey?.id },
        query: { activityType: 'lead_owner' },
      },
    });
    const record = leadData?.find((lead) => lead?.id === actionKey?.id);
    form.setFieldsValue({
      owner: { id: record?.owner?.id },
    });
  };

  useEffect(() => {
    getActivity();
  }, [dispatch, form]);
  const onOwnerSelect = (values) => {
    // eslint-disable-next-line no-console

    dispatch({
      type: 'leads/setLeadOwner',
      payload: {
        body: values,
        pathParams: { leadId: actionKey?.id },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        message.success('You have set owner successfully');
        getActivity();
        setActionKey({ id: null, title: null, subTitle: null, key: null });
        dispatch({
          type: 'student/getAllStudentList',
          payload: {
            query: {},
          },
        });
      } else {
        message.error('Something went wrong !!');
      }
    });
  };
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
  return (
    <>
      <Form form={form} onFinish={onOwnerSelect} hideRequiredMark autoComplete="off">
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
              setActionKey({ id: null, title: null, subTitle: null, key: null });
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

export default connect(({ leads, loading, staff }) => ({
  ownerRecord: leads?.activityRecord,
  staffList: staff.staffList,
  loading: loading?.effects['leads/setLeadOwner'],
  leadData: leads?.clientLeadData?.records,
}))(ClientLeadOwner);
