import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Checkbox, Tooltip } from 'antd';
import React from 'react';

const TestReports = () => {
  return (
    <div className="border rounded-lg mt-4">
      <div className=" flex justify-between ">
        <div className="py-2 px-2 font-semibold text-base ">
          <span className="border-r pr-2  font-bold  text-blue-800 ">ELC-1</span>
          <span className="text-gray-700 border-r px-2 ">IELTS-AC</span>
          <span className="text-gray-700 border-r px-2 ">All Modules</span>
        </div>
        <div className="py-2 px-2 ">
          <span className="border-r pr-2 text-yellow-500 font-semibold text-md">Inter-1</span>
          <span className="text-yellow-500 px-2 font-semibold text-md">Extra Class-1</span>
        </div>
        <div className="py-2 px-2 ">
          <span className="bg-green-500 pr-2 text-white font-semibold text-md px-2 py-1 rounded-lg">
            offline
          </span>
        </div>
      </div>
      <div>
        <table className="mx-2 mb-4">
          <tr className="text-blue-600  h-8">
            <th className="px-4">
              <Checkbox />
            </th>
            <th className="px-10" />
            <th className="px-4">2 Oct</th>
            <th className="px-4">9 Oct</th>
            <th className="px-4">12 Oct</th>
            <th className="px-4">20 Oct</th>
            <th className="px-4">30 Oct</th>
          </tr>
          <tr className="border h-12 font-semibold">
            <td className="px-4 border">
              {' '}
              <Checkbox />
            </td>
            <td className="px-4 border text-blue-500 font-bold">
              Reading{' '}
              <span className="text-green-500 rounded-full px-1 pb-1 border ml-2">
                <ArrowUpOutlined />
              </span>
            </td>
            <td className="px-6 border text-gray-500">27</td>{' '}
            <td className="px-6 border text-red-500">
              <Tooltip title="Test cancled">C </Tooltip>
            </td>
            <td className="px-6 border">
              <span className="text-gray-500"> 25</span>
              <span className="text-green-500 ml-1">
                <ArrowUpOutlined />
              </span>
            </td>
            <td className="px-6 border" />
          </tr>
          <tr className="border h-12 font-semibold">
            <td className="px-4 border">
              {' '}
              <Checkbox />
            </td>
            <td className="px-4 border text-yellow-500 font-bold">
              Writing{' '}
              <span className="text-red-500 rounded-full px-1 pb-1 border ml-2">
                <ArrowDownOutlined />
              </span>
            </td>
            <td className="px-6 border text-gray-500">25</td>
            <td className="px-6 border" />
            <td className="px-6 border" />
            <td className="px-6 border" />
          </tr>
          <tr className="border h-12">
            <td className="px-4 border">
              {' '}
              <Checkbox />
            </td>
            <td className="px-6 border"></td>
            <td className="px-6 border"></td>
            <td className="px-6 border" />
            <td className="px-6 border" />
            <td className="px-6 border" />
          </tr>
          <tr className="border h-12">
            <td className="px-4 border">
              {' '}
              <Checkbox />
            </td>
            <td className="px-6 border"></td>
            <td className="px-6 border"></td>
            <td className="px-6 border" />
            <td className="px-6 border" />
            <td className="px-6 border" />
          </tr>
          <tr className="border h-12">
            <td className="px-4 border">
              {' '}
              <Checkbox />
            </td>
            <td className="px-6 border"></td>
            <td className="px-6 border"></td>
            <td className="px-6 border" />
            <td className="px-6 border" />
            <td className="px-6 border" />
          </tr>
          <tr className="border h-12">
            <td className="px-4 border">
              {' '}
              <Checkbox />
            </td>
            <td className="px-6 border"></td>
            <td className="px-6 border"></td>
            <td className="px-6 border" />
            <td className="px-6 border" />
            <td className="px-6 border" />
          </tr>
        </table>
      </div>
    </div>
  );
};

export default TestReports;
