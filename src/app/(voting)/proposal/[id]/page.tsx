import { TypographyH1 } from '@/components/ui/typography';
import React from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface Props {}

export default function ProposalPage({}: Props) {
  const isActive = true;

  return (
    <>
      <TypographyH1 text="중요한 안건" />
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eligendi consequatur commodi magnam ab ut fugit?
      <Image width={200} height={200} style={{ borderRadius: '50%' }} src={'/캐릭터/버터.webp'} alt="dummy" />
      <Card>
        <CardHeader>
          <Badge variant="destructive">종료됨</Badge>

          <Badge variant={'destructive'} className="bg-green-500 dark:bg-green-600">
            진행 중
          </Badge>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </>
  );
}
