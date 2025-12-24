import { X, Users, TrendingUp, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { Group } from "@/store/group.store";
import GroupStudents from "./group-students";

interface GroupStatsProps {
  group: Group;
  onClose: () => void;
}

export default function GroupStats({ group, onClose }: GroupStatsProps) {
  const [showStudents, setShowStudents] = useState(false);
  const activeEnrollments = Math.floor(group.capacity * 0.6);
  const remaining = group.capacity - activeEnrollments;
  const isFull = remaining <= 0;

  const occupancyPercent = Math.round(
    (activeEnrollments / group.capacity) * 100
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="flex justify-between items-center p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">
              Guruh statistikasi
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {group.name}
              </h3>
              <p className="text-sm text-slate-600">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    group.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {group.isActive ? "Faol" : "Arxiv"}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={20} className="text-blue-600" />
                  <p className="text-sm text-slate-600">Sig'im</p>
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {group.capacity}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={20} className="text-green-600" />
                  <p className="text-sm text-slate-600">Ro'yxatdan o'tgan</p>
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {activeEnrollments}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={20} className="text-orange-600" />
                  <p className="text-sm text-slate-600">Bo'sh joy</p>
                </div>
                <p className="text-3xl font-bold text-slate-900">{remaining}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-slate-900">
                  Bandlik foizi
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {occupancyPercent}%
                </p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    occupancyPercent < 50
                      ? "bg-green-500"
                      : occupancyPercent < 80
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${occupancyPercent}%` }}
                />
              </div>
              {isFull && (
                <p className="text-sm text-red-600 font-medium mt-2">
                  Guruh to'ldirilgan!
                </p>
              )}
            </div>

            <button
              onClick={() => setShowStudents(true)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Talabalarni ko'rish
            </button>

            <button
              onClick={onClose}
              className="w-full px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>

      {showStudents && (
        <GroupStudents group={group} onClose={() => setShowStudents(false)} />
      )}
    </>
  );
}
