import { Skeleton } from '@/components/ui/skeleton';
import { TableSkeleton } from '@/components/shared/table-skeleton';

export default function CreditTransactionSkeleton() {
  return (
    <div>
      <section className="mb-3 flex flex-col md:flex-row md:gap-2 md:items-center">
        <div className="w-full flex-col sm:flex-row flex items-center gap-2 px-2 py-1 md:px-0">
          <Skeleton className="h-9 w-full sm:max-w-sm md:max-w-xs" />
          <Skeleton className="h-9 w-full sm:max-w-sm md:max-w-xs" />
        </div>
        <div className="flex gap-3 border-t px-2 py-1 md:border-t-0 md:ml-auto md:px-0">
          <Skeleton className="grow h-8 w-[95px] sm:ml-auto md:grow-0 lg:flex" />
          <Skeleton className="grow h-8 w-9 sm:ml-auto md:grow-0 lg:flex" />
        </div>
      </section>
      <TableSkeleton rows={10} hasFooter={true} />
    </div>
  );
}
