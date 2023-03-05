import React, { useEffect } from 'react';
import { Table, Tooltip } from 'antd';
import { connect } from 'umi';

const AssignedTest = ({ getTestAssigned, dispatch, studentId, loadingTestAssigned }) => {
  //   const getTestsAssigned = () => {
  //     dispatch({
  //       type: 'student/getTestAssigned',
  //       payload: {
  //         pathParams: { studentId },
  //       },
  //     });
  //   };
  useEffect(() => {
    // getTestsAssigned();
  }, [dispatch, studentId]);

  const columns = [
    {
      title: 'Module',
      dataIndex: 'module',
      render: () => (
        <div className="flex w-max">
          <p className="font-medium ">Reading</p>
          <svg
            height="15"
            width="15"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="check"
            className="svg-inline--fa fa-check fa-w-16 text-green-700 mt-1 ml-2"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
            ></path>
          </svg>
        </div>
      ),
    },
    {
      title: 'Course',
      dataIndex: 'courseName',
      render: (record) => {
        return (
          <div className="w-max font-medium">
            <p>{record?.courseName}</p>
          </div>
        );
      },
    },
    {
      title: 'D-Level',
      dataIndex: 'difficultyLevelId',
      // eslint-disable-next-line consistent-return
      render: (text) => {
        switch (text) {
          case 'HARD':
            return (
              <div className="pl-2 w-max ">
                <img
                  className="text-red-700"
                  style={{ color: 'red' }}
                  src="https://cdn-icons-png.flaticon.com/512/3563/3563395.png"
                  height="40"
                  width="40"
                  alt=""
                />
              </div>
            );

          case 'MEDIUM':
            return (
              <div className="pl-2 w-max">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3563/3563394.png"
                  height="40"
                  width="40"
                  alt=""
                />
              </div>
            );

          case 'EASY':
            return (
              <div className="pl-2 w-max">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3563/3563393.png"
                  height="40"
                  width="40"
                  alt=""
                />
              </div>
            );

          default:
            break;
        }
      },
      width: 90,
    },
    {
      title: 'Test',
      dataIndex: 'test',
      render: () => {
        return (
          <div className="w-max">
            <p className="font-medium ">AC/CB-1/RT-1</p>
          </div>
        );
      },
    },
    {
      title: 'Lession',
      dataIndex: 'lession',
      render: () => {
        return (
          <div className="w-max">
            <p className="font-medium ">AC/CB1/RT-1</p>
          </div>
        );
      },
    },
    {
      title: 'Justification',
      dataIndex: 'justification',
      render: () => {
        return (
          <div className="w-max">
            <p className="font-medium ">AC/CB1/RT-1/J</p>
          </div>
        );
      },
    },
    {
      title: 'Answer Key',
      dataIndex: 'answerKey',
      render: () => {
        return (
          <div className="w-max">
            <p className="font-medium ">AC/CB1/RT-1/ak</p>
          </div>
        );
      },
    },
    {
      title: 'Assigned By',
      dataIndex: 'assignedBy',
      render: () => {
        return (
          <Tooltip
            placement="bottom"
            title={
              <p style={{ fontSize: '9px' }}>
                Language Teacher | Reading | Teaching |BO-Kapurthala
              </p>
            }
          >
            <div className="flex w-max">
              <img
                className="rounded-full"
                height="40"
                width="40"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ0OTAqC4xVoXNE8eLYie4DDjlLgZZrwj2cB64su1Z9f5YuarNKHYM8WoOrdFxTqoYjVE&usqp=CAU"
                alt=""
              />
              <h3 className="mt-2 ml-2">Priya Multani</h3>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: 'Date & Time',
      dataIndex: 'assignedOn',
      render: () => {
        return (
          <div className="flex border">
            <div className=" border-r">
              <p className="border-b  m-0 px-2 h-6 w-36">
                <span className="text-green-700 font-medium">AO </span>: 21-10-21
              </p>
              <p className="border-b m-0 px-2 h-6 w-36">
                <span className="text-yellow-700 font-medium">SO </span>: 21-10-21
              </p>
              <p className="px-2 m-0 h-6 w-36">
                <span className="text-red-800 font-medium">CO </span>: 21-10-21
              </p>
            </div>
            <div className="border-r">
              <p className="border-b m-0 px-2 h-6 w-36">
                <span className="text-green-700 font-medium">Start</span> - 09:30AM
              </p>
              <p className="border-b m-0 px-2 h-6 w-36">
                <span className="text-yellow-700 font-medium">End</span> - 09:30AM
              </p>
              <p className="px-2 m-0 h-6 w-36">
                <span className="text-red-800 font-medium">Time</span> - 9h & 30min
              </p>
            </div>
            <div className="">
              <p className="border-b pl-2 m-0 text-xl pl-1 mt-1 w-10 h-8 text-yellow-700 ">26</p>
              <p className="text-xl m-0 pl-1 text-blue-700 w-10">100</p>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      redner: () => {
        return (
          <div className="flex w-max">
            <div className="mr-2">
              <svg
                height="20"
                width="20"
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="save"
                className="svg-inline--fa fa-save fa-w-14"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM272 80v80H144V80h128zm122 352H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h42v104c0 13.255 10.745 24 24 24h176c13.255 0 24-10.745 24-24V83.882l78.243 78.243a6 6 0 0 1 1.757 4.243V426a6 6 0 0 1-6 6zM224 232c-48.523 0-88 39.477-88 88s39.477 88 88 88 88-39.477 88-88-39.477-88-88-88zm0 128c-22.056 0-40-17.944-40-40s17.944-40 40-40 40 17.944 40 40-17.944 40-40 40z"
                ></path>
              </svg>
            </div>
            <div>
              <svg
                height="20"
                width="20"
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="check-square"
                className="svg-inline--fa fa-check-square fa-w-14"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zm0 400H48V80h352v352zm-35.864-241.724L191.547 361.48c-4.705 4.667-12.303 4.637-16.97-.068l-90.781-91.516c-4.667-4.705-4.637-12.303.069-16.971l22.719-22.536c4.705-4.667 12.303-4.637 16.97.069l59.792 60.277 141.352-140.216c4.705-4.667 12.303-4.637 16.97.068l22.536 22.718c4.667 4.706 4.637 12.304-.068 16.971z"
                ></path>
              </svg>
            </div>
          </div>
        );
      },
    },
  ];
  //

  return (
    <div className="mt-5">
      <Table
        loading={loadingTestAssigned}
        columns={columns}
        style={{ width: '100%', overflowX: 'auto' }}
        bordered={true}
        pagination={false}
        dataSource={getTestAssigned}
      />
    </div>
  );
};

export default connect(({ student, loading }) => ({
  getTestAssigned: student?.getTestAssigned?.records,
  loadingTestAssigned: loading.effects['student/getTestAssigned'],
}))(AssignedTest);
