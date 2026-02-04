import { Spinner } from '@/components/Spinner';
import { useSearchParam } from '@/hooks/useSearchParam';
import { setUserJWT } from '@/utils/jwt-helper';
import { setGlobalUserLoginInfo } from '@/utils/user-helper';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  createTemporaryUser,
  isValidStr,
  t,
  useAsyncRequest,
} from 'tailchat-shared';
import { string } from 'yup';
import { useNavToView } from './utils';
import { EntryInput } from './components/Input';

export const GuestView: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const navToView = useNavToView();
  const navRedirect = useSearchParam('redirect');
  const [nickname, setNickname] = useState('');

  const [{ loading }, handleCreateTemporaryUser] = useAsyncRequest(async () => {
    await string().required(t('昵称不能为空')).max(16).validate(nickname);

    const data = await createTemporaryUser(nickname);

    setGlobalUserLoginInfo(data);
    await setUserJWT(data.token);

    if (isValidStr(navRedirect)) {
      navigate(decodeURIComponent(navRedirect));
    } else {
      navigate('/main');
    }
  }, [nickname, navigate, navRedirect]);

  return (
    <div style={{ width: 400 }}>
      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          color: '#444444',
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        {'// GUEST_ACCESS'}
      </div>

      <h2
        style={{
          fontFamily: 'Oswald, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          color: '#FFFFFF',
          letterSpacing: 2,
          textTransform: 'uppercase',
          margin: '0 0 8px 0',
        }}
      >
        {t('CREATE GUEST')}
      </h2>

      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          color: '#666666',
          marginBottom: 32,
        }}
      >
        {t('Enter a nickname to begin as a guest')}
      </p>

      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: '#666666',
            marginBottom: 8,
            letterSpacing: 0.5,
          }}
        >
          {'// nickname'}
        </div>
        <EntryInput
          placeholder={t('Enter your call sign')}
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

      <button
        onClick={handleCreateTemporaryUser}
        disabled={loading || !nickname.trim()}
        style={{
          width: '100%',
          padding: '14px 24px',
          backgroundColor: '#FF6B35',
          border: 'none',
          borderRadius: 4,
          color: '#FFFFFF',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 13,
          fontWeight: 600,
          cursor: loading || !nickname.trim() ? 'not-allowed' : 'pointer',
          opacity: loading || !nickname.trim() ? 0.5 : 1,
          marginBottom: 12,
          letterSpacing: 1,
        }}
      >
        {loading ? <Spinner /> : null}
        {'enter_room()'}
      </button>

      <button
        onClick={() => navToView('/entry/login')}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px 24px',
          backgroundColor: 'transparent',
          border: '1px solid #3D3D3D',
          borderRadius: 4,
          color: '#666666',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        {'← back_to_login()'}
      </button>
    </div>
  );
});
GuestView.displayName = 'GuestView';
