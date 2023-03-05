import { Divider, Form, Table, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';

const ServiceAfterRegisration = ({ leadSerivcesAfterRegistration, dispatch }) => {
  const [tab, setTab] = useState('COURSES');
  const [registeredServices, setRegisteredServices] = useState({});
  const { TabPane } = Tabs;
  const [afterRegistrateForm] = Form.useForm();
  //   const {leadId}=useParams()
  const tabsPane = [
    {
      tab: <span className="font-semibold">Courses</span>,
      key: 'COURSES',
    },
    {
      tab: <span className="font-semibold">Visa</span>,
      key: 'VISA',
    },
    {
      tab: <span className="font-semibold">Other services</span>,
      key: 'OTHER_SERVICES',
    },
  ];
  const column = [
    {
      title: 'Sr no.',
      dataIndex: 'srno',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Services',
      dataIndex: 'sevices',
      render: () => <div>{tab}</div>,
    },
    {
      title: 'Sub type',
      dataIndex: 'sub_type',
      render: (__, record) => <div>{record?.description}</div>,
    },
    {
      title: 'Other visa services',
      dataIndex: 'other_visa_services',
      render: (__, record) => (
        <div className="w-1/2">
          <div className="flex">
            {record?.subTypes?.map((item) => (
              <div key={item?.id}>
                <p className="border w-max p-0.5 mx-0.5 bg-gray-50">{item?.description}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];
  useEffect(() => {
    dispatch({
      type: 'leads/leadSerivcesAfterRegistration',
      payload: {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //   const servicesData=()=>{
  //     const filterValues=leadSerivcesAfterRegistration?.needTypeList?.filter((item)=>item?.id===tab)
  //     setRegisteredServices(filterValues)
  //   }
  useEffect(() => {
    const filterValues = leadSerivcesAfterRegistration?.needTypeList?.find(
      (item) => item?.id === tab,
    );

    setRegisteredServices(filterValues);
  }, [leadSerivcesAfterRegistration, tab]);

  return (
    <div>
      <div className="mt-4">
        <Form form={afterRegistrateForm} hideRequiredMark>
          <div className="flex justify-between">
            <div>
              <div className="text-blue-700 font-medium text-xl">Services after registered</div>
            </div>
            <div className="flex justify-between gap-5">
              <div>
                {/* <Button type="primary" onClick={() => setIsModalVisible(true)}>
              Apply leave
            </Button> */}
              </div>
              {/* <div className="mr-4">
                <Select placeholder="Select leave type" className="w-40"> */}
              {/* {leaveType?.map((item) => ( */}
              {/* <Select.Option key={item?.typeId} value={item?.typeId}> */}
              {/* {item?.description} */}
              {/* </Select.Option> */}
              {/* ))} */}
              {/* </Select>
              </div> */}
            </div>
          </div>
          <Divider style={{ marginTop: '0.6rem' }} />
          <Tabs
            defaultActiveKey="allNotes"
            activeKey={tab}
            onChange={(val) => {
              setTab(val);
              //   history.push(`/students/${leadId}/${tabname}/${val}`);
            }}
            className="font-semibold text-blue-500"
          >
            {tabsPane?.map((value) => (
              <TabPane
                tab={value?.tab}
                key={value?.key}
                style={{
                  marginBottom: '2.5rem',
                  height: '36rem',
                  overflow: 'auto',
                  padding: '11px',
                }}
              >
                <div className="mr-5 mt-5">
                  <Table
                    dataSource={registeredServices?.subTypes}
                    // className={styles?.tableStyling}
                    columns={
                      tab !== 'VISA'
                        ? column?.filter((col) => col?.dataIndex !== 'other_visa_services')
                        : column
                    }
                    scroll={{ x: 500 }}
                    bordered
                    size="large"
                    style={{ width: '100%', marginTop: '20px' }}
                    locale={{
                      emptyText: (
                        <div className="flex items-center justify-center text-center">
                          <div>
                            <p className="text-lg">No records yet!</p>
                            <img
                              className="ml-16 "
                              src={SearchNotFound}
                              alt="No records found!"
                              style={{ height: '100px' }}
                            />
                          </div>
                        </div>
                      ),
                    }}
                  />
                </div>
              </TabPane>
            ))}
          </Tabs>
        </Form>
      </div>
    </div>
  );
};

export default connect(({ leads }) => ({
  leadSerivcesAfterRegistration: leads?.leadSerivcesAfterRegistration,
}))(ServiceAfterRegisration);
