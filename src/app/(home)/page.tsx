import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TypographyH1, TypographyP } from '@/components/ui/typography';
import RowOverview from './row-overview';
import { cn } from '@/lib/utils';

export default async function Home() {
  return (
    // <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <TypographyH1 text={'거버넌스 의제'} />
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
          <RowOverview />
        </TableBody>
      </Table>

      {/* <LoadingSpinner /> */}
    </main>
    // </div>
  );
}
