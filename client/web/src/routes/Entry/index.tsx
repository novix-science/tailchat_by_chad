import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginView } from './LoginView';
import styles from './index.module.less';
import { RegisterView } from './RegisterView';
import { useRecordMeasure } from '@/utils/measure-helper';
import { GuestView } from './GuestView';
import { ForgetPasswordView } from './ForgetPasswordView';

const EntryRoute = React.memo(() => {
  useRecordMeasure('appEntryRenderStart');

  return (
    <div
      className="h-full flex flex-row"
      style={{ backgroundColor: '#0D0D0D' }}
    >
      {/* Left Brand Panel */}
      <div
        className={styles.entryLeft}
        style={{
          width: 560,
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '40px 48px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              backgroundColor: '#FF6B35',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: 16,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            MOCHAT
          </span>
        </div>

        {/* Tagline */}
        <div style={{ marginTop: -80 }}>
          <h1
            style={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: 48,
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: 2,
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            WHERE
            <br />
            CONVERSATIONS
            <br />
            COME ALIVE
          </h1>
          <p
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: '#444444',
              marginTop: 24,
              letterSpacing: 1,
            }}
          >
            {'// REAL_ESTATE   MORE_CUSTOM   CUSTOMIZABLE'}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            color: '#444444',
          }}
        >
          {'© 2024 MoChat · MIT License'}
        </div>
      </div>

      {/* Right Form Panel */}
      <div
        className="flex-1 mobile:w-full flex items-center justify-center"
        style={{ backgroundColor: '#1A1A1A' }}
      >
        <div className="mobile:hidden" style={{ display: 'none' }} />
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/guest" element={<GuestView />} />
          <Route path="/forget" element={<ForgetPasswordView />} />
          <Route
            path="/"
            element={<Navigate to="/entry/login" replace={true} />}
          />
        </Routes>
      </div>
    </div>
  );
});
EntryRoute.displayName = 'EntryRoute';

export default EntryRoute;
