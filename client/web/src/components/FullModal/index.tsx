import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import _isFunction from 'lodash/isFunction';
import { Icon } from 'tailchat-design';
import clsx from 'clsx';

/**
 * 全屏模态框
 */
interface FullModalProps extends PropsWithChildren {
  visible?: boolean;
  onChangeVisible?: (visible: boolean) => void;
}
export const FullModal: React.FC<FullModalProps> = React.memo((props) => {
  const { visible = true, onChangeVisible } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  const handleClose = useCallback(() => {
    _isFunction(onChangeVisible) && onChangeVisible(false);
  }, [onChangeVisible]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keyup', handler);

    return () => {
      window.removeEventListener('keyup', handler);
    };
  }, [handleClose]);

  return (
    <div
      className={clsx(
        'fixed left-0 right-0 top-0 bottom-0 z-10 flex justify-center items-center',
        {
          'opacity-0': !visible,
        }
      )}
      style={{ backgroundColor: '#1A1A1A' }}
      ref={ref}
    >
      {props.children}

      {_isFunction(onChangeVisible) && (
        <div
          className="absolute right-8 top-8 cursor-pointer flex flex-col"
          onClick={handleClose}
          data-testid="full-modal-close"
        >
          <Icon
            className="text-2xl"
            icon="mdi:close"
            style={{
              border: '2px solid #3D3D3D',
              borderRadius: '50%',
              padding: 4,
              color: '#666666',
            }}
          />
          <span
            style={{
              textAlign: 'center',
              marginTop: 4,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              fontWeight: 600,
              color: '#666666',
            }}
          >
            ESC
          </span>
        </div>
      )}
    </div>
  );
});
FullModal.displayName = 'FullModal';
