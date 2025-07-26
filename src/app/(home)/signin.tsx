'use client';

import React, { useActionState } from 'react';
import { recoverAndSignIn } from '../actions';
import { Button } from '@/components/ui/button';
import { Spacer } from '@/components/ui/spacer';
import Form from 'next/form';
import { Input } from '@/components/ui/input';
interface Props {}

export default function SignIn({}: Props) {
  const [state, formAction] = useActionState(recoverAndSignIn, undefined);

  return (
    <div>
      <Form action={formAction}>
        {state}
        <Input name="mnemonic" placeholder="패스키를 입력하세요" type="text" />
        <Spacer v={1.5} />
        <div className="flex justify-end">
          <Button type="submit" className="m-auto">
            로그인하기
          </Button>
        </div>
      </Form>
    </div>
  );
}
