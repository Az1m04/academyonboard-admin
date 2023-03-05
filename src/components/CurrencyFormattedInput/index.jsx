import React from 'react';
import { Input } from 'antd';
import { currencyFormatter, currencyParser } from '@/utils/utils';

const CurrencyFormattedInput = (props) => (
  <Input
    {...props}
    autoComplete="off"
    className="text-right"
    onBlur={(event) => {
      if (props.form) {
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
        props.form.setFieldsValue({
          [props.id]: currencyFormatter.format(currencyParser(mod)),
        });
      }
    }}
  />
);
export default CurrencyFormattedInput;
