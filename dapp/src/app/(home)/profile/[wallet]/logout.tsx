'use client';

import { clearAndLogOut } from '@/app/actions';
import { Button } from '@/components/ui/button';
import Form from 'next/form';
import React, { useActionState, useEffect } from 'react';

interface Props {}

export default function LogOutComponent({}: Props) {
  const [state, formAction] = useActionState(clearAndLogOut, undefined);

  return (
    <Form action={formAction}>
      <Button type="submit" className="m-auto">
        로그아웃
      </Button>
    </Form>
  );
}
