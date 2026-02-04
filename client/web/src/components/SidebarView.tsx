import React, { useState, useContext, PropsWithChildren } from 'react';
import _get from 'lodash/get';
import { DevContainer } from 'tailchat-shared';
import clsx from 'clsx';

export interface SidebarViewMenuItemType {
  type: 'item';
  title: string;
  content: React.ReactNode;

  /**
   * 是否是仅开发者可见
   */
  isDev?: boolean;

  /**
   * 隐藏这个项
   */
  hidden?: boolean;
}

interface SidebarViewLinkType {
  type: 'link';
  title: string;
  onClick: () => void;
  isDanger?: boolean;
}

const SidebarViewMenuItemTitle: React.FC<
  PropsWithChildren<{
    active?: boolean;
    isDanger?: boolean;
    onClick: () => void;
  }>
> = (props) => (
  <div
    className="cursor-pointer"
    style={{
      width: 192,
      padding: '8px 12px',
      marginBottom: 2,
      borderRadius: 4,
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 13,
      color: props.isDanger ? '#FF4444' : props.active ? '#FF6B35' : '#666666',
      backgroundColor: props.active
        ? 'rgba(255, 107, 53, 0.08)'
        : 'transparent',
      transition: 'all 0.2s',
    }}
    onClick={props.onClick}
  >
    {props.children}
  </div>
);

interface SidebarViewContextProps {
  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;
}
export const SidebarViewContext =
  React.createContext<SidebarViewContextProps | null>(null);
SidebarViewContext.displayName = 'SidebarViewContext';

export type SidebarViewMenuItem = SidebarViewMenuItemType | SidebarViewLinkType;
export type SidebarViewMenuType =
  | {
      type: 'group';
      title: string;
      children: SidebarViewMenuItem[];
    }
  | SidebarViewMenuItem;

interface SidebarViewMenuProps {
  menu: SidebarViewMenuType;
}
const SidebarViewMenuItem: React.FC<SidebarViewMenuProps> = React.memo(
  (props) => {
    const { menu } = props;
    const context = useContext(SidebarViewContext);

    if (!context) {
      return null;
    }

    const { content, setContent } = context;

    if (menu.type === 'group') {
      return (
        <div style={{ paddingBottom: 16, marginBottom: 16 }}>
          <div
            style={{
              padding: '0 12px 8px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              color: '#444444',
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            {'// ' + menu.title}
          </div>
          <div>
            {menu.children.map((sub, i) => (
              <SidebarViewMenuItem key={i} menu={sub} />
            ))}
          </div>
        </div>
      );
    } else if (menu.type === 'item') {
      if (menu.hidden === true) {
        return null;
      }

      const component = (
        <SidebarViewMenuItemTitle
          active={content === menu.content}
          onClick={() => setContent(menu.content)}
        >
          {menu.title}
        </SidebarViewMenuItemTitle>
      );

      if (menu.isDev === true) {
        return <DevContainer>{component}</DevContainer>;
      } else {
        return <div>{component}</div>;
      }
    } else if (menu.type === 'link') {
      return (
        <div>
          <SidebarViewMenuItemTitle
            isDanger={menu.isDanger}
            onClick={menu.onClick}
          >
            {menu.title}
          </SidebarViewMenuItemTitle>
        </div>
      );
    }

    return null;
  }
);
SidebarViewMenuItem.displayName = 'SidebarViewMenuItem';

interface SidebarViewProps {
  menu: SidebarViewMenuType[];

  /**
   * 默认内容路径
   * @default "0.children.0.content"
   */
  defaultContentPath: string;
}
export const SidebarView: React.FC<SidebarViewProps> = React.memo((props) => {
  const { menu, defaultContentPath = '0.children.0.content' } = props;
  const [content, setContent] = useState<React.ReactNode>(
    _get(menu, defaultContentPath, null)
  );

  return (
    <SidebarViewContext.Provider value={{ content, setContent }}>
      <div className="flex w-full h-full mobile:flex-col mobile:overflow-auto">
        <div
          className="flex flex-col justify-start items-end py-20 px-2.5 mobile:items-start mobile:py-10 text-sm"
          style={{
            flex: '1 0 240px',
            backgroundColor: '#0D0D0D',
            borderRight: '1px solid #3D3D3D',
          }}
        >
          {menu.map((item, i) => (
            <SidebarViewMenuItem key={i} menu={item} />
          ))}
        </div>

        <div
          className="pt-24 pb-20 px-10 mobile:pt-10 mobile:px-2 desktop:overflow-auto"
          style={{
            flex: '1 1 800px',
            backgroundColor: '#1A1A1A',
          }}
        >
          {content}
        </div>
      </div>
    </SidebarViewContext.Provider>
  );
});
SidebarView.displayName = 'SidebarView';
