import React, { useState } from 'react';
import { Input, Row, Col, Form, Select, Switch, Button } from 'antd';
import CheckValidation from '@/components/CheckValidation';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const ClassDetails = ({ allFormValues, form, enableCampus, setEnableCampus, classViewId }) => {
  const [isOtherClassType, setIsOtherClassType] = useState(false);

  const typesOfClass = [
    {
      id: 'NORMAL_ROOM',
      value: 'Normal Room',
    },
    {
      id: 'MEETING_ROOM',
      value: 'Meeting Room',
    },
    {
      id: 'COMPUTER_LAB',
      value: 'Computer Lab',
    },
    {
      id: 'COUNSELLING_ROOM',
      value: 'Counselling Room',
    },
    {
      id: 'OTHER_CLASS_TYPE',
      value: 'Others',
    },
  ];

  const typesOfFacilities = [
    {
      id: 'AC',
      value: 'AC',
    },
    {
      id: 'PROJECTOR',
      value: 'Projector',
    },
    {
      id: 'LCD',
      value: 'LCD',
    },
    {
      id: 'LISTENING_SETUP',
      value: 'Listening Setup',
    },
    {
      id: 'AUDIO_SYSTEM',
      value: ' Audio System',
    },
    {
      id: 'FAN',
      value: 'Fan',
    },
    {
      id: 'WIFI',
      value: 'Wifi',
    },
    {
      id: 'LAN',
      value: 'LAN',
    },
    {
      id: 'POWER_BACKUP',
      value: 'Power Backup',
    },
    {
      id: 'WHITE_BOARD',
      value: 'whiteboard',
    },
    {
      id: 'OTHERS',
      value: 'Others',
    },
  ];

  const TypeForm = (
    <Form.Item
      name="classTypeId"
      rules={[
        {
          required: true,
          message: 'Please select type',
        },
      ]}
      noStyle={isOtherClassType}
    >
      <Select
        getPopupContainer={(node) => node.parentNode}
        style={{ minWidth: '8rem' }}
        size="large"
        placeholder="Select type"
        onSelect={(value) => {
          form.setFieldsValue({
            otherClassType: undefined,
          });
          if (value === 'OTHER_CLASS_TYPE') {
            setIsOtherClassType(true);
          } else if (isOtherClassType) {
            setIsOtherClassType(false);
          }
        }}
        disabled={classViewId && true}
      >
        {typesOfClass?.map((item) => (
          <Option key={item.id}>{item.value}</Option>
        ))}
      </Select>
    </Form.Item>
  );
  return (
    <>
      <div className="text-right">
        <div>
          <span className="pr-2"> Add campus :</span>
          <Switch
            checkedChildren={<p className="font-medium text-gray-800">Yes</p>}
            unCheckedChildren={<p className="font-medium text-gray-800">No</p>}
            checked={enableCampus}
            onChange={(e) => setEnableCampus(e)}
            disabled={classViewId && true}
          />
        </div>
      </div>
      <Row gutter={12}>
        <Col span={6}>
          <p className="font-medium text-gray-800">Name</p>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: 'Please enter name',
              },
            ]}
          >
            <Input
              autocomplete="off"
              size="large"
              placeholder="Class name"
              disabled={classViewId && true}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <CheckValidation show={!isOtherClassType}>
            <p className="font-medium text-gray-800">Type</p>
            {TypeForm}
          </CheckValidation>
          <CheckValidation show={isOtherClassType}>
            <p className="font-medium text-gray-800">Type</p>
            <Form.Item
              name="otherClassType"
              rules={[
                {
                  required: true,
                  message: 'Please enter other type',
                },
              ]}
            >
              <Input
                autocomplete="off"
                type="text"
                size="large"
                addonBefore={TypeForm}
                placeholder="Enter other type..."
                disabled={classViewId && true}
              />
            </Form.Item>
          </CheckValidation>
        </Col>
        {enableCampus && (
          <Col span={6}>
            <p className="font-medium text-gray-800">Campus name</p>
            <Form.Item
              name="campusName"
              rules={[
                {
                  required: true,
                  message: 'Please enter campus name',
                },
              ]}
            >
              <Input
                autocomplete="off"
                size="large"
                placeholder="Campus name"
                disabled={classViewId && true}
              />
            </Form.Item>
          </Col>
        )}
        <Col span={6}>
          <p className="font-medium text-gray-800">Sitting capacity</p>
          <Form.Item
            name="sittingCapacity"
            rules={[
              {
                required: true,
                message: 'Please enter sitting capacity',
              },
            ]}
          >
            <Input
              autocomplete="off"
              type="number"
              min="0"
              size="large"
              placeholder="Sitting capacity"
              disabled={classViewId && true}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <p className="font-medium text-gray-800">Select Floor</p>
          <Form.Item
            name="floor"
            rules={[
              {
                required: true,
                message: 'Please enter floor',
              },
            ]}
          >
            <Input
              autocomplete="off"
              type="number"
              min="0"
              size="large"
              placeholder="Floor"
              disabled={classViewId && true}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <p className="font-medium text-gray-800">Add Facilities</p>
          <Form.Item
            name="facilities"
            rules={[
              {
                required: true,
                message: 'Please add facility',
              },
            ]}
          >
            <Select
              getPopupContainer={(node) => node.parentNode}
              size="large"
              placeholder="Select facility"
              mode="multiple"
              disabled={classViewId && true}
            >
              {typesOfFacilities?.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {allFormValues?.facilities?.includes('OTHERS') ? (
          <Col span={6}>
            <p className="font-medium text-gray-800">Other facility</p>
            <Form.Item
              name="value"
              rules={[
                {
                  required: true,
                  message: 'Please enter other facility',
                },
              ]}
            >
              <Input
                autocomplete="off"
                size="large"
                placeholder="Other facility"
                disabled={classViewId && true}
              />
            </Form.Item>
          </Col>
        ) : null}
      </Row>

      {form.getFieldValue('classTypeId') === 'COMPUTER_LAB' && (
        <Row gutter={12}>
          <Col span={24}>
            <p className="font-medium text-gray-800">Add equipments</p>
            <div className="mt-5">
              <Row gutter={12}>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <p className="font-medium text-gray-800">No of Computers</p>
                  <Form.Item
                    name="noOfComputers"
                    rules={[{ required: true, message: 'Please enter device name' }]}
                  >
                    <Input
                      autocomplete="off"
                      min="0"
                      placeholder="Quantity"
                      size="large"
                      disabled={classViewId && true}
                    />
                  </Form.Item>
                </Col>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <p className="font-medium text-gray-800">No of Printers</p>
                  <Form.Item
                    name="noOfPrinters"
                    rules={[{ required: true, message: 'Please enter device name' }]}
                  >
                    <Input
                      autocomplete="off"
                      min="0"
                      placeholder="Quantity"
                      size="large"
                      disabled={classViewId && true}
                    />
                  </Form.Item>
                </Col>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <p className="font-medium text-gray-800">No of Laptop</p>
                  <Form.Item
                    name="noOfLaptops"
                    rules={[{ required: true, message: 'Please enter device name' }]}
                  >
                    <Input
                      autocomplete="off"
                      min="0"
                      placeholder="Quantity"
                      size="large"
                      disabled={classViewId && true}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.List name="numberOfEquipments">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Row gutter={12} key={key}>
                        <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                          <p className="font-medium text-gray-800">Name</p>
                          <Form.Item
                            {...restField}
                            name={[name, 'attrName']}
                            rules={[{ required: true, message: 'Please enter device name' }]}
                          >
                            <Input
                              autocomplete="off"
                              size="large"
                              placeholder="Device name"
                              disabled={classViewId && true}
                            />
                          </Form.Item>
                        </Col>

                        <Col xl={11} lg={11} md={11} sm={22} xs={22}>
                          <p className="font-medium text-gray-800">Quantity</p>
                          <Form.Item
                            {...restField}
                            name={[name, 'attrVal']}
                            rules={[{ required: true, message: 'Please enter quantity' }]}
                          >
                            <Input
                              autocomplete="off"
                              type="number"
                              min="0"
                              size="large"
                              placeholder="Quantity"
                              disabled={classViewId && true}
                            />
                          </Form.Item>
                        </Col>
                        <Col xl={2} lg={2} md={2} sm={2} xs={2}>
                          <div className="flex justify-center h-full align-center">
                            <MinusCircleOutlined
                              style={{ paddingTop: '34px' }}
                              onClick={() => remove(name)}
                              disabled={classViewId && true}
                            />
                          </div>
                        </Col>
                      </Row>
                    ))}

                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                        disabled={classViewId && true}
                      >
                        Add another
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>{' '}
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ClassDetails;
