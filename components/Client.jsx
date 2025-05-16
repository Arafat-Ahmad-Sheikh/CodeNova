import React from 'react';

const Client = ({ username }) => {
  return (
    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-base-200 transition">
      <div className="avatar">
        <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src={`https://api.dicebear.com/7.x/beam/svg?seed=${username}`}  alt={`avatar ${username}`} />
        </div>
      </div>
      <span className="font-medium text-base-content">{username}</span>
    </div>
  );
};

export default Client;
