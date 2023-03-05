/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect, useParams } from 'umi';
import { Typography, Col, Row, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ImageUpload from '@/components/ImageUpload';
import dayjs from 'dayjs';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import styles from './index.less';
import UpdateStaffDetails from '../component/UpdateStaffDetails';
import StaffClassDetails from './StaffClassDetails';

const { Paragraph } = Typography;

/**
 *
 * @StaffDetails - The purpose of this component is to get details of particular staff member
 */

/**
* @property {Object} staffDetails is the details of single staff

*/

const StaffDetails = ({ dispatch, staffDetails, match }) => {
  const { staffId } = useParams();
  const [visible, setVisible] = useState(false);

  const getStaffDetail = () =>
    dispatch({
      type: 'staff/getStaffDetails',
      payload: {
        staffId,
      },
    });
  useEffect(() => {
    getStaffDetail();
  }, []);

  const type = 'Staff member';
  return (
    <div className="container mx-auto">
      <Page
        title="Staff"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'All Staff Members',
                path: '/staff/list/all',
              },
            ]}
          />
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={10} lg={10} xl={8} xxl={8}>
            <div className="rounded shadow bg-white">
              <div className={`${styles.NameWrapper} flex items-center px-6 py-4 border-b`}>
                <div>
                  <ImageUpload partyId={staffId} partyImage={null} />
                </div>
                <div className="pl-4 w-full">
                  <span className="flex justify-between">
                    <div className={styles.LeadName}>
                      <Paragraph
                        className="w-full text-lg font-semibold"
                        ellipsis
                        title={staffDetails?.display_name}
                      >
                        {staffDetails?.display_name}
                      </Paragraph>
                    </div>
                    <Tooltip title="Edit">
                      <EditOutlined
                        onClick={() => {
                          // setEditBasicDetailsModal(!editBasicDetailsModal);
                          setVisible(!visible);
                        }}
                        className={` text-blue-700 font-semibold hover:font-bold border-blue-600`}
                        style={{ color: '#3182ce' }}
                      />
                    </Tooltip>
                  </span>
                  <div title="Designation" className={styles.LeadDesignation}>
                    <Paragraph className="w-full" ellipsis title={`${type} since 3 months ago`}>
                      {type} since {staffDetails?.created_at_pretty}
                    </Paragraph>
                  </div>
                </div>
              </div>
              {/* Adhar Number */}
              <div className="flex justify-between border-b  px-6 py-4">
                <div className="text-sm text-gray-500 uppercase">Adhar Number</div>
                <div
                  className={`${styles.LeadCompanyEmail} flex truncate font-semibold text-black`}
                >
                  <div className="pl-2">
                    <Paragraph
                      style={{ maxWidth: 275 }}
                      title={staffDetails?.aadhar_number}
                      ellipsis
                    >
                      {staffDetails?.aadhar_number}
                    </Paragraph>
                  </div>
                </div>
              </div>
              {/* Date Of Birth */}
              <div className="flex justify-between border-b  px-6 py-4">
                <div className="text-sm text-gray-500 uppercase">Date of Birth</div>
                <div className={`flex ${styles.LeadCompanyPhone}`}>
                  <div className="font-semibold text-black">
                    <span className="ml-2">
                      {dayjs(staffDetails?.birth_date).format('MMMM D, YYYY')}
                    </span>
                  </div>
                </div>
              </div>
              {/* Date of Joining */}
              <div className="flex justify-between border-b  px-6 py-4">
                <div className="text-sm text-gray-500 uppercase">Date Of Joining</div>
                <div
                  className={`${styles.LeadCompanyEmail} flex truncate font-semibold text-black`}
                >
                  <div className="pl-2">
                    <Paragraph
                      style={{ maxWidth: 275 }}
                      title={staffDetails?.joining_date}
                      ellipsis
                    >
                      {dayjs(staffDetails?.joining_date).format('MMMM D, YYYY')}
                    </Paragraph>
                  </div>
                </div>
              </div>
              {/* Occupation */}
              <div className="flex justify-between border-b  px-6 py-4">
                <div className="text-sm text-gray-500 uppercase">Occupation</div>
                <div
                  className={`${styles.LeadCompanyEmail} flex truncate font-semibold text-black`}
                >
                  <div className="pl-2">
                    <Paragraph
                      style={{ maxWidth: 275 }}
                      title={staffDetails?.qualification}
                      ellipsis
                    >
                      {staffDetails?.qualification}
                    </Paragraph>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={14} lg={14} xl={16} xxl={16}>
            <div className="bg-white shadow">
              <StaffClassDetails {...{ match, getStaffDetail }} />
            </div>
          </Col>
        </Row>
        <UpdateStaffDetails {...{ visible, setVisible }} />
      </Page>
    </div>
  );
};

export default connect(({ staff }) => ({
  staffDetails: staff.staffDetails,
}))(StaffDetails);
