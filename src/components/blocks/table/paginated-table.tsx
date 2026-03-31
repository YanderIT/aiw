"use client";

import { useState, Children } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

export default function PaginatedTable({
  header,
  rows,
  emptyMessage,
  pageSize = PAGE_SIZE,
}: {
  header: React.ReactNode;
  rows: React.ReactNode[];
  emptyMessage?: string;
  pageSize?: number;
}) {
  const [page, setPage] = useState(1);
  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const showPagination = totalItems > pageSize;

  return (
    <div>
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          {header}
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {pagedRows.length > 0 ? pagedRows : (
            <tr className="border-b transition-colors hover:bg-muted/50">
              <td colSpan={100}>
                <div className="flex w-full justify-center items-center py-8 text-muted-foreground">
                  <p>{emptyMessage || "暂无数据"}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showPagination && (
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <p className="text-sm text-muted-foreground">
            共 {totalItems} 条，第 {page}/{totalPages} 页
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p: number) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              上一页
            </Button>
            {totalPages <= 7 ? (
              Array.from({ length: totalPages }, (_: unknown, i: number) => (
                <Button
                  key={i + 1}
                  size="sm"
                  variant={page === i + 1 ? "default" : "outline"}
                  onClick={() => setPage(i + 1)}
                  className="w-9"
                >
                  {i + 1}
                </Button>
              ))
            ) : (
              <>
                <Button
                  size="sm"
                  variant={page === 1 ? "default" : "outline"}
                  onClick={() => setPage(1)}
                  className="w-9"
                >
                  1
                </Button>
                {page > 3 && <span className="text-muted-foreground px-1">...</span>}
                {Array.from({ length: 3 }, (_: unknown, i: number) => {
                  const p = Math.min(Math.max(page - 1 + i, 2), totalPages - 1);
                  return p;
                })
                  .filter((v: number, i: number, a: number[]) => a.indexOf(v) === i)
                  .map((p: number) => (
                    <Button
                      key={p}
                      size="sm"
                      variant={page === p ? "default" : "outline"}
                      onClick={() => setPage(p)}
                      className="w-9"
                    >
                      {p}
                    </Button>
                  ))}
                {page < totalPages - 2 && <span className="text-muted-foreground px-1">...</span>}
                <Button
                  size="sm"
                  variant={page === totalPages ? "default" : "outline"}
                  onClick={() => setPage(totalPages)}
                  className="w-9"
                >
                  {totalPages}
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p: number) => p + 1)}
            >
              下一页
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
