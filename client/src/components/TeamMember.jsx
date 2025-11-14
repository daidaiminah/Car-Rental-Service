import React from 'react';

const TeamMember = ({ name, role, image, bio }) => (
  <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2">
    <div className="relative group">
      <img 
        src={image} 
        alt={name}
        className="w-full h-80 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
        <div>
          <h3 className="text-white text-xl font-bold">{name}</h3>
          <p className="text-gray-200">{role}</p>
          <p className="text-gray-200 text-sm mt-2">{bio}</p>
        </div>
      </div>
    </div>
  </div>
);

export default TeamMember;
