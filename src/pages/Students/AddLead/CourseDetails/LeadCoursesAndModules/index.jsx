import React from 'react';
import { Form, Row, Col, Select, Checkbox } from 'antd';
import { connect } from 'umi';
import CheckValidation from '@/components/CheckValidation';

const LeadCoursesAndModules = ({
  form,
  courseDisplayName,
  id,
  index,
  courseModulesArray,
  dispatch,
  checkBoxMargin,
}) => {
  return (
    <div className="">
      <p className="font-medium text-sm text-gray-800 py-2.5 bg-gray-100 px-4 ">
        {courseDisplayName} course details
      </p>
      <div className="px-4 mt-4">
        <Row gutter={[12]}>
          <Col lg={10} xl={10} md={12} sm={24} xs={24}>
            <p className="font-medium text-gray-800">Course name</p>
            <Form.Item
              name={['items', index, 'productId']}
              rules={[
                {
                  required: true,
                  message: 'Please type name of the course',
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Please list down the course name"
                style={{ width: '100%' }}
                getPopupContainer={(node) => node.parentNode}
              >
                <Select.Option value={id}>{courseDisplayName}</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col lg={4} xl={4} md={12} sm={24} xs={24} className="flex justify-center">
            <Form.Item
              name={['items', index, 'addModulesCheckbox']}
              valuePropName="checked"
              style={{ marginTop: 23, marginLeft: checkBoxMargin }}
            >
              <Checkbox
                disabled={courseModulesArray === undefined}
                onChange={(val) => {
                  const courseItems = form?.getFieldValue('items') || [];
                  courseItems[index] = {
                    ...courseItems[index],
                    addModulesCheckbox: val.target.checked,
                  };
                  form.setFieldsValue({
                    items: courseItems,
                  });

                  dispatch({
                    type: 'student/setStates',
                    payload: {
                      isModulesSelected: val.target.checked,
                    },
                    key: 'courseFee',
                  });
                  if (!val.target.checked) {
                    courseItems[index] = {
                      ...courseItems[index],
                      modulesList: undefined,
                    };
                    form.setFieldsValue({
                      items: courseItems,
                    });
                  }
                }}
              >
                Add modules
              </Checkbox>
            </Form.Item>
          </Col>

          <Col lg={10} xl={10} md={12} sm={24} xs={24}>
            <CheckValidation show={form.getFieldValue(['items', index, 'addModulesCheckbox'])}>
              <p className="font-medium text-gray-800">Modules</p>
              <Form.Item
                name={['items', index, 'modulesList']}
                rules={[
                  {
                    required: true,
                    message: 'Please select the course modules!',
                  },
                ]}
              >
                <Select
                  size="large"
                  mode="tags"
                  placeholder="Please select the course modules"
                  style={{ width: '100%' }}
                  getPopupContainer={(node) => node.parentNode}
                  onChange={(value) => {
                    const allCourses = form.getFieldValue(['items']);
                    const course = allCourses[index];

                    let initialModules = course?.modulesItems || [];

                    if (initialModules?.length < value?.length) {
                      const newModule = {
                        moduleProductId: value[value?.length - 1],
                        moduleId: courseModulesArray?.find(
                          (data) => data?.id === value[value?.length - 1],
                        )?.displayName,
                      };

                      initialModules = [...initialModules, newModule];

                      course.modulesItems = initialModules;
                      allCourses[index] = course;

                      form.setFieldsValue({
                        items: allCourses,
                      });
                    } else {
                      initialModules = initialModules?.filter((data) =>
                        value?.includes(data?.moduleProductId),
                      );

                      initialModules = [...initialModules];
                      course.modulesItems = initialModules;
                      course.adjustmentAmount = undefined;
                      allCourses[index] = course;
                      form.setFieldsValue({
                        items: allCourses,
                      });
                    }
                  }}
                >
                  {courseModulesArray?.map((item) => (
                    <Select.Option value={item?.id} key={item?.id}>
                      {item?.displayName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </CheckValidation>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default connect(({ student }) => ({
  courseFee: student?.courseFee,
}))(LeadCoursesAndModules);
