import { Tooltip, Popconfirm } from 'antd';
import { PlusSquareTwoTone, DeleteOutlined } from '@ant-design/icons';

const RenderTemplates = ({ info, setBody, deleteTemplateHandler }) => {
  return (
    <>
      <Tooltip title={info?.description} key={info?.id}>
        <div className="flex justify-between px-2 my-5 bg-white border-b-2 rounded ">
          <div className="inline-flex flex-col max-w-xs gap-y-1">
            <div className="items-center font-semibold text-gray-600 border-b-2 border-dashed">
              {info?.name}
            </div>
            <div className="text-sm font-bold truncate ">{info?.description}</div>
          </div>
          <div className="inline-flex flex-col items-center justify-center gap-1 ">
            <div
              className="mt-1 cursor-pointer"
              onClick={() => {
                // form.setFieldsValue({
                //   name: info?.name,
                // });
                setBody(info?.description);
              }}
            >
              <PlusSquareTwoTone twoToneColor="#ffa500" className="text-lg" />
            </div>
            <Popconfirm
              title="Are you sure you want to delete this template?"
              placement="topRight"
              okButtonProps={{
                onClick: () => deleteTemplateHandler(info?.id),
              }}
              okText="Yes"
              cancelText="No"
            >
              <div className="mb-1 cursor-pointer">
                <DeleteOutlined style={{ color: 'red' }} className="text-base" />
              </div>
            </Popconfirm>
          </div>
        </div>
      </Tooltip>
    </>
  );
};

export default RenderTemplates;
