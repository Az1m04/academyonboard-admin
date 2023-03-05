import React from 'react';

const ActionTitleRender = ({ icon, title, subTitle }) => {
  return (
    <span className="flex items-center gap-5 py-1 px-2">
      <span className="text-blue-700">{icon}</span>

      <div className="flex flex-col">
        <span className="font-semibold" style={{ color: 'rgba(30,58,138)' }}>
          {title}
        </span>

        <span className="font-normal  text-sm" style={{ color: 'rgba(30,58,138)' }}>
          {subTitle}
        </span>
      </div>
    </span>
  );
};

export default ActionTitleRender;
