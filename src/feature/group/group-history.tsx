import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useGroupStore } from "@/store/group.store";
import GroupCard from "./group-card";
import GroupForm from "./group-form";

export default function GroupHistory() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { groups, loading, page, limit, total, fetchGroups } = useGroupStore();

  useEffect(() => {
    fetchGroups(1, limit, searchQuery);
  }, [searchQuery]);

  const inactiveGroups =
    groups?.filter((group) => group?.isActive === false) || [];

  const pages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-foreground/0 to-foreground/10 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground/90">
              Guruhlar tarixi
            </h1>
            <p className="text-foreground/60 mt-1">
              Faol bo‘lmagan guruhlarni kuzating
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-background rounded-lg shadow-sm p-6 mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-3 text-background/40"
              size={20}
            />
            <input
              type="text"
              placeholder="Guruh nomi bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-foreground/30 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 text-foreground/60">
            Yuklanmoqda...
          </div>
        ) : inactiveGroups.length === 0 ? (
          <div className="text-center py-12 bg-background rounded-lg text-foreground/60">
            Faol bo‘lmagan guruhlar topilmadi
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {inactiveGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchGroups(p, limit, searchQuery)}
                    className={`w-10 h-10 rounded-lg transition ${
                      page === p
                        ? "bg-blue-600 text-white"
                        : "border border-foreground/30 text-foreground/70 hover:bg-foreground/5"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {isFormOpen && (
        <GroupForm open={isFormOpen} onOpenChange={setIsFormOpen} />
      )}
    </div>
  );
}
