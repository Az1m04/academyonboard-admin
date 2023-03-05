import React from 'react';
import { Column } from '@ant-design/charts';

const LineGraph = () => {
  const data = [
    {
      name: 'Sales',
      月份: 'Jan.',
      月均降雨量: 18.9,
    },
    {
      name: 'Sales',
      月份: 'Feb.',
      月均降雨量: 28.8,
    },
    {
      name: 'Sales',
      月份: 'Mar.',
      月均降雨量: 39.3,
    },
    {
      name: 'Sales',
      月份: 'Apr.',
      月均降雨量: 81.4,
    },
    {
      name: 'Sales',
      月份: 'May',
      月均降雨量: 47,
    },
    {
      name: 'Sales',
      月份: 'Jun.',
      月均降雨量: 20.3,
    },
    {
      name: 'Sales',
      月份: 'Jul.',
      月均降雨量: 24,
    },
    {
      name: 'Sales',
      月份: 'Aug.',
      月均降雨量: 35.6,
    },
  ];
  const config = {
    data,
    // isGroup: true,
    xField: '月份',
    yField: '月均降雨量',
    seriesField: 'name',
    label: {
      position: 'middle',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
  };
  return <Column {...config} />;
};

export default LineGraph;
