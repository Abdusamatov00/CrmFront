import { useEffect, useState } from "react";
import { Search, Plus, Loader2, ChevronDown } from "lucide-react";
import Pagination from "./pagination";
import { useTeacherStore } from "@/store/teacher.store";
import TeacherTable from "./teacher-table";
import TeacherSheet from "./teacher-modal";

export default function TeacherList() {
  const { teachers, meta, loading, fetchTeachers } = useTeacherStore();
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  useEffect(() => {
    loadTeachers();
  }, [meta?.page, isActive]);

  const loadTeachers = () => {
    fetchTeachers({
      page: meta?.page ?? 1,
      limit: meta?.limit ?? 10,
      search,
      isActive: isActive === "all" ? undefined : isActive === "true",
    });
  };

  const handleSearch = () => {
    fetchTeachers({
      page: 1,
      limit: meta?.limit ?? 10,
      search,
      isActive: isActive === "all" ? undefined : isActive === "true",
    });
  };

  const handleEdit = (id: string) => {
    setSelectedTeacher(id);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedTeacher(null);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    fetchTeachers({
      page,
      limit: meta?.limit ?? 10,
      search,
      isActive: isActive === "all" ? undefined : isActive === "true",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">O‘qituvchilar</h1>
          <p className="text-muted-foreground">
            Barcha o‘qituvchilarni boshqaring
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border bg-card">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="O‘qituvchi qidirish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full bg-accent pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
              </div>

              <div className="relative w-27">
                <select
                  value={isActive}
                  onChange={(e) => setIsActive(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 border border-border rounded-xl bg-accent text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                >
                  <option value="all">Barchasi</option>
                  <option value="true">Faol</option>
                  <option value="false">Nofaol</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground w-4 h-4" />
              </div>

              <button
                onClick={handleSearch}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
              >
                Qidirish
              </button>

              <button
                onClick={handleCreate}
                className="px-6 py-2.5 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Yangi
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <TeacherTable teachers={teachers} onEdit={handleEdit} />
              {meta && (
                <div className="p-6 border-t border-border bg-card">
                  <Pagination meta={meta} onPageChange={handlePageChange} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <TeacherSheet
          open={isModalOpen}
          teacherId={selectedTeacher}
          onClose={() => {
            setIsModalOpen(false);
            loadTeachers();
          }}
        />
      )}
    </div>
  );
}
