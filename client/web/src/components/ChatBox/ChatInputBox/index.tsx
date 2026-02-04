import {
  getMessageTextDecorators,
  pluginChatInputButtons,
} from '@/plugin/common';
import { isEnterHotkey } from '@/utils/hot-key';
import React, { useRef, useState } from 'react';
import { ChatInputAddon } from './Addon';
import { ClipboardHelper } from './clipboard-helper';
import { ChatInputActionContext, useChatInputMentionsContext } from './context';
import { uploadMessageImage } from './utils';
import { ChatInputBoxInput } from './input';
import {
  getCachedUserInfo,
  isValidStr,
  SendMessagePayloadMeta,
  useEvent,
  useSharedEventHandler,
} from 'tailchat-shared';
import { ChatInputEmotion } from './Emotion';
import _uniq from 'lodash/uniq';
import { ChatDropArea } from './ChatDropArea';
import { Icon } from 'tailchat-design';
import { usePasteHandler } from './usePasteHandler';

interface ChatInputBoxProps {
  onSendMsg: (msg: string, meta?: SendMessagePayloadMeta) => Promise<void>;
}
/**
 * 通用聊天输入框
 */
export const ChatInputBox: React.FC<ChatInputBoxProps> = React.memo((props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [mentions, setMentions] = useState<string[]>([]);
  const { disabled } = useChatInputMentionsContext();
  const { runPasteHandlers, pasteHandlerContainer } = usePasteHandler();

  const sendMessage = useEvent(
    async (msg: string, meta?: SendMessagePayloadMeta) => {
      await props.onSendMsg(msg, meta);
      setMessage('');
      inputRef.current?.focus();
    }
  );

  const handleSendMsg = useEvent(() => {
    sendMessage(message, {
      mentions: _uniq(mentions), // 发送前去重
    });
  });

  const appendMsg = useEvent((append: string) => {
    setMessage(message + append);

    inputRef.current?.focus();
  });

  const handleKeyDown = useEvent(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (isEnterHotkey(e.nativeEvent)) {
        e.preventDefault();
        handleSendMsg();
      }
    }
  );

  const handlePaste = useEvent(
    (e: React.ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const el: HTMLTextAreaElement | HTMLInputElement = e.currentTarget;
      const helper = new ClipboardHelper(e);

      if (!el.value) {
        // 当没有任何输入内容时才会执行handler
        const handlers = helper.matchPasteHandler();
        if (handlers.length > 0) {
          // 弹出选择框
          runPasteHandlers(handlers, e, {
            sendMessage,
            applyMessage: setMessage,
          });
          return;
        }
      }

      // If not match any paste handler or not paste without any input, fallback to image paste checker
      const image = helper.hasImage();
      if (image) {
        // 上传图片
        e.preventDefault();
        uploadMessageImage(image).then(({ url, width, height }) => {
          props.onSendMsg(
            getMessageTextDecorators().image(url, { width, height })
          );
        });
      }
    }
  );

  useSharedEventHandler('replyMessage', async (payload) => {
    if (inputRef.current) {
      inputRef.current.focus();
      if (payload && isValidStr(payload?.author)) {
        const userInfo = await getCachedUserInfo(payload.author);
        setMessage(
          `${getMessageTextDecorators().mention(
            payload.author,
            userInfo.nickname
          )} ${message}`
        );
      }
    }
  });

  return (
    <ChatInputActionContext.Provider
      value={{
        message,
        setMessage,
        sendMsg: props.onSendMsg,
        appendMsg,
      }}
    >
      <div style={{ padding: '12px 24px', borderTop: '1px solid #3D3D3D' }}>
        <div
          className="flex items-center relative"
          style={{
            backgroundColor: '#0D0D0D',
            border: '1px solid #3D3D3D',
            borderRadius: 6,
            minHeight: 40,
          }}
        >
          {!disabled && (
            <div className="flex items-center" style={{ paddingLeft: 12 }}>
              <ChatInputAddon />
            </div>
          )}

          {/* This w-0 is magic to ensure show mention and long text */}
          <div className="flex-1 w-0">
            <ChatInputBoxInput
              inputRef={inputRef}
              value={message}
              onChange={(message, mentions) => {
                setMessage(message);
                setMentions(mentions);
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
            />
          </div>

          {pasteHandlerContainer}

          {!disabled && (
            <div
              className="flex items-center"
              style={{ paddingRight: 12, gap: 8 }}
            >
              {pluginChatInputButtons.map((item, i) =>
                React.cloneElement(item.render(), {
                  key: `plugin-chatinput-btn#${i}`,
                })
              )}

              <ChatInputEmotion />

              {message && (
                <Icon
                  icon="mdi:send"
                  className="cursor-pointer"
                  style={{ fontSize: 18, color: '#FF6B35' }}
                  onClick={handleSendMsg}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {!disabled && <ChatDropArea />}
    </ChatInputActionContext.Provider>
  );
});
ChatInputBox.displayName = 'ChatInputBox';
