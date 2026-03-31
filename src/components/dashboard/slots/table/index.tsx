import Header from "@/components/dashboard/header";
import { Table as TableSlotType } from "@/types/slots/table";
import { TableColumn } from "@/types/blocks/table";
import Toolbar from "@/components/blocks/toolbar";
import { Card } from "@/components/ui/card";
import PaginatedTable from "@/components/blocks/table/paginated-table";
import TableItemImage from "@/components/blocks/table/image";
import TableItemLabel from "@/components/blocks/table/label";
import TableItemTime from "@/components/blocks/table/time";
import Copy from "@/components/blocks/table/copy";

function renderRows(columns: TableColumn[], data: any[]) {
  return data.map((item: any, idx: number) => (
    <tr key={idx} className="border-b transition-colors hover:bg-muted/50 h-16">
      {columns.map((column: TableColumn, iidx: number) => {
        const value = item[column.name as keyof typeof item];
        const content = column.callback ? column.callback(item) : value;
        let cellContent = content;

        if (column.type === "image") {
          cellContent = <TableItemImage value={value} options={column.options} className={column.className} />;
        } else if (column.type === "time") {
          cellContent = <TableItemTime value={value} options={column.options} className={column.className} />;
        } else if (column.type === "label") {
          cellContent = <TableItemLabel value={value} options={column.options} className={column.className} />;
        } else if (column.type === "copy" && value) {
          cellContent = <Copy text={value}>{content}</Copy>;
        }

        return (
          <td key={iidx} className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] ${column.className || ""}`}>
            {cellContent}
          </td>
        );
      })}
    </tr>
  ));
}

export default function ({ ...table }: TableSlotType) {
  const columns = table.columns ?? [];
  const allData = table.data ?? [];

  const headerRow = (
    <tr className="border-b transition-colors hover:bg-muted/50">
      {columns.map((item: TableColumn, idx: number) => (
        <th key={idx} className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] ${item.className || ""}`}>
          {item.title}
        </th>
      ))}
    </tr>
  );

  const rows = renderRows(columns, allData);

  return (
    <>
      <Header crumb={table.crumb} />
      <div className="w-full px-4 md:px-8 py-8">
        <h1 className="text-2xl font-medium mb-8">{table.title}</h1>
        {table.description && (
          <p className="text-sm text-muted-foreground mb-8">
            {table.description}
          </p>
        )}
        {table.tip && (
          <p className="text-sm text-muted-foreground mb-8">
            {table.tip.description || table.tip.title}
          </p>
        )}
        {table.toolbar && <Toolbar items={table.toolbar.items} />}
        <Card className="overflow-x-auto px-6">
          <PaginatedTable
            header={headerRow}
            rows={rows}
            emptyMessage={table.empty_message || "暂无数据"}
          />
        </Card>
      </div>
    </>
  );
}
