import React from 'react';
import { Icon } from 'tailchat-design';
import { t } from 'tailchat-shared';

export const ChatMessageHeader: React.FC<{
  title: React.ReactNode;
}> = React.memo((props) => {
  return (
    <div style={{ padding: '32px 24px 16px' }}>
      <div
        className="flex items-center"
        style={{
          fontFamily: 'Oswald, sans-serif',
          fontSize: 20,
          fontWeight: 700,
          color: '#FFFFFF',
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom: 8,
          gap: 8,
        }}
      >
        <Icon icon="mdi:pound" style={{ color: '#666666' }} />
        <div>{props.title}</div>
      </div>
      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12,
          color: '#666666',
        }}
      >
        {t('这里是所有消息的开始，请畅所欲言。')}
      </div>
    </div>
  );
});
ChatMessageHeader.displayName = 'ChatMessageHeader';
