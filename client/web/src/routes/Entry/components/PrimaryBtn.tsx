import { Spinner } from '@/components/Spinner';
import clsx from 'clsx';
import React, { ButtonHTMLAttributes } from 'react';
import _omit from 'lodash/omit';

export const PrimaryBtn: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
  }
> = React.memo((props) => {
  return (
    <button
      disabled={props.loading}
      {..._omit(props, ['loading'])}
      className={clsx(
        'w-full mb-3 border-none focus:outline-none disabled:opacity-50 cursor-pointer',
        props.className
      )}
      style={{
        backgroundColor: '#FF6B35',
        color: '#FFFFFF',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 13,
        fontWeight: 600,
        borderRadius: 4,
        padding: '14px 24px',
        letterSpacing: 1,
        ...props.style,
      }}
    >
      {props.loading && <Spinner />}
      {props.children}
    </button>
  );
});
PrimaryBtn.displayName = 'PrimaryBtn';
