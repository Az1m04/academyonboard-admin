import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Pagination,
  Popconfirm,
  Radio,
  Row,
  Select,
  message,
  Spin,
  Checkbox,
  Tag,
} from 'antd';
import { connect, history, useParams } from 'umi';
import Breadcrumbs from '@/components/BreadCrumbs';
import CheckValidation from '@/components/CheckValidation';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import EmptyState from '@/components/EmptyState';
import Page from '@/components/Page';

import FixedFooter from '@/components/FixedFooter';
import { CircleFill } from 'react-bootstrap-icons';

const { Option } = Select;
const CreateNewCapsule = ({
  dispatch,
  getCourseContent,
  getTopicCount,
  loading,
  loadingTableRowSave,
  loadingUpdateTableRow,
  loadingUpdateCapsule,
  loadingCount,
  difficultyLevelsExistingList,
  loadingLevelsExisting,
  loadingPopulateCapsule,
}) => {
  const [capsuleForm] = Form.useForm();
  const [capsuleTableForm] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [singleCourseDetails, setSingleCourseDetails] = useState({});
  const [capsuleCreated, setCapsuleCreated] = useState(false);
  const [keyNumber, setKeyNumber] = useState();
  const [startIndex, setStartIndex] = useState(0);
  const [getModules, setGetModules] = useState([]);
  const [topicListRemove, setTopicListRemove] = useState([]);
  const [homeWorkListRemove, setHomeWorkListRemove] = useState([]);
  const [onlineTopicSelectedKeys, setOnlineTopicSelectedKeys] = useState({});
  const [onlineHomeWorkSelectedKeys, setOnlineHomeWorkSelectedKeys] = useState({});
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [topicListRes, setTopicListRes] = useState([]);
  const [postCourseId, setPostCourseId] = useState();
  const [postCapsuleId, setPostCapsuleId] = useState();
  const [createCapsuleResponse, setCreateCapsuleResponse] = useState();
  const [capsuleCreatedTableRow, setCapsuleCreatedTableRow] = useState(false);
  const [topicCount, setTopicCount] = useState();
  const [capsuleType, setCapsuleType] = useState('');
  const { IdCourse, IdCapsule } = useParams();
  const { IdViewCourse, IdViewCapsule } = useParams();
  const [createdCapsuleDetails, setCreatedCapsuleDetails] = useState({
    capsuleType: '',
    isHomeWorkIncluded: false,
  });

  const GetRows = (numOfDays, topicsList, id) => {
    if (capsuleCreated === false) {
      const state = [];
      for (let i = 1; i <= numOfDays; i++) {
        state?.push({
          key: i,
          day: i,
          topics: topicsList,
          moduleId: id,
        });
      }
      setDataSource(state);
    } else if (capsuleCreated === true) {
      if (dataSource?.length < numOfDays) {
        const add = Number(numOfDays - dataSource?.length);
        let keyNumberStart = (dataSource[dataSource?.length - 1]?.key || 0) + 1;
        const addNew = [];
        for (let i = 1; i <= add; i++) {
          addNew?.push({
            key: keyNumberStart,
            day: keyNumberStart,
            topics: topicsList,
            moduleId: id,
          });
          keyNumberStart++;
        }
        setDataSource([...dataSource, ...addNew]);
      }
    }
  };
  const PopulateDataInCapsule = () => {
    if ((IdCourse && IdCapsule) || (IdViewCourse && IdViewCapsule)) {
      dispatch({
        type: 'courses/getCapsuleDetail',
        payload: {
          pathParams: {
            courseId: IdCourse || IdViewCourse,
            capsuleId: IdCapsule || IdViewCapsule,
          },
        },
      }).then((res) => {
        if (res?.id) {
          setCreateCapsuleResponse(res?.capsuleDetails);
          if (res?.capsuleTypeId === 'BOTH_HOME_AND_CLASS') {
            setCapsuleType('Regular');
            setCreatedCapsuleDetails({
              capsuleType: 'Regular',
              isHomeWorkIncluded: true,
            });
            setOnlineHomeWorkSelectedKeys({ ...res?.homeWorkOnlineKeys });
            setOnlineTopicSelectedKeys({ ...res?.classWorkOnlineKeys });
          }
          if (res?.capsuleTypeId === 'CLASSWORK') {
            setCapsuleType('Regular');
            setCreatedCapsuleDetails({
              capsuleType: 'Regular',
              isHomeWorkIncluded: false,
            });
            setOnlineTopicSelectedKeys({ ...res?.classWorkOnlineKeys });
          }
          if (res?.capsuleTypeId === 'MOCK_TST') {
            setCapsuleType('mockTest');
            setCreatedCapsuleDetails({
              capsuleType: 'mockTest',
              isHomeWorkIncluded: false,
            });
            setOnlineTopicSelectedKeys({ ...res?.mockTestOnlineKeys });
          }
          const topicList = [
            ...res?.courseDetails?.offlineCourseContents.modules?.map((item) => {
              if (item?.topics) {
                return [
                  ...item?.topics,
                  ...res?.courseDetails?.onlineCourseContents?.modules
                    ?.find((fi) => fi?.id === item?.id)
                    ?.tests?.map((data) => {
                      return { ...data, mode: 'ONLINE' };
                    }),
                ];
              }
              return [
                ...item?.tests,
                ...res?.courseDetails?.onlineCourseContents?.modules
                  ?.find((fi) => fi?.id === item?.id)
                  ?.tests?.map((data) => {
                    return { ...data, mode: 'ONLINE' };
                  }),
              ];
            }),
          ];

          const moduleId = res?.courseDetails?.offlineCourseContents.modules?.map(
            (show) => show?.id,
          );

          setGetModules(
            res?.courseDetails?.offlineCourseContents?.modules?.map((item) => {
              return {
                title: item?.name,
                key: item?.name,
              };
            }),
          );
          capsuleForm?.setFieldsValue({
            capsuleName: res?.capsuleName,
            course: { id: res?.courseId },
            numOfDays: res?.numOfDays,
            difficultyLevel: res?.difficultyLevel,
          });
          setCapsuleCreated(true);
          const populateData = [];
          dispatch({
            type: 'courses/getTopicCount',
            payload: {
              pathParams: {
                courseId: res?.courseId,
              },
              query: {
                difficultyLevel: res?.difficultyLevel,
              },
            },
          }).then((response) => {
            setDifficultyLevel(res?.difficultyLevel);
            if (response?.responseMessage === 'success') {
              if (res?.isMockTest) {
                setTopicCount(response?.testCount);
              } else {
                setTopicCount(response?.topicsCount);
              }
            }
          });
          if (res?.capsuleGroups?.length > 0) {
            setTopicListRes([...res?.capsuleGroups]);
            for (let i = 1; i <= res?.capsuleGroups?.length; i++) {
              populateData?.push({
                key: res?.capsuleGroups[i - 1]?.day,
                day: res?.capsuleGroups[i - 1]?.day,
                topics: topicList,
                moduleId,
                status: 'ok',
              });
            }
            setDataSource([...populateData]);

            let filterGroupTopics = [];
            filterGroupTopics = res?.capsuleGroups?.filter((item) => item?.day);

            const Rows = [];
            let RemoveTopic = {};
            if (res?.capsuleTypeId === 'MOCK_TST') {
              filterGroupTopics?.forEach(
                // eslint-disable-next-line no-return-assign
                (item) =>
                  (Rows[item?.day] = moduleId?.map((mid) => {
                    if (
                      mid ===
                      item?.mockTests?.find((findeO) => findeO?.module?.id === mid)?.module?.id
                    ) {
                      return {
                        topicId: item?.mockTests
                          ?.find((findeO) => findeO?.module?.id === mid)
                          ?.topics?.map((topic) => topic?.id),
                        moduleId: mid,
                      };
                      // eslint-disable-next-line no-else-return
                    } else {
                      return {};
                    }
                  })),
              );
              RemoveTopic = Object.assign(
                {},
                ...moduleId?.map((mid) => {
                  return {
                    [mid]: Object.assign(
                      {},
                      ...filterGroupTopics?.map((list) => {
                        if (
                          mid ===
                          list?.mockTests?.find((findeO) => findeO?.module?.id === mid)?.module?.id
                        ) {
                          return {
                            [list?.day]: list?.mockTests
                              ?.find((findeO) => findeO?.module?.id === mid)
                              ?.topics?.map((topic) => topic?.id),
                          };
                        }
                        // eslint-disable-next-line no-else-return
                        else {
                          return undefined;
                        }
                      }),
                    ),
                  };
                }),
              );
            } else {
              filterGroupTopics?.forEach(
                // eslint-disable-next-line no-return-assign
                (item) =>
                  (Rows[item?.day] = moduleId?.map((mid) => {
                    if (
                      mid ===
                        item?.classWorks?.find((findeO) => findeO?.module?.id === mid)?.module
                          ?.id ||
                      item?.homeWorks?.find((findeO) => findeO?.module?.id === mid)?.module?.id
                    ) {
                      return {
                        topicId: item?.classWorks
                          ?.find((findeO) => findeO?.module?.id === mid)
                          ?.topics?.map((topic) => topic?.id),
                        homeWorkId: item?.homeWorks
                          ?.find((findeO) => findeO?.module?.id === mid)
                          ?.topics?.map((topic) => topic?.id),
                        moduleId: mid,
                      };
                      // eslint-disable-next-line no-else-return
                    } else {
                      return {};
                    }
                  })),
              );
              RemoveTopic = Object.assign(
                {},
                ...moduleId?.map((mid) => {
                  return {
                    [mid]: Object.assign(
                      {},
                      ...filterGroupTopics?.map((list) => {
                        if (
                          mid ===
                          list?.classWorks?.find((findeO) => findeO?.module?.id === mid)?.module?.id
                        ) {
                          return {
                            [list?.day]: list?.classWorks
                              ?.find((findeO) => findeO?.module?.id === mid)
                              ?.topics?.map((topic) => topic?.id),
                          };
                        }
                        // eslint-disable-next-line no-else-return
                        else {
                          return undefined;
                        }
                      }),
                    ),
                  };
                }),
              );
            }

            if (res?.capsuleTypeId === 'BOTH_HOME_AND_CLASS') {
              let homeWorkRemoved = {};
              homeWorkRemoved = Object.assign(
                {},
                ...moduleId?.map((mid) => {
                  return {
                    [mid]: Object.assign(
                      {},
                      ...filterGroupTopics?.map((list) => {
                        if (
                          mid ===
                          list?.homeWorks?.find((findeO) => findeO?.module?.id === mid)?.module?.id
                        ) {
                          return {
                            [list?.day]: list?.homeWorks
                              ?.find((findeO) => findeO?.module?.id === mid)
                              ?.topics?.map((topic) => topic?.id),
                          };
                        }
                        // eslint-disable-next-line no-else-return
                        else {
                          return undefined;
                        }
                      }),
                    ),
                  };
                }),
              );
              setHomeWorkListRemove({ ...homeWorkRemoved });
            }

            setTopicListRemove({ ...RemoveTopic });
            capsuleTableForm?.setFieldsValue({
              Row: Rows,
            });
          } else {
            for (let i = 1; i <= res?.numOfDays; i++) {
              populateData?.push({
                key: i,
                day: i,
                topics: topicList,
                moduleId,
              });
            }
            setDataSource([...populateData]);
          }
        }
      });
    }
  };
  useEffect(() => {
    if ((IdCourse && IdCapsule) || (IdViewCourse && IdViewCapsule)) {
      if (
        createdCapsuleDetails?.capsuleType === 'Regular' &&
        createdCapsuleDetails?.isHomeWorkIncluded &&
        capsuleType === 'Regular'
      ) {
        capsuleForm?.setFieldsValue({
          capsuleType: 'Regular',
          capulsefor: {
            homeWork: true,
          },
        });
      }
      if (
        createdCapsuleDetails?.capsuleType === 'Regular' &&
        !createdCapsuleDetails?.isHomeWorkIncluded &&
        capsuleType === 'Regular'
      ) {
        capsuleForm?.setFieldsValue({
          capsuleType: 'Regular',
        });
      }
      if (
        createdCapsuleDetails?.capsuleType === 'mockTest' &&
        !createdCapsuleDetails?.isHomeWorkIncluded &&
        capsuleType === 'mockTest'
      ) {
        capsuleForm?.setFieldsValue({
          capsuleType: 'mockTest',
        });
      }
    }
  }, [IdCourse, IdCapsule, createdCapsuleDetails, capsuleType]);

  const PostCapsule = (values) => {
    const body = {};
    body.capsuleName = values?.capsuleName;
    body.numOfDays = values?.numOfDays;
    body.difficultyLevel = values?.difficultyLevel;
    if (values?.capulsefor?.classWork) {
      body.capsuleType = 'CLASSWORK';
    }
    if (values?.capulsefor?.homeWork) {
      body.capsuleType = 'HOMEWORK';
    }
    if (values?.capulsefor?.classWork && values?.capulsefor?.homeWork) {
      body.capsuleType = 'BOTH_HOME_AND_CLASS';
    }
    if (values?.capsuleType === 'Regular' && values?.capulsefor?.homeWork) {
      setCreatedCapsuleDetails({ isHomeWorkIncluded: true, capsuleType: values?.capsuleType });
    }
    if (!values?.capulsefor?.homeWork && values?.capsuleType === 'Regular') {
      setCreatedCapsuleDetails({ isHomeWorkIncluded: false, capsuleType: values?.capsuleType });
    }
    if (values?.capsuleType === 'mockTest') {
      body.isMockTest = true;
      body.capsuleType = 'MOCK_TST';
    }
    dispatch({
      type: 'courses/postCapsule',
      payload: {
        body,
        pathParams: { courseId: values?.course?.id },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        setCapsuleCreated(true);
        setPostCourseId(res?.courseId);
        setPostCapsuleId(res?.capsuleId);
        setCreateCapsuleResponse(res);

        setGetModules([
          ...res?.courseDetails?.offlineCourseContents?.modules?.map((item) => {
            return {
              title: item?.name,
              key: item?.name,
            };
          }),
        ]);
        const topics = [
          ...res?.courseDetails?.offlineCourseContents.modules?.map((item) => {
            if (item?.topics) {
              return [
                ...item?.topics,
                ...res?.courseDetails?.onlineCourseContents?.modules
                  ?.find((fi) => fi?.id === item?.id)
                  ?.tests?.map((data) => {
                    return { ...data, mode: 'ONLINE' };
                  }),
              ];
            }
            return [
              ...item?.tests,
              ...res?.courseDetails?.onlineCourseContents?.modules
                ?.find((fi) => fi?.id === item?.id)
                ?.tests?.map((data) => {
                  return { ...data, mode: 'ONLINE' };
                }),
            ];
          }),
        ];
        GetRows(
          res?.numOfDays,
          topics,
          res?.courseDetails?.offlineCourseContents?.modules?.map((show) => show?.id),
        );
      }
    });
  };
  const UpdateCapsuleValues = (values) => {
    const body = {};
    body.capsuleName = values?.capsuleName;
    body.numOfDays = values?.numOfDays;
    body.difficultyLevel = values?.difficultyLevel;
    if (values?.capulsefor?.classWork) {
      body.capsuleType = 'CLASSWORK';
    }
    if (values?.capulsefor?.homeWork) {
      body.capsuleType = 'HOMEWORK';
    }
    if (values?.capulsefor?.classWork && values?.capulsefor?.homeWork) {
      body.capsuleType = 'BOTH_HOME_AND_CLASS';
    }
    if (values?.capsuleType === 'Regular' && values?.capulsefor?.homeWork) {
      setCreatedCapsuleDetails({ isHomeWorkIncluded: true, capsuleType: values?.capsuleType });
    }
    if (!values?.capulsefor?.homeWork && values?.capsuleType === 'Regular') {
      setCreatedCapsuleDetails({ isHomeWorkIncluded: false, capsuleType: values?.capsuleType });
    }
    if (values?.capsuleType === 'mockTest') {
      body.isMockTest = true;
      body.capsuleType = 'MOCK_TST';
    }
    dispatch({
      type: 'courses/updateCapsule',
      payload: {
        body,
        pathParams: {
          courseId: postCourseId || IdCourse,
          capsuleId: postCapsuleId || IdCapsule,
        },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        setGetModules([
          ...res?.courseDetails?.offlineCourseContents?.modules?.map((item) => {
            return {
              title: item?.name,
              key: item?.name,
            };
          }),
        ]);
        const topics = [
          ...res?.courseDetails?.offlineCourseContents.modules?.map((item) => {
            if (item?.topics) {
              return [
                ...item?.topics,
                ...res?.courseDetails?.onlineCourseContents?.modules
                  ?.find((fi) => fi?.id === item?.id)
                  ?.tests?.map((data) => {
                    return { ...data, mode: 'ONLINE' };
                  }),
              ];
            }
            return [
              ...item?.tests,
              ...res?.courseDetails?.onlineCourseContents?.modules
                ?.find((fi) => fi?.id === item?.id)
                ?.tests?.map((data) => {
                  return { ...data, mode: 'ONLINE' };
                }),
            ];
          }),
        ];
        GetRows(
          res?.numOfDays,
          topics,
          res?.courseDetails?.offlineCourseContents?.modules?.map((show) => show?.id),
        );
      }
    });
  };
  const CapsuleTableRowPost = (values, day) => {
    const body = [];
    let classWorks = [];
    let homeWorks = [];
    let mockTests = [];
    if (capsuleType === 'Regular') {
      classWorks = values.Row[day]?.map((val) => {
        return {
          module: {
            id: val?.moduleId,
          },
          topics: val?.topicId?.map((item) => {
            return {
              topicId: item,
              mode: onlineTopicSelectedKeys[val?.moduleId]?.includes(item) ? 'ONLINE' : 'OFFLINE',
            };
          }),
        };
      });
      classWorks = classWorks?.filter((item) => item?.topics?.length > 0);
      homeWorks = values.Row[day]?.map((val) => {
        return {
          module: {
            id: val?.moduleId,
          },
          topics: val?.homeWorkId?.map((item) => {
            return {
              topicId: item,
              mode: onlineHomeWorkSelectedKeys[val?.moduleId]?.includes(item)
                ? 'ONLINE'
                : 'OFFLINE',
            };
          }),
        };
      });
      homeWorks = homeWorks.filter((item) => item?.topics?.length > 0);
      body[0] = { day, classWorks, homeWorks };
    } else {
      mockTests = values.Row[day]?.map((val) => {
        return {
          module: {
            id: val?.moduleId,
          },
          topics: val?.topicId?.map((item) => {
            return {
              topicId: item,
              mode: onlineTopicSelectedKeys[val?.moduleId]?.includes(item) ? 'ONLINE' : 'OFFLINE',
            };
          }),
        };
      });
      mockTests = mockTests?.filter((item) => item?.topics?.length > 0);
      body[0] = { day, mockTests };
    }
    dispatch({
      type: 'courses/createCapsuleTableRow',
      payload: {
        body,
        pathParams: {
          courseId: postCourseId || IdCourse,
          capsuleId: postCapsuleId || IdCapsule,
        },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        setDataSource(
          dataSource?.map((item) => {
            if (res?.res?.find((val) => val?.day)?.day === item?.day) {
              return {
                ...item,
                status: 'ok',
              };
              // eslint-disable-next-line no-else-return
            } else {
              return { ...item };
            }
          }),
        );
        setTopicListRes([...topicListRes, ...res?.res]);
      }
    });
  };

  const UpdateCapsuleTableRow = (values, day) => {
    const groupId = topicListRes?.find((group) => group?.day === day)?.groupId;
    const body = [];
    let classWorks = [];
    let homeWorks = [];
    let mockTests = [];
    if (capsuleType === 'Regular') {
      classWorks = values.Row[day]?.map((val) => {
        return {
          module: {
            id: val?.moduleId,
          },
          topics: val?.topicId?.map((item) => {
            return {
              topicId: item,
              mode: onlineTopicSelectedKeys[val?.moduleId]?.includes(item) ? 'ONLINE' : 'OFFLINE',
            };
          }),
        };
      });
      classWorks = classWorks?.filter((item) => item?.topics?.length > 0);
      homeWorks = values.Row[day]?.map((val) => {
        return {
          module: {
            id: val?.moduleId,
          },
          topics: val?.homeWorkId?.map((item) => {
            return {
              topicId: item,
              mode: onlineHomeWorkSelectedKeys[val?.moduleId]?.includes(item)
                ? 'ONLINE'
                : 'OFFLINE',
            };
          }),
        };
      });
      homeWorks = homeWorks.filter((item) => item?.topics?.length > 0);
      body[0] = { day, groupId, classWorks, homeWorks };
    } else {
      mockTests = values.Row[day]?.map((val) => {
        return {
          module: {
            id: val?.moduleId,
          },
          topics: val?.topicId?.map((item) => {
            return {
              topicId: item,
              mode: onlineTopicSelectedKeys[val?.moduleId]?.includes(item) ? 'ONLINE' : 'OFFLINE',
            };
          }),
        };
      });
      mockTests = mockTests?.filter((item) => item?.topics?.length > 0);
      body[0] = { day, mockTests, groupId };
    }
    const capsuleGroups = [...body];
    dispatch({
      type: 'courses/capsuleTableRowUpdate',
      payload: {
        body: {
          capsuleGroups,
        },
        pathParams: {
          courseId: postCourseId || IdCourse,
          capsuleId: postCapsuleId || IdCapsule,
        },
      },
    }).then((res) => {
      if (res?.id) {
        setCapsuleCreatedTableRow(false);
        setTopicListRes([
          ...topicListRes?.filter((item) => item?.groupId !== groupId),
          ...res?.capsuleGroups,
        ]);
        setDataSource(
          dataSource?.map((item) => {
            if (day === item?.day) {
              return {
                ...item,
                status: 'ok',
              };
              // eslint-disable-next-line no-else-return
            } else {
              return { ...item };
            }
          }),
        );
      }
    });
  };
  const deletFormTableRow = (key) => {
    const rowGroupId = topicListRes?.find((group) => group?.day === key)?.groupId;
    dispatch({
      type: 'courses/deleteCapsuleFormTableRow',
      payload: {
        pathParams: {
          courseId: postCourseId || IdCourse,
          capsuleId: postCapsuleId || IdCapsule,
          groupId: rowGroupId,
        },
      },
    }).then((response) => {
      if (response?.status === 'ok') {
        message.success('Capsule row deleted successfully');
        setDataSource(dataSource?.filter((res) => res?.key !== key));
        const newObject = { ...topicListRemove };
        dataSource[0]?.moduleId?.forEach((item) => {
          if (newObject[item] !== undefined) {
            delete newObject[item][keyNumber];
          }
        });
        setTopicListRemove({ ...newObject });
        setTopicListRes(topicListRes?.filter((group) => group?.day !== key));
        const Rows = capsuleTableForm?.getFieldsValue('Row');
        if (!Object.keys(Rows).length === 0) {
          Rows.Row[key] = [undefined];
          capsuleTableForm?.setFieldsValue({
            Row: Rows?.Row,
          });
        }
        capsuleForm?.submit();
      } else {
        message.error('Something went wrong');
      }
    });
  };
  function confirm() {
    deletFormTableRow(keyNumber);
  }
  useEffect(() => {
    if (IdCourse && IdCapsule) {
      dispatch({
        type: 'courses/getCourseContent',
        payload: { query: { type: 'COURSE', viewSize: 1000 } },
      }).then((res) => {
        if (res?.records) {
          setSingleCourseDetails(res?.records?.find((item) => item?.courseId === IdCourse));
          PopulateDataInCapsule();
        }
      });
    } else {
      dispatch({
        type: 'courses/getCourseContent',
        payload: {
          query: { type: 'COURSE', hasCapsule: true, viewSize: 1000 },
        },
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (singleCourseDetails?.courseId) {
      capsuleForm.setFieldsValue({
        courseCategory: singleCourseDetails?.categoryName,
        courseSubCategory: singleCourseDetails?.subCategoryName,
      });
      if ((IdCourse && IdCapsule !== undefined) || (IdViewCapsule && IdViewCourse)) {
        capsuleForm.setFieldsValue({
          moduleName: singleCourseDetails?.modules?.map((item) => item?.name),
        });
      }
      capsuleForm.setFieldsValue({
        moduleName: singleCourseDetails?.contentModules?.map((item) => item?.name),
      });
    }
  }, [singleCourseDetails, capsuleForm]);
  function handleChangePagination(current, size) {
    setStartIndex(current * size - 10);
  }
  useEffect(() => {
    if (dataSource?.length > 0) {
      capsuleForm.setFieldsValue({
        numOfDays: Number(dataSource?.length),
      });
    } else if (dataSource?.length === 0) {
      capsuleTableForm.resetFields();
      setTopicListRes([]);
    }
  }, [dataSource, capsuleForm, capsuleTableForm]);
  const checkDifficultyLevelExist = (value) => {
    if (capsuleType === 'Regular' && difficultyLevelsExistingList) {
      if (
        difficultyLevelsExistingList &&
        [...difficultyLevelsExistingList]?.find((item) => item && item === value)
      ) {
        return false;
      }
      return true;
    }
    return null;
  };
  return (
    <>
      <Page
        title={
          (IdViewCourse && IdViewCapsule && 'View Capsule') ||
          (IdCourse && IdCapsule && 'Update Capsule') ||
          'Create capsule'
        }
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Capsules',
                path: '/upload/create-capsule',
              },
              {
                name:
                  (IdViewCourse && IdViewCapsule && 'View Capsule') ||
                  (IdCourse && IdCapsule && 'Update Capsule') ||
                  'Create capsule',
                path: '#',
              },
            ]}
          />
        }
      >
        <div className="bg-white rounded-md shadow-md mt-10">
          <div className="text-base text-gray-800 font-semibold px-5 pt-5 border-b">
            <p>Create Capsule</p>
          </div>
          <div className="px-5 pt-5">
            <Spin
              spinning={
                Boolean(loading) ||
                Boolean(loadingUpdateCapsule) ||
                Boolean(loadingCount) ||
                Boolean(loadingLevelsExisting) ||
                Boolean(loadingPopulateCapsule)
              }
            >
              <Form
                name="capsule"
                form={capsuleForm}
                onFinish={(values) =>
                  capsuleCreated === true || (IdCourse && IdCapsule)
                    ? UpdateCapsuleValues(values)
                    : PostCapsule(values)
                }
              >
                <Row gutter={24} className="pb-5">
                  <Col xl={6} lg={6} md={8} sm={24} xs={24}>
                    <p className="font-medium text-gray-800 mb-3">Name Of capsule</p>
                    <Form.Item
                      name="capsuleName"
                      rules={[{ required: true, message: 'Enter capsule name first' }]}
                    >
                      <Input
                        size="large"
                        disabled={IdViewCapsule && IdViewCourse}
                        placeholder="Enter capsule name"
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={6} lg={6} md={8} sm={24} xs={24}>
                    <p className="font-medium text-gray-800 mb-3">Select course</p>
                    <Form.Item
                      rules={[{ required: true, message: 'Select course please' }]}
                      name={['course', 'id']}
                    >
                      <Select
                        size="large"
                        showSearch
                        placeholder="Select course"
                        disabled={
                          capsuleCreated ||
                          (IdCourse && IdCapsule) ||
                          (IdViewCourse && IdViewCapsule)
                        }
                        onChange={(value) => {
                          // capsuleForm.setFieldsValue({
                          //   capsuleType: props?.content?.isClassTestCapsuleExist
                          //     ? 'mockTest'
                          //     : undefined,
                          // });
                          setSingleCourseDetails(
                            getCourseContent?.records?.find((item) => item?.courseId === value),
                          );

                          capsuleForm?.setFieldsValue({
                            numOfDays: undefined,
                            capsuleType: undefined,
                            difficultyLevel: undefined,
                          });
                          setCapsuleType('');
                        }}
                      >
                        {getCourseContent?.records?.map((content) => (
                          <Select.Option
                            value={content?.courseId}
                            key={content?.courseId}
                            content={content}
                          >
                            {content?.productName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  {singleCourseDetails?.categoryName ? (
                    <Col xl={6} lg={6} md={8} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 mb-3">Category</p>
                      <Form.Item name="courseCategory">
                        <Input
                          size="large"
                          placeholder=""
                          style={{ background: 'white', color: 'black' }}
                          disabled={true}
                        />
                      </Form.Item>
                    </Col>
                  ) : null}
                  {singleCourseDetails?.subCategoryName ? (
                    <Col xl={6} lg={6} md={8} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 mb-3">Subcategory</p>
                      <Form.Item name="courseSubCategory">
                        <Input
                          placeholder=""
                          size="large"
                          style={{ background: 'white', color: 'black' }}
                          disabled={true}
                        />
                      </Form.Item>
                    </Col>
                  ) : null}
                  {singleCourseDetails?.mockTestModules || singleCourseDetails?.contentModules ? (
                    <>
                      <Col xl={6} lg={6} md={8} sm={24} xs={24}>
                        <p className="font-medium text-gray-800 mb-3">Modules</p>
                        <Form.Item name="moduleName">
                          <Select
                            mode="multiple"
                            size="large"
                            style={{ backgroundColor: 'white', color: 'black' }}
                            disabled={true}
                          ></Select>
                        </Form.Item>
                      </Col>
                    </>
                  ) : null}
                  {singleCourseDetails?.courseId && (
                    <>
                      <Col xl={6} lg={6} md={8} sm={24} xs={24}>
                        <p className="mb-1 font-medium text-gray-800 mb-3">Capsule type</p>
                        <Form.Item
                          name="capsuleType"
                          rules={[{ required: true, message: 'Please select capsule type' }]}
                        >
                          <Radio.Group
                            size="large"
                            onChange={(e) => {
                              setCapsuleType(e.target.value);
                              if (e.target.value === 'mockTest') {
                                setTopicCount(getTopicCount?.testCount);
                              } else {
                                setTopicCount(getTopicCount?.topicsCount);
                              }

                              if (e.target.value !== 'mockTest') {
                                capsuleForm.setFieldsValue({
                                  moduleName: singleCourseDetails?.contentModules?.map(
                                    (item) => item?.name,
                                  ),
                                  difficultyLevel: undefined,
                                });
                                dispatch({
                                  type: 'courses/getCourseDifficultyLevels',
                                  payload: {
                                    pathParams: {
                                      courseId: singleCourseDetails?.courseId,
                                    },
                                  },
                                });
                              } else {
                                capsuleForm.setFieldsValue({
                                  moduleName: singleCourseDetails?.mockTestModules?.map(
                                    (items) => items?.name,
                                  ),
                                  difficultyLevel: undefined,
                                });
                              }
                            }}
                            disabled={
                              capsuleCreated ||
                              (IdCourse && IdCapsule) ||
                              (IdViewCapsule && IdViewCourse)
                            }
                          >
                            <Radio
                              style={{ textAlign: 'center', padding: '0px 28px 0px 28px' }}
                              value="Regular"
                              disabled={!singleCourseDetails?.hasContent}
                            >
                              Regular
                            </Radio>
                            <Radio
                              style={{ textAlign: 'center' }}
                              value="mockTest"
                              disabled={!singleCourseDetails?.hasMockTest}
                            >
                              Mock test
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      {capsuleType && (
                        <Col xl={6} lg={6} md={8} sm={24} xs={24}>
                          <p className="mb-1 font-medium text-gray-800 mb-3">Difficulty level</p>
                          <Form.Item
                            name="difficultyLevel"
                            rules={[{ required: true, message: 'Please select difficulty level' }]}
                          >
                            <Radio.Group
                              size="large"
                              disabled={
                                capsuleCreated ||
                                (IdCourse && IdCapsule) ||
                                (IdViewCapsule && IdViewCourse)
                              }
                              onChange={(e) => {
                                setDifficultyLevel(e.target.value);

                                dispatch({
                                  type: 'courses/getTopicCount',
                                  payload: {
                                    pathParams: {
                                      courseId: singleCourseDetails?.courseId,
                                    },
                                    query: {
                                      difficultyLevel: e.target.value,
                                    },
                                  },
                                }).then((res) => {
                                  if (capsuleType === 'mockTest') {
                                    setTopicCount(res?.testCount);
                                  } else {
                                    setTopicCount(res?.topicsCount);
                                  }
                                });
                              }}
                              buttonStyle="solid"
                              rules={[
                                { required: true, message: 'Please select difficulty level' },
                              ]}
                            >
                              <Radio.Button
                                style={{ textAlign: 'center', padding: '0px 28px 0px 28px' }}
                                disabled={checkDifficultyLevelExist('EASY')}
                                value="EASY"
                              >
                                Easy
                              </Radio.Button>
                              <Radio.Button
                                style={{ textAlign: 'center' }}
                                value="INTERMEDIATE"
                                disabled={checkDifficultyLevelExist('INTERMEDIATE')}
                              >
                                Intermediate
                              </Radio.Button>
                              <Radio.Button
                                style={{ textAlign: 'center', padding: '0px 28px 0px 28px' }}
                                value="HARD"
                                disabled={checkDifficultyLevelExist('HARD')}
                              >
                                Hard
                              </Radio.Button>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                      )}
                    </>
                  )}

                  {capsuleType === 'Regular' ? (
                    <Col xl={6} lg={6} md={8} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 mb-3" />

                      {capsuleType === 'Regular' && (
                        <div className="flex gap-5 mt-8">
                          <Form.Item
                            name={['capulsefor', 'classWork']}
                            valuePropName="checked"
                            initialValue={true}
                          >
                            <Checkbox value={true} checked={true} disabled>
                              <span className="m-0 font-medium text-gray-900 pl-1">Class work</span>
                            </Checkbox>
                          </Form.Item>
                          <Form.Item name={['capulsefor', 'homeWork']} valuePropName="checked">
                            <Checkbox
                              disabled={
                                capsuleCreated ||
                                (IdCourse && IdCapsule) ||
                                (IdViewCapsule && IdViewCourse)
                              }
                            >
                              <span className="m-0 font-medium text-gray-900 pl-1">Home Work</span>
                            </Checkbox>
                          </Form.Item>
                        </div>
                      )}
                    </Col>
                  ) : null}
                  {singleCourseDetails?.courseId && difficultyLevel && (
                    <Col xl={6} lg={6} md={8} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 mb-3 ">No. of days</p>
                      <Form.Item
                        name="numOfDays"
                        rules={[
                          { required: true, message: 'Enter no. of days' },
                          () => ({
                            validator(_, value) {
                              if (value <= topicCount) {
                                // eslint-disable-next-line prefer-promise-reject-errors
                                return Promise.resolve();
                                // eslint-disable-next-line no-else-return
                              } else {
                                return Promise.reject(
                                  new Error(
                                    topicCount !== undefined
                                      ? `You have only ${topicCount} ${
                                          capsuleType === 'mockTest' ? 'test' : 'topic'
                                        } of this course`
                                      : `please select course first`,
                                  ),
                                );
                              }
                            },
                          }),
                        ]}
                      >
                        <InputNumber
                          size="large"
                          placeholder="Enter no. of days"
                          disabled={IdViewCapsule && IdViewCourse}
                          min={dataSource?.length === 0 ? 1 : dataSource?.length}
                          style={{ width: '100%' }}
                          onBlur={(e) => {
                            if (e.target.value > topicCount) {
                              capsuleForm.setFieldsValue({
                                numOfDays: topicCount,
                              });
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                  )}
                </Row>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                  <Form.Item>
                    <div>
                      {capsuleCreated === true || (IdCourse && IdCapsule) ? (
                        <Button
                          disabled={IdViewCapsule && IdViewCourse}
                          htmlType="submit"
                          type="primary"
                          size="large"
                          style={{ width: '150px' }}
                        >
                          Update Capsule
                        </Button>
                      ) : (
                        <Button
                          htmlType="submit"
                          type="primary"
                          size="large"
                          style={{ width: '150px' }}
                        >
                          Save
                        </Button>
                      )}
                    </div>
                  </Form.Item>
                </div>
              </Form>
            </Spin>
          </div>
        </div>
        <div className="mt-10 bg-white rounded-md shadow-md">
          <CheckValidation
            show={dataSource?.length > 0}
            fallback={
              <EmptyState
                emptyState={emptyStateSvg}
                emptyHeaderText={<span>No Capsule have been Created yet!</span>}
              />
            }
          >
            <Spin
              spinning={
                (Boolean(createCapsuleResponse) && Boolean(loadingTableRowSave)) ||
                (Boolean(createCapsuleResponse) && Boolean(loadingUpdateTableRow)) ||
                Boolean(loadingUpdateCapsule)
              }
            >
              <Form
                name="tableForm"
                form={capsuleTableForm}
                onFinish={(values) =>
                  capsuleCreatedTableRow === true
                    ? UpdateCapsuleTableRow(values, keyNumber)
                    : CapsuleTableRowPost(values, keyNumber)
                }
                style={{ width: '100%', overflowX: 'scroll' }}
              >
                <table
                  className={`table-fixed ${
                    dataSource[0]?.moduleId?.length > 2
                      ? 'max-content'
                      : 'xl:w-full lg:w-full md:max-content'
                  }`}
                  cellPadding={10}
                >
                  <tr className="bg-gray-50 text-gray-900 font-light border-b">
                    <th className="text-center w-40 py-3.5 truncate">No. of day</th>
                    {/* <th></th> */}
                    {getModules?.map((show) => (
                      <th key={show?.key} className="text-left py-3.5  capitalize">
                        {show?.title}
                      </th>
                    ))}
                    <th className="text-center w-40  py-3.5">Action</th>
                  </tr>
                  {dataSource
                    ?.filter((_, index) => index >= startIndex && index < startIndex + 10)
                    ?.map((display, index) => (
                      <tr key={display?.key} className="hover:bg-gray-50">
                        <td className="text-center w-40 py-3.5">{index + startIndex + 1}</td>

                        {display?.topics?.map((dis, idx) => (
                          <>
                            <td key={display?.moduleId[idx]} className="py-3.5 w-96">
                              <Form.Item
                                name={['Row', display?.key, idx, 'moduleId']}
                                style={{ margin: '0%', display: 'none' }}
                                initialValue={display?.moduleId[idx]}
                              >
                                <Input
                                  style={{ margin: '0%', display: 'none' }}
                                  value={display?.moduleId[idx]}
                                />
                              </Form.Item>
                              {dis
                                ?.filter(
                                  ({ id }) =>
                                    !Object.values(
                                      topicListRemove?.[display?.moduleId?.[idx]] || [],
                                    )
                                      .flat()
                                      ?.includes(id) ||
                                    topicListRemove[display?.moduleId?.[idx]][
                                      display?.key
                                    ]?.includes(id),
                                )
                                ?.map((items) => items).length > 0 ? (
                                <>
                                  <Form.Item
                                    name={['Row', display?.key, idx, 'topicId']}
                                    style={{ margin: '0%' }}
                                  >
                                    <Select
                                      allowClear
                                      style={{ overflow: 'visible' }}
                                      showSearch
                                      optionFilterProp="filter"
                                      filterOption
                                      placeholder={
                                        (createdCapsuleDetails?.capsuleType === 'Regular' &&
                                          'Select class work topic..') ||
                                        'Select topic..'
                                      }
                                      getPopupContainer={(node) =>
                                        dataSource?.length > 2 ? node.parentNode : node
                                      }
                                      tagRender={({ label, closable, onClose }) => {
                                        const render = label?.props?.item;
                                        if (render?.mode === 'ONLINE') {
                                          return (
                                            <Tag
                                              closable={closable}
                                              onClose={onClose}
                                              color="green"
                                            >
                                              {render?.name}
                                            </Tag>
                                          );
                                        }
                                        return (
                                          <Tag closable={closable} onClose={onClose} color="blue">
                                            {render?.name}
                                          </Tag>
                                        );
                                      }}
                                      onSelect={(value, props) => {
                                        if (props?.children?.props?.item?.mode === 'ONLINE') {
                                          setOnlineTopicSelectedKeys((prev) => ({
                                            ...prev,
                                            [display?.moduleId[idx]]: [
                                              ...(prev[display?.moduleId[idx]] || []),
                                              value,
                                            ],
                                          }));
                                        }
                                      }}
                                      onDeselect={(value, props) => {
                                        if (props?.children?.props?.item?.mode === 'ONLINE') {
                                          setOnlineTopicSelectedKeys((prev) => ({
                                            ...prev,
                                            [display?.moduleId[idx]]: prev[
                                              display?.moduleId[idx]
                                            ]?.filter((item) => item !== value),
                                          }));
                                        }
                                      }}
                                      mode={'multiple'}
                                      onChange={(val) => {
                                        setTopicListRemove((prev) => ({
                                          ...prev,
                                          [display?.moduleId[idx]]: {
                                            ...prev[display?.moduleId[idx]],
                                            [display?.key]: val,
                                          },
                                        }));
                                      }}
                                      disabled={
                                        display?.status === 'ok'
                                          ? true
                                          : null || (IdViewCapsule && IdViewCourse)
                                      }
                                    >
                                      {dis

                                        ?.filter(
                                          ({ id }) =>
                                            !Object.values(
                                              topicListRemove?.[display?.moduleId?.[idx]] || [],
                                            )
                                              .flat()
                                              ?.includes(id) ||
                                            topicListRemove[display?.moduleId?.[idx]][
                                              display?.key
                                            ]?.includes(id),
                                        )
                                        ?.map((items) => (
                                          <Option
                                            filter={items?.name}
                                            key={items?.id}
                                            value={items?.id}
                                          >
                                            <div className="flex justify-between" item={items}>
                                              <span>{items?.name}</span>
                                              {items?.mode === 'ONLINE' && (
                                                <span>
                                                  <CircleFill className="text-green-500 mt-0.5 pl-1" />
                                                </span>
                                              )}
                                            </div>
                                          </Option>
                                        ))}
                                    </Select>
                                  </Form.Item>
                                </>
                              ) : (
                                <p className="text-gray-900 font-medium text-center border m-1 py-0.5">
                                  No more topics yet
                                </p>
                              )}
                              {createdCapsuleDetails?.isHomeWorkIncluded &&
                                (dis
                                  ?.filter(
                                    ({ id }) =>
                                      !Object.values(
                                        homeWorkListRemove?.[display?.moduleId?.[idx]] || [],
                                      )
                                        .flat()
                                        ?.includes(id) ||
                                      homeWorkListRemove[display?.moduleId?.[idx]][
                                        display?.key
                                      ]?.includes(id),
                                  )
                                  ?.map((items) => items).length > 0 ? (
                                  <>
                                    <div className=" font-medium text-gray-900 mb-1 mt-1" />
                                    <Form.Item
                                      name={['Row', display?.key, idx, 'homeWorkId']}
                                      style={{ margin: '0' }}
                                    >
                                      <Select
                                        allowClear
                                        style={{ overflow: 'visible' }}
                                        placeholder="Select home work topic.."
                                        showSearch
                                        optionFilterProp="filter"
                                        filterOption
                                        getPopupContainer={(node) =>
                                          dataSource?.length > 2 ? node.parentNode : node
                                        }
                                        mode={'multiple'}
                                        tagRender={({ label, closable, onClose }) => {
                                          const render = label?.props?.item;
                                          if (render?.mode === 'ONLINE') {
                                            return (
                                              <Tag
                                                closable={closable}
                                                onClose={onClose}
                                                color="green"
                                              >
                                                {render?.name}
                                              </Tag>
                                            );
                                          }
                                          return (
                                            <Tag closable={closable} onClose={onClose} color="blue">
                                              {render?.name}
                                            </Tag>
                                          );
                                        }}
                                        onSelect={(value, props) => {
                                          if (props?.children?.props?.item?.mode === 'ONLINE') {
                                            setOnlineHomeWorkSelectedKeys((prev) => ({
                                              ...prev,
                                              [display?.moduleId[idx]]: [
                                                ...(prev[display?.moduleId[idx]] || []),
                                                value,
                                              ],
                                            }));
                                          }
                                        }}
                                        onDeselect={(value, props) => {
                                          if (props?.children?.props?.item?.mode === 'ONLINE') {
                                            setOnlineHomeWorkSelectedKeys((prev) => ({
                                              ...prev,
                                              [display?.moduleId[idx]]: prev[
                                                display?.moduleId[idx]
                                              ]?.filter((item) => item !== value),
                                            }));
                                          }
                                        }}
                                        onChange={(val) => {
                                          setHomeWorkListRemove((prev) => ({
                                            ...prev,
                                            [display?.moduleId[idx]]: {
                                              ...prev[display?.moduleId[idx]],
                                              [display?.key]: val,
                                            },
                                          }));
                                        }}
                                        disabled={
                                          display?.status === 'ok'
                                            ? true
                                            : null || (IdViewCapsule && IdViewCourse)
                                        }
                                      >
                                        {dis
                                          ?.filter(
                                            ({ id }) =>
                                              !Object.values(
                                                homeWorkListRemove?.[display?.moduleId?.[idx]] ||
                                                  [],
                                              )
                                                .flat()
                                                ?.includes(id) ||
                                              homeWorkListRemove[display?.moduleId?.[idx]][
                                                display?.key
                                              ]?.includes(id),
                                          )
                                          ?.map((items) => (
                                            <Option
                                              filter={items?.name}
                                              key={items?.id}
                                              value={items?.id}
                                            >
                                              <div className="flex justify-between" item={items}>
                                                <span>{items?.name}</span>
                                                {items?.mode === 'ONLINE' && (
                                                  <span>
                                                    <CircleFill className="text-green-500 mt-0.5 pl-1" />
                                                  </span>
                                                )}
                                              </div>
                                            </Option>
                                          ))}
                                      </Select>
                                    </Form.Item>
                                  </>
                                ) : (
                                  <p className="text-gray-900 font-medium text-center border m-1 py-0.5">
                                    No more H/W topics yet
                                  </p>
                                ))}
                            </td>
                          </>
                        ))}

                        <td className="py-3.5 w-40">
                          <div className="flex justify-center gap-8">
                            {display?.status === 'ok' ? (
                              <div>
                                <a
                                  disabled={IdViewCapsule && IdViewCourse}
                                  onClick={() => {
                                    setDataSource(
                                      dataSource?.map((item) => {
                                        if ([item]?.find((val) => val?.day === display?.key)) {
                                          return {
                                            ...item,
                                            status: 'notOk',
                                          };
                                          // eslint-disable-next-line no-else-return
                                        } else {
                                          return { ...item };
                                        }
                                      }),
                                    );
                                  }}
                                >
                                  Edit
                                </a>
                              </div>
                            ) : (
                              <div>
                                {display?.status === 'notOk' ? (
                                  <a
                                    onClick={() => {
                                      capsuleTableForm.submit();
                                      setKeyNumber(display?.key);
                                      setCapsuleCreatedTableRow(true);
                                    }}
                                  >
                                    Update
                                  </a>
                                ) : (
                                  <a
                                    disabled={IdViewCapsule && IdViewCourse}
                                    onClick={() => {
                                      capsuleTableForm.submit();
                                      setKeyNumber(display?.key);
                                      setCapsuleCreatedTableRow(false);
                                    }}
                                  >
                                    Save
                                  </a>
                                )}
                              </div>
                            )}
                            <div>
                              {display?.status === 'ok' || display?.status === 'notOk' ? (
                                <Popconfirm
                                  disabled={IdViewCapsule && IdViewCourse}
                                  title="Are you sure to delete this row?"
                                  onConfirm={confirm}
                                  onCancel={null}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <a
                                    disabled={IdViewCapsule && IdViewCourse}
                                    onClick={() => {
                                      setKeyNumber(display?.key);
                                    }}
                                  >
                                    Delete
                                  </a>
                                </Popconfirm>
                              ) : (
                                <Popconfirm
                                  title="Are you sure to delete this rowssss?"
                                  onConfirm={() => {
                                    setDataSource(
                                      dataSource?.filter((items) => items?.key !== display?.key),
                                    );
                                    const Rows = capsuleTableForm?.getFieldsValue('Row');
                                    Rows.Row[display?.key] = [undefined];
                                    capsuleTableForm?.setFieldsValue({
                                      Row: Rows?.Row,
                                    });
                                    capsuleForm?.submit();
                                    if (topicListRemove?.length !== 0) {
                                      const newObject = { ...topicListRemove };
                                      dataSource[0]?.moduleId?.forEach((item) => {
                                        if (newObject[item] !== undefined) {
                                          delete newObject[item][display?.key];
                                        }
                                      });
                                      setTopicListRemove({ ...newObject });
                                    }
                                  }}
                                  onCancel={null}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <a
                                    disabled={IdViewCapsule && IdViewCourse}
                                    onClick={() => setKeyNumber(display?.key)}
                                  >
                                    Delete
                                  </a>
                                </Popconfirm>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                </table>
              </Form>
              {dataSource?.length > 8 ? (
                <div className="flex justify-end bg-gray-50 pr-6 py-5 border-t">
                  <Pagination
                    defaultCurrent={1}
                    total={dataSource?.length}
                    onChange={handleChangePagination}
                    showSizeChanger={false}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                  />
                </div>
              ) : null}
            </Spin>
          </CheckValidation>
        </div>
        {(IdViewCapsule && IdViewCourse) === undefined ? (
          <FixedFooter classes="text-right">
            <div className="flex mr-36 py-2.5">
              <div className="w-full ">
                <Button
                  type="primary"
                  disabled={dataSource?.length < 1 ? true : null}
                  onClick={() => {
                    if (
                      dataSource?.find((findSource) => findSource?.status === 'ok')?.status === 'ok'
                    ) {
                      setDataSource(dataSource?.filter((item) => item?.status !== undefined));
                      capsuleForm.submit();
                      history.push(`/upload/create-capsule`);
                    } else {
                      message.error('Please save atleast one row or update rows');
                    }
                  }}
                  style={{ height: '2.5rem', fontWeight: '500', fontSize: '15px' }}
                >
                  {IdCourse && IdCapsule ? 'Update Capsule' : 'Create capsule'}
                </Button>
              </div>
            </div>
          </FixedFooter>
        ) : null}
      </Page>
    </>
  );
};

export default connect(({ courses, loading }) => ({
  getCourseContent: courses?.getCourseContent,
  getTopicCount: courses?.getTopicCount,
  difficultyLevelsExistingList: courses?.difficultyLevelsExistingList,
  loading: loading?.effects['courses/postCapsule'],
  loadingCount: loading?.effects['courses/getTopicCount'],
  loadingUpdateCapsule: loading?.effects['courses/updateCapsule'],
  loadingTableRowSave: loading?.effects['courses/createCapsuleTableRow'],
  loadingUpdateTableRow: loading?.effects['courses/capsuleTableRowUpdate'],
  loadingLevelsExisting: loading?.effects['courses/getCourseDifficultyLevels'],
  loadingPopulateCapsule: loading?.effects['courses/getCapsuleDetail'],
}))(CreateNewCapsule);
