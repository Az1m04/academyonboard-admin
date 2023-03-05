import React from 'react';

const EmptyState = ({ emptyState, renderButtons, type, emptyHeaderText, emptySubHeaderText }) => (
  <div className="text-center py-10 bg-white">
    <div className="text-center">
      <img className="mx-auto" src={emptyState} alt="No address" style={{ height: '150px' }} />
    </div>
    <div className="text-lg font-bold text-blue-800 mb-4">
      {emptyHeaderText || `No ${type} added yet!`}
    </div>
    <div className="text-sm my-4 ">
      {emptySubHeaderText || 'Let us add some now and they will show up here.'}
    </div>
    <br />
    {renderButtons && renderButtons()}
  </div>
);

export default EmptyState;
