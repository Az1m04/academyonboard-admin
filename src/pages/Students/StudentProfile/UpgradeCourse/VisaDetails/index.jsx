import React, { useEffect } from 'react';
import { Form, Row, Col, Input, Select } from 'antd';
import classNames from 'classnames';
import { connect } from 'umi';
import styles from '../index.less';

const VisaDetails = ({
  form,
  dispatch,
  getValues,
  countries,
  visaCategory,
  setVisaCategory,
  displayOtherVisaDropBox,
  setDisplayOtherVisaDropBox,
  visaOption,
  setVisaOption,
  otherVisaSetting,
  setOtherVisaSetting,
}) => {
  useEffect(() => {
    dispatch({
      type: 'common/getCountriesList',
    });
  }, [dispatch]);

  const visaDetails = [
    {
      id: 'STUDENT_VISA',
      label: 'Student Visa ',
    },
    {
      id: 'VISITOR_VISA',
      label: 'Visitor Visa ',
    },
    {
      id: 'OTHER_VISA_SERVICES',
      label: 'Other Visa Services ',
    },
  ];

  const categoryList = [
    {
      id: 'PR',
      label: 'PR',
    },
    {
      id: 'WORK',
      label: 'Work',
    },
    {
      id: 'IMMIGRATION',
      label: 'Immigration',
    },
    { id: 'OTHER_VISA', label: 'Others' },
  ];

  const otherVisaServices = (val) => {
    setVisaOption(val);
    form.setFieldsValue({
      country: undefined,
    });
  };

  if (otherVisaSetting) {
    form.setFieldsValue({
      otherVisaCategory: 'OTHER_VISA',
    });
  }

  useEffect(() => {
    if (visaCategory) {
      form.setFieldsValue({
        visa: visaCategory,
      });
    }
    if (visaOption) {
      form.setFieldsValue({
        visa_category: visaOption,
      });
    }
  }, [visaOption, form, visaCategory]);

  const prefixCategorySelector = (
    <Form.Item name="otherVisaCategory" initialValue="OTHER_VISA" style={{ margin: '0' }}>
      <Select
        showSearch
        size="large"
        style={{ width: '110px' }}
        className={classNames(styles?.selectStyling)}
        placeholder="Enter other visa category"
        getPopupContainer={(node) => node.parentNode}
        onSelect={(val) => {
          if (val === 'OTHER_VISA') {
            setDisplayOtherVisaDropBox(true);
          } else {
            setDisplayOtherVisaDropBox(false);
            form.setFieldsValue({
              category_other: '',
            });
          }
        }}
        onChange={(value) => setVisaOption(value)}
      >
        {categoryList &&
          categoryList?.map((element) => (
            <Select.Option key={element?.id} value={element?.id}>
              {element?.label}
            </Select.Option>
          ))}
      </Select>
    </Form.Item>
  );

  useEffect(() => {
    getValues();
  }, [form, getValues]);

  const visaDetailsChange = (value) => {
    setVisaCategory(value);
    setDisplayOtherVisaDropBox(false);
    setVisaOption([]);
    form.setFieldsValue({
      visa_category: undefined,
      category_other: undefined,
      country: undefined,
      otherVisaCategory: undefined,
    });
  };

  return (
    <div className="mt-5">
      <Row gutter={[12]}>
        <Col lg={12} xl={12} md={12} sm={24} xs={24}>
          <p className="font-medium text-gray-800">Visa</p>
          <Form.Item
            name="visa"
            rules={[
              {
                required: true,
                message: 'Please select the visa',
              },
            ]}
          >
            <Select
              size="large"
              placeholder="Please select the visa"
              style={{ width: '100%' }}
              getPopupContainer={(node) => node.parentNode}
              onChange={visaDetailsChange}
            >
              {visaDetails?.map((item) => (
                <Select.Option value={item?.id} label={item?.label} key={item?.id}>
                  {item?.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {visaCategory?.includes('OTHER_VISA_SERVICES') && (
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            {!displayOtherVisaDropBox ? (
              <>
                <p className="font-medium text-gray-800">Choose category </p>
                <Form.Item
                  name="visa_category"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the category',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Please select the category"
                    style={{ width: '100%' }}
                    getPopupContainer={(node) => node.parentNode}
                    onChange={otherVisaServices}
                    onSelect={(val) => {
                      if (val === 'OTHER_VISA') {
                        setVisaOption([]);
                        setOtherVisaSetting(true);
                        setDisplayOtherVisaDropBox(true);
                      } else setDisplayOtherVisaDropBox(false);
                    }}
                  >
                    {categoryList?.map((item) => (
                      <Select.Option value={item?.id} key={item?.id}>
                        {item?.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            ) : (
              <>
                <p className="font-medium text-gray-800">Choose category</p>
                <Form.Item
                  name="category_other"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter other visa',
                    },
                  ]}
                >
                  <Input
                    type="text"
                    size="large"
                    addonBefore={prefixCategorySelector}
                    placeholder="Enter other visa category"
                    autoComplete="off"
                  />
                </Form.Item>
              </>
            )}
          </Col>
        )}
        {(visaCategory?.includes('STUDENT_VISA') ||
          visaCategory?.includes('VISITOR_VISA') ||
          visaOption?.includes('IMMIGRATION')) && (
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            <>
              <p className="font-medium text-gray-800">Country </p>
              <Form.Item
                name="country"
                rules={[
                  {
                    required: true,
                    message: 'Please select the country',
                  },
                ]}
              >
                <Select
                  getPopupContainer={(node) => node.parentNode}
                  size="large"
                  showSearch
                  placeholder="Please select the country"
                  notFoundContent="No Countries Found"
                  style={{ width: '100%' }}
                  filterOption={(input, option) =>
                    option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
                  }
                >
                  {countries?.map((item) => (
                    <Select.Option value={item?.name} key={item?.name}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default connect(({ common }) => ({
  countries: common.countriesList,
}))(VisaDetails);
