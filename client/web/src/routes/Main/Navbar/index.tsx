import React from 'react';
import { GroupNav } from './GroupNav';
import { MobileMenuBtn } from './MobileMenuBtn';
import { SettingBtn } from './SettingBtn';
import { PersonalNav } from './PersonalNav';

/**
 * 导航栏组件
 */
export const Navbar: React.FC = React.memo(() => {
  return (
    <div
      data-tc-role="navbar"
      className="mobile:zoom-4/5 flex flex-col items-center"
      style={{
        width: 64,
        backgroundColor: '#0D0D0D',
        borderRight: '1px solid #3D3D3D',
        paddingTop: 16,
        paddingBottom: 16,
        gap: 8,
      }}
    >
      <MobileMenuBtn />

      {/* Navbar */}
      <div
        className="flex-1 w-full overflow-hidden flex flex-col items-center"
        style={{ gap: 8 }}
      >
        <PersonalNav />

        {/* Divider */}
        <div
          style={{
            width: 32,
            height: 2,
            backgroundColor: '#3D3D3D',
            borderRadius: 1,
          }}
        />

        {/* 如果导航栏高度不够就缩减群组列表的高度 */}
        <div className="overflow-y-hidden hover:overflow-y-smart scroll overflow-x-hidden thin-scrollbar flex-1">
          <GroupNav />
        </div>
      </div>

      <div
        data-tc-role="navbar-settings"
        className="flex flex-col items-center"
        style={{ gap: 8, paddingTop: 8 }}
      >
        {/* 设置按钮 */}
        <SettingBtn />
      </div>
    </div>
  );
});
Navbar.displayName = 'Navbar';
