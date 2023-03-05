/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@/components/BreadCrumbs';
import Page from '@/components/Page';
import {
  Avatar,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Popover,
  Radio,
  Row,
  Select,
  Tag,
  Upload,
  message,
  Spin,
  Modal,
  Button,
} from 'antd';
import { getInitials } from '@/utils/common';
import { connect, useParams, history } from 'umi';
import { getWeekNumber, priority, TimeDuration } from '@/components/AddTaskModal';
import moment from 'moment';
import FixedFooter from '@/components/FixedFooter';

const { TextArea } = Input;
const { Dragger } = Upload;
const recurrenceDays = [
  {
    id: 1,
    name: 'Sun',
    value: 'SUN',
  },
  {
    id: 2,
    name: 'Mon',
    value: 'MON',
  },
  {
    id: 3,
    name: 'Tue',
    value: 'TUE',
  },
  {
    id: 4,
    name: 'Wed',
    value: 'WED',
  },
  {
    id: 5,
    name: 'Thus',
    value: 'THU',
  },
  {
    id: 6,
    name: 'Fri',
    value: 'FRI',
  },
  {
    id: 7,
    name: 'Sat',
    value: 'SAT',
  },
];
const repeatOn = [
  {
    id: 1,
    name: 'day',
    value: 'DAILY',
  },
  {
    id: 2,
    name: 'week',
    value: 'WEEKLY',
  },
  {
    id: 3,
    name: 'month',
    value: 'MONTHLY',
  },
  {
    id: 4,
    name: 'year',
    value: 'YEARLY',
  },
];
const EditTask = ({
  dispatch,
  branchList,
  departmentList,
  staffList,
  studentsList,
  currentUser,
  orgMemberList,
  loading,
}) => {
  const [updateTaskForm] = Form.useForm();
  const [customRecurrenceForm] = Form.useForm();
  const { editTask, viewTask } = useParams();
  const [isDepartmentInclude, setIsDepartmentInclude] = useState(false);
  const [isStaffInclude, setIsStaffInclude] = useState(false);
  const [isRecurrenceVisible, setIsRecurrenceVisible] = useState(false);
  const [repeatEnds, setRepeatEnds] = useState('never');
  const [repeatCount, setRepeatCount] = useState(1);
  const [disableStudentTypeField, setDisableStudentTypeField] = useState(false);
  const [recurrencePayload, setRecurrencePayload] = useState();
  const [repeatOption, setRepeatOption] = useState('WEEKLY');
  const [leadType, setLeadType] = useState('LEAD');
  const [searchStudentBy, setSearchStudentBy] = useState('COURSES');
  const [keyword, setKeyword] = useState();
  const [followerKeyword, setFollowerKeyword] = useState();
  const [contentsForTask, setContentsForTask] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  let weeks = moment().weeks() - moment().startOf('month').weeks() + 1;
  weeks = (weeks + 52) % 52;
  const createRecurrencePayload = (value) => {
    switch (value) {
      case 'DAILY':
        return setRecurrencePayload({
          isRecurrence: true,
          recurrence: {
            recurrenceType: value,
            repetitionType: value,
            repetitionFrequency: 1,
            startDate: moment().toISOString(),
            isEnds: false,
          },
        });
      case 'WEEKLY':
        return setRecurrencePayload({
          isRecurrence: true,
          recurrence: {
            recurrenceType: value,
            repetitionType: value,
            repetitionOn: [moment().format('ddd').toUpperCase()],
            repetitionFrequency: 1,
            startDate: moment().toISOString(),
            isEnds: false,
          },
        });
      case 'MONTHLY':
        return setRecurrencePayload({
          isRecurrence: true,
          recurrence: {
            recurrenceType: value,
            repetitionType: value,
            repetitionOn: [moment().format('ddd').toUpperCase()],
            repetitionFrequency: 1,
            repetitionOnType: 'DAY',
            repeatByDay: weeks,
            startDate: moment().toISOString(),
            isEnds: false,
          },
        });
      case 'YEARLY':
        return setRecurrencePayload({
          isRecurrence: true,
          recurrence: {
            startDate: '2022-02-11T04:40:52.040Z',
            recurrenceType: 'YEARLY',
            isEnds: false,
            repetitionFrequency: 1,
            repetitionType: 'YEARLY',
            repetitionOnType: 'DATE',
          },
        });
      default:
        break;
    }
  };
  const getFollowerList = () => {
    dispatch({
      type: 'staff/getOrgMemberList',
      payload: {
        query: {
          keyword: followerKeyword,
          viewSize: 200000,
        },
        pathParams: {
          clientId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
        },
      },
    });
  };
  const getStudents = (leadTypeId, searchBy, keywordSearch) => {
    dispatch({
      type: 'tasks/getStudentsList',
      payload: {
        query: {
          leadTypeId,
          searchBy,
          keyword: keywordSearch,
        },
      },
    });
  };
  const populateTaskData = () => {
    dispatch({
      type: 'tasks/singleTaskDetail',
      payload: {
        pathParams: {
          taskId: editTask || viewTask,
        },
      },
    })
      .then((res) => {
        if (res) {
          getFollowerList();
          if (res?.students) {
            setLeadType(res?.students[0]?.roleTypeId === 'LEAD_STUDENT' ? 'LEAD' : 'STUDENT');
            setDisableStudentTypeField(true);
          }
          setSearchStudentBy(res?.sourcePage);
          const followers = res?.followers?.map((item) => item?.id);
          const students = res?.students?.map((item) => item?.id);
          updateTaskForm.setFieldsValue({
            branch: { id: res?.branch?.id },
            recurrenceType: res?.recurrence?.recurrenceType,
            title: res?.name,
            dueDate: moment(res?.dueDate),
            remark: res?.description,
            followers,
            students,
            priorityTypeId: res?.priorityTypeId,
          });
        }
        if (res?.department) {
          setIsDepartmentInclude(true);
          updateTaskForm.setFieldsValue({
            isDepartmentInclude: true,
            department: res?.department?.id,
          });
        }
        if (res?.department?.members) {
          dispatch({
            type: 'tasks/getStaffList',
            payload: {
              pathParams: {
                departmentId: res?.department?.id,
              },
              query: {
                veiwSize: 1000,
              },
            },
          }).then((response) => {
            if (response) {
              setIsStaffInclude(true);
              const members = res?.department?.members?.map((item) => item?.id);
              updateTaskForm.setFieldsValue({
                isStaffInclude: true,
                members,
              });
            }
          });
        }
        if (res?.recurrence?.recurrenceType === 'CUSTOM') {
          setIsRecurrenceVisible(true);
          setRepeatCount(res?.recurrence?.repetitionFrequency);
          setRepeatOption(res?.recurrence?.repetitionType);
          customRecurrenceForm?.setFieldsValue({
            repetitionOn: res?.recurrence?.repetitionOn,
            repetitionFrequency: res?.recurrence?.repetitionFrequency,
            repetitionType: res?.recurrence?.repetitionType,
            endsOn: (res?.recurrence?.endsOn && moment(res?.recurrence?.endsOn)) || moment(),
            endsAfter: (res?.recurrence?.endsAfter && res?.recurrence?.endsAfter) || 1,
            repeatByDay: res?.recurrence?.repeatByDay && res?.recurrence?.repeatByDay,
          });
          if (res?.recurrence?.endsOn) {
            setRepeatEnds('on');
          } else if (res?.recurrence?.endsAfter) {
            setRepeatEnds('after');
          } else {
            setRepeatEnds('never');
          }
        } else {
          setRecurrencePayload({ isRecurrence: res?.isRecurrence, recurrence: res?.recurrence });
        }
        if (res?.contents) {
          setContentsForTask(
            res?.contents?.map((items) => {
              return {
                name: items?.dataResourceName,
                status: 'done',
                uid: items?.id,
                thumbUrl: items?.thumbnailUrl,
                url: items?.downloadUrl,
              };
            }),
          );
        }
      })
      .catch((error) => {
        if (error) {
          message.error('Something went wrong! We are working on it!');
        }
      });
  };
  useEffect(() => {
    if (editTask || viewTask) {
      populateTaskData();
      dispatch({
        type: 'tasks/getBranchList',
        payload: {
          query: {
            isAccepted: true,
            clientId: 'OMG',
          },
        },
      });
      dispatch({
        type: 'tasks/getDepartmentList',
        payload: {
          query: {
            veiwSize: 1000,
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTask, viewTask]);
  const updateTaskValues = (newEncodePayload, recurrence) => {
    const allValues = updateTaskForm.getFieldsValue();
    const departmentObj = {
      id: allValues?.department,
      members: allValues?.members?.map((item) => {
        return { id: item };
      }),
    };
    const taskPayload = {
      body: {
        students: allValues?.students?.map((stud) => {
          return { id: stud };
        }),
        priorityTypeId: allValues?.priorityTypeId,
        dueDate: allValues?.dueDate && allValues?.dueDate?.toISOString(),
        followers: allValues?.followers?.map((item) => {
          return { id: item };
        }),
        name: allValues?.title || 'Untitled Task',
        branch: allValues?.branch,
        department: departmentObj,
        sourcePage: searchStudentBy,
        description: allValues?.remark,
        contents: newEncodePayload,
        ...(recurrence || recurrencePayload),
      },
      pathParams: { taskId: editTask || viewTask },
    };
    dispatch({
      type: 'tasks/updateTask',
      payload: taskPayload,
    })
      .then((res) => {
        if (res?.id) {
          setUpdateLoading(false);
          message.success(`Task #${res?.id} updated successfully!`);
          history.push('/tasks');
        }
      })
      .catch((error) => {
        if (error) {
          setUpdateLoading(false);
          message.error('Something went wrong! We are working on it!');
        }
      });
  };

  const getStep = () => {
    switch (repeatOption) {
      case 'DAY':
        return <></>;
      case 'WEEKLY':
        return (
          <>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <p className="text-sm font-semibold mb-1 ">Repeat on</p>
              <Form.Item name="repetitionOn" style={{ margin: '0%' }} initialValue={['SUN']}>
                <Select
                  disabled={viewTask}
                  style={{ minWidth: '300px' }}
                  mode="multiple"
                  size="large"
                  placeholder="Repeating Days"
                  onChange={(e) => {
                    if (e?.length === 0) {
                      customRecurrenceForm?.setFieldsValue({
                        repetitionOn: 'SUN',
                      });
                    }
                  }}
                >
                  {recurrenceDays?.map((item) => (
                    <Select.Option key={item?.id} value={item?.value}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </>
        );
      case 'MONTHLY':
        return (
          <>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <p className="text-sm font-semibold mb-1 ">Select monthly repeat on</p>
              <Form.Item name="repeatByDay" initialValue={+moment().format('DD')}>
                <Select style={{ minWidth: '300px' }} size="large" disabled={viewTask}>
                  <Select.Option value={+moment().format('DD')}>
                    {`Monthly on day ${+moment().format('DD')}`}
                  </Select.Option>
                  <Select.Option value={weeks}>
                    {`Monthly on ${getWeekNumber()}${moment().format('dddd').toLowerCase()}`}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </>
        );
      case 'YEARLY':
        return <></>;
      default:
        return <></>;
    }
  };
  useEffect(() => {
    getStudents(leadType, searchStudentBy, keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadType, searchStudentBy, keyword, editTask, viewTask]);
  const onSearch = (val) => {
    setKeyword(val);
  };
  const onFollowerSearch = (val) => {
    setFollowerKeyword(val);
  };
  useEffect(() => {
    getFollowerList();
  }, [followerKeyword, editTask, viewTask]);

  const tagRender = ({ label, closable, onClose }) => {
    const displayData = label?.props?.displayData;
    return (
      <Tag
        closable={closable}
        onClose={onClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0px 1px 0px 0px',
          borderRadius: 61,
        }}
      >
        <div className=" flex items-center cursor-pointer">
          <Avatar className="bg-blue-800" src={displayData?.photoUrl}>
            {getInitials(displayData?.displayName)}
          </Avatar>

          <div className="text-black font-medium text-xs ml-1">
            <div>{displayData?.displayName}</div>
          </div>
        </div>
      </Tag>
    );
  };
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader?.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  const handlePreview = async (file) => {
    setDownloadLoading(true);
    if (!file.url && !file.preview) {
      // eslint-disable-next-line no-param-reassign
      file.preview = await getBase64(file.originFileObj || file?.data);
    }
    setPreviewImage(file.thumbUrl);
    setPreviewTitle(file.name || file?.data?.name);
    const tiltes = file.name || file?.data?.name;
    if (tiltes.includes('.docx') || tiltes.includes('.xlsx') || tiltes.includes('.doc')) {
      setPreviewVisible(false);
      const urll = file.thumbUrl;
      fetch(`${urll}`).then((response) => {
        response.blob().then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${file.name}`;
          setDownloadLoading(false);
          a.click();
        });
      });
    } else {
      setPreviewVisible(true);
      setDownloadLoading(false);
    }
  };

  const handleContents = async (valuesSubmited) => {
    let newUploadedFile = contentsForTask?.map((item) => item?.data);
    newUploadedFile = newUploadedFile?.filter((item) => item !== undefined);
    const base64Arr = await Promise.all(newUploadedFile?.map(async (data) => toBase64(data)));
    const encodedFiles = base64Arr?.map((encoded, i) => {
      return {
        encodedFile: encoded,
        name: newUploadedFile[i]?.name,
        typeId: 'DOCUMENT',
      };
    });
    const encodeFilesPayload = [
      ...encodedFiles,
      ...contentsForTask
        ?.filter((item) => item?.status === 'done')
        ?.map((items) => {
          return { id: items?.uid };
        }),
    ];
    // customRecurrencePayload
    if (isRecurrenceVisible) {
      const values = valuesSubmited;
      let isEnds = false;
      if (repeatEnds === 'on' || repeatEnds === 'after') {
        isEnds = true;
        if (repeatEnds === 'on') {
          Object.keys(values).forEach((key) => {
            if (key === 'endsOn') {
              values[key] = values[key]?.toISOString();
            }
          });
        }
        if (repeatEnds === 'on') {
          Object.keys(values).forEach((key) => {
            if (key === 'endsAfter') {
              delete values[key];
            }
          });
        }
        if (repeatEnds === 'after') {
          Object.keys(values).forEach((key) => {
            if (key === 'endsOn') {
              delete values[key];
            }
          });
        }
      } else {
        isEnds = false;
        Object.keys(values).forEach((key) => {
          if (key === 'endsAfter' || key === 'endsOn') {
            delete values[key];
          }
        });
      }
      const customPayload = {
        isEnds,
        ...values,
      };
      Object.keys(customPayload).forEach((key) => {
        if (customPayload[key] === undefined) {
          delete customPayload[key];
        }
      });
      if (customPayload?.repetitionType === 'MONTHLY') {
        customPayload.repetitionOnType = 'DAY';
      }
      if (customPayload?.repetitionType === 'YEARLY') {
        customPayload.repetitionOnType = 'DATE';
      }
      const customRecurrencePayload = {
        isRecurrence: true,
        recurrence: {
          startDate: moment().toISOString(),
          recurrenceType: 'CUSTOM',
          ...customPayload,
        },
      };
      updateTaskValues(encodeFilesPayload, customRecurrencePayload);
    } else {
      updateTaskValues(encodeFilesPayload);
    }
  };
  return (
    <Page
      title={viewTask !== undefined ? 'View Task' : 'Update Task'}
      breadcrumbs={
        <Breadcrumbs
          path={[
            {
              name: 'Dashboard',
              path: '/dashboard',
            },
            {
              name: 'Tasks',
              path: '/tasks',
            },
            {
              name: viewTask !== undefined ? 'View Task' : 'Update Task',
              path: '#',
            },
          ]}
        />
      }
    >
      <Spin spinning={Boolean(loading) || updateLoading || downloadLoading}>
        <Form form={updateTaskForm} requiredMark={false}>
          <div className="bg-white px-10 py-10 rounded-md shadow-md">
            <div className="flex mb-3">
              <Form.Item
                name="isDepartmentInclude"
                valuePropName="checked"
                style={{ margin: '0%' }}
              >
                <Checkbox
                  value={isDepartmentInclude}
                  disabled={viewTask}
                  style={{ display: 'flex' }}
                  onChange={(e) => {
                    setIsDepartmentInclude(e.target.checked);
                    if (!e.target.checked) {
                      setIsStaffInclude(false);
                      updateTaskForm.setFieldsValue({
                        members: undefined,
                        department: undefined,
                      });
                    }
                  }}
                >
                  <p className="pl-2">Add department</p>
                </Checkbox>
              </Form.Item>
              {isDepartmentInclude === true ? (
                <Form.Item name="isStaffInclude" valuePropName="checked" style={{ margin: '0%' }}>
                  <Checkbox
                    disabled={viewTask}
                    style={{ display: 'flex' }}
                    value={isStaffInclude}
                    onChange={(e) => {
                      setIsStaffInclude(e.target.checked);
                      if (!e.target.checked) {
                        updateTaskForm.setFieldsValue({
                          members: undefined,
                        });
                      }
                    }}
                  >
                    <p className="pl-2">Add staff</p>
                  </Checkbox>
                </Form.Item>
              ) : null}
            </div>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <div>
                  <p className="text-sm font-semibold">Select branch</p>
                  <Form.Item
                    name={['branch', 'id']}
                    rules={[{ required: true, message: 'Please select branch!' }]}
                  >
                    <Select
                      disabled={viewTask}
                      size="large"
                      placeholder="Please select branch"
                      className="w-full"
                      getPopupContainer={(node) => node.parentNode}
                    >
                      {branchList?.records?.map((item) => (
                        <Select.Option key={item?.id} value={item?.id}>
                          {item?.clientName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              {isDepartmentInclude === true ? (
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <div>
                    <p className="text-sm font-semibold">Select department</p>
                    <Form.Item name="department">
                      <Select
                        size="large"
                        disabled={viewTask}
                        placeholder="select department"
                        getPopupContainer={(node) => node.parentNode}
                        onChange={(e) => {
                          dispatch({
                            type: 'tasks/getStaffList',
                            payload: {
                              pathParams: {
                                departmentId: e,
                              },
                              query: {
                                veiwSize: 1000,
                              },
                            },
                          });
                          updateTaskForm.setFieldsValue({
                            members: undefined,
                          });
                        }}
                      >
                        {departmentList?.records?.map((item) => (
                          <Select.Option value={item?.id} key={item?.id}>
                            {item?.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
              ) : null}
              {isStaffInclude && isDepartmentInclude ? (
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <div>
                    <p className="text-sm font-semibold">Select staff</p>
                    <Form.Item name={['members']}>
                      <Select
                        disabled={viewTask}
                        size="large"
                        mode="multiple"
                        placeholder="select staff"
                        showArrow
                        getPopupContainer={(node) => node.parentNode}
                        tagRender={(props) => {
                          // eslint-disable-next-line prefer-destructuring
                          const itemStaff = props.label.props.itemStaff;
                          return itemStaff?.photoUrl !== undefined ? (
                            <Popover
                              key={itemStaff?.id}
                              itemStaff={itemStaff}
                              title={itemStaff?.displayName}
                              {...props}
                            >
                              <div>
                                <img
                                  src={itemStaff?.photoUrl}
                                  alt=""
                                  className="rounded-full w-8 h-8"
                                />
                              </div>
                            </Popover>
                          ) : (
                            <Popover
                              key={itemStaff?.id}
                              itemStaff={itemStaff}
                              content={itemStaff?.displayName}
                              {...props}
                            >
                              <Avatar
                                {...props}
                                style={{ cursor: 'pointer' }}
                                className="uppercase text-gray-900 font-medium mx-2"
                                size={30}
                                src={itemStaff?.photoUrl}
                              >
                                <p className="text-gray-900 text-xs pt-2">
                                  {itemStaff?.displayName && getInitials(itemStaff?.displayName)}
                                </p>
                              </Avatar>
                            </Popover>
                          );
                        }}
                      >
                        {staffList?.members?.map((itemStaff) => (
                          <Select.Option key={itemStaff?.id} value={itemStaff?.partyId}>
                            <div
                              key={itemStaff?.id}
                              itemStaff={itemStaff}
                              title={itemStaff?.displayName}
                            >
                              <div className="flex gap-2 px-2 cursor-pointer  w-max">
                                {itemStaff?.photoUrl !== undefined ? (
                                  <div>
                                    <img
                                      src={itemStaff?.photoUrl}
                                      alt=""
                                      className="rounded-full w-8 h-8"
                                    />
                                  </div>
                                ) : (
                                  <Avatar className="uppercase text-gray-900 font-medium" size={30}>
                                    <p className="text-gray-900 text-xs pt-2">
                                      {itemStaff?.displayName &&
                                        getInitials(itemStaff?.displayName)}
                                    </p>
                                  </Avatar>
                                )}

                                <p className="text-gray-900 font-medium capitalize mt-1.5 text-xs">
                                  {itemStaff?.displayName}
                                </p>
                              </div>
                            </div>
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
              ) : null}
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <p className="text-sm font-semibold ">Add work title</p>
                <Form.Item
                  name="title"
                  style={{ margin: '5px 0px' }}
                  label={false}
                  rules={[
                    {
                      required: true,
                      message: 'Please input the title of the task!',
                    },
                  ]}
                >
                  <TextArea
                    disabled={viewTask}
                    minRows={2}
                    onKeyDown={(event) => {
                      if (event.keyCode === 50) {
                        if (event.shiftKey) {
                          //   TODO:
                        }
                      }
                    }}
                    autoSize
                    size="large"
                    placeholder="Work Description"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <div>
                  <p
                    className="text-sm font-semibold"
                    rules={[{ required: true, message: 'Please select type of work!' }]}
                  >
                    Select Priority
                  </p>
                  <Form.Item name="priorityTypeId" style={{ margin: '' }}>
                    <Select
                      disabled={viewTask}
                      size="large"
                      placeholder="Select priority"
                      getPopupContainer={(node) => node.parentNode}
                    >
                      {priority?.map((prior) => (
                        <Select.Option value={prior?.value} key={prior?.value}>
                          {prior?.title}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <div>
                  <p className="text-sm font-semibold">Select type of work</p>
                  <Form.Item name="recurrenceType" style={{ margin: '' }}>
                    <Select
                      disabled={viewTask}
                      size="large"
                      placeholder="Select work type"
                      getPopupContainer={(node) => node.parentNode}
                      onChange={(value) => {
                        if (value === 'CUSTOM') {
                          setIsRecurrenceVisible(true);
                          setRecurrencePayload();
                        } else {
                          createRecurrencePayload(value);
                          setIsRecurrenceVisible(false);
                        }
                      }}
                    >
                      {TimeDuration?.map((dru) => (
                        <Select.Option value={dru?.value} key={dru?.value}>
                          {dru?.title}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </div>
          {isRecurrenceVisible && (
            <div className="bg-white  rounded-md shadow-md mt-3">
              <h1 className="text-gray-900 m-0 font-medium px-5 py-5">Custom recurrence</h1>
              <Divider style={{ margin: '0%' }} />
              <div className="px-10 py-5">
                <Form form={customRecurrenceForm} onFinish={(values) => handleContents(values)}>
                  <Row gutter={16}>
                    <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                      <p className="text-sm font-semibold mb-1">Repeat every</p>
                      <div className="flex gap-2.5">
                        <Form.Item
                          name="repetitionFrequency"
                          style={{ margin: '0%' }}
                          initialValue={1}
                        >
                          <InputNumber
                            size="large"
                            disabled={viewTask}
                            min={1}
                            defaultValue={1}
                            style={{ width: '9.5rem' }}
                            onChange={(e) => setRepeatCount(e)}
                          />
                        </Form.Item>
                        <Form.Item
                          name="repetitionType"
                          style={{ margin: '0%' }}
                          initialValue="WEEKLY"
                        >
                          <Select
                            disabled={viewTask}
                            style={{ width: '16rem' }}
                            onChange={(e) => setRepeatOption(e)}
                            size="large"
                            defaultValue={'WEEKLY'}
                          >
                            {repeatOn?.map((item) => (
                              <Select.Option key={item?.value} value={item?.value}>
                                {item?.name}
                                {repeatCount > 1 ? 's' : null}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                    </Col>

                    {getStep()}

                    <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                      <p className="text-sm font-semibold">Ends</p>
                      <Radio.Group
                        style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}
                        size="large"
                        disabled={viewTask}
                        defaultValue="never"
                        value={repeatEnds}
                        onChange={(e) => setRepeatEnds(e.target.value)}
                        buttonStyle="solid"
                      >
                        <Radio value="never">Never</Radio>
                        <Radio value="on" style={{ display: 'flex', alignItems: 'center' }}>
                          <div className="flex">
                            <span className="mt-2.5">On</span>
                            <Form.Item
                              name="endsOn"
                              style={{ margin: '0%' }}
                              initialValue={moment()}
                            >
                              <DatePicker
                                size="small"
                                allowClear={false}
                                suffixIcon={<></>}
                                disabled={repeatEnds !== 'on' || viewTask}
                                format={'ll'}
                                style={{
                                  height: '2rem',
                                  width: '6rem',
                                  marginLeft: '5rem',
                                  marginTop: '5px',
                                  borderTop: '0px',
                                  borderLeft: '0px',
                                  borderRight: '0px',
                                }}
                              />
                            </Form.Item>
                          </div>
                        </Radio>
                        <Radio value="after">
                          <div className="flex">
                            <p className="mt-2.5">After</p>
                            <div className="flex" style={{ marginLeft: '4.3rem' }}>
                              <Form.Item name="endsAfter" style={{ margin: '0%' }} initialValue={1}>
                                <InputNumber
                                  size="small"
                                  allowClear={false}
                                  disabled={repeatEnds !== 'after' || viewTask}
                                  min={1}
                                  format={'ll'}
                                  style={{
                                    height: '2rem',
                                    width: '6rem',
                                    marginTop: '5px',
                                    borderTop: '0px',
                                    borderLeft: '0px',
                                    borderRight: '0px',
                                  }}
                                />
                              </Form.Item>
                              <p className="mt-2.5 text-gray-900  font-medium ml-2">Occurrences</p>
                            </div>
                          </div>
                        </Radio>
                      </Radio.Group>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          )}
          <div className="bg-white  rounded-md shadow-md mt-3">
            <h1 className="text-gray-900 m-0 font-medium px-5 py-5">Add students</h1>
            <Divider style={{ margin: '0%' }} />
            <div className="px-10 py-5">
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                  <p className="text-sm font-semibold ">Select from</p>
                  <Radio.Group
                    disabled={disableStudentTypeField || viewTask}
                    onChange={(e) => setLeadType(e.target.value)}
                    style={{ display: 'flex' }}
                    size="large"
                    value={leadType}
                    buttonStyle="solid"
                  >
                    <Radio value="LEAD">Leads</Radio>
                    <Radio value="STUDENT">Students</Radio>
                  </Radio.Group>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <p className="text-sm font-semibold ">Select purpose</p>
                  <Select
                    size="large"
                    disabled={disableStudentTypeField || viewTask}
                    style={{ width: '100%' }}
                    placeholder="Select work type"
                    value={searchStudentBy}
                    onChange={(e) => setSearchStudentBy(e)}
                    getPopupContainer={(node) => node.parentNode}
                  >
                    <Select.Option value="COURSES">Course</Select.Option>
                    <Select.Option value="VISA">Visa</Select.Option>
                    <Select.Option value="OTHERS">Other Services</Select.Option>
                  </Select>
                </Col>
                <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                  <div className="">
                    <p className="text-sm font-semibold">Select student</p>
                    <Form.Item name="students">
                      <Select
                        disabled={viewTask}
                        showSearch
                        size="large"
                        style={{ width: '100%' }}
                        onSearch={onSearch}
                        allowClear
                        placeholder="Add students"
                        defaultActiveFirstOption={false}
                        mode="multiple"
                        notFoundContent={null}
                        filterOption={false}
                        onBlur={() => {
                          setKeyword('');
                        }}
                        onSelect={() => {
                          setKeyword('');
                        }}
                        onChange={(e) => {
                          if (e?.length > 0) {
                            setDisableStudentTypeField(true);
                          } else {
                            setDisableStudentTypeField(false);
                          }
                        }}
                      >
                        {studentsList?.records?.map((studentItem) => (
                          <Select.Option key={studentItem?.id} label={studentItem?.displayName}>
                            {studentItem?.displayName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="bg-white px-10 py-10 rounded-md shadow-md mt-4">
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <p className="text-sm font-semibold mb-1">Select due date</p>
                <Form.Item name="dueDate">
                  <DatePicker
                    disabled={viewTask}
                    size="large"
                    style={{ width: '100%' }}
                    showTime={{ use12Hours: true }}
                    showNow={false}
                    disabledDate={(date) => date.valueOf() < moment().subtract(1, 'days').valueOf()}
                    allowClear={false}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <p className="text-sm font-semibold mb-1">Add follower</p>
                <Form.Item name="followers">
                  <Select
                    showSearch
                    disabled={viewTask}
                    size="large"
                    style={{ width: '100%' }}
                    onSearch={onFollowerSearch}
                    allowClear
                    placeholder="Add followers"
                    defaultActiveFirstOption={false}
                    mode="multiple"
                    tagRender={tagRender}
                    notFoundContent={null}
                    filterOption={false}
                    onBlur={() => {
                      setFollowerKeyword('');
                    }}
                    onSelect={() => {
                      setFollowerKeyword('');
                    }}
                  >
                    {orgMemberList?.records?.map((record) => (
                      <Select.Option
                        key={record?.id}
                        label={record?.displayName}
                        value={record?.id}
                      >
                        <div className="flex justify-between items-center" displayData={record}>
                          <div className="px-3 py-2 space-x-2 flex items-center cursor-pointer">
                            <Avatar className="bg-blue-800" src={record?.photoUrl}>
                              {getInitials(record.displayName)}
                            </Avatar>
                            <div className="flex-auto truncate">
                              <div className="text-black font-medium text-sm flex">
                                <div>{record?.displayName}</div>
                              </div>
                              <div className="text-gray-600text-sm truncate">{record.email}</div>
                            </div>
                          </div>
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <p className="text-sm font-semibold mb-1 ">Add remarks</p>
                <Form.Item name="remark" style={{ margin: '5px 0px' }} label={false}>
                  <TextArea
                    disabled={viewTask}
                    minRows={2}
                    onKeyDown={(event) => {
                      if (event.keyCode === 50) {
                        if (event.shiftKey) {
                          //   TODO:
                        }
                      }
                    }}
                    autoSize
                    size="large"
                    placeholder="Enter any remark"
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className="2xl:mx-60 xl:mx-60 lg:mx-20 ">
              <Dragger
                disabled={viewTask}
                name={'file'}
                accept=".jpg, .png, .jpeg, .gif, .bmp, .tif,.pdf,.doc,.docx,.xlsx ,.tiff|image/*"
                onPreview={handlePreview}
                onRemove={(data) => {
                  setContentsForTask(contentsForTask?.filter((del) => del?.uid !== data?.uid));
                  return Promise.resolve();
                }}
                fileList={contentsForTask}
                multiple={true}
                isImageUrl={() => <img />}
                beforeUpload={(data) =>
                  setContentsForTask((prev) => [
                    ...prev,
                    { uid: data?.uid, thumbUrl: URL.createObjectURL(data), data, name: data?.name },
                  ])
                }
                style={{
                  display: 'block',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
              >
                <p className="">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </p>
                <p className="ant-upload-text">
                  <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 mr-1.5">
                    Upload a file
                  </span>
                  or drag and drop
                </p>
              </Dragger>
            </div>
          </div>
        </Form>
      </Spin>
      <FixedFooter classes="text-right">
        <div className="flex mr-36 py-2.5">
          <div className="w-full ">
            {viewTask !== undefined ? (
              <Button
                type="primary"
                style={{ height: '2.5rem', fontWeight: '500', fontSize: '15px' }}
                onClick={() => {
                  history.push('/tasks');
                }}
              >
                Return to Table
              </Button>
            ) : (
              <Button
                type="primary"
                loading={updateLoading}
                style={{ height: '2.5rem', fontWeight: '500', fontSize: '15px' }}
                onClick={() => {
                  setUpdateLoading(true);
                  if (isRecurrenceVisible) {
                    customRecurrenceForm.submit();
                  } else {
                    handleContents();
                  }
                }}
              >
                Update Task
              </Button>
            )}
          </div>
        </div>
      </FixedFooter>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        centered
        width="80%"
        bodyStyle={{ margin: 0, padding: 0, height: '75vh' }}
        onCancel={() => {
          setPreviewVisible(false);
          setPreviewTitle('');
        }}
      >
        <iframe
          alt="example"
          className="h-full text-center w-full"
          frameBorder="0"
          src={previewImage}
        />
      </Modal>
    </Page>
  );
};

export default connect(({ tasks, loading, user, staff }) => ({
  orgMemberList: staff?.orgMemberList,
  branchList: tasks?.branchList,
  currentUser: user?.currentUser,
  departmentList: tasks?.departmentList,
  staffList: tasks?.staffList,
  studentsList: tasks?.studentsList,
  loading: loading?.effects['tasks/singleTaskDetail'],
}))(EditTask);
