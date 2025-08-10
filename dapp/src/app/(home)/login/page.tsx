'use client';

import React, { useActionState } from 'react';
import { recoverAndSignIn } from '../../actions';
import { Button } from '@/components/ui/button';
import { Spacer } from '@/components/ui/spacer';
import Form from 'next/form';
import { Input } from '@/components/ui/input';
import { TypographyH1 } from '@/components/ui/typography';
interface Props {}

export default function SignIn({}: Props) {
  const [state, formAction, isPending] = useActionState(recoverAndSignIn, undefined);

  return (
    <div
      className="w-3/4 sm:w-auto"
      style={{
        border: '1px solid white',
        borderRadius: '15px',
        padding: '1.5rem',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <TypographyH1 text={'지갑으로 시작하기'} />
      <Spacer v={1.5} />
      <Form action={formAction}>
        {state}
        <Input
          required
          className="w-full max-w-md m-auto"
          name="mnemonic"
          placeholder="패스키를 입력하세요"
          type="text"
        />
        <Spacer v={1.5} />
        <div className="flex justify-end">
          <Button type="submit" className="m-auto">
            로그인
          </Button>
        </div>
      </Form>
    </div>
  );
}
