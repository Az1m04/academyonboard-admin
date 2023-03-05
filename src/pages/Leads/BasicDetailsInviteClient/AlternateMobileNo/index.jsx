import React, { useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import Flag from 'react-country-flag';
import { connect } from 'umi';

const cleanInputChange = (inp) => {
  if (inp) {
    return inp.replace(/(?!-)[^0-9.]/g, '');
  }
  return '';
};
const { Option } = Select;
const AlternateMobileNo = (props) => {
  const { form, name, rules, countryCode, dispatch, countriesList } = props;

  useEffect(() => {
    dispatch({
      type: 'common/getCountriesList',
    });
  }, [dispatch]);

  useEffect(() => {
    form.setFieldsValue({
      [name[0]]: {
        [name[1]]: props.recordDetails?.mobile
          .substring(6, props.recordDetails?.mobile.length)
          .replace('-', '')
          .split('')
          .join(''),
      },
    });
  }, [props.recordDetails, form, name]);

  const onInputChange = (e) => {
    const value = cleanInputChange(e.target.value.toString());

    form.setFieldsValue({
      [name[0]]: {
        [name[1]]: value,
      },
    });
  };
  return (
    <div className="flex ">
      <Form.Item initialValue="IN" name={countryCode}>
        <Select size="large" getPopupContainer={(node) => node.parentNode}>
          {countriesList &&
            countriesList.map((country) => {
              return (
                <Option value={country.code} key={country.id}>
                  <Flag countryCode={country.code} svg /> {country.code}
                </Option>
              );
            })}
        </Select>
      </Form.Item>
      <div className="w-full">
        <Form.Item name={name} rules={rules} getPopupContainer={(node) => node.parentNode}>
          <Input
            size="large"
            maxLength={10}
            onChange={onInputChange}
            disabled={props.editable}
            {...props}
            autoComplete="off"
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default connect(({ common }) => ({
  countriesList: common.countriesList,
}))(AlternateMobileNo);
