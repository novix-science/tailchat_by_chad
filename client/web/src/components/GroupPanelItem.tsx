import { Badge, BadgeProps, Space } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

/**
 * 群组面板项
 * 用于侧边栏
 */
export const GroupPanelItem: React.FC<{
  name: string;
  icon: React.ReactNode;
  to: string;
  dimmed?: boolean;
  badge?: boolean;
  badgeProps?: BadgeProps;
  extraBadge?: React.ReactNode[];
}> = React.memo((props) => {
  const { icon, name, to, dimmed = false, badge } = props;
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link className="block" to={to} style={{ textDecoration: 'none' }}>
      <div
        className={clsx('w-full cursor-pointer flex items-center group')}
        style={{
          padding: '6px 8px',
          borderRadius: 4,
          backgroundColor: isActive ? '#2D2D2D' : 'transparent',
          color: isActive
            ? '#FFFFFF'
            : dimmed
            ? 'rgba(102,102,102,0.4)'
            : '#666666',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 13,
          height: 32,
          transition: 'background-color 0.2s',
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{ marginRight: 8, color: isActive ? '#FFFFFF' : '#666666' }}
        >
          {icon}
        </div>

        <span
          className="flex-1 truncate"
          style={{
            color: isActive
              ? '#FFFFFF'
              : dimmed
              ? 'rgba(102,102,102,0.4)'
              : '#CCCCCC',
          }}
        >
          {name}
        </span>

        <Space>
          {badge === true && <Badge status="error" {...props.badgeProps} />}

          {props.extraBadge}
        </Space>
      </div>
    </Link>
  );
});
GroupPanelItem.displayName = 'GroupPanelItem';
