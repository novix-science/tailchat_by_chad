import React from 'react';
import { t, useDMConverseList, useUnread } from 'tailchat-shared';
import { NavbarNavItem } from './NavItem';

function usePersonalUnread(): boolean {
  const converse = useDMConverseList();
  const unreads = useUnread(converse.map((converse) => String(converse._id)));

  return unreads.some((u) => u === true);
}

export const PersonalNav: React.FC = React.memo(() => {
  const unread = usePersonalUnread();

  return (
    <div data-tc-role="navbar-personal">
      <NavbarNavItem
        name={t('我')}
        to={'/main/personal'}
        showPill={true}
        badge={unread}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#FF6B35',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0D0D0D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
        </div>
      </NavbarNavItem>
    </div>
  );
});
PersonalNav.displayName = 'PersonalNav';
