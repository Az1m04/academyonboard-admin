import { Button } from 'antd';
import React from 'react';
import SearchNotFound from '../../../assets/icons/space-empty.svg';

const RecentClients = () => {
  return (
    <div className="text-center flex mt-2 justify-center items-center">
      <div>
        <img
          src={SearchNotFound}
          className="ml-2"
          alt="No staff member found!"
          style={{ height: '100px' }}
        />
        <p className="text-lg text-gray-300 mt-2">No client invited yet!</p>
        <Button type="primary">Invite</Button>
      </div>
    </div>
  );
};

export default RecentClients;
