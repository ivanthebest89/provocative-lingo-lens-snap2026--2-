import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Languages, Sparkles, Loader2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import ImageUploader from "../components/translate/ImageUploader";
import LanguageSelector from "../components/translate/LanguageSelector";
import TranslationResult from "../components/translate/TranslationResult";
import WordBreakdown from "../components/translate/WordBreakdown";
import MedicalDiagnosis from "../components/translate/MedicalDiagnosis";

export default function Translate() {
  const [mode, setMode] = useState("image"); // "image" | "text"
  const [imageFile, setImageFile] = useState(null);
  const [typedText, setTypedText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("english");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  const LANG_CODE_MAP = {
    english: "en-US", spanish: "es-ES", french: "fr-FR", german: "de-DE",
    italian: "it-IT", portuguese: "pt-PT", chinese: "zh-CN", japanese: "ja-JP",
    korean: "ko-KR", arabic: "ar-SA", hindi: "hi-IN", russian: "ru-RU",
    turkish: "tr-TR", dutch: "nl-NL", polish: "pl-PL", thai: "th-TH",
    vietnamese: "vi-VN", swedish: "sv-SE", hebrew: "he-IL", nepali: "ne-NP",
  };

  const handleSpeak = () => {
    if (!result?.translated_text) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(result.translated_text);
    utter.lang = LANG_CODE_MAP[targetLang?.toLowerCase()] || "en-US";
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const handleImageSelected = (file) => {
    setImageFile(file);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
  };

  const handleTranslate = async () => {
    if (mode === "image" && !imageFile) return;
    if (mode === "text" && !typedText.trim()) return;
    setIsProcessing(true);
    setResult(null);

    let imageUrl = null;
    if (mode === "image") {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: imageFile });
      imageUrl = file_url;
    }

    const response = await base44.functions.invoke('translate', {
      mode,
      text: typedText,
      imageUrl,
      sourceLang,
      targetLang,
    });

    setResult(response.data.data);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/70 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <Languages className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Image Translator</h1>
            <p className="text-xs text-slate-400">Extract & translate text from any image</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Mode Tabs */}
        <div className="flex gap-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-1.5">
          <button
            onClick={() => { setMode("image"); setResult(null); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === "image"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            📷 Image
          </button>
          <button
            onClick={() => { setMode("text"); setResult(null); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === "text"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            ✏️ Text
          </button>
        </div>

        {/* Upload Section */}
        {mode === "image" && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-slate-200/80 shadow-sm shadow-slate-100 p-6 sm:p-8"
        >
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-800 mb-1">Upload Image</h2>
            <p className="text-sm text-slate-400">Upload an image containing text you'd like to extract and translate</p>
          </div>
          <ImageUploader
            onImageSelected={handleImageSelected}
            imagePreview={imagePreview}
            onClear={handleClear}
          />
        </motion.section>
        )}

        {/* Text Input Section */}
        {mode === "text" && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-slate-200/80 shadow-sm shadow-slate-100 p-6 sm:p-8"
        >
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-800 mb-1">Enter Text</h2>
            <p className="text-sm text-slate-400">Type or paste the text you'd like to translate</p>
          </div>
          <textarea
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-40 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300"
          />
        </motion.section>
        )}

        {/* Language & Translate */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl border border-slate-200/80 shadow-sm shadow-slate-100 p-6 sm:p-8"
        >
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-800 mb-1">Translation Settings</h2>
            <p className="text-sm text-slate-400">Choose languages and start translating</p>
          </div>

          <LanguageSelector
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSourceChange={setSourceLang}
            onTargetChange={setTargetLang}
          />

          <div className="mt-6 flex gap-3">
            <Button
              onClick={handleTranslate}
              disabled={(mode === "image" ? !imageFile : !typedText.trim()) || isProcessing}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-violet-200 transition-all disabled:opacity-40 disabled:shadow-none"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting & Translating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Extract & Translate
                </>
              )}
            </Button>
            <Button
              onClick={handleSpeak}
              disabled={!result?.translated_text}
              variant="outline"
              className={`h-12 w-12 rounded-xl border-slate-200 flex-shrink-0 ${speaking ? 'text-violet-600 border-violet-300 bg-violet-50' : ''}`}
              title={speaking ? 'Stop speaking' : 'Speak translation'}
            >
              {speaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>
        </motion.section>

        {/* Results */}
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm shadow-slate-100 p-6 sm:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-slate-800 mb-1">Results</h2>
                <p className="text-sm text-slate-400">Extracted and translated text</p>
              </div>
              <Button
                onClick={handleSpeak}
                disabled={!result?.translated_text}
                className={`flex items-center gap-2 h-10 px-4 rounded-xl font-semibold text-sm transition-all ${
                  speaking
                    ? 'bg-violet-100 text-violet-700 border border-violet-300 hover:bg-violet-200'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow shadow-violet-200 hover:from-violet-700 hover:to-indigo-700'
                } disabled:opacity-40`}
              >
                {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {speaking ? 'Stop' : 'Play Translation'}
              </Button>
            </div>
            <TranslationResult
              originalText={result.original_text}
              translatedText={result.translated_text}
              detectedLang={result.detected_language}
              targetLang={targetLang}
              severity={result.severity}
              severityReason={result.severity_reason}
            />
          </motion.section>
        )}

        {/* Medical Diagnosis */}
        {result?.medical_analysis?.has_medical_content && (
          <MedicalDiagnosis medicalAnalysis={result.medical_analysis} />
        )}

        {/* Word Breakdown */}
        {result?.word_translations?.length > 0 && (
          <WordBreakdown wordTranslations={result.word_translations} />
        )}
      </main>
    </div>
  );
}