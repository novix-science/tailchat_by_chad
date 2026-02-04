import { Input } from 'antd';
import React, { useState } from 'react';
import {
  createGroup,
  GroupPanelType,
  t,
  useAppDispatch,
  useAsyncRequest,
  groupActions,
} from 'tailchat-shared';
import type { GroupPanel } from 'tailchat-shared';
import { closeModal, ModalWrapper } from '../Modal';
import { useNavigate } from 'react-router';
import { applyDefaultFallbackGroupPermission } from 'tailchat-shared';

const defaultPanels: GroupPanel[] = [
  {
    id: '00',
    name: t('文字频道'),
    type: GroupPanelType.GROUP,
  },
  {
    id: '01',
    name: t('大厅'),
    parentId: '00',
    type: GroupPanelType.TEXT,
  },
];

export const ModalCreateGroup: React.FC = React.memo(() => {
  const [name, setName] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [{ loading }, handleCreate] = useAsyncRequest(async () => {
    const data = await createGroup(name, defaultPanels);

    dispatch(groupActions.appendGroups([data]));

    navigate(`/main/group/${data._id}`);

    await applyDefaultFallbackGroupPermission(String(data._id));

    closeModal();
  }, [name, location]);

  return (
    <ModalWrapper style={{ maxWidth: 480 }}>
      <div
        style={{
          backgroundColor: '#1A1A1A',
          borderRadius: 8,
          padding: '32px 32px 24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: 20,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: 2,
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            {t('创建群组')}
          </h2>
        </div>

        <div
          style={{
            marginBottom: 8,
            color: '#444444',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            letterSpacing: 1,
          }}
        >
          {'// create_group'}
        </div>

        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              marginBottom: 8,
              color: '#666666',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
            }}
          >
            {t('群组名称')}
          </div>
          <Input
            size="large"
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('输入群组名称')}
            style={{
              backgroundColor: '#0D0D0D',
              border: '1px solid #3D3D3D',
              borderRadius: 4,
              color: '#FFFFFF',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13,
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button
            onClick={() => closeModal()}
            style={{
              padding: '10px 24px',
              backgroundColor: 'transparent',
              border: '1px solid #3D3D3D',
              borderRadius: 4,
              color: '#666666',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {t('取消')}
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            style={{
              padding: '10px 24px',
              backgroundColor: '#FF6B35',
              border: 'none',
              borderRadius: 4,
              color: '#FFFFFF',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
              fontWeight: 600,
              cursor: loading || !name.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !name.trim() ? 0.5 : 1,
            }}
          >
            {loading ? t('创建中...') : t('下一步')}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
});
ModalCreateGroup.displayName = 'ModalCreateGroup';
