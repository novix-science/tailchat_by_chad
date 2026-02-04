import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { createDMConverse, t, useAsyncRequest } from 'tailchat-shared';
import { FriendPicker } from '../UserPicker/FriendPicker';
import { closeModal, ModalWrapper } from '../Modal';

interface CreateDMConverseProps {
  /**
   * 隐藏成员
   * 在选择好友时会进行过滤
   * 但是创建时会加上
   */
  hiddenUserIds?: string[];
}
export const CreateDMConverse: React.FC<CreateDMConverseProps> = React.memo(
  (props) => {
    const { hiddenUserIds = [] } = props;
    const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
    const navigate = useNavigate();

    const [{ loading }, handleCreate] = useAsyncRequest(async () => {
      const converse = await createDMConverse([
        ...hiddenUserIds,
        ...selectedFriendIds,
      ]);
      closeModal();
      navigate(`/main/personal/converse/${converse._id}`);
    }, [selectedFriendIds]);

    return (
      <ModalWrapper style={{ maxWidth: 480 }}>
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: '#444444',
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          {'// new_conversation'}
        </div>

        <h2
          style={{
            fontFamily: 'Oswald, sans-serif',
            fontSize: 20,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: 2,
            textTransform: 'uppercase',
            margin: '0 0 24px 0',
          }}
        >
          {t('NEW CONVERSATION')}
        </h2>

        <FriendPicker
          withoutUserIds={hiddenUserIds}
          selectedIds={selectedFriendIds}
          onChange={setSelectedFriendIds}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            marginTop: 24,
          }}
        >
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
            {t('cancel()')}
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || selectedFriendIds.length === 0}
            style={{
              padding: '10px 24px',
              backgroundColor: '#FF6B35',
              border: 'none',
              borderRadius: 4,
              color: '#FFFFFF',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
              fontWeight: 600,
              cursor:
                loading || selectedFriendIds.length === 0
                  ? 'not-allowed'
                  : 'pointer',
              opacity: loading || selectedFriendIds.length === 0 ? 0.5 : 1,
            }}
          >
            {loading ? t('创建中...') : t('start_chat()')}
          </button>
        </div>
      </ModalWrapper>
    );
  }
);
CreateDMConverse.displayName = 'CreateDMConverse';
