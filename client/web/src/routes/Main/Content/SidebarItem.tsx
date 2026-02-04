import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Badge } from 'antd';
import clsx from 'clsx';
import { Avatar } from 'tailchat-design';

interface SidebarItemProps {
  name: string;
  to: string;
  badge?: boolean | number;
  icon?: string | React.ReactElement;
  action?: React.ReactNode;
}
export const SidebarItem: React.FC<SidebarItemProps> = React.memo((props) => {
  const { icon, name, to, badge } = props;
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div
        className={clsx('w-full cursor-pointer flex items-center group mb-0.5')}
        style={{
          padding: '8px 12px',
          borderRadius: 4,
          backgroundColor: isActive ? '#2D2D2D' : 'transparent',
          color: isActive ? '#FFFFFF' : '#666666',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 13,
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLDivElement).style.backgroundColor =
              'rgba(255,255,255,0.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLDivElement).style.backgroundColor =
              'transparent';
          }
        }}
      >
        <div
          className="flex items-center justify-center text-lg"
          style={{ width: 24, height: 24, marginRight: 10 }}
        >
          {React.isValidElement(icon) ? (
            icon
          ) : (
            <Avatar src={icon} name={name} size={24} />
          )}
        </div>

        <span className="flex-1 truncate">{name}</span>

        {badge === true ? (
          <Badge status="error" />
        ) : (
          <Badge count={Number(badge) || 0} />
        )}

        {props.action && (
          <div className="text-base p-1 cursor-pointer hidden opacity-70 group-hover:block hover:opacity-100">
            {props.action}
          </div>
        )}
      </div>
    </Link>
  );
});
SidebarItem.displayName = 'SidebarItem';
