import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

const LANGUAGES = [
  { value: "auto", label: "Auto Detect" },
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "italian", label: "Italian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "chinese", label: "Chinese (Simplified)" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "arabic", label: "Arabic" },
  { value: "hindi", label: "Hindi" },
  { value: "russian", label: "Russian" },
  { value: "turkish", label: "Turkish" },
  { value: "dutch", label: "Dutch" },
  { value: "polish", label: "Polish" },
  { value: "thai", label: "Thai" },
  { value: "vietnamese", label: "Vietnamese" },
  { value: "swedish", label: "Swedish" },
  { value: "hebrew", label: "Hebrew" },
  { value: "nepali", label: "Nepali" },
];

const TARGET_LANGUAGES = LANGUAGES.filter(l => l.value !== "auto");

export default function LanguageSelector({ sourceLang, targetLang, onSourceChange, onTargetChange }) {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">From</label>
        <Select value={sourceLang} onValueChange={onSourceChange}>
          <SelectTrigger className="rounded-xl bg-white border-slate-200 h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map(lang => (
              <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="pt-6">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-200">
          <ArrowRight className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="flex-1">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">To</label>
        <Select value={targetLang} onValueChange={onTargetChange}>
          <SelectTrigger className="rounded-xl bg-white border-slate-200 h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TARGET_LANGUAGES.map(lang => (
              <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}