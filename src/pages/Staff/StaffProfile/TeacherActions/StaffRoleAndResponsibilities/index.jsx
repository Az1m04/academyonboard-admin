import { Divider, Table } from 'antd';
import { connect, useParams } from 'umi';
import React, { useEffect } from 'react';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';

const StaffRoleAndResponsibilities = ({
  dispatch,
  getRoleAndResponsibilities,
  loadingForGetData,
}) => {
  const { staffId } = useParams();
  const columns = [
    {
      title: 'Sr no.',
      dataIndex: 'srNo',
      key: 'srNo',
      width: 90,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Staff Responsibilities',
      dataIndex: 'staffResponsibilities',
      key: 'staffResponsibilities   ',
      render: (__, record) => <div>{record?.description}</div>,
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'staff/getRoleAndResponsibilities',
      payload: {
        pathParams: { staffId },
      },
    });
  }, []);

  return (
    <div>
      <div className="mt-5">
        <div className="flex justify-between">
          <div className="text-blue-700 font-medium text-xl">Role and Responsibilities</div>
        </div>
        <Divider style={{ marginTop: '0.6rem' }} />
        <div className="mr-5 ">
          <Table
            pagination={true}
            dataSource={getRoleAndResponsibilities?.responsibilities}
            loading={loadingForGetData}
            style={{ marginTop: '20px' }}
            bordered
            scroll={{ x: 500 }}
            columns={columns}
            locale={{
              emptyText: (
                <>
                  <EmptyState
                    emptyState={emptyStateSvg}
                    emptyHeaderText={<span>No Data found yet!</span>}
                  />
                </>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(({ staff, loading }) => ({
  getRoleAndResponsibilities: staff?.getRoleAndResponsibilities,
  loadingForGetData: loading?.effects['staff/getRoleAndResponsibilities'],
}))(StaffRoleAndResponsibilities);
