import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import './loader.css';

const MESSAGES_MAPPING = {
  default: [
    'Loading...',
    'Still loading, thank you for waiting...',
    'Preparing the workspace...',
    'Almost done, setting things up...',
  ],
  session: [
    'Securing your session...',
    'Verifying your credentials...',
    'Loading user profile...',
    'Almost there, establishing secure connection...',
  ],
  checkout: [
    'Securing checkout...',
    'Connecting to billing provider...',
    'Preparing payment gate...',
    'Finalizing transaction page...',
  ],
  submit: [
    'Saving prompt...',
    'Validating input fields...',
    'Updating prompt metadata...',
    'Applying final configurations...',
  ],
} as const;

interface LoaderProps {
  className?: string;
  size?: number;
  color?: string;
  accentColor?: string;
  variant?: 'default' | 'session' | 'checkout' | 'submit';
  messages?: string[];
}

/**
 * A custom 3D animated loader component.
 *
 * @param className - Additional classes for the container
 * @param size - Size of the loader in pixels (default: 48)
 * @param color - Primary color of the loader (default: currentColor or #fff)
 * @param accentColor - Accent color of the loader (default: #FF3D00)
 * @param variant - The message sequence variant to display below the spinner
 * @param messages - Optional custom message sequence to override the preset list
 */
export function Loader({
  className,
  size = 48,
  color,
  accentColor,
  variant,
  messages,
}: LoaderProps) {
  const messagesKey = messages?.join(',');
  const [prevVariant, setPrevVariant] = useState(variant);
  const [prevMessagesKey, setPrevMessagesKey] = useState(messagesKey);
  const [messageIndex, setMessageIndex] = useState(0);

  if (variant !== prevVariant || messagesKey !== prevMessagesKey) {
    setPrevVariant(variant);
    setPrevMessagesKey(messagesKey);
    setMessageIndex(0);
  }

  useEffect(() => {
    if (!variant) return;

    const timer1 = setTimeout(() => setMessageIndex(1), 3000);
    const timer2 = setTimeout(() => setMessageIndex(2), 5000);
    const timer3 = setTimeout(() => setMessageIndex(3), 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [variant, messagesKey]);

  const activeMessages = messages || (variant ? MESSAGES_MAPPING[variant] : []);
  const currentMessage =
    activeMessages.length > 0
      ? activeMessages[Math.min(messageIndex, activeMessages.length - 1)]
      : undefined;

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        variant && 'flex-col',
        className,
      )}
      style={
        {
          '--loader-color': color || 'currentColor',
          '--loader-accent': accentColor || '#FF3D00',
        } as React.CSSProperties
      }
    >
      <span
        className="loader"
        style={{
          width: size,
          height: size,
        }}
      />
      {variant && currentMessage && (
        <p
          key={currentMessage}
          className="loader-text animate-fade-in-up text-muted-foreground text-sm font-medium tracking-wide uppercase"
        >
          {currentMessage}
        </p>
      )}
    </div>
  );
}
