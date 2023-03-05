import CheckValidation from '@/components/CheckValidation';
import EmptyState from '@/components/EmptyState';
import { Spin, Timeline } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import ReactHtmlParser from 'react-html-parser';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import moment from 'moment';

const StaffActivityLog = ({ dispatch, staffId, getStaffActivity, loadingForGetDetials }) => {
  useEffect(() => {
    dispatch({
      type: 'staff/getStaffActivity',
      payload: { pathParams: { staffId } },
    });
  }, [dispatch, staffId]);

  return (
    <div>
      <div>
        <Spin spinning={Boolean(loadingForGetDetials)}>
          <div className="my-5 text-md font-semibold">Activity logs</div>
          <div className="flex justify-between ">
            <span>
              Showing{' '}
              <span className="text-blue-600 pr-1">{getStaffActivity?.records?.length || 0}</span>
              of <span className="text-green-600">{getStaffActivity?.totalCount || 0}</span>
            </span>
          </div>

          <CheckValidation
            show={getStaffActivity?.records?.length > 0}
            fallback={
              <EmptyState
                emptyState={emptyStateSvg}
                emptyHeaderText={<span>No activity log found yet!</span>}
              />
            }
          />
          <div className={`px-5 mt-5`}>
            <Timeline className="w-full">
              {getStaffActivity?.records?.map((rec) => (
                <>
                  <Timeline.Item>
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
                                {rec?.startTime && moment(rec?.startTime).fromNow()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          <p className="m-0">
                            {rec?.startTime && moment(rec?.startTime).format('MMM D, YYYY')} at{' '}
                            {rec?.startTime && moment(rec?.startTime).format('h:mm A')}
                          </p>
                        </div>
                        <div className="w-10 rich text-container-div">
                          {ReactHtmlParser(rec?.dataDescription)}
                        </div>
                      </div>
                    </div>
                  </Timeline.Item>
                </>
              ))}
            </Timeline>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default connect(({ staff, loading }) => ({
  getStaffActivity: staff?.getStaffActivity,
  loadingForGetDetials: loading?.effects['staff/getStaffActivity'],
}))(StaffActivityLog);
