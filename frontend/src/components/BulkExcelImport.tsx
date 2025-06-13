// Excel 파일 읽기 & AG Grid 편집 가능한 Grid Component
import { ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';
import React, { useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import * as XLSX from 'xlsx';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { normalizeDate } from '@/utils/normalizeDate';
ModuleRegistry.registerModules([AllCommunityModule]);

interface BulkExcelImportProps {
  onDataLoaded: (data: any[]) => void;
}

const BulkExcelImport: React.FC<BulkExcelImportProps> = ({ onDataLoaded }) => {
  const [columnDefs, setColumnDefs] = useState<any[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const wb = XLSX.read(evt.target?.result as ArrayBuffer, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];

      const sheetJson: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (sheetJson.length < 2) return;

      const headers = sheetJson[0] as string[];
      // 컬럼 정의
      const cols = headers.map(h => ({ field: h, headerName: h, editable: true, resizable: true }));

      // 행 데이터
      const rows = sheetJson.slice(1).map(row =>
        headers.reduce((obj, key, idx) => {
          const raw = row[idx];
          let str: string;
          if (typeof raw === 'string') {
            // yyyy.mm.dd 또는 yyyy-mm-dd → normalizeDate 로 “yyyy-mm-dd”
            str = normalizeDate(raw);
          } else if (raw instanceof Date || typeof raw === 'number') {
            // Date/serial 모두 ISO 문자열로 변환
            const dt = raw instanceof Date
              ? raw
              : new Date((raw - 25567 - 2) * 86400 * 1000);
            str = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
          } else {
            str = '';
          }
          obj[key] = str;
          return obj;
        }, {} as any)
      );
      setColumnDefs(cols);
      setRowData(rows);
      onDataLoaded(rows);
    };
    reader.readAsArrayBuffer(file);
  }, [onDataLoaded]);

  const onCellValueChanged = useCallback((params: any) => {
    const updated = rowData.map(r => (r === params.data.original ? params.data : r));
    setRowData(updated);
    onDataLoaded(updated);
  }, [rowData, onDataLoaded]);

  return (
    <div className="space-y-2">
      <input type="file" accept=".xlsx, .xls" onChange={handleFile} />
      {rowData.length > 0 && (
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            defaultColDef={{ flex: 1, minWidth: 100, editable: true, resizable: true }}
            cellSelection={true}
            copyHeadersToClipboard={true}
            rowSelection="multiple"
            onCellValueChanged={onCellValueChanged}
          />
        </div>
      )}
    </div>
  );
}

export default BulkExcelImport;