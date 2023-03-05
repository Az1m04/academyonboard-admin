import { RightOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React from 'react';
import { Link } from 'umi';

const ChooseDiscountModal = ({ visible, setVisible }) => {
  const percentage = (
    <svg viewBox="0 0 20 20" focusable="false" aria-hidden="true" height="20" width="20">
      <path
        fillRule="evenodd"
        fill="currentColor"
        d="M11.566.66a2.189 2.189 0 0 0-3.132 0l-.962.985a2.189 2.189 0 0 1-1.592.66l-1.377-.017a2.189 2.189 0 0 0-2.215 2.215l.016 1.377a2.189 2.189 0 0 1-.66 1.592l-.984.962a2.189 2.189 0 0 0 0 3.132l.985.962c.428.418.667.994.66 1.592l-.017 1.377a2.189 2.189 0 0 0 2.215 2.215l1.377-.016a2.189 2.189 0 0 1 1.592.66l.962.984c.859.88 2.273.88 3.132 0l.962-.985a2.189 2.189 0 0 1 1.592-.66l1.377.017a2.189 2.189 0 0 0 2.215-2.215l-.016-1.377a2.189 2.189 0 0 1 .66-1.592l.984-.962c.88-.859.88-2.273 0-3.132l-.985-.962a2.189 2.189 0 0 1-.66-1.592l.017-1.377a2.189 2.189 0 0 0-2.215-2.215l-1.377.016a2.189 2.189 0 0 1-1.592-.66L11.566.66zM7 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm6 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm.778-8.278a1.1 1.1 0 0 1 0 1.556l-6 6a1.1 1.1 0 1 1-1.556-1.556l6-6a1.1 1.1 0 0 1 1.556 0z"
      ></path>
    </svg>
  );
  const cart = (
    <svg
      fill="currentColor"
      viewBox="0 0 20 20"
      focusable="false"
      aria-hidden="true"
      height="20"
      width="20"
    >
      <path d="M8.707 7.707l6-6A1 1 0 0 0 13.293.293l-6 6a1 1 0 0 0 1.414 1.414z"></path>
      <path
        fillRule="evenodd"
        d="M2 0a1 1 0 0 0 0 2h1v12.17A3.001 3.001 0 1 0 6.83 16h5.34A3 3 0 1 0 15 14H5v-2h11.566a1.5 1.5 0 0 0 1.485-1.288l.939-6.57a1 1 0 0 0-1.98-.283L16.133 10H5V1.5A1.5 1.5 0 0 0 3.5 0H2zm13 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM4 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
      ></path>
      <path d="M8.5 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM15 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
    </svg>
  );
  return (
    <div>
      <Modal
        title="Create discount"
        footer={[<Button key="1">Cancel</Button>]}
        visible={visible}
        width={600}
        bodyStyle={{ padding: 0 }}
        onCancel={() => setVisible(false)}
      >
        <Link to="/discounts/new">
          <div className="flex items-center justify-between hover:bg-gray-100 px-4 py-4 border-b cursor-pointer">
            <div className="flex items-center text-gray-600">
              <div className="border p-3 rounded">{percentage}</div>
              <div className="ml-4">
                <div className="font-semibold">Discount Codes</div>
                <div className="">
                  Customer will get a discount if they enter a code at checkout.
                </div>
              </div>
            </div>
            <div className="text-gray-600">
              <RightOutlined />
            </div>
          </div>
        </Link>
        <Link to="/discounts/automatic/new">
          <div className="flex items-center justify-between hover:bg-gray-100 px-4 py-4 border-b cursor-pointer">
            <div className="flex items-center text-gray-600">
              <div className="border p-3 rounded">{cart}</div>
              <div className="ml-4">
                <div className="font-semibold">Automatic Discount</div>
                <div className="">Customer will get a discount automatically in their cart.</div>
              </div>
            </div>
            <div className="text-gray-600">
              <RightOutlined />
            </div>
          </div>
        </Link>
        <div className="px-4 py-4 text-gray-500 cursor-pointer">
          <div className="">Customer can&apos;t combine discounts at checkout.</div>
        </div>
      </Modal>
    </div>
  );
};

export default ChooseDiscountModal;
