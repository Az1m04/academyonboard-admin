/* eslint-disable no-unused-vars */

import { ApartmentOutlined, ScheduleOutlined, UploadOutlined } from '@ant-design/icons';

const {
  DashboardIcon,
  Kanban,
  Collection,
  LayoutSidebarInset,
  PeopleIcon,
  CardChecklist,
  Book,
  UserGraduate,
  ClientsIcon,
  LeadManager,
  LeadIcon,
  EnquiryIcon,
  LeadFollowUps,
  AssessmentTest,
  DemoClass,
  ScheduleTask,
  Closed,
  UploadFile,
  TeachingSchedule,
  CapsuleIcon,
  BuildingIcon,
  RoundUserIcon,
} = require('@/utils/AppIcons');

export const routes = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    id: '/dashboard',
    icon: DashboardIcon,
  },
  {
    // name: 'Lead manager',
    // // path: '/leads',
    // id: '/leads',
    // icon: LeadManager,
    // routes: [
    // {
    name: 'Students',
    // path: '/leads/students-list',
    id: '/leads/students',
    icon: UserGraduate,
    routes: [
      {
        name: 'Leads',
        id: '/leads/students/leads',
        path: '/leads/students/leads',
        icon: LeadIcon,
      },
      {
        name: 'Enquiries',
        id: '/leads/students/enquiries',
        path: '/leads/students/enquiries',
        icon: EnquiryIcon,
      },
      {
        name: 'Follow ups',
        id: '/leads/students/follow-ups',
        path: '/leads/students/follow-ups',
        icon: LeadFollowUps,
      },
      {
        name: 'Assessment tests',
        id: '/leads/students/assessment-tests',
        path: '/leads/students/assessment-tests',
        icon: AssessmentTest,
      },
      {
        name: 'Demo',
        id: '/leads/students/demo',
        path: '/leads/students/demo',
        icon: DemoClass,
      },
      {
        name: 'Schedule tasks',
        id: '/leads/students/schedule-tasks',
        path: '/leads/students/schedule-tasks',
        icon: ScheduleTask,
      },
      {
        name: 'Closed',
        id: '/leads/students/closed',
        path: '/leads/students/closed',
        icon: Closed,
      },
      // ],
      // },
      {
        name: 'Branch',
        // path: '/leads/clients-list',
        id: '/leads/client',
        icon: LeadManager,
        routes: [
          {
            name: 'Leads',
            id: '/leads/client/leads',
            path: '/leads/client/leads',
          },
          {
            name: 'Follow ups',
            id: '/leads/client/branch/follow-ups',
            path: '/leads/client/branch/follow-ups',
          },
          {
            name: 'Demo',
            id: '/leads/client/branch/demo',
            path: '/leads/client/branch/demo',
          },
          {
            name: 'Closed',
            id: '/leads/client/branch/closed',
            path: '/leads/client/branch/closed',
          },
        ],
      },
      // {
      //   name: 'Clients',
      //   path: '/leads/clients-list',
      //   id: '/leads/clients-list',
      //   icon: PeopleFill,
      // },
    ],
  },
  { name: 'Sub branches', path: '/sub-branches', id: '/sub-branches', icon: ApartmentOutlined },
  {
    name: 'Courses',
    path: '/courses',
    id: '/courses',
    icon: Kanban,
  },
  {
    name: 'Staff',
    path: '/staff',
    id: '/staff',
    icon: PeopleIcon,
  },
  {
    name: 'Timetable',
    id: '/timetable',
    icon: ScheduleOutlined,
    routes: [
      { name: 'All batch', path: '/timetable/all-batch', id: '/timetable/all-batch' },
      { name: 'Single batch', path: '/timetable/batch', id: '/timetable/batch' },
      {
        name: 'Available teachers',
        path: '/timetable/teacher-free-timeslot',
        id: '/timetable/teacher-free-timeslot',
      },
      {
        name: 'Free classes',
        path: '/timetable/classes-free-timeslot',
        id: '/timetable/classes-free-timeslot',
      },
    ],
  },
  {
    name: 'Students',
    path: '/students',
    id: '/students',
    icon: UserGraduate,
  },
  {
    name: 'Clients',
    path: '/clients',
    id: '/clients',
    icon: ClientsIcon,
  },
  {
    name: 'Tests',
    path: '/tests',
    id: '/tests',
    icon: Collection,
  },
  {
    name: 'Batches',
    path: '/batches',
    id: '/batches',
    icon: LayoutSidebarInset,
  },

  {
    name: 'Classes',
    path: '/classes',
    id: '/classes',
    // icon: PersonBoundingBox,
    icon: Book,
  },
  {
    name: 'Tasks',
    path: '/tasks',
    id: '/tasks',
    // icon: PersonBoundingBox,
    icon: CardChecklist,
  },
  {
    name: 'Course contents',
    id: '/upload',
    icon: UploadOutlined,
    routes: [
      {
        name: 'Upload Course',
        id: 'upload/course-content',
        path: '/upload/course-content',
        icon: UploadFile,
      },
      {
        name: 'Create Capsule',
        id: '/upload/create-capsule',
        path: '/upload/create-capsule',
        icon: CapsuleIcon,
      },
      {
        name: 'Teaching Schedule',
        id: '/upload/teaching-schedule',
        path: '/upload/teaching-schedule',
        icon: TeachingSchedule,
      },
    ],
  },

  // {
  //   name: 'Bulk import',
  //   id: '/upload/UploadPublicHolidays',
  //   icon: UploadOutlined,
  //   routes: [
  //     {
  //       name: 'Upload excel',
  //       id: 'upload/course-content',
  //       path: '/upload/UploadPublicHolidays',
  //     },
  //   ],
  // },
  // {
  //   name: 'Branch Profile',
  //   path: '/branch-profile',
  //   id: '/branch-profile',
  //   icon: BuildingIcon,
  // },
  // {
  //   name: 'Products',
  //   path: '/products',
  //   id: 'products',
  //   icon: Kanban,
  // },
  // {
  //   name: 'Analytics',
  //   path: '/analytics',
  //   id: 'analytics',
  //   icon: Kanban,
  // },
  // {
  //   name: 'Client leads',
  //   path: '/clients/leads',
  //   id: '/clients/leads',
  //   icon: LayoutSidebarInset,
  // },
  // {
  //   name: 'Profile',
  //   path: '/profile',
  //   id: 'profile',
  //   icon: RoundUserIcon,
  // },
  // {
  //   name: 'Collections',
  //   path: '/collections',
  //   id: 'collections',
  //   icon: Collection,
  // },
  // {
  //   name: 'Discounts',
  //   path: '/discounts',
  //   id: 'discounts',
  //   icon: Kanban,
  // },
];
