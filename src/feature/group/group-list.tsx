import { useEffect, useState } from "react";
import { Search, Plus, Archive } from "lucide-react";
import { useGroupStore } from "@/store/group.store";
import GroupCard from "./group-card";
import GroupForm from "./group-form";

export default function GroupList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { groups, loading, page, limit, total, fetchGroups } = useGroupStore();

  useEffect(() => {
    fetchGroups(1, limit, searchQuery);
  }, [searchQuery, showHistory]);

  const displayedGroups =
    groups?.filter((group) => group.isActive === !showHistory) || [];

  const pages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-foreground/0 to-foreground/10 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground/90">
              {showHistory ? "Guruhlar tarixi" : "Guruhlar"}
            </h1>
            <p className="text-foreground/60 mt-1">
              {showHistory
                ? "Faol bo‘lmagan guruhlarni kuzating"
                : "Hammasini boshqaring va kuzatib turing"}
            </p>
          </div>
          <div className="flex gap-2">
            {!showHistory && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                <Plus size={20} />
                Yangi guruh
              </button>
            )}
            <button
              onClick={() => setShowHistory((prev) => !prev)}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Archive size={20} />
              {showHistory ? "Faol guruhlar" : "Guruh tarixi"}
            </button>
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
              className="w-full pl-10 pr-4 py-2 border border-foreground/30 rounded-lg"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">Yuklanmoqda...</div>
        ) : displayedGroups.length === 0 ? (
          <div className="text-center py-12 bg-background rounded-lg">
            {showHistory
              ? "Faol bo‘lmagan guruhlar topilmadi"
              : "Faol guruhlar topilmadi"}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayedGroups.map((group) => (
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
                    className={`w-10 h-10 rounded-lg ${
                      page === p
                        ? "bg-blue-600 text-white"
                        : "border border-slate-300"
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

      {/* Forms */}
      {isFormOpen && !showHistory && (
        <GroupForm open={isFormOpen} onOpenChange={setIsFormOpen} />
      )}
    </div>
  );
}
