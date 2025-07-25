import React from 'react';
import { TypographyH1, TypographyP } from '@/components/ui/typography';
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
interface Props {}

export default async function VotersPage({}: Props) {
  return (
    <>
      <TypographyH1 text={`투표자`} />
      <TypographyP text={'Lorem ipsum dolor sit amet.'} />

      <Card>
        <CardHeader>
          <Link href={'voter/1'}>
            <Avatar>
              <AvatarImage src="/캐릭터/버터.webp" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </Link>
          <CardAction>asdf</CardAction>
        </CardHeader>
      </Card>
    </>
  );
}
