"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

export default function PaginationWrapper({
  totalItems,
  pageSize = PAGE_SIZE,
  children,
  onPageChange,
}: {
  totalItems: number;
  pageSize?: number;
  children: React.ReactNode;
  onPageChange?: (page: number) => void;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const showPagination = totalItems > pageSize;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    onPageChange?.(newPage);
  };

  if (!showPagination) {
    return <>{children}</>;
  }

  return (
    <div>
      {children}
      <div className="flex items-center justify-between px-4 py-4 border-t">
        <p className="text-sm text-muted-foreground">
          共 {totalItems} 条，第 {page}/{totalPages} 页
        </p>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
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
                onClick={() => handlePageChange(i + 1)}
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
                onClick={() => handlePageChange(1)}
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
                    onClick={() => handlePageChange(p)}
                    className="w-9"
                  >
                    {p}
                  </Button>
                ))}
              {page < totalPages - 2 && <span className="text-muted-foreground px-1">...</span>}
              <Button
                size="sm"
                variant={page === totalPages ? "default" : "outline"}
                onClick={() => handlePageChange(totalPages)}
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
            onClick={() => handlePageChange(page + 1)}
          >
            下一页
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
