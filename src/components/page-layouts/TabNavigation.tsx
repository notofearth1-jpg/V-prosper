// TabNavigation.tsx
import React, { useState } from 'react';

const TabNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div>
      <div className=" border-b border-gray-300 ">
        <ul className="  flex flex-wrap -mb-px text-sm font-medium text-center" id="myTab" data-tabs-toggle="#myTabContent" role="tablist" >
          <li className="mr-2" role="presentation">
            <button className={`inline-block p-3 px-3 border-b-2 rounded-t-lg text-gray-700 ${activeTab === 'profile' ? 'border-blue-500' : ''
              }`}
              id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected={activeTab === 'profile'} onClick={() => handleTabClick('profile')}>Profile</button>
          </li>
          <li className="mr-2" role="presentation">
            <button className={`inline-block p-3 px-3 border-b-2 border-transparent rounded-t-lg text-gray-700 hover:text-gray-600 ${activeTab === 'dashboard' ? 'border-blue-500' : ''
              }`}
              id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected={activeTab === 'dashboard'} onClick={() => handleTabClick('dashboard')}>Dashboard
            </button>
          </li>
          <li className="mr-2" role="presentation">
            <button
              className={`inline-block p-3 px-3 border-b-2 border-transparent rounded-t-lg text-gray-700 hover:text-gray-600  ${activeTab === 'settings' ? 'border-blue-500' : ''
                }`}
              id="settings-tab" data-tabs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected={activeTab === 'settings'} onClick={() => handleTabClick('settings')}> Settings
            </button>
          </li>
          <li role="presentation">
            <button
              className={`inline-block p-3 px-3 border-b-2 border-transparent rounded-t-lg text-gray-700 hover:text-gray-600  ${activeTab === 'contacts' ? 'border-blue-500' : ''
                }`}
              id="contacts-tab" data-tabs-target="#contacts" type="button" role="tab" aria-controls="contacts" aria-selected={activeTab === 'contacts'} onClick={() => handleTabClick('contacts')}> Contacts
            </button>
          </li>
        </ul>
      </div>
      {/* <div id="myTabContent">
        <div
          className={`p-4 rounded-lg bg-gray-50  ${
            activeTab === 'profile' ? 'block' : 'hidden'
          }`}
          id="profile" role="tabpanel" aria-labelledby="profile-tab" >
          <p className="text-sm text-gray-500 "> 111111This is some placeholder content the{' '}</p>
        </div>
        <div className={`p-4 rounded-lg bg-gray-50  ${
            activeTab === 'dashboard' ? 'block' : 'hidden'
          }`} id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
          <p className="text-sm text-gray-500 "> 22222222This is some placeholder content the{' '}</p>
        </div>
        <div className={`p-4 rounded-lg bg-gray-50  ${
            activeTab === 'settings' ? 'block' : 'hidden'
          }`}
          id="settings" role="tabpanel" aria-labelledby="settings-tab">
          <p className="text-sm text-gray-500 ">33333333his is some placeholder content the{' '} and styling.</p>
        </div>
        <div
          className={`p-4 rounded-lg bg-gray-50  ${
            activeTab === 'contacts' ? 'block' : 'hidden'
          }`}
          id="contacts" role="tabpanel" aria-labelledby="contacts-tab">
          <p className="text-sm text-gray-500 "> 444444444444This is some placeholder content the{' '}  styling.</p>
        </div>
      </div> */}
    </div>
  );
};

export default TabNavigation;
