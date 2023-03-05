import { currencyFormatter, currencyParser } from '@/utils/utils';
import { Form, Input, InputNumber } from 'antd';
import React from 'react';

const VariantItem = ({ index, name, form, details }) => {
  return (
    <div key={`V_${index}`} className="flex justify-between p-4">
      <div className="text-center flex justify-center items-center">{name}</div>
      <div>
        <Form.Item
          initialValue={details?.price ? currencyFormatter.format(details?.price) : '₹0.00'}
          noStyle
          name={['variantPrice', index]}
          label={null}
        >
          <Input
            style={{
              width: 100,
              borderRadius: 6,
            }}
            size="large"
            onFocus={(e) => e.target.select()}
            placeholder="₹0.00"
            autoComplete="off"
            className="text-right"
            onBlur={(event) => {
              let i = 0;
              let res = event.target.value
                // replace the dots with empty string if value contains more than one dot
                // leave first decimal
                .replace(/\./g, () => {
                  i += 1;
                  return i >= 2 ? '' : '.';
                })
                // replace the commas too with empty string if have any
                .replace(/,/g, '');
              let mod;
              if (res) {
                res = res[0] === '₹' ? res.substring(1, res.length).trim() : res;
                mod = Number(res).toFixed(2);
              } else {
                mod = event.target.value;
              }
              form.setFieldsValue({
                variantPrice: {
                  [index]: currencyFormatter.format(currencyParser(mod)),
                },
              });
            }}
          />
        </Form.Item>
      </div>
      <div>
        <Form.Item
          noStyle
          name={['variantQuantity', index]}
          label={null}
          initialValue={details ? details?.quantity : 0}
        >
          <InputNumber
            style={{
              borderRadius: 6,
            }}
            placeholder="0"
            size="large"
            min={0}
          />
        </Form.Item>
      </div>
      <div>
        <Form.Item initialValue={details?.sku} noStyle name={['variantSku', index]} label={null}>
          <Input
            style={{
              width: 100,
              borderRadius: 6,
            }}
            placeholder=""
            size="large"
          />
        </Form.Item>
      </div>
      <div>
        <Form.Item
          initialValue={details?.barcode}
          noStyle
          name={['variantBarcode', index]}
          label={null}
        >
          <Input
            style={{
              width: 100,
              borderRadius: 6,
            }}
            placeholder=""
            size="large"
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default VariantItem;
