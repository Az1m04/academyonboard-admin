import Breadcrumbs from '@/components/BreadCrumbs';
import Page from '@/components/Page';
import { UsergroupAddOutlined, UserOutlined } from '@ant-design/icons';
import { Row, Col, Button, Popover, Tag } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React from 'react';

const ViewBatch = () => {
  return (
    <div className="">
      <Page
        title="Batch name"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Batchlist',
                path: '/batches/all',
              },
              {
                name: '25546',
              },
            ]}
          />
        }
      >
        <div className="mx-12 my-8">
          <Row gutter={16}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <div>
                <div className="flex items-center justify-between bg-white shadow-sm px-4 py-4 border">
                  <span className="items-center text-gray-500 font-semibold">
                    <UsergroupAddOutlined className="mx-2 text-lg" /> INSTRUCTORS / TRAINERS
                  </span>
                  <div>
                    <Button size="small">Add</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-4 border">
                  <span className="items-center text-gray-500 font-semibold">
                    <Avatar
                      size="small"
                      style={{
                        backgroundColor: '#87d068',
                      }}
                      icon={<UserOutlined />}
                    />
                    {'  '}
                    Demo Trainer 2
                  </span>
                  <div>
                    <Popover content="Information about demo trainer">
                      {' '}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="currentColor"
                        className="bi bi-info-circle-fill text-blue-700"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                      </svg>
                    </Popover>
                  </div>
                </div>
                <div className="items-center justify-between bg-white shadow-sm px-4 py-2 border">
                  <span className="items-center font-semibold text-xl">AZ-MELT Program</span>
                  <p className="mt-4 mb-0">
                    Learn all the skills you need to become a proficient truck driver, includes
                    in-class and in-yard trainings
                  </p>
                </div>
                <div className="items-center justify-between bg-white shadow-sm px-4 py-2 border">
                  <span className="flex items-center font-semibold text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-alarm mr-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5z" />
                      <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1h-3zm1.038 3.018a6.093 6.093 0 0 1 .924 0 6 6 0 1 1-.924 0zM0 3.5c0 .753.333 1.429.86 1.887A8.035 8.035 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5zM13.5 1c-.753 0-1.429.333-1.887.86a8.035 8.035 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1z" />
                    </svg>{' '}
                    103.5 hours / 45 days
                  </span>
                  <div className="flex mt-2">
                    {' '}
                    <span className="ml-6 text-gray-500 text-sm border-r">
                      34 hr <Tag color="gold">In-yard</Tag>
                    </span>
                    <span className="ml-6 text-gray-500 text-sm">
                      44 hr <Tag color="geekblue">In-class</Tag>
                    </span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={16} lg={16} xl={16}>
              <div>
                <div className="flex items-center justify-between bg-white shadow-sm px-4 py-4 border">
                  <span className="items-center font-semibold text-lg">
                    Manage program schedule
                  </span>
                  <div>
                    <Button size="small">Add</Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Page>
    </div>
  );
};

export default ViewBatch;
