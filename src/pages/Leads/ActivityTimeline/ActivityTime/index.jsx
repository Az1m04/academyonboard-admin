import AppIcons from '@/utils/AppIcons';
import {
  NodePlus,
  BlackBoard,
  DemoCalender,
  PersonDashFill,
  JournalText,
  Dollar,
  PersonWorkSpace,
  BookFill,
  BookHalf,
  PersonCheck,
} from '@/utils/AppIcons';
import dayjs from 'dayjs';

const ActivityTime = ({ activityRec }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'lead_priority':
        return <AppIcons.SortUp />;

      case 'lead_owner':
        return <AppIcons.PersonSquare />;

      case ' lead_follow_up_by':
        return <NodePlus />;

      case 'lead_demo_class':
        return <BlackBoard />;

      case 'demo_account':
        return <DemoCalender />;

      case 'lead_expired':
        return <PersonDashFill />;

      case 'lead_assessment_test':
        return <JournalText />;

      case 'student_payment':
        return <Dollar />;

      case 'lead_follow_up_by_student':
        return <PersonWorkSpace />;

      case 'add_student_course':
        return <BookFill />;

      case 'update_student_course':
        return <BookHalf />;

      case 'batch_assignee':
        return <PersonCheck />;
      default:
        return <AppIcons.PeopleFill />;
    }
  };
  const getTimelineIcon = (type) => {
    return (
      <div
        className="flex items-center justify-center w-8 h-8 text-white rounded-full"
        style={{ backgroundColor: '#ffa500' }}
      >
        {getActivityIcon(type)}
      </div>
    );
  };

  return (
    <div className="mt-4">
      {activityRec?.records?.map((rec, i) => (
        <div key={i} className=" flex items-center mb-2">
          {getTimelineIcon(rec?.activityType)}
          <div className="ml-2">{dayjs(rec?.startTime).format('h:mm A')}</div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTime;
