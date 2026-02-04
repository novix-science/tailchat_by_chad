import React, { PropsWithChildren, useState } from 'react';
import { Dropdown, MenuProps } from 'antd';
import { Icon } from 'tailchat-design';
import clsx from 'clsx';

interface SectionHeaderProps extends PropsWithChildren {
  menu?: MenuProps;
  'data-testid'?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = React.memo(
  (props) => {
    const [visible, setVisible] = useState(false);

    return (
      <div
        className="relative flex items-center py-0 font-bold flex-shrink-0"
        style={{
          height: 52,
          fontFamily: 'Oswald, sans-serif',
          fontSize: 18,
          fontWeight: 600,
          borderBottom: '1px solid #3D3D3D',
          color: '#FFFFFF',
        }}
      >
        {props.menu ? (
          <Dropdown
            className="overflow-hidden"
            onOpenChange={setVisible}
            menu={props.menu}
            placement="bottomRight"
            trigger={['click']}
          >
            <div
              className="cursor-pointer flex flex-1"
              data-testid={props['data-testid']}
            >
              <header className="flex-1 truncate px-4">{props.children}</header>
              <Icon
                className={clsx('text-2xl transition-transform transform', {
                  'rotate-180': visible,
                })}
                icon="mdi:chevron-down"
              >
                &#xe60f;
              </Icon>
            </div>
          </Dropdown>
        ) : (
          <header
            className="flex-1 truncate px-4 select-text"
            data-testid={props['data-testid']}
          >
            {props.children}
          </header>
        )}
      </div>
    );
  }
);
SectionHeader.displayName = 'SectionHeader';
