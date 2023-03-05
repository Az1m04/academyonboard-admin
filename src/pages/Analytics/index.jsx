import { CalendarOutlined } from '@ant-design/icons';
import { Col, Dropdown, Row, Statistic, Form, Select, DatePicker, Checkbox, Button } from 'antd';
import React, { Suspense, useState } from 'react';

const LineGraph = React.lazy(() => import('./LineGraph'));
const { RangePicker } = DatePicker;

const list = [
  {
    name: 'Today',
    value: 'Today',
  },
  {
    name: 'Yesterday',
    value: 'Yesterday',
  },
  {
    name: 'Last 7 days',
    value: '7days',
  },
  {
    name: 'Last 30 days',
    value: '30days',
  },
  {
    name: 'Last 90 days',
    value: '90days',
  },
  {
    name: 'Last month',
    value: 'last_month',
  },
  {
    name: 'Last year',
    value: 'last_year',
  },
  {
    name: 'Week to date',
    value: 'week_to_date',
  },
  {
    name: 'Month to date',
    value: 'month_to_date',
  },
  {
    name: 'Quatar to date',
    value: 'quater_to_date',
  },
  {
    name: 'Year to date',
    value: 'year_to_date',
  },
  {
    name: '1st Quarter (2021)',
    value: '1quarter_2021',
  },
  {
    name: '4th Quarter (2020)',
    value: '4quarter_2020',
  },
  {
    name: '3rd Quarter (2020)',
    value: '3quarter_2020',
  },
  {
    name: '2nd Quarter (2020)',
    value: '2quarter_2020',
  },
];

const Analytics = () => {
  const [showCompare, setShowCompare] = useState(true);
  return (
    <div
      style={{
        maxWidth: '70.8rem',
        marginTop: '1rem',
        marginRight: 'auto',
        marginLeft: 'auto',
      }}
      className="container mx-auto"
    >
      <div className="font-semibold text-xl py-2">Overview dashboard</div>
      <div className="py-2 ">
        <Dropdown
          trigger={['click']}
          //   visible
          overlay={
            <div className="bg-white shadow rounded w-96">
              <div className="px-4 pt-4">
                <Form
                  initialValues={{ compare_to: 'previous' }}
                  layout="vertical"
                  autoComplete="off"
                  name="rangeform"
                  requiredMark={false}
                >
                  <Form.Item initialValue="Today" name="date_range" label="Date range">
                    <Select size="large">
                      {list.map((item) => (
                        <Select.Option key={item.value}>{item.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name="starting_range" label="Starting">
                    <RangePicker size="large" style={{ width: '100%' }} />
                  </Form.Item>
                  <div className="mb-4">
                    <Checkbox
                      checked={showCompare}
                      onChange={(value) => setShowCompare(value.target.checked)}
                    >
                      Compare to previous dates
                    </Checkbox>
                  </div>
                  {showCompare && (
                    <Form.Item name="compare_to" label="Compare to">
                      <Select size="large">
                        <Select.Option value="previous">Pervious period</Select.Option>
                      </Select>
                    </Form.Item>
                  )}
                </Form>
              </div>
              <div className="flex justify-between border-t px-4 py-4">
                <Button>Cancel</Button>
                <Button type="primary">Apply</Button>
              </div>
            </div>
          }
        >
          <span className="bg-white hover:bg-gray-100 cursor-pointer border px-4 pt-1 pb-2 rounded font-semibold">
            <CalendarOutlined /> Today
          </span>
        </Dropdown>
        <span className="px-2">compared to 17 Apr 2021</span>
      </div>
      <div className="pt-3">
        <Row gutter={12}>
          <Col xl={8} lg={8} md={24} sm={24} xs={24}>
            <div className="shadow bg-white rounded p-4">
              <span className="font-semibold text-base border-b border-dashed text-black">
                Total sales
              </span>
              <div className="flex justify-between items-center py-2">
                <Statistic
                  valueStyle={{ fontSize: 24, fontWeight: '600' }}
                  precision={2}
                  value={10000000}
                  prefix="₹"
                />
                <div className="font-bold text-xl">-</div>
              </div>
              <div className="mt-4">
                <span className="font-medium uppercase text-xs border-b border-dashed text-black">
                  Sales over time
                </span>
                <div className="mt-4">
                  <Suspense fallback={<div>Loading...</div>}>
                    <LineGraph />
                  </Suspense>
                </div>
              </div>
            </div>
          </Col>
          <Col xl={8} lg={8} md={24} sm={24} xs={24}>
            <div className="shadow bg-white rounded p-4">
              <span className="font-semibold text-base border-b border-dashed text-black">
                Total orders
              </span>
              <div className="flex justify-between items-center py-2">
                <Statistic valueStyle={{ fontSize: 24, fontWeight: '600' }} value={17600} />
                <div className="font-bold text-xl">-</div>
              </div>
              <div className="mt-4">
                <span className="font-medium uppercase text-xs border-b border-dashed text-black">
                  Orders over time
                </span>
                <div className="mt-4">
                  <Suspense fallback={<div>Loading...</div>}>
                    <LineGraph />
                  </Suspense>
                </div>
              </div>
            </div>
          </Col>
          <Col xl={8} lg={8} md={24} sm={24} xs={24}>
            <div className="shadow bg-white rounded p-4">
              <span className="font-semibold text-base border-b border-dashed text-black">
                Payments
              </span>
              <div className="flex justify-between items-center py-2">
                <Statistic
                  valueStyle={{ fontSize: 24, fontWeight: '600' }}
                  precision={2}
                  value={10000000}
                  prefix="₹"
                />
                <div className="font-bold text-xl">-</div>
              </div>
              <div className="mt-4">
                <span className="font-medium uppercase text-xs border-b border-dashed text-black">
                  Payments over time
                </span>
                <div className="mt-4">
                  <Suspense fallback={<div>Loading...</div>}>
                    <LineGraph />
                  </Suspense>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Analytics;
