import {
  isValidStr,
  model,
  registerWithEmail,
  showSuccessToasts,
  t,
  useAsyncFn,
  useAsyncRequest,
  getGlobalConfig,
  useWatch,
} from 'tailchat-shared';
import React, { useState } from 'react';
import { string } from 'yup';
import { Icon } from 'tailchat-design';
import { useNavigate } from 'react-router';
import { setUserJWT } from '../../utils/jwt-helper';
import { setGlobalUserLoginInfo } from '../../utils/user-helper';
import { useSearchParam } from '@/hooks/useSearchParam';
import { useNavToView } from './utils';
import { EntryInput } from './components/Input';
import { TipIcon } from '@/components/TipIcon';
import { Spinner } from '@/components/Spinner';

/**
 * 注册视图
 */
export const RegisterView: React.FC = React.memo(() => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [emailOTP, setEmailOTP] = useState('');
  const [sendedEmail, setSendedEmail] = useState(false);
  const [customNickname, setCustomNickname] = useState(false);
  const navigate = useNavigate();
  const navRedirect = useSearchParam('redirect');

  const [{ loading, error }, handleRegister] = useAsyncFn(async () => {
    await string()
      .email(t('邮箱格式不正确'))
      .required(t('邮箱不能为空'))
      .max(40, t('邮箱最长限制40个字符'))
      .validate(email);

    await string()
      .min(6, t('密码不能低于6位'))
      .required(t('密码不能为空'))
      .max(40, t('密码最长限制40个字符'))
      .validate(password);

    const data = await registerWithEmail({
      email,
      password,
      nickname,
      emailOTP,
    });

    setGlobalUserLoginInfo(data);
    await setUserJWT(data.token);

    if (isValidStr(navRedirect)) {
      navigate(decodeURIComponent(navRedirect));
    } else {
      navigate('/main');
    }
  }, [email, nickname, password, emailOTP, navRedirect]);

  const [{ loading: sendEmailLoading }, handleSendEmail] =
    useAsyncRequest(async () => {
      await model.user.verifyEmail(email);
      showSuccessToasts(t('发送成功, 请检查你的邮箱。'));
      setSendedEmail(true);
    }, [email]);

  useWatch([email, customNickname], () => {
    if (!customNickname) {
      setNickname(getEmailAddress(email));
    }
  });

  const navToView = useNavToView();

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
        {'// REGISTER_ACCOUNT'}
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
        {t('SIGN UP')}
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
            name="reg-email"
            placeholder="name@example.com"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {getGlobalConfig().emailVerification && (
          <>
            {!sendedEmail && (
              <button
                onClick={handleSendEmail}
                disabled={sendEmailLoading}
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
                  cursor: sendEmailLoading ? 'not-allowed' : 'pointer',
                  opacity: sendEmailLoading ? 0.5 : 1,
                  marginBottom: 16,
                  letterSpacing: 1,
                }}
              >
                {sendEmailLoading ? <Spinner /> : null}
                {t('向邮箱发送校验码')}
              </button>
            )}

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
                {'// emailOTP'}
              </div>
              <EntryInput
                name="reg-email-otp"
                type="text"
                placeholder="6位校验码"
                value={emailOTP}
                onChange={(e) => setEmailOTP(e.target.value)}
              />
            </div>
          </>
        )}

        <div style={{ marginBottom: 20, position: 'relative' }}>
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: '#666666',
              marginBottom: 8,
              letterSpacing: 0.5,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ marginRight: 4 }}>{'// username'}</span>
            <TipIcon content={t('后续在用户设置中可以随时修改')} />
          </div>
          <EntryInput
            name="reg-nickname"
            type="text"
            disabled={!customNickname}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <Icon
            className="absolute right-2 cursor-pointer z-10"
            style={{
              bottom: 10,
              width: 28,
              height: 28,
              padding: 6,
              borderRadius: 4,
              color: '#666666',
            }}
            icon={customNickname ? 'mdi:pencil-off' : 'mdi:pencil'}
            onClick={() =>
              setCustomNickname((customNickname) => !customNickname)
            }
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
            name="reg-password"
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p
            style={{
              color: '#FF4444',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            {error.message}
          </p>
        )}

        <button
          onClick={handleRegister}
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
          {'register()'}
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
    </div>
  );
});
RegisterView.displayName = 'RegisterView';

function getEmailAddress(email: string) {
  return email.split('@')[0];
}
