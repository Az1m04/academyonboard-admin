import React from 'react';
import { Row, Col, Typography, Button, Tooltip } from 'antd';
import emptyAddressSvg from '@/assets/img/empty-address.svg';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Building, GeoAltFill } from 'react-bootstrap-icons';
import LeadDetailsSection from '../LeadDetailsSection';
import ContactDetailsSection from '@/components/ContactDetailsSection';
import './index.less';
import ImageUploadMmo from '../../../components/ImageUploadMmo';
// import ClientActivities from './ClientActivities';

dayjs.extend(relativeTime);

const { Paragraph } = Typography;

const ClientProfile = (props) => {
  // eslint-disable-next-line no-console
  console.log(props, 'props');
  return (
    <div className="h-full">
      <div
        className="flex flex-col h-64 items"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(52, 211, 153, 0), rgba(0, 133, 255, 1))',
        }}
      >
        <div className="bg-gradient-to-r from-green-400 to-blue-500 h-full" />
        {/* ${leadDetails?.addresses[0]?.staticMapUrl} */}
        <div
          className="container px-4 mx-auto items-center mb-10"
          // style={{ marginTop: '-13.72rem' }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <div className="pt-6 pb-4 border-b">
                <div className="rounded bg-white shadow">
                  <div className="relative w-full">
                    <img
                      className="self-center inline-block w-full h-full cursor-pointer rounded-t"
                      src={emptyAddressSvg}
                      alt="Lead location map"
                      size={120}
                    />
                  </div>
                  <div
                    className="px-6 py-4 -mt-20 flex items-center justify-center"
                    style={{ marginTop: '-5rem' }}
                  >
                    <ImageUploadMmo
                      wrapperClassName="relative bg-white shadow rounded-full p-1"
                      // leadImage={LeadImage}
                      size={120}
                      photoOwnerInitials="SS"
                    />
                  </div>
                  <div>
                    <div className="pl-4 w-full text-center">
                      <div className="text-2xl font-semibold text-black">Mr. john</div>
                      <div className="flex items-center justify-center text-lg">
                        <Paragraph
                          ellipsis
                          className="flex items-center justify-center text-lg font-semibold"
                          editable={false}
                          title="jAssistant Manager"
                        >
                          Assistant Manager
                        </Paragraph>
                      </div>
                      {/* Company details */}
                      <div className="font-medium text-gray-800 flex items-center justify-center pt-2">
                        <Building className="mr-1 text-base" /> ML Dhingra Complex
                      </div>
                      {/* lead contact location */}
                      <div className="pt-2">
                        <div className="flex items-center justify-center space-x-2">
                          <div>
                            <GeoAltFill />
                          </div>
                          <div>United Kingdom</div>
                          <div className="inline-block mr-2 text-black">
                            {/* <Flag style={{ color: 'black' }}
                          countryCode={getCompanyFlag()} svg /> */}
                          </div>
                        </div>
                      </div>
                      {/* Created date */}
                      <div className="pt-2 text-center text-base">
                        <div>Added {dayjs().fromNow()}</div>
                        <div>Last modified {dayjs().fromNow()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full p-2">
                    <Button type="primary" size="large" block>
                      Edit Profile
                    </Button>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2 border-b">
                    <div className="app-label">Assignees</div>
                  </div>
                  {/* Lead owner */}
                  <div className="px-4 py-2 border-b">
                    <div>
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex">
                            <div className="mr-2">
                              <img
                                className="rounded-full"
                                src="https://cdn.managemyorg.com/pub/user/avatar/6eb40a1d-04c8-44d3-ab5d-ed1618fa53b0.png"
                                alt="Elon"
                                width={34}
                              />
                            </div>
                            <div>
                              <div className="flex space-x-1">
                                <span className="font-bold">Joban Saund</span>
                              </div>
                              <div className="text-gray-500 leading-4">Owner</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <Tooltip title="Change lead owner">
                              <Button>Change</Button>
                            </Tooltip>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                  {/* Lead assignee */}
                  <div className="px-4 py-2 border-b">
                    <div>
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex">
                            <div className="mr-2">
                              <img
                                className="rounded-full"
                                src="https://cdn.managemyorg.com/pub/user/avatar/6eb40a1d-04c8-44d3-ab5d-ed1618fa53b0.png"
                                alt="Elon"
                                width={34}
                              />
                            </div>
                            <div>
                              <div className="flex space-x-1">
                                <span className="font-bold">Joban Saund</span>
                              </div>
                              <div className="text-gray-500 leading-4">Assignee</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <Tooltip title="Change lead owner">
                              <Button>Change</Button>
                            </Tooltip>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <LeadDetailsSection />
              </div>
              <div>
                <ContactDetailsSection title="Contact Details" />
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={16} xl={16}>
              <div className="pt-4">
                {/* eslint-disable-next-line react/destructuring-assignment */}
                {props.children}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
