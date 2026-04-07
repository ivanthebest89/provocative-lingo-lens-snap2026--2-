import React, { useState } from "react";
import { motion } from "framer-motion";
import { Stethoscope, Pill, Activity, AlertTriangle, ChevronDown, ChevronUp, Info } from "lucide-react";

const URGENCY_CONFIG = {
  routine: { label: "Routine", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", dot: "bg-green-400" },
  urgent: { label: "Urgent", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", dot: "bg-yellow-400" },
  emergency: { label: "Emergency", bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-500" },
};

function ConditionCard({ condition }) {
  const cfg = URGENCY_CONFIG[condition.urgency] || URGENCY_CONFIG.routine;
  return (
    <div className={`rounded-xl p-3 border ${cfg.bg} ${cfg.border}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-slate-800">{condition.name}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.text} ${cfg.bg} border ${cfg.border}`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>
      {condition.description && (
        <p className="text-xs text-slate-600 leading-relaxed">{condition.description}</p>
      )}
    </div>
  );
}

export default function MedicalDiagnosis({ medicalAnalysis }) {
  const [expanded, setExpanded] = useState(true);

  if (!medicalAnalysis || !medicalAnalysis.has_medical_content) return null;

  const { conditions = [], medications = [], symptoms = [], recommendations, disclaimer } = medicalAnalysis;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white rounded-3xl border border-red-100 shadow-sm shadow-red-50 overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 sm:p-8 pb-4 sm:pb-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md shadow-red-200">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-slate-800">Medical Diagnosis</h2>
            <p className="text-xs text-slate-400">AI-powered medical content analysis</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {expanded && (
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-5">

          {/* Conditions */}
          {conditions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-slate-700">Identified Conditions</span>
              </div>
              <div className="space-y-2">
                {conditions.map((c, i) => <ConditionCard key={i} condition={c} />)}
              </div>
            </div>
          )}

          {/* Symptoms */}
          {symptoms.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-slate-700">Symptoms Detected</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-700 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Medications */}
          {medications.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Pill className="w-4 h-4 text-violet-500" />
                <span className="text-sm font-semibold text-slate-700">Medications</span>
              </div>
              <div className="space-y-2">
                {medications.map((m, i) => (
                  <div key={i} className="rounded-xl p-3 border border-violet-100 bg-violet-50">
                    <div className="text-sm font-semibold text-slate-800">{m.name}</div>
                    {m.purpose && <div className="text-xs text-slate-600 mt-0.5">{m.purpose}</div>}
                    {m.notes && <div className="text-xs text-violet-600 mt-1 font-medium">{m.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations && (
            <div className="rounded-xl p-4 bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-blue-700">Recommendations</span>
              </div>
              <p className="text-xs text-blue-700 leading-relaxed">{recommendations}</p>
            </div>
          )}

          {/* Disclaimer */}
          {disclaimer && (
            <p className="text-xs text-slate-400 italic leading-relaxed border-t border-slate-100 pt-4">
              ⚠️ {disclaimer}
            </p>
          )}
        </div>
      )}
    </motion.section>
  );
}