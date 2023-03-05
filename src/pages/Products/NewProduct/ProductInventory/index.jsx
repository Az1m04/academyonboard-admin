import CheckValidation from '@/components/CheckValidation';
import { Checkbox, Col, Form, Input, InputNumber, Row } from 'antd';

const ProductInventory = ({ form }) => {
  return (
    <div className="">
      <div className="p-4 ">
        <Row gutter={24}>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Form.Item
              name="sku"
              label={<span className="formLabel">SKU (Stock Keeping Unit)</span>}
            >
              <Input placeholder="SKU" size="large" />
            </Form.Item>
          </Col>

          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Form.Item
              name="barcode"
              label={<span className="formLabel">Barcode (ISBN, UPC, GTIN, etc.)</span>}
            >
              <Input placeholder="Barcode" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item noStyle name="trackInventory" label={null} valuePropName="checked">
          <Checkbox>Track quantity</Checkbox>
        </Form.Item>
        <div className="pt-2">
          <Form.Item noStyle name="continueAfterStockOut" label={null} valuePropName="checked">
            <Checkbox>Continue selling when out of stock</Checkbox>
          </Form.Item>
        </div>
      </div>
      <CheckValidation show={form.getFieldValue('trackInventory')}>
        <div className="p-4 border-t">
          <div className="text-black text-sm font-medium">QUANTITY</div>
          <div className="mt-4">
            <Form.Item
              initialValue={0}
              className="mt-4"
              name="quantity"
              label={<span className="formLabel">Available</span>}
            >
              <InputNumber
                size="large"
                min={0}
                style={{
                  width: 300,
                }}
              />
            </Form.Item>
          </div>
        </div>
      </CheckValidation>
    </div>
  );
};

export default ProductInventory;
