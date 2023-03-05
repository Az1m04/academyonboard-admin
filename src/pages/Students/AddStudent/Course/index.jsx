/* eslint-disable react/jsx-key */
import { Form, Row, Col, Select, DatePicker } from 'antd';

const CourseDetails = () => {
  // console.log(`form.getFieldsValue();`, form.getFieldsValue());
  const moduleList = [
    {
      id: 'WRITING',
      label: 'Writing',
    },
    {
      id: 'SPEAKING',
      label: 'Speaking',
    },
    {
      id: 'LISTENING',
      label: 'Listening',
    },
    {
      id: 'GRAMMAR',
      label: 'Grammar',
    },
    {
      id: 'SPECIAL_CLASS',
      label: 'Special class',
    },
    {
      id: 'MOCK',
      label: 'Mock',
    },
  ];
  const courseList = [
    {
      id: 'ENG',
      label: 'English',
    },
    {
      id: 'HND',
      label: 'Hindi',
    },
    {
      id: 'PNB',
      label: 'Punjabi',
    },
  ];
  const format = 'MMM, YYYY';
  return (
    <>
      <Row gutter={[24, 12]}>
        <Col lg={12} xl={12} md={12} sm={24} xs={24}>
          <p className="font-medium text-gray-800">Course</p>
          <Form.Item
            name="course"
            rules={[
              {
                required: true,
                message: 'Please select the course',
              },
            ]}
          >
            <Select
              getPopupContainer={(node) => node.parentNode}
              size="large"
              placeholder="Please select the course"
              style={{ width: '100%' }}
            >
              {courseList.map((item) => (
                <Select.Option value={item.id}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col lg={12} xl={12} md={12} sm={24} xs={24}>
          <p className="font-medium text-gray-800">Module</p>
          <Form.Item
            name="module"
            rules={[{ required: true, message: 'Please select the module' }]}
          >
            <Select
              getPopupContainer={(node) => node.parentNode}
              size="large"
              placeholder="Please select the module"
              style={{ width: '100%' }}
            >
              {moduleList.map((item) => (
                <Select.Option value={item.id}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col lg={12} xl={12} md={12} sm={24} xs={24}>
          <p className="font-medium text-gray-800">Joining timeline</p>
          <Form.Item
            name="startDate"
            rules={[{ required: true, message: 'Please select joining month, year' }]}
          >
            <DatePicker
              picker="month"
              getPopupContainer={(node) => node.parentNode}
              format={format}
              size="large"
              placeholder="Joining month, year"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col lg={12} xl={12} md={12} sm={24} xs={24}>
          <p className="font-medium text-gray-800">Ending timeline</p>
          <Form.Item
            name="endDate"
            rules={[{ required: true, message: 'Please select ending month, year' }]}
          >
            <DatePicker
              size="large"
              getPopupContainer={(node) => node.parentNode}
              format={format}
              placeholder="Ending month, year"
              picker="month"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default CourseDetails;
