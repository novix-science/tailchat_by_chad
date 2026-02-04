import {
  isValidStr,
  loginWithEmail,
  t,
  useAsyncFn,
  useGlobalConfigStore,
} from 'tailchat-shared';
import React, { useEffect, useState } from 'react';
import { string } from 'yup';
import { useLocation, useNavigate } from 'react-router';
import { setUserJWT } from '../../utils/jwt-helper';
import { setGlobalUserLoginInfo, tryAutoLogin } from '../../utils/user-helper';
import { useSearchParam } from '@/hooks/useSearchParam';
import { useNavToView } from './utils';
import { IconBtn } from '@/components/IconBtn';
import { openModal } from '@/components/Modal';
import { ServiceUrlSettings } from '@/components/modals/ServiceUrlSettings';
import { LanguageSelect } from '@/components/LanguageSelect';
import { EntryInput } from './components/Input';
import { pluginLoginAction } from '@/plugin/common';
import { Spinner } from '@/components/Spinner';

/**
 * 登录视图
 */
export const LoginView: React.FC = React.memo(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const navRedirect = useSearchParam('redirect');
  const { pathname } = useLocation();
  const { serverName, disableGuestLogin, disableUserRegister } =
    useGlobalConfigStore((state) => ({
      serverName: state.serverName,
      disableGuestLogin: state.disableGuestLogin,
      disableUserRegister: state.disableUserRegister,
    }));

  useEffect(() => {
    tryAutoLogin()
      .then(() => {
        navigate('/main');
      })
      .catch(() => {});
  }, []);

  const [{ loading, error }, handleLogin] = useAsyncFn(async () => {
    await string()
      .email(t('邮箱格式不正确'))
      .required(t('邮箱不能为空'))
      .validate(email);

    await string()
      .min(6, t('密码不能低于6位'))
      .required(t('密码不能为空'))
      .validate(password);

    const data = await loginWithEmail(email, password);

    setGlobalUserLoginInfo(data);
    await setUserJWT(data.token);

    if (isValidStr(navRedirect) && navRedirect !== pathname) {
      navigate(decodeURIComponent(navRedirect));
    } else {
      navigate('/main');
    }
  }, [email, password, navRedirect, pathname, navigate]);

  const navToView = useNavToView();

  return (
    <div style={{ width: 400, position: 'relative' }}>
      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          color: '#444444',
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        {'// LOGIN_ACCOUNT'}
      </div>

      <h2
        style={{
          fontFamily: 'Oswald, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          color: '#FFFFFF',
          letterSpacing: 2,
          textTransform: 'uppercase',
          margin: '0 0 32px 0',
        }}
      >
        {t('登录 {{serverName}}', {
          serverName: serverName || 'MoChat',
        })}
      </h2>

      <div>
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: '#666666',
              marginBottom: 8,
              letterSpacing: 0.5,
            }}
          >
            {'// email'}
          </div>
          <EntryInput
            name="login-email"
            placeholder="name@example.com"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: '#666666',
              marginBottom: 8,
              letterSpacing: 0.5,
            }}
          >
            {'// password'}
          </div>
          <EntryInput
            name="login-password"
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {loading === false && error && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 16,
              alignItems: 'center',
            }}
          >
            <p
              style={{
                color: '#FF4444',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12,
                margin: 0,
              }}
            >
              {error.message}
            </p>
            <div
              style={{
                color: '#FF6B35',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12,
                cursor: 'pointer',
              }}
              onClick={() => navToView('/entry/forget')}
            >
              {t('忘记密码？')}
            </div>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
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
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
            marginBottom: 12,
            letterSpacing: 1,
          }}
        >
          {loading ? <Spinner /> : null}
          {'login()'}
        </button>

        {!disableUserRegister && (
          <button
            disabled={loading}
            onClick={() => navToView('/entry/register')}
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
              marginBottom: 8,
            }}
          >
            {t('注册账号')} {'→'}
          </button>
        )}

        {!disableGuestLogin && (
          <button
            disabled={loading}
            onClick={() => navToView('/entry/guest')}
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
              marginBottom: 8,
            }}
          >
            {t('游客访问')} {'→'}
          </button>
        )}

        {pluginLoginAction.map((item) => {
          const { name, component: Component } = item;

          return <Component key={name} />;
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: -60,
          left: 0,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <IconBtn
          icon="mdi:cog"
          shape="square"
          onClick={() => openModal(<ServiceUrlSettings />)}
        />

        <LanguageSelect size="middle" />
      </div>
    </div>
  );
});
LoginView.displayName = 'LoginView';
