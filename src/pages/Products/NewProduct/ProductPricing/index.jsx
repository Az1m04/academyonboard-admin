import CurrencyFormattedInput from '@/components/CurrencyFormattedInput';
import { currencyFormatter, decodeDollarsToDigits } from '@/utils/utils';
import { Col, Form, Input, InputNumber, Row } from 'antd';

const ProductPricing = ({ form }) => {
  const renderProfit = () => {
    const price = form.getFieldValue('price');
    const cost = form.getFieldValue('unitPrice');

    if (price && cost) {
      let priceValue = price;
      let constValue = cost;
      if (price.includes('₹')) {
        priceValue = parseFloat(decodeDollarsToDigits(price));
      }
      if (cost.includes('₹')) {
        constValue = parseFloat(decodeDollarsToDigits(cost));
      }
      const res = priceValue - constValue;
      return currencyFormatter.format(res);
    }
    return '-';
  };

  const renderMargin = () => {
    const price = form.getFieldValue('price');
    const cost = form.getFieldValue('unitPrice');

    if (price && cost) {
      let priceValue = price;
      let constValue = cost;
      if (price.includes('₹')) {
        priceValue = parseFloat(decodeDollarsToDigits(price));
      }
      if (cost.includes('₹')) {
        constValue = parseFloat(decodeDollarsToDigits(cost));
      }
      const profit = priceValue - constValue;
      const res = (profit / priceValue) * 100;
      return `${res.toFixed(2)}%`;
    }
    return '-';
  };

  return (
    <div>
      <Row gutter={24}>
        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <Form.Item
            name="price"
            label={<span className="formLabel">Price</span>}
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Price can't be blank!",
              },
            ]}
          >
            <CurrencyFormattedInput
              form={form}
              id="price"
              size="large"
              onFocus={(e) => e.target.select()}
              placeholder="₹0.00"
            />
          </Form.Item>
          <Form.Item
            extra="Customer's won't see this"
            name="unitPrice"
            label={<span className="formLabel">Cost per item</span>}
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Cost per item can't be blank!",
              },
            ]}
          >
            <CurrencyFormattedInput
              form={form}
              id="unitPrice"
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
          <div className="p-2 mb-10 pt-6 mt-2 flex justify-between ">
            <div>
              <div className="text-gray-500">Margin</div>
              <div className="text-gray-500 text-base">{renderMargin()}</div>
            </div>
            <div className="pr-4">
              <div className="text-gray-500"> Profit</div>
              <div className="text-gray-500 text-base">{renderProfit()}</div>
            </div>
          </div>
          <Form.Item name="hsn" label={<span className="formLabel">HSN number</span>}>
            <Input size="large" placeholder="Enter HSN number" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default ProductPricing;
