import { Tooltip, Badge, BadgeProps } from 'antd';
import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useEvent } from 'tailchat-shared';

export const NavbarNavItem: React.FC<
  PropsWithChildren<{
    name: string;
    className?: ClassValue;
    to?: string;
    showPill?: boolean;
    badge?: boolean;
    badgeProps?: BadgeProps;
    onClick?: () => void;
    ['data-testid']?: string;
  }>
> = React.memo((props) => {
  const { name, className, to, showPill = false, badge = false } = props;
  const location = useLocation();
  const isActive = typeof to === 'string' && location.pathname.startsWith(to);
  const navigate = useNavigate();

  const handleClick = useEvent(() => {
    if (typeof to === 'string') {
      navigate(to);
    }
    props.onClick?.();
  });

  let inner = (
    <Tooltip
      title={
        name ? <div className="font-bold px-1.5 py-0.5">{name}</div> : null
      }
      placement="right"
    >
      <div
        className={clsx(
          'transition-all duration-300 cursor-pointer flex items-center justify-center overflow-hidden',
          className
        )}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: isActive ? undefined : '#2D2D2D',
        }}
        onClick={handleClick}
        data-testid={props['data-testid']}
      >
        {props.children}
      </div>
    </Tooltip>
  );

  if (badge === true) {
    inner = (
      <Badge status="error" dot={true} offset={[0, 40]} {...props.badgeProps}>
        {inner}
      </Badge>
    );
  }

  return (
    <div className="relative group flex justify-center">
      {showPill && isActive && (
        <div
          className="absolute left-0 top-0 bottom-0 flex items-center"
          style={{ marginLeft: 0 }}
        >
          <span
            className="rounded-r transition-all duration-300"
            style={{
              backgroundColor: '#FF6B35',
              width: 3,
              height: 32,
            }}
          />
        </div>
      )}

      {inner}
    </div>
  );
});
NavbarNavItem.displayName = 'NavbarNavItem';
