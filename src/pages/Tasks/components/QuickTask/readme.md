# Quick Task Helper

QuickTask can be used to create project or individual tasks. If a projectId is passed, displays project members by default.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| layoutMode | This attribute defines the way the widget is rendered, in responsive mode the UI doesn't start in compact mode and all options are visible | `default` \| `responsive` | `default` |  |
| onCreateTask | Callback invoked when a task is ready to be created, | function | - | 1.0.0 |

> Tip: Placeholder to show some tooltip.

## Example usage

```jsx
<QuickTask
  layoutMode="responsive"
  onCreateTask={(payload) => {
    return dispatch({
      type: 'tasks/createTask',
      payload: {
        body: {
          parentTaskId: '',
          name: payload.taskName,
          description: '',
          categoryId: payload.categoryId || 'TC_PRSNL',
          taskSubTypeId: payload.taskSubTypeId,
          assignee: payload.listAssignees.map((assignee) => assignee.id),
          notifyPeople: payload.notifyPeople.map((notify) => notify.id),
          priorityTypeId: payload.taskPriority,
          dueDate: payload.dueDate,
          links: payload.savedLinks,
          files: payload.savedFiles,
          projectId,
        },
        pathParams: {
          projectId,
        },
      },
    });
  }}
  taskCreatedCallBack={() => getProjectTasks({ isIncompleted: true })}
  projectId={match.params}
  projectName={projectData?.name}
/>
```
