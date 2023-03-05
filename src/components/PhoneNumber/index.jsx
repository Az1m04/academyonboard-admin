import React, { useEffect } from 'react';
import { Input, Select, Form } from 'antd';
import Flag from 'react-country-flag';
import { connect } from 'umi';

const cleanInput = (inp) => {
  if (inp) {
    return inp.replace(/(?!-)[^0-9.]/g, '').replace('-', '');
  }
  return '';
};

const { Option } = Select;

const PhoneNumber = (props) => {
  const {
    setCode,
    form,
    name,
    rules,
    countryCode,
    dispatch,
    telephonicCode,
    disabled,
    purpose,
    formType,
    typeEdit,
    clientDisable,
  } = props;
  useEffect(() => {
    dispatch({
      type: 'common/getCountriesList',
    });
    dispatch({
      type: 'common/getTelephonicCode',
    }).then((res) => {
      if (res) {
        if (setCode) {
          const countryTeleCode = res?.data?.filter((item) => item?.countryCode === 'IN');
          setCode(countryTeleCode?.[0]?.teleCode);
        }
      }
    });
  }, [dispatch, setCode]);

  // useEffect(() => {
  //   form.setFieldsValue({
  //     [name[0]]: {
  //       [name[1]]: props?.recordDetails?.mobile
  //         .substring(6, props?.recordDetails?.mobile?.length)
  //         .replace('-', '')
  //         .split('')
  //         .join(''),
  //     },
  //   });
  // }, [props.recordDetails,form,name]);

  const countryChangeHandler = (value) => {
    const countryTeleCode = telephonicCode?.filter((item) => item?.formattedTeleCode === value);
    if (setCode) setCode(countryTeleCode[0]?.teleCode);
    form.setFieldsValue({
      [name[0]]: {
        [name[1]]: undefined,
      },
    });
  };

  const onChange = (e) => {
    const value = cleanInput(e.target.value.toString());
    if (formType === 'studentReferencesForm') {
      const newValues = form.getFieldsValue();
      newValues.References[name[0]].phone.phone = value;
      form.setFieldsValue({ ...newValues });
    }

    if (formType === 'parentDetailsForm') {
      const newValues = form.getFieldsValue();
      newValues.ParentDetails[name[0]].phone.phone = value;
      form.setFieldsValue({ ...newValues });
    }

    if (name?.length === 3) {
      form.setFieldsValue({
        [name[0]]: {
          [name[1]]: {
            [name[2]]: value,
          },
        },
      });
      return;
    }
    form.setFieldsValue({
      [name[0]]: {
        [name[1]]: value,
      },
    });
  };

  return (
    <div className="flex ">
      <Form.Item initialValue="+91" name={countryCode}>
        <Select
          size={`${typeEdit ? 'medium' : 'large'}`}
          style={{ width: '5rem' }}
          getPopupContainer={(node) => node.parentNode}
          onChange={countryChangeHandler}
          disabled={disabled || clientDisable}
        >
          {telephonicCode &&
            telephonicCode.map((country) => {
              return (
                <Option value={country.formattedTeleCode} key={country.countryCode}>
                  <Flag countryCode={country.countryCode} svg /> {country.countryCode}
                </Option>
              );
            })}
        </Select>
      </Form.Item>
      <div className="w-full ">
        <Form.Item name={name} rules={rules}>
          <Input
            autocomplete="off"
            disabled={purpose === 'Add student' ? disabled : props.editable || clientDisable}
            size={`${typeEdit ? 'medium' : 'large'}`}
            {...props}
            maxLength={10}
            onChange={onChange}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default connect(({ common, leads }) => ({
  countriesList: common.countriesList,
  telephonicCode: common.telephonicCode,
  editLead: leads.editLead,
}))(PhoneNumber);
