import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import CheckValidation from '@/components/CheckValidation';

const { Panel } = Collapse;

const TestDetails = ({ courseDetails, allTestDetails }) => {
  const Item = ({ title, value }) => (
    <div className="px-4 py-2 mt-1 border-b ">
      <span className="flex justify-between">
        <div className="text-sm font-normal text-gray-700">{title}</div>
        <p className="m-0 font-semibold text-blue-800">{value}</p>
      </span>
    </div>
  );
  return (
    <>
      <div className="bg-white rounded shadow">
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          className="site-collapse-custom-collapse"
        >
          <Panel
            header={
              <div className="px-4 text-base font-semibold text-blue-900">Course details</div>
            }
            key="1"
            className="site-collapse-custom-panel"
            style={{ backgroundColor: '#fff' }}
          >
            <div className="pt-1 ">
              <Item title="Course" value={courseDetails?.displayName} />
              <Item title="Category" value={courseDetails?.categoryName} />
              <Item title="Subcategory" value={courseDetails?.subCategoryName} />
              <Item
                title="Module"
                value={courseDetails?.courseModules?.map(
                  (item, i, details) =>
                    `${item?.displayName.trim()}${i < details.length - 1 ? ', ' : ''}`,
                )}
              />
            </div>
          </Panel>
        </Collapse>
      </div>

      <div className="mt-2 bg-white rounded shadow">
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          className="site-collapse-custom-collapse"
        >
          <Panel
            header={<div className="px-4 text-base font-semibold text-blue-900">Test details</div>}
            key="1"
            className="site-collapse-custom-panel"
            style={{ backgroundColor: '#fff' }}
          >
            <div className="pt-1 ">
              <Item title="Name" value={allTestDetails?.name} />
              <Item title="Type" value={allTestDetails?.testType} />
              <Item title="Difficulty level" value={allTestDetails?.difficultyLevel} />
              <Item
                title="Time"
                value={`${allTestDetails?.testTime} ${
                  allTestDetails?.testTimeUomId === 'TF_hr' ? 'Hr' : 'Min'
                }`}
              />
              <Item
                title="Is timer pause allowed"
                value={allTestDetails?.isPauseAllowed ? 'Yes' : 'No'}
              />
              <Item title="Description" value={allTestDetails?.description} />
              <Item title="Passing marks" value={allTestDetails?.passingMarks} />
              <Item title="Total marks" value={allTestDetails?.totalMarks} />
            </div>
          </Panel>
        </Collapse>
      </div>

      <div className="mt-2 bg-white rounded shadow">
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          className="site-collapse-custom-collapse"
        >
          <Panel
            header={
              <div className="px-4 text-base font-semibold text-blue-900">Result details</div>
            }
            key="1"
            className="site-collapse-custom-panel"
            style={{ backgroundColor: '#fff' }}
          >
            <div className="pt-1 ">
              <Item title="Type" value={allTestDetails?.resultType} />
              <Item title="Remarks" value={allTestDetails?.resultRemarks} />
            </div>
          </Panel>
        </Collapse>
      </div>
      <CheckValidation show={allTestDetails?.testTypeId === 'ASSESS_TST'}>
        <div className="mt-2 bg-white rounded shadow">
          <Collapse
            bordered={false}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            className="site-collapse-custom-collapse"
          >
            <Panel
              header={<div className="px-4 text-base font-semibold text-blue-900">Suggestions</div>}
              key="1"
              className="site-collapse-custom-panel"
              style={{ backgroundColor: '#fff' }}
            >
              {allTestDetails?.marksRange?.map((item) => {
                return (
                  <>
                    <div className="pt-1 mb-10">
                      <Item title="Minimum marks" value={item?.minMarks} />
                      <Item title="Maximum marks" value={item?.maxMarks} />
                      <Item title="Remarks" value={item?.remarks} />
                    </div>
                  </>
                );
              })}
            </Panel>
          </Collapse>
        </div>
      </CheckValidation>
    </>
  );
};

export default TestDetails;
