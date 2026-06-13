"use client";

import { useState } from "react";
import { MessageSquare, Bug, Lightbulb, BookOpen, Star, Send, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const TYPES = [
  { value: "suggestion", label: "Suggestion", icon: Lightbulb, color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" },
  { value: "bug", label: "Bug Report", icon: Bug, color: "text-red-400 border-red-500/30 bg-red-500/10" },
  { value: "content", label: "Content Issue", icon: BookOpen, color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  { value: "general", label: "General", icon: MessageSquare, color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
] as const;

export default function FeedbackPage() {
  const [form, setForm] = useState({ type: "suggestion" as string, message: "", rating: 0, email: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.message.trim().length < 10) {
      setError("Please write at least 10 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.type,
          message: form.message,
          rating: form.rating || undefined,
          email: form.email || undefined,
          page: typeof window !== "undefined" ? document.referrer : undefined,
        }),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl mb-4">
          <MessageSquare className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Share Your Feedback</h1>
        <p className="text-surface-300">Help us make SimuLearn better for everyone.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-100 border border-surface-200 rounded-2xl p-8"
      >
        {success ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Thank you! 🎉</h2>
            <p className="text-surface-300 mb-6">Your feedback has been submitted. We read every single one!</p>
            <button onClick={() => { setSuccess(false); setForm({ type: "suggestion", message: "", rating: 0, email: "" }); }}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors text-sm font-semibold">
              Submit Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type selector */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-3">What kind of feedback?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TYPES.map(({ value, label, icon: Icon, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, type: value })}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${form.type === value ? color : "border-surface-300 text-surface-400 hover:border-surface-200 hover:text-surface-300"}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Star rating */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-3">Overall experience</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star className={`w-8 h-8 transition-colors ${star <= (hoverRating || form.rating) ? "text-yellow-400 fill-yellow-400" : "text-surface-400"}`} />
                  </button>
                ))}
                <span className="ml-3 text-sm text-surface-400">
                  {["", "Poor", "Fair", "Good", "Great", "Excellent!"][hoverRating || form.rating] || ""}
                </span>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Your message <span className="text-red-400">*</span></label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your experience, idea, or issue in detail…"
                rows={5}
                required
                className="w-full bg-surface-200 border border-surface-300 rounded-xl px-4 py-3 text-white placeholder:text-surface-400 focus:outline-none focus:border-brand-400 transition-colors resize-none"
              />
              <p className="text-xs text-surface-500 mt-1 text-right">{form.message.length}/2000</p>
            </div>

            {/* Optional email */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Email (optional — for follow-up)</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full bg-surface-200 border border-surface-300 rounded-xl px-4 py-3 text-white placeholder:text-surface-400 focus:outline-none focus:border-brand-400 transition-colors"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? "Submitting…" : "Submit Feedback"}
            </button>
          </form>
        )}
      </motion.div>
    </main>
  );
}
