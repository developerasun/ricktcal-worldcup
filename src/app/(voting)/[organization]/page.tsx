import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TypographyH1, TypographyP } from '@/components/ui/typography'

interface Props {
    params: Promise<{ organization: string }>
}

export default async function OrganizationPage({params}: Props) {
  const { organization } = await params
  return (
    <>
    
    <TypographyH1 text={`${organization}'s Space`} />
    <TypographyP text={'Lorem ipsum dolor sit amet.'} />
     
    <Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
    </>
  )
}