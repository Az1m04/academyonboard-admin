const { defaults } = require('./defaults');

export const tasks = {
  getMyTasks: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/me/tasks/list',
    },
  },
  createTask: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/tasks',
    },
  },
  completeTask: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/tasks/:id/complete',
    },
  },
  reopenTask: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/tasks/:id/reopen',
    },
  },
  addTaskCategory: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/tasks/categories',
    },
  },
  getTaskCategoryList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/tasks/categories',
    },
  },
  getBranchList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/client',
    },
  },
  getDepartmentList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/departments',
    },
  },
  getStaffList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/departments/:departmentId/members',
    },
  },
  getStudentsList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/leads/search',
    },
  },
  getTasksList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/tasks',
    },
  },
  removeTaskFromList: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/tasks/:taskId',
    },
  },
  singleTaskDetail: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/tasks/:taskId',
    },
  },
  changePriority: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/tasks/:taskId/priority',
    },
  },
  markAsComplete: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/tasks/:taskId/complete',
    },
  },
  markAsProcess: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/tasks/:taskId/inProcess',
    },
  },
  getTaskCounts: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/tasks/stats',
    },
  },
  getTaskActivity: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/tasks/:taskId/activities',
    },
  },
  updateTask: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/tasks/:taskId',
    },
  },
  addFollowUpInTask: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/tasks/:taskId/followup',
    },
  },
  getFollowUpInTask: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/tasks/followups',
    },
  },
  assignToOther: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/tasks/:taskId/assignee',
    },
  },
};
