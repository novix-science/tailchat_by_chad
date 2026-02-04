import clsx from 'clsx';
import React, { ButtonHTMLAttributes } from 'react';

export const SecondaryBtn: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> =
  React.memo((props) => {
    return (
      <button
        {...props}
        className={clsx(
          'w-full focus:outline-none disabled:opacity-50 cursor-pointer',
          props.className
        )}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #3D3D3D',
          borderRadius: 4,
          color: '#666666',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12,
          padding: '12px 24px',
          ...props.style,
        }}
      >
        {props.children}
      </button>
    );
  });
SecondaryBtn.displayName = 'SecondaryBtn';
