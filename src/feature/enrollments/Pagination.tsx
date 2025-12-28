import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, limit, total, pages } = meta;

  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-muted-foreground">
        {total} tadan {(page - 1) * limit + 1}-
        {Math.min(page * limit, total)} gacha
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Oldingi
        </Button>
        <div className="text-sm">
          {page} / {pages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
        >
          Keyingi
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
