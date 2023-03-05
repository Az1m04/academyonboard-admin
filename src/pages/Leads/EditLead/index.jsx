import React from 'react';
import Icon, {
  LineChartOutlined,
  UsergroupAddOutlined,
  ScheduleOutlined,
  CommentOutlined,
  FormOutlined,
  FileAddOutlined,
} from '@ant-design/icons';
import AppIcons from '@/utils/AppIcons';
import { connect } from 'dva';
import EditStatus from '../EditStatus';
import EditLeadOwner from '../EditLeadOwner';
import AddFollowUp from '../AddFollowUp';
import EditLeadPriority from '../EditLeadPriority';
import AddNote from '../AddNote';
import AddDemoClass from '../AddDemoClass';
import AssignAssessmentTest from '../AssignAssessmentTest';
import ActivityTimeline from '../ActivityTimeline';
import AddDemoAccount from '../AddDemoAccount';
import AssignIndividual from '../AssignIndividual';
import { Drawer } from 'antd';

const EditLead = ({ editLead, dispatch, courseId }) => {
  const RenderComponent = () => {
    switch (editLead?.type) {
      case 'STATUS':
        return <EditStatus />;

      case 'LEAD_OWNER':
        return <EditLeadOwner />;

      case 'ADD_FOLLOW_UP':
        return <AddFollowUp editLead={editLead} />;

      case 'ADD_DEMO_CLASS':
        return <AddDemoClass />;

      case 'ASSIGN_ASSESSMENT_TEST':
        return <AssignAssessmentTest courseId={courseId} />;
      case 'ACTIVITY_TIMELINE':
        return <ActivityTimeline />;

      case 'LEAD_PRIORITY':
        return <EditLeadPriority editLead={editLead} />;

      case 'ADD_NOTE':
        return <AddNote editLead={editLead} />;
      case 'ASSIGN_DEMO_ACCOUNT':
        return <AddDemoAccount />;
      case 'ASSIGN_INDIVIDUAL_LEAD':
        return <AssignIndividual />;
      default:
        return null;
    }
  };

  const RenderIcon = () => {
    switch (editLead?.type) {
      case 'STATUS':
        return <LineChartOutlined className="mt-1 text-xl" style={{ color: 'rgba(30,58,138)' }} />;

      case 'LEAD_OWNER':
        return (
          <Icon
            component={AppIcons.PersonSquare}
            className="mt-1.5 text-2xl"
            style={{ color: 'rgba(30,58,138)' }}
          />
        );

      case 'ADD_FOLLOW_UP':
        return (
          <Icon
            component={AppIcons.PeopleFill}
            className="mt-1.5 text-2xl"
            style={{ color: 'rgba(30,58,138)' }}
          />
        );

      case 'ADD_DEMO_CLASS':
        return (
          <Icon
            component={AppIcons.BlackBoard}
            className="mt-1.5 text-2xl"
            style={{ color: 'rgba(30,58,138)' }}
          />
        );

      case 'ACTIVITY_TIMELINE':
        return (
          <Icon
            component={AppIcons.TimelineIcon}
            className="mt-1.5 text-2xl"
            style={{ color: 'rgba(30,58,138)' }}
          />
        );

      case 'ASSIGN_INDIVIDUAL_LEAD':
        return (
          <Icon
            component={AppIcons.PersonPlusFill}
            className="mt-1.5 text-2xl"
            style={{ color: 'rgba(30,58,138)' }}
          />
        );

      case 'ASSIGN_ASSESSMENT_TEST':
        return (
          <Icon
            component={AppIcons.JournalText}
            className="mt-1.5 text-2xl"
            style={{ color: 'rgba(30,58,138)' }}
          />
        );

      case 'ASSIGN_DEMO_ACCOUNT':
        return (
          <Icon
            component={AppIcons.DemoCalender}
            className="mt-1.5 text-2xl"
            style={{ color: 'rgba(30,58,138)' }}
          />
        );

      case 'REFER_TO':
        return (
          <UsergroupAddOutlined className="text-xl mt-1.5" style={{ color: 'rgba(30,58,138)' }} />
        );

      case 'NEXT_ACTION':
        return <ScheduleOutlined className="mt-1 text-xl" style={{ color: 'rgba(30,58,138)' }} />;
      case 'LAST_FOLLOW_UP_COMMENT':
        return <CommentOutlined className="mt-1 text-xl" style={{ color: 'rgba(30,58,138)' }} />;

      case 'REMARKS':
        return <FormOutlined className="mt-1 text-xl" style={{ color: 'rgba(30,58,138)' }} />;

      case 'LEAD_PRIORITY':
        return (
          <Icon
            component={AppIcons.SortUp}
            className="mt-1.5 text-4xl font-bold"
            style={{ color: 'rgba(30,58,138)' }}
          />
        );

      case 'ADD_NOTE':
        return <FileAddOutlined className="mt-1 text-xl" style={{ color: 'rgba(30,58,138)' }} />;

      default:
        return null;
    }
  };

  return (
    <Drawer
      visible={editLead?.visible}
      width={550}
      onClose={() => {
        dispatch({
          type: 'leads/setStates',
          payload: {
            visible: false,
            type: null,
            title: null,
            leadId: null,
          },
          key: 'editLead',
        });
      }}
      bodyStyle={{ padding: '0' }}
      headerStyle={{ padding: '5px 18px 5px 24px' }}
      title={
        <div className="flex w-full px-4 py-4 pt-2">
          <RenderIcon />
          <div className="w-full pl-4">
            <div className="w-full text-base font-semibold text-blue-900">
              {editLead?.title}
              <div className="w-full text-sm font-normal text-gray-500">
                <span>{editLead?.subTitle}</span> for the lead here
              </div>
            </div>
          </div>
        </div>
      }
    >
      <RenderComponent />
    </Drawer>
    // <div
    //   className="fixed h-full right-0 top-16 z-50"
    //   style={{ width: collapsed === false ? '26.4%' : '29.05%', paddingBottom: '100px' }}
    // >
    //   <div className="w-full h-screen overflow-y-auto  bg-white shadow">
    //     <div className="bg-white  h-screen ">
    //       <div className="flex justify-between border-b">
    //         <div className="flex w-full px-4 py-4 pt-2">
    //           <RenderIcon />
    //           <div className="w-full pl-4">
    //             <div className="w-full text-base font-semibold text-blue-900">
    //               {editLead?.title}
    //               <div className="w-full text-sm font-normal text-gray-500">
    //                 <span>{editLead?.subTitle}</span> for the lead here
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="flex items-center justify-center pr-4 text-center">
    //           <CloseOutlined
    //             onClick={() => {
    //               dispatch({
    //                 type: 'leads/setStates',
    //                 payload: {
    //                   visible: false,
    //                   type: null,
    //                   title: null,
    //                   leadId: null,
    //                 },
    //                 key: 'editLead',
    //               });
    //             }}
    //             className="text-base font-semibold cursor-pointer "
    //           />
    //         </div>
    //       </div>

    //       <RenderComponent />
    //     </div>
    //   </div>
    // </div>
  );
};

export default connect(({ leads, global }) => ({
  collapsed: global?.collapsed,
  editLead: leads?.editLead,
}))(EditLead);
