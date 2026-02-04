import { closeModal, openModal } from '@/components/Modal';
import { SettingsView } from '@/components/modals/SettingsView';
import { Icon } from 'tailchat-design';
import React, { useCallback } from 'react';

export const SettingBtn: React.FC = React.memo(() => {
  const handleClick = useCallback(() => {
    const key = openModal(<SettingsView onClose={() => closeModal(key)} />);
  }, []);

  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        border: '1px solid #3D3D3D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <Icon className="text-xl" style={{ color: '#666666' }} icon="mdi:cog" />
    </div>
  );
});
SettingBtn.displayName = 'SettingBtn';
