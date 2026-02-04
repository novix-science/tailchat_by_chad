import React, { PropsWithChildren } from 'react';
import { Icon } from 'tailchat-design';
import { SidebarItem } from '../SidebarItem';
import { t, useDMConverseList, useGlobalConfigStore } from 'tailchat-shared';
import { SidebarDMItem } from './SidebarDMItem';
import { openModal } from '@/components/Modal';
import { CreateDMConverse } from '@/components/modals/CreateDMConverse';
import { CommonSidebarWrapper } from '@/components/CommonSidebarWrapper';
import { pluginCustomPanel } from '@/plugin/common';
import { CustomSidebarItem } from '../CustomSidebarItem';

const SidebarSection: React.FC<
  PropsWithChildren<{
    action: React.ReactNode;
  }>
> = React.memo((props) => {
  return (
    <div className="h-10 text-white flex pt-4 px-1">
      <span
        className="flex-1 overflow-hidden overflow-ellipsis font-mono"
        style={{ fontSize: '10px', color: '#444444', letterSpacing: '1px' }}
      >
        {props.children}
      </span>
      <div className="text-base cursor-pointer" style={{ color: '#444444' }}>
        {props.action}
      </div>
    </div>
  );
});
SidebarSection.displayName = 'SidebarSection';

/**
 * 个人面板侧边栏组件
 */
export const PersonalSidebar: React.FC = React.memo(() => {
  const converseList = useDMConverseList();
  const disablePluginStore = useGlobalConfigStore(
    (state) => state.disablePluginStore
  );

  return (
    <CommonSidebarWrapper data-tc-role="sidebar-personal">
      <div className="p-2 overflow-auto flex-1">
        {!disablePluginStore && (
          <SidebarItem
            name={t('插件中心')}
            icon={<Icon icon="mdi:puzzle" />}
            to="/main/personal/plugins"
          />
        )}

        {/* 插件自定义面板 */}
        {pluginCustomPanel
          .filter((p) => p.position === 'personal')
          .map((p) => (
            <CustomSidebarItem key={p.name} panelInfo={p} />
          ))}

        <SidebarSection
          action={
            <Icon
              icon="mdi:plus"
              onClick={() => openModal(<CreateDMConverse />)}
            />
          }
        >
          {t('// DIRECT_MESSAGES')}
        </SidebarSection>

        {converseList.map((converse) => {
          return <SidebarDMItem key={converse._id} converse={converse} />;
        })}
      </div>
    </CommonSidebarWrapper>
  );
});
PersonalSidebar.displayName = 'PersonalSidebar';
