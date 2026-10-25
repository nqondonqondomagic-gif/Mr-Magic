"use client";

import { useState } from "react";
import { FileText, Folder, Search, Upload, Download, Tag, Bot } from "lucide-react";
import { db } from "@/lib/db/store";

export default function DocumentsPage() {
  const orgId = "org-apex-001";
  const [documents, setDocuments] = useState(db.getDocuments(orgId));
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState<string>("All");

  const folders = ["All", "Compliance & Tax", "Company Secretarial", "Standard Contracts"];

  const filtered = documents.filter((d) => {
    const matchesFolder = activeFolder === "All" || d.folder === activeFolder;
    const matchesQuery =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.summary && d.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.extracted_text && d.extracted_text.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-brand-600" />
            Document Vault & Business Knowledge Base
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Secure multi-tenant file archive with OCR text extraction, indexed for AI agent retrieval-augmented generation.
          </p>
        </div>
      </div>

      {/* Folders & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFolder(f)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                activeFolder === f
                  ? "bg-brand-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>{f}</span>
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search OCR text & summaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 hover:border-brand-400 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {doc.folder}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {(doc.file_size_bytes / 1024).toFixed(0)} KB
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 leading-snug">{doc.title}</h3>

              {doc.summary && (
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-0.5 flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5 text-brand-600" />
                    AI Summary:
                  </span>
                  {doc.summary}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {doc.tags?.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200 font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate max-w-[150px] font-mono text-[10px]">{doc.file_path}</span>
              <button
                onClick={() => alert(`Simulating secure signed URL download for: ${doc.title}`)}
                className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
