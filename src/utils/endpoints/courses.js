const { defaults } = require('./defaults');

export const courses = {
  getCourses: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses',
    },
  },
  getCourseContent: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/contents/mockTests',
    },
  },

  getCoursesCategory: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/categories',
    },
  },
  getCoursesSubCategory: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/categories',
    },
  },

  getCoursesFromSubCategory: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses',
    },
  },

  addCourse: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/courses/',
    },
  },
  editCourse: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/courses/:courseId',
    },
  },
  getSingleCourseDetails: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/:courseId',
    },
  },
  addTest: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/tests',
    },
  },
  uploadTestContent: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/content',
    },
  },
  deleteTestContent: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/content/:contentId',
    },
  },
  deleteTest: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/tests/:testId',
    },
  },
  updateTest: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/tests/:courseId',
    },
  },
  getTests: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/tests',
    },
  },
  getTestById: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/tests/:testId',
    },
  },
  getCourseDetailSingle: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/contents',
    },
  },
  getSingleCourse: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/:courseId',
    },
  },
  getCoursesDetail: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/contents',
    },
  },
  getCoursesDetailForModule: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/contents',
    },
  },
  uploadCourseContentFile: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/courses/add/content',
    },
  },
  uploadCourseContentDetails: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/module/:moduleId/assoc/:assocId/topics/new',
    },
  },
  uploadCoursedetails: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/module/:moduleId/assoc',
    },
  },
  deleteuploadCoursedetail: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/module/:moduleId',
    },
  },
  deleteUploadFile: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/content/:contentId',
    },
  },
  updateCourseContentFile: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/module/:moduleId/assoc/:assocId/topics/new',
    },
  },
  updateCourseDLevelDetails: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/modules/:moduleId/assoc/:assocId',
    },
  },
  deleteUploadCourseContents: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/module/:moduleId/topic/:topicId',
    },
  },
  getCoursesForTeachingSchedule: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/contents/mockTests',
    },
  },
  getTeachingCapsuleForClassTest: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/capsule',
    },
  },
  getTeachingCapsuleForMockTest: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/capsule',
    },
  },
  uploadTeachingSchedule: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/teaching/schedules',
    },
  },
  getTeachingSchedules: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/teaching/schedules',
    },
  },
  getSingleTeachingSchedules: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/teaching/schedules/:teachingScheduleId',
    },
  },
  updateTeachingSchedule: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/teaching/schedules/:teachingScheduleId',
    },
  },
  deleteTeachingSchedule: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/teaching/schedules/:teachingScheduleId/timesheet/:timesheetId',
    },
  },
  getUpdateCourseContents: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/modules/:moduleId/assoc/:assocId/topics',
    },
  },
  postCapsule: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/capsule',
    },
  },
  updateCapsule: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/capsule/:capsuleId/new',
    },
  },
  getCapsule: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/capsule',
    },
  },
  deleteCapsule: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/capsule/:capsuleId',
    },
  },
  createCapsuleTableRow: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/capsule/:capsuleId/new',
    },
  },
  capsuleTableRowUpdate: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/capsule/:capsuleId/new',
    },
  },
  deleteCapsuleFormTableRow: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/capsule/:capsuleId/group/:groupId',
    },
  },
  getTopicCount: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/topics/count',
    },
  },
  getCapsuleDetail: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/capsule/:capsuleId/new',
    },
  },
  getCourseContentDLevel: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/modules/:moduleId/dLevel/:dLevel/check-existing',
    },
  },
  getCourseDifficultyLevels: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/courses/:courseId/difficultyLevel',
    },
  },
  updateAdditionalFileName: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/content',
    },
  },
};
