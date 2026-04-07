import React from "react";
import { motion } from "framer-motion";

const POS_COLORS = {
  noun: "bg-blue-100 text-blue-700",
  verb: "bg-green-100 text-green-700",
  adjective: "bg-purple-100 text-purple-700",
  adverb: "bg-orange-100 text-orange-700",
  pronoun: "bg-pink-100 text-pink-700",
  preposition: "bg-yellow-100 text-yellow-700",
  conjunction: "bg-teal-100 text-teal-700",
};

export default function WordBreakdown({ wordTranslations }) {
  if (!wordTranslations || wordTranslations.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-3xl border border-slate-200/80 shadow-sm shadow-slate-100 p-6 sm:p-8"
    >
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-800 mb-1">Word-by-Word Breakdown</h2>
        <p className="text-sm text-slate-400">Each word from the original text with its translation and part of speech</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {wordTranslations.map((item, i) => (
          <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs shadow-sm">
            <div className="font-semibold text-slate-800 text-sm">{item.word}</div>
            <div className="text-violet-600 font-medium mt-0.5">{item.translation}</div>
            {item.type && (
              <span className={`mt-1.5 inline-block px-1.5 py-0.5 rounded-full text-[10px] font-medium ${POS_COLORS[item.type.toLowerCase()] || 'bg-slate-100 text-slate-500'}`}>
                {item.type}
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
}