import {
  forgetPassword,
  resetPassword,
  showToasts,
  t,
  useAsyncRequest,
} from 'tailchat-shared';
import React, { useState } from 'react';
import { string } from 'yup';
import { useNavToView } from './utils';
import { EntryInput } from './components/Input';
import { Spinner } from '@/components/Spinner';

/**
 * 忘记密码视图
 */
export const ForgetPasswordView: React.FC = React.memo(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [sendedEmail, setSendedEmail] = useState(false);

  const navToView = useNavToView();

  const [{ loading: sendEmailLoading }, handleSendEmail] =
    useAsyncRequest(async () => {
      await forgetPassword(email);
      setSendedEmail(true);
      showToasts(`已发送邮件到 ${email}`, 'success');
    }, [email]);

  const [{ loading }, handleResetPassword] = useAsyncRequest(async () => {
    await string()
      .email(t('邮箱格式不正确'))
      .required(t('邮箱不能为空'))
      .validate(email);

    await string()
      .min(6, t('密码不能低于6位'))
      .required(t('密码不能为空'))
      .validate(password);

    await string().length(6, t('OTP为6位数字')).validate(otp);

    await resetPassword(email, password, otp);

    showToasts(t('密码重置成功，现在回到登录页'), 'success');
    navToView('/entry/login');
  }, [email, password, otp, navToView]);

  return (
    <div style={{ width: 400, textAlign: 'center' }}>
      {/* Key icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          border: '2px solid #3D3D3D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FF6B35"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
        </svg>
      </div>

      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          color: '#444444',
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        {'// RESET_PASSWORD'}
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
        {t('ENTER OTP')}
      </h2>

      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          color: '#666666',
          marginBottom: 32,
        }}
      >
        {sendedEmail
          ? t('A 6-digit code has been sent to your email.')
          : t('Enter your email to receive a reset code.')}
      </p>

      <div style={{ textAlign: 'left' }}>
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
            name="forget-email"
            placeholder="name@example.com"
            type="text"
            disabled={sendedEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {!sendedEmail && (
          <button
            onClick={handleSendEmail}
            disabled={sendEmailLoading || !email.trim()}
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
              cursor:
                sendEmailLoading || !email.trim() ? 'not-allowed' : 'pointer',
              opacity: sendEmailLoading || !email.trim() ? 0.5 : 1,
              marginBottom: 12,
              letterSpacing: 1,
            }}
          >
            {sendEmailLoading ? <Spinner /> : null}
            {t('send_otp()')}
          </button>
        )}

        {sendedEmail && (
          <>
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
                {'// otp_code'}
              </div>
              <EntryInput
                name="forget-otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
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
                {'// new_password'}
              </div>
              <EntryInput
                name="forget-password"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleResetPassword}
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
              {'reset_password()'}
            </button>
          </>
        )}

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
ForgetPasswordView.displayName = 'ForgetPasswordView';
