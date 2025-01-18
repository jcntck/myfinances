'use client';

import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Spinner } from '../ui/spinner';

type ReadCSVInputProps = {
  rawData: string[][];
  setRawData: (rawData: string[][]) => void;
  onLoadData: (rawData: string[][]) => void;
  label: string;
  loadingMessage: string;
};

export default function ReadCSVInput({
  rawData,
  setRawData,
  onLoadData,
  label,
  loadingMessage,
}: ReadCSVInputProps) {
  const { toast } = useToast();
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || !files[0]) {
      toast({
        title: 'Nenhum arquivo selecionado',
        variant: 'destructive',
      });
      return;
    }
    if (!files[0].name.endsWith('.csv')) {
      toast({
        title: 'Arquivo inválido',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const text = e.target.result as string;
      const rows = text.split('\n').map((row: string) => row.split(';'));
      setCsvData(rows);
      onLoadData(rows);
      setIsLoading(false);
    };
    reader.readAsText(files[0]);
  };

  return (
    <>
      {!isLoading && !csvData.length && (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="extrato">{label}</Label>
          <Input
            id="extrato"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
          />
        </div>
      )}

      {isLoading && (
        <Spinner size="large">
          <span>{loadingMessage}</span>
        </Spinner>
      )}
    </>
  );
}
