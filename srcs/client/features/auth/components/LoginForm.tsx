'use client';

import Image from 'next/image';
import {
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  useRef,
} from 'react';
import icochangArmsImage from '@/assets/icochang_arms.png';
import icochangBackgroundImage from '@/assets/icochang_background.png';
import icochangFrontgroundImage from '@/assets/icochang_frontground.png';
import icochangLeftEyeImage from '@/assets/icochang_lefteye.png';
import icochangRightEyeImage from '@/assets/icochang_righteye.png';
import icoicoLogoImage from '@/assets/icoico.png';
import { signInWithGoogle } from '@/features/auth/actions';

export function LoginForm() {
  const interactionRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const defaultEyeX = 0;
  const defaultEyeY = -12;

  const setInteractionIntent = (value: number) => {
    const interactionField = interactionRef.current;

    if (!interactionField) {
      return;
    }

    const clampedValue = Math.max(0, Math.min(1, value));
    const mascotLift = `${(-10 * clampedValue).toFixed(2)}px`;
    const mascotScale = (1 + clampedValue * 0.025).toFixed(4);
    const buttonRingOpacity = (clampedValue * 0.9).toFixed(3);
    const buttonGlowOpacity = (clampedValue * 0.85).toFixed(3);

    interactionField.style.setProperty(
      '--login-intent',
      clampedValue.toFixed(3),
    );
    interactionField.style.setProperty('--login-mascot-lift', mascotLift);
    interactionField.style.setProperty('--login-mascot-scale', mascotScale);
    interactionField.style.setProperty(
      '--login-button-ring-opacity',
      buttonRingOpacity,
    );
    interactionField.style.setProperty(
      '--login-button-glow-opacity',
      buttonGlowOpacity,
    );
    interactionField.dataset.loginIntent =
      clampedValue > 0.14 ? 'true' : 'false';
  };

  const setEyePosition = (event: PointerEvent<HTMLDivElement>) => {
    const interactionField = interactionRef.current;
    const mascot = mascotRef.current;

    if (!interactionField || !mascot) {
      return;
    }

    const mascotRect = mascot.getBoundingClientRect();
    const centerX = mascotRect.left + mascotRect.width / 2;
    const centerY = mascotRect.top + mascotRect.height * 0.35;
    const horizontalIntent =
      (event.clientX - centerX) / (mascotRect.width * 0.3);
    const verticalIntent =
      (event.clientY - centerY) / (mascotRect.height * 0.25);
    const eyeX = defaultEyeX + Math.max(-1, Math.min(1, horizontalIntent)) * 10;
    const eyeY = defaultEyeY + Math.max(-1.65, Math.min(1, verticalIntent)) * 8;

    interactionField.style.setProperty('--login-eye-x', `${eyeX.toFixed(2)}px`);
    interactionField.style.setProperty('--login-eye-y', `${eyeY.toFixed(2)}px`);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') {
      return;
    }

    const interactionField = interactionRef.current;
    const button = buttonRef.current;

    if (!interactionField || !button) {
      return;
    }

    setEyePosition(event);

    const buttonRect = button.getBoundingClientRect();
    const interactionRect = interactionField.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    const pointerDistance = Math.hypot(
      event.clientX - buttonCenterX,
      event.clientY - buttonCenterY,
    );
    const intentRange = 230;
    const intent = (intentRange - pointerDistance) / intentRange;

    interactionField.style.setProperty(
      '--login-pointer-x',
      `${event.clientX - interactionRect.left}px`,
    );
    interactionField.style.setProperty(
      '--login-pointer-y',
      `${event.clientY - interactionRect.top}px`,
    );
    setInteractionIntent(intent);
  };

  const handlePointerLeave = () => {
    setInteractionIntent(0);
    const interactionField = interactionRef.current;

    if (!interactionField) {
      return;
    }

    interactionField.style.setProperty(
      '--login-eye-x',
      `${defaultEyeX.toFixed(2)}px`,
    );
    interactionField.style.setProperty(
      '--login-eye-y',
      `${defaultEyeY.toFixed(2)}px`,
    );
  };

  const handleFocus = () => {
    setInteractionIntent(1);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget;

    if (
      !(nextFocusedElement instanceof Node) ||
      !event.currentTarget.contains(nextFocusedElement)
    ) {
      setInteractionIntent(0);
    }
  };

  const interactionStyle = {
    '--login-intent': '0',
    '--login-mascot-lift': '0px',
    '--login-mascot-scale': '1',
    '--login-button-ring-opacity': '0',
    '--login-button-glow-opacity': '0',
    '--login-pointer-x': '50%',
    '--login-pointer-y': '50%',
    '--login-eye-x': `${defaultEyeX.toFixed(2)}px`,
    '--login-eye-y': `${defaultEyeY.toFixed(2)}px`,
  } as CSSProperties;

  return (
    <div
      ref={interactionRef}
      className='login-interaction-field relative flex min-h-dvh w-full items-center justify-center'
      data-login-intent='false'
      onBlurCapture={handleBlur}
      onFocusCapture={handleFocus}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={interactionStyle}
    >
      <div className='login-experience relative flex min-h-[42rem] w-full max-w-[26rem] flex-col items-center justify-end md:min-h-[45rem] md:max-w-[28rem]'>
        <div ref={mascotRef} className='login-mascot-stack' aria-hidden='true'>
          <Image
            src={icochangBackgroundImage}
            alt=''
            priority
            sizes='(min-width: 768px) 340px, 300px'
            className='login-mascot-layer login-mascot-background'
          />
          <Image
            src={icochangLeftEyeImage}
            alt=''
            sizes='(min-width: 768px) 340px, 300px'
            className='login-mascot-layer login-mascot-eye login-mascot-left-eye'
          />
          <Image
            src={icochangRightEyeImage}
            alt=''
            sizes='(min-width: 768px) 340px, 300px'
            className='login-mascot-layer login-mascot-eye login-mascot-right-eye'
          />
          <Image
            src={icochangFrontgroundImage}
            alt=''
            priority
            sizes='(min-width: 768px) 340px, 300px'
            className='login-mascot-layer login-mascot-frontground'
          />
        </div>

        <section
          className='login-panel relative z-20 w-full px-5 py-5 text-center md:px-6 md:py-6'
          aria-labelledby='login-title'
        >
          <div className='mb-5'>
            <h1 id='login-title' className='flex justify-center'>
              <Image
                src={icoicoLogoImage}
                alt='ICOICO'
                priority
                sizes='220px'
                className='login-panel-logo'
              />
            </h1>
            <p
              id='login-help'
              className='mx-auto mt-4 max-w-[18rem] text-sm leading-6 text-muted-foreground'
            >
              <span className='block'>Googleアカウントでログインして、</span>
              <span className='block'>ご飯を誘いましょ。</span>
            </p>
          </div>

          <form action={signInWithGoogle}>
            <button
              ref={buttonRef}
              type='submit'
              className='login-google-button group relative flex h-12 w-full items-center justify-center gap-3 rounded-full border border-[#dadce0] bg-white px-4 text-[0.9375rem] font-semibold text-[#3c4043] shadow-[0_1px_2px_rgba(60,64,67,0.08)] outline-none transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:border-[#c5d5f7] hover:shadow-[0_6px_18px_rgba(60,64,67,0.14)] focus-visible:-translate-y-0.5 focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/20 active:translate-y-0'
              aria-describedby='login-help login-google-hint'
            >
              <span className='login-google-glow' aria-hidden='true' />
              <svg
                className='relative z-10 size-[1.125rem] shrink-0'
                viewBox='0 0 48 48'
                aria-hidden='true'
              >
                <path
                  fill='#EA4335'
                  d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
                />
                <path
                  fill='#4285F4'
                  d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
                />
                <path
                  fill='#FBBC05'
                  d='M10.53 28.59A14.5 14.5 0 0 1 9.75 24c0-1.59.28-3.12.78-4.59l-7.98-6.19A23.96 23.96 0 0 0 0 24c0 3.86.92 7.5 2.56 10.78l7.97-6.19z'
                />
                <path
                  fill='#34A853'
                  d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
                />
              </svg>
              <span className='relative z-10'>Googleでログイン</span>
            </button>
          </form>

          <p
            id='login-google-hint'
            className='mt-3 flex items-center justify-center gap-2 text-[0.75rem] text-muted-foreground'
          >
            <span className='login-hint-dot' aria-hidden='true' />
            安全にGoogle認証へ進みます
          </p>
        </section>

        <Image
          src={icochangArmsImage}
          alt=''
          sizes='(min-width: 768px) 340px, 300px'
          className='login-mascot-arms pointer-events-none absolute left-1/2 z-30 select-none'
          aria-hidden='true'
        />
      </div>
    </div>
  );
}
