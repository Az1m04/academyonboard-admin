/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import { AutoComplete, Col, Form, Input, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';

const { Option } = Select;

// eslint-disable-next-line no-undef
const map = new google.maps.Map(document.getElementById('map'));
// eslint-disable-next-line no-undef
const googleInstance = new google.maps.places.AutocompleteService();
// eslint-disable-next-line no-undef
const placesService = new google.maps.places.PlacesService(map);

const Address = (props) => {
  const {
    form,
    studentEdit,
    dispatch,
    countries = [{ code: 'IN', id: 'IND', name: 'India' }],
    countriesList,
    type,
    selectedCountry,
    mainHeading,
    secondaryHeadingVisibility,
    pinCodeHeading,
    stateHeading,
    onCountryChange,
    setOnCountryChange,
    purpose,
    disabled,
    staffEdit,
    clientDisable,
  } = props;

  const [suggestedAddress, setSuggestedAddress] = useState([]);
  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      const context = this;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    };
  }
  const action = (text) => {
    googleInstance.getPredictions({ input: text }, (predictions) => {
      setSuggestedAddress(predictions);
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = React.useCallback(debounce(action, 400), []);

  const [provinces, setProvinces] = useState([]);

  const componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'short_name',
    postal_code: 'short_name',
  };

  useEffect(() => {
    dispatch({
      type: 'common/getCountriesList',
    });
  }, [dispatch, selectedCountry]);

  useEffect(() => {
    // form.setFieldsValue({
    //   [type]: {
    //     countryCode: countries[0]?.code,
    //   },
    // });

    setProvinces(countriesList?.find((data) => data?.id === onCountryChange)?.provinces);
  }, [selectedCountry, type, form, countries, onCountryChange, countriesList]);

  const getAddressFieldsFromGoogle = async (placeId, cb) => {
    let finalData = {};
    placesService.getDetails({ placeId }, ({ address_components }) => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < address_components.length; i++) {
        const addressType = address_components[i].types[0];
        if (componentForm[addressType]) {
          const val = address_components[i][componentForm[addressType]];
          finalData = { ...finalData, [addressType]: val };
        }
        if (address_components.length - 1 === i) {
          cb(finalData);
        }
      }
    });
  };

  return (
    <div>
      <div className="formLabel">{mainHeading || 'Address line 1'}</div>

      <Form.Item
        name={[type, 'addressLine1']}
        rules={
          mainHeading && mainHeading.includes('Optional')
            ? null
            : [
                {
                  required: true,
                  message: 'Please enter your address',
                },
              ]
        }
      >
        <AutoComplete
          getPopupContainer={(node) => node.parentNode}
          size={studentEdit || staffEdit ? 'medium' : 'large'}
          onSearch={debounceSearch}
          {...props}
          options={
            suggestedAddress &&
            suggestedAddress.map(({ place_id, description }) => ({
              valueJson: { id: place_id, description },
              value: description,
              text: description,
            }))
          }
          disabled={clientDisable}
          onChange={() => form.setFieldsValue({ [type]: { stateCode: undefined } })}
          onSelect={async (e, optionData) => {
            const obj = optionData.valueJson;
            getAddressFieldsFromGoogle(obj.id, (addressFieldsByGoogle) => {
              const foundCountry = countriesList?.filter(
                (c) => c?.code === addressFieldsByGoogle?.country,
              );
              const countriesCode = foundCountry?.length > 0 ? foundCountry[0]?.id : undefined;
              setOnCountryChange(countriesCode);
              const foundProvince = foundCountry[0]?.provinces?.find(
                (province) => province?.code === addressFieldsByGoogle?.administrative_area_level_1,
              );
              const sCode = foundProvince ? foundProvince?.id : undefined;
              form.setFieldsValue({
                [type]: {
                  city: addressFieldsByGoogle?.locality || addressFieldsByGoogle?.postal_town,
                  postalCode: addressFieldsByGoogle?.postal_code,
                  // addressLine1: addressFieldsByGoogle.street_number
                  //   ? `${addressFieldsByGoogle.street_number}, ${addressFieldsByGoogle.route}`
                  //   : '',
                  countryCode: countriesCode,
                  stateCode: sCode,
                },
              });
              // setProvinces(foundCountry[0].provinces);
              // setSelectedCountry(countryCode);
            });
          }}
        >
          <Input
            placeholder="Street, house no."
            size={studentEdit || staffEdit ? 'medium' : 'large'}
            disabled={(purpose === 'Add student' && disabled) || clientDisable}
          />
        </AutoComplete>
      </Form.Item>
      {secondaryHeadingVisibility && (
        <Form.Item
          name={[type, 'addressLine2']}
          label={<span className="formLabel">Address line 2</span>}
        >
          <Input
            type="text"
            placeholder="Suite, building, apt."
            size={studentEdit || staffEdit ? 'medium' : 'large'}
            disabled={purpose === 'Add student' && disabled}
          />
        </Form.Item>
      )}
      <Row gutter={[12, 0]}>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <div className="formLabel">City</div>
          <Form.Item
            name={[type, 'city']}
            rules={[
              {
                required: true,
                message: 'A valid city name is required',
              },
            ]}
          >
            <Input
              size={studentEdit || staffEdit ? 'medium' : 'large'}
              type="text"
              placeholder="City"
              autoComplete="off"
              disabled={(purpose === 'Add student' && disabled) || clientDisable}
            />
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <div className="formLabel">{pinCodeHeading || 'Zipcode (Optional)'}</div>
          <Form.Item
            name={[type, 'postalCode']}
            rules={
              pinCodeHeading?.includes('Optional')
                ? null
                : [
                    {
                      required: true,
                      message: 'Please enter your PIN code!',
                    },
                  ]
            }
          >
            <Input
              size={studentEdit || staffEdit ? 'medium' : 'large'}
              placeholder="PIN code"
              autoComplete="off"
              disabled={(purpose === 'Add student' && disabled) || clientDisable}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[12, 0]}>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <div className="formLabel">Country</div>
          <Form.Item
            name={[type, 'countryCode']}
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: 'Please select your country',
              },
            ]}
          >
            <Select
              getPopupContainer={(node) => node.parentNode}
              showSearch
              placeholder="Select Your Country"
              size={studentEdit || staffEdit ? 'medium' : 'large'}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
              }
              // onSelect={(countryValue) => {
              //   form.setFieldsValue({ address: { stateCode: '' } });
              //   setSelectedCountry(countryValue);
              //   const foundCountry = countries.filter((c) => c.code === countryValue.split(' ')[0]);
              //   setProvinces(foundCountry.length > 0 ? foundCountry[0].provinces : []);
              // }}
              onChange={(v) => {
                setOnCountryChange(v);
                form.setFieldsValue({
                  [type]: { stateCode: undefined },
                });
              }}
              disabled={(purpose === 'Add student' && disabled) || clientDisable}
            >
              {countriesList?.length > 0
                ? countriesList?.reverse().map((c) => (
                    <Option key={c.id} value={c.id} title={c?.name}>
                      {c?.name}
                    </Option>
                  ))
                : ''}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <div className="formLabel">{stateHeading || 'State'}</div>
          <Form.Item
            name={[type, 'stateCode']}
            rules={[
              {
                required: provinces?.length > 0,
                message: 'Please select your state',
              },
            ]}
          >
            <Select
              getPopupContainer={(node) => node.parentNode}
              showSearch={provinces?.length > 0}
              size={studentEdit || staffEdit ? 'medium' : 'large'}
              placeholder="Select your state"
              notFoundContent="No States found for the selected country"
              // optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
              }
              disabled={(purpose === 'Add student' && disabled) || clientDisable}
            >
              {provinces?.map((province) => (
                <Option
                  key={province?.id}
                  value={province?.id}
                  title={`${province?.code} ${province?.name}`}
                >
                  {province?.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ common }) => ({
  countriesList: common.countriesList,
}))(Address);
