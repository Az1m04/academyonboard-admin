import CurrencyFormattedInput from '@/components/CurrencyFormattedInput';
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';

const { Option } = Select;

const ServicePricing = ({ form }) => {
  const list = [
    {
      name: 'Per hour',
      id: 'TF_hr',
    },
    {
      name: 'Per day',
      id: 'TF_day',
    },
    {
      name: 'Per week',
      id: 'TF_wk',
    },
    {
      name: 'Per month',
      id: 'TF_mon',
    },
    {
      name: 'Per year',
      id: 'TF_yr',
    },
    {
      name: 'Fixed',
      id: 'TF_fixed',
    },
  ];

  return (
    <div>
      <Row gutter={24}>
        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <Form.Item name="price" label={<span className="formLabel">Price</span>}>
            <CurrencyFormattedInput
              form={form}
              id="price"
              size="large"
              onFocus={(e) => e.target.select()}
              placeholder="₹0.00"
            />
          </Form.Item>
          <Form.Item name="hsn" label={<span className="formLabel">HSN number</span>}>
            <Input size="large" placeholder="Enter HSN number" />
          </Form.Item>
          <Form.Item
            initialValue="TF_day"
            name="quantityUomId"
            label={<span className="formLabel">Cost per service</span>}
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Cost per service can't be blank!",
              },
            ]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              size="large"
            >
              {list?.map((item) => (
                <Option key={item?.id} value={item?.id} label={item?.name}>
                  {item?.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <Form.Item
            name="compareAtPrice"
            label={<span className="formLabel">Compare at price</span>}
          >
            <CurrencyFormattedInput
              form={form}
              id="compareAtPrice"
              size="large"
              onFocus={(e) => e.target.select()}
              placeholder="₹0.00"
            />
          </Form.Item>
          <Form.Item name="gst" initialValue={0} label={<span className="formLabel">GST</span>}>
            <InputNumber
              style={{
                width: '100%',
              }}
              size="large"
              placeholder="5%"
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace('%', '')}
            />
          </Form.Item>
          <Form.Item
            initialValue="SRV_ONLINE"
            name="serviceModeId"
            label={<span className="formLabel">Service mode</span>}
          >
            <Select size="large">
              <Option value="SRV_ONLINE">Online</Option>
              <Option value="SRV_OFFLINE">Offline</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default ServicePricing;
