import React, { useState } from 'react';
import { Input, Collapse } from 'antd';
import EditableField from '@/components/EditableField';
import { Diagram2 } from '@/utils/AppIcons';

const { Panel } = Collapse;

const Subtasks = ({ subTasks, setSubTasks }) => {
  const [subtaskInput, setSubtaskInput] = useState('');
  return (
    <Collapse bordered={false} expandIconPosition="right" destroyInactivePanel>
      <Panel
        className="border-none"
        header={
          <div className="flex p-0 items-center justify-between">
            <div className="p-0 flex items-center">
              <Diagram2 /> <span>Subtasks ({subTasks?.length || 0})</span>
            </div>
          </div>
        }
        style={{ background: '#fff', border: '0' }}
        key={['1']}
      >
        <div
          className="flex flex-1 overflow-y-auto w-full"
          style={{
            maxHeight: '30vh',
          }}
        >
          <div className="flex flex-1 w-full overflow-auto overflow-x-hidden flex-col justify-start">
            {subTasks?.length &&
              subTasks.map((subTaskRecord, index) => (
                <div key="" className="flex border-t px-4 py-2 space-x-2 w-full cursor-pointer">
                  {/* Sequence number 1,2,3... */}
                  <div className="text-gray-700 font-semibold" style={{ minWidth: 18 }}>
                    {index + 1}.
                  </div>
                  <div className="hover:bg-gray-100 w-full">
                    <EditableField
                      editBeforeCreate
                      key={subTaskRecord?.id}
                      textStyles="font-semibold text-blue-900"
                      inputStyles="font-semibold text-blue-900"
                      inputText={subTaskRecord?.name}
                      onUpdateHandler={(updatedInput, cb) => {
                        const subTasksUpdated = subTasks.map((item) => {
                          if (item?.id === subTaskRecord?.id) {
                            return { ...subTaskRecord, name: updatedInput };
                          }
                          return item;
                        });
                        setSubTasks(subTasksUpdated);
                        cb();
                      }}
                    />
                  </div>
                </div>
              ))}
            <div className="border-t px-4 py-2  flex items-center">
              <div className="text-gray-500 font-semibold" style={{ minWidth: 18 }}>
                {(subTasks?.length || 0) + 1}.
              </div>
              <Input.TextArea
                bordered={false}
                placeholder="Add sub task"
                value={subtaskInput}
                autoSize
                onChange={(e) => setSubtaskInput(e.target.value)}
                onPressEnter={(evt) => {
                  evt.preventDefault();
                  // make api call to create task
                  if (subtaskInput !== '') {
                    setSubTasks([
                      ...subTasks,
                      { name: subtaskInput, id: Math.random() * Math.random() },
                    ]);
                    setSubtaskInput('');
                  }
                }}
              />
            </div>
          </div>
        </div>
      </Panel>
    </Collapse>
  );
};

export default Subtasks;
