/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Select, Form, Input } from 'antd';
import Flag from 'react-country-flag';
import { connect } from 'umi';

const { Option } = Select;

const WhatsAppPhoneNumber = (props) => {
  const { form, data, countryCode, dispatch, countriesList } = props;

  const [code, setCode] = useState('');

  useEffect(() => {
    form.setFieldsValue({
      [props.countryCode[0]]: {
        [props.countryCode[1]]: code,
      },
    });
  }, [code]);

  useEffect(() => {
    form.setFieldsValue({
      contacts: {
        [props.name]: props?.data[0]?.formattedPhone
          ?.slice(
            props?.data[0]?.formattedPhone.indexOf(' '),
            props?.data[0]?.formattedPhone?.length,
          )
          ?.replace(/\s+/g, '')
          ?.replace(/[^a-zA-Z0-9 ]/g, ''),
      },
    });
  }, [props]);

  useEffect(() => {
    dispatch({
      type: 'common/getCountriesList',
    });
    dispatch({
      type: 'common/getTelephonicCode',
    }).then((res) => {
      if (res) {
        const countryTeleCode = res?.data?.filter(
          (item) =>
            Number(item.teleCode) ===
            Number(
              props?.data[0]?.formattedPhone?.substr(
                1,
                props?.data[0]?.formattedPhone?.indexOf(' '),
              ),
            ),
        );

        setCode(countryTeleCode?.[0]?.countryCode);
      }
    });
  }, [dispatch, data, form]);
  return (
    <div className="flex">
      <div style={{ flex: '1 1 8%' }}>
        <Form.Item initialValue="IN" name={countryCode}>
          <Select
            disabled
            size="large"
            style={{ width: '5rem' }}
            getPopupContainer={(node) => node.parentNode}
            // onChange={countryChangeHandler}
          >
            {countriesList &&
              countriesList.map((country) => {
                return (
                  <Option key={country?.code} value={country?.code}>
                    <Flag countryCode={country?.code} svg /> {country?.code}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
      </div>
      <div style={{ flex: '1 1 85%' }}>
        <Form.Item
          form={form}
          name={['contacts', props.name]}
          rules={[
            {
              required: true,
              message: 'Please enter or select phone number',
            },
          ]}
        >
          <Input disabled />
        </Form.Item>
      </div>
    </div>
  );
};

export default connect(({ common }) => ({
  countriesList: common.countriesList,
  telephonicCode: common.telephonicCode,
}))(WhatsAppPhoneNumber);
