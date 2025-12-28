import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FilterParams {
  studentId?: string;
  groupId?: string;
  status?: string;
  from?: string;
  to?: string;
}

interface EnrollmentFiltersProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
  onReset: () => void;
}

export function EnrollmentFilters({
  filters,
  onFilterChange,
  onReset,
}: EnrollmentFiltersProps) {
  const handleChange = (key: keyof FilterParams, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtrlar</CardTitle>
        <CardDescription>Ro'yxatdan o'tishlarni filtrlash</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filter-status">Holati</Label>
            <Select
              value={filters.status || ""}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Barcha holatlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Barcha</SelectItem>
                <SelectItem value="ACTIVE">Faol</SelectItem>
                <SelectItem value="PAUSED">To'xtatilgan</SelectItem>
                <SelectItem value="LEFT">Ketgan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-from">Dan</Label>
            <Input
              id="filter-from"
              type="date"
              value={filters.from || ""}
              onChange={(e) => handleChange("from", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-to">Gacha</Label>
            <Input
              id="filter-to"
              type="date"
              value={filters.to || ""}
              onChange={(e) => handleChange("to", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-student">Talaba ID</Label>
            <Input
              id="filter-student"
              placeholder="Talaba ID"
              value={filters.studentId || ""}
              onChange={(e) => handleChange("studentId", e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={onReset}>
            Filtrlarni Tozalash
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}