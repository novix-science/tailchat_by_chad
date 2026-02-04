import clsx from 'clsx';
import React, { InputHTMLAttributes } from 'react';

export const EntryInput: React.FC<InputHTMLAttributes<HTMLInputElement>> =
  React.memo((props) => {
    return (
      <input
        {...props}
        className={clsx(
          'appearance-none relative block w-full px-4 py-3 focus:outline-none focus:z-10 text-sm mobile:text-sm',
          props.className
        )}
        style={{
          backgroundColor: '#0D0D0D',
          border: '1px solid #3D3D3D',
          borderRadius: 4,
          color: '#FFFFFF',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 13,
          ...props.style,
        }}
      >
        {props.children}
      </input>
    );
  });
EntryInput.displayName = 'EntryInput';
