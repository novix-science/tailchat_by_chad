import { Icon } from 'tailchat-design';
import React, { PropsWithChildren } from 'react';
import { useReducer } from 'react';

export const GroupSection: React.FC<
  PropsWithChildren<{
    header: string;
  }>
> = React.memo((props) => {
  const [isShow, switchShow] = useReducer((v) => !v, true);

  return (
    <div>
      <div
        className="flex items-center cursor-pointer"
        onClick={switchShow}
        style={{
          padding: '8px 0',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          color: '#444444',
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        <Icon
          className="mr-1"
          icon="mdi:chevron-right"
          rotate={isShow ? 45 : 0}
          style={{ fontSize: 12, color: '#444444' }}
        />
        <div>{props.header}</div>
      </div>
      <div
        className="transition-all overflow-hidden space-y-0.5"
        style={{
          maxHeight: isShow ? 'var(--max-height)' : 0,
          paddingLeft: 4,
        }}
        ref={(ref) =>
          ref?.style.setProperty('--max-height', `${ref.scrollHeight}px`)
        }
      >
        {props.children}
      </div>
    </div>
  );
});
GroupSection.displayName = 'GroupSection';
