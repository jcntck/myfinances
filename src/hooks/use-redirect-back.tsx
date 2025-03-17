import { useSearchParams } from 'next/navigation';

export function useRedirectBack() {
  const searchParams = useSearchParams();

  const pathname = searchParams.get('backToUrl');
  const from = searchParams.has('from')
    ? `?from=${searchParams.get('from')}`
    : '';
  const to = searchParams.has('to') ? `&to=${searchParams.get('to')}` : '';

  return `${pathname}${from}${to}`;
}
