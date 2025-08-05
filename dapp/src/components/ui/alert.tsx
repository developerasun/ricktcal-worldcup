import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { IconConstruction } from './icon';
import Link from 'next/link';
import { Button } from './button';
import { Siren } from 'lucide-react';

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive:
          'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Alert({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  );
}

function AlertUnderConsturction({ message }: { message?: string }) {
  return (
    <Alert
      className="flex flex-col justify-center items-center gap-2 w-1/2 h-1/2 sm:w-1/3 sm:h-1/3"
      variant="default"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <IconConstruction />
      <AlertTitle className="text-xl font-bold">공사 중</AlertTitle>
      <AlertDescription>{message ? message : '준비 중인 페이지입니다.'}</AlertDescription>
      <Link href={'/'}>
        <Button>돌아가기</Button>
      </Link>
    </Alert>
  );
}

function AlertEmpty({ message, className }: { message?: string; className?: string }) {
  return (
    <Alert variant="default" className={className ? className : ''}>
      <Siren />
      <AlertTitle>데이터 없음</AlertTitle>
      <AlertDescription>{message ? message : '표시할 데이터가 존재하지 않습니다.'}</AlertDescription>
    </Alert>
  );
}

export { Alert, AlertTitle, AlertDescription, AlertUnderConsturction, AlertEmpty };
