import React from "react";
import { motion } from "framer-motion";
import { Copy, Check, FileText, Languages, AlertTriangle, ShieldCheck, AlertCircle, Flame, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LANG_CODE_MAP = {
  english: "en-US", spanish: "es-ES", french: "fr-FR", german: "de-DE",
  italian: "it-IT", portuguese: "pt-PT", chinese: "zh-CN", japanese: "ja-JP",
  korean: "ko-KR", arabic: "ar-SA", hindi: "hi-IN", russian: "ru-RU",
  turkish: "tr-TR", dutch: "nl-NL", polish: "pl-PL", thai: "th-TH",
  vietnamese: "vi-VN", swedish: "sv-SE", hebrew: "he-IL", nepali: "ne-NP",
};

function TextBlock({ title, icon: Icon, text, accent, langCode }) {
  const [copied, setCopied] = React.useState(false);
  const [speaking, setSpeaking] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    if (langCode) utter.lang = langCode;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-semibold text-slate-700">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 ${speaking ? 'text-violet-500' : 'text-slate-400 hover:text-slate-600'}`}
            onClick={handleSpeak}
            title={speaking ? 'Stop' : 'Read aloud'}
          >
            {speaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-slate-600"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>
      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 min-h-[120px]">
        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}

const SEVERITY_CONFIG = {
  low: {
    label: "Low Severity",
    desc: "Content is calm and non-urgent.",
    icon: ShieldCheck,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    iconColor: "text-emerald-500",
    bar: "bg-emerald-400",
    width: "w-1/4",
  },
  moderate: {
    label: "Moderate Severity",
    desc: "Some notable or sensitive content detected.",
    icon: AlertTriangle,
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    iconColor: "text-yellow-500",
    bar: "bg-yellow-400",
    width: "w-2/4",
  },
  high: {
    label: "High Severity",
    desc: "Urgent or serious content detected.",
    icon: AlertCircle,
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    iconColor: "text-orange-500",
    bar: "bg-orange-400",
    width: "w-3/4",
  },
  critical: {
    label: "Critical Severity",
    desc: "Extremely urgent or dangerous content.",
    icon: Flame,
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    iconColor: "text-red-500",
    bar: "bg-red-500",
    width: "w-full",
  },
};

const POS_COLORS = {
  noun: "bg-blue-100 text-blue-700",
  verb: "bg-green-100 text-green-700",
  adjective: "bg-purple-100 text-purple-700",
  adverb: "bg-orange-100 text-orange-700",
  pronoun: "bg-pink-100 text-pink-700",
  preposition: "bg-yellow-100 text-yellow-700",
  conjunction: "bg-teal-100 text-teal-700",
};

export default function TranslationResult({ originalText, translatedText, detectedLang, targetLang, severity, severityReason }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      {detectedLang && (
        <div className="mb-4 px-3 py-1.5 bg-violet-50 border border-violet-100 rounded-lg inline-block">
          <span className="text-xs text-violet-600 font-medium">Detected language: {detectedLang}</span>
        </div>
      )}

      {severity && (() => {
        const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.low;
        const Icon = cfg.icon;
        return (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-5 p-4 rounded-2xl border ${cfg.bg} ${cfg.border} flex items-start gap-3`}
          >
            <div className={`mt-0.5 ${cfg.iconColor}`}><Icon className="w-5 h-5" /></div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-semibold ${cfg.text}`}>{cfg.label}</span>
              </div>
              <div className="w-full bg-white/60 rounded-full h-1.5 mb-2">
                <div className={`h-1.5 rounded-full ${cfg.bar} ${cfg.width} transition-all`} />
              </div>
              {severityReason && <p className={`text-xs ${cfg.text} opacity-80`}>{severityReason}</p>}
            </div>
          </motion.div>
        );
      })()}

      <div className="flex flex-col md:flex-row gap-5">
        <TextBlock
          title="Original Text"
          icon={FileText}
          text={originalText}
          accent="bg-slate-100 text-slate-500"
          langCode={detectedLang ? LANG_CODE_MAP[detectedLang.toLowerCase()] : undefined}
        />
        <TextBlock
          title="Translation"
          icon={Languages}
          text={translatedText}
          accent="bg-violet-100 text-violet-600"
          langCode={LANG_CODE_MAP[targetLang?.toLowerCase()] || undefined}
        />
      </div>

    </motion.div>
  );
}