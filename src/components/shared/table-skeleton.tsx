import { Skeleton } from '@/components/ui/skeleton';

export function TableSkeleton({ rows = 5, columns = 4, hasFooter = false }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Cabeçalho da Tabela */}
      <div className="py-2 border-b flex">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-1/4 mx-2" />
        ))}
      </div>

      {/* Linhas da Tabela */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex py-3 items-center">
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton key={j} className="h-5 w-1/4 mx-2" />
            ))}
          </div>
        ))}
      </div>

      {/* Rodapé da Tabela (Opcional) */}
      {hasFooter && (
        <div className="py-2 border-t flex bg-muted/50">
          {/* Primeira coluna (ocupa espaço restante) */}
          <div className="flex-1 mx-2">
            <Skeleton className="h-5 w-full" />
          </div>

          {/* Segunda coluna (ocupa largura da última coluna da tabela) */}
          <div className="w-1/4 mx-2">
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
