"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Clock, MapPin, Video, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db/store";
import { formatDateTime } from "@/lib/utils";

export default function CalendarPage() {
  const orgId = "org-apex-001";
  const [appointments, setAppointments] = useState(db.getAppointments(orgId));
  const [modalOpen, setModalOpen] = useState(false);

  const [newApt, setNewApt] = useState({
    title: "",
    customer_name: "Discovery Health Corporate",
    start_time: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    location: "Google Meet",
    meeting_link: "https://meet.google.com/sample-room",
    description: "Executive review and roadmap alignment.",
  });

  const handleCreateApt = (e: React.FormEvent) => {
    e.preventDefault();
    db.createAppointment({
      id: `apt-${Date.now()}`,
      organisation_id: orgId,
      customer_name: newApt.customer_name,
      title: newApt.title,
      start_time: new Date(newApt.start_time).toISOString(),
      end_time: new Date(new Date(newApt.start_time).getTime() + 3600000).toISOString(),
      location: newApt.location,
      meeting_link: newApt.meeting_link,
      description: newApt.description,
      status: "confirmed",
      created_at: new Date().toISOString(),
    });
    setAppointments(db.getAppointments(orgId));
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-brand-600" />
            Executive Calendar & Appointments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Schedule client meetings, steering committees, and bi-directional Google Calendar synchronisation.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Schedule Meeting</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 hover:border-brand-400 transition-colors"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {apt.status}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>60 min</span>
              </span>
            </div>

            <h3 className="font-bold text-base text-slate-900 leading-snug">{apt.title}</h3>
            <p className="text-xs font-semibold text-brand-600">{apt.customer_name}</p>
            {apt.description && <p className="text-xs text-slate-500 leading-relaxed">{apt.description}</p>}

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-2 font-medium">
                <CalendarIcon className="w-4 h-4 text-slate-400" />
                <span>{formatDateTime(apt.start_time)}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{apt.location}</span>
              </p>
            </div>

            {apt.meeting_link && (
              <a
                href={apt.meeting_link}
                target="_blank"
                rel="noreferrer"
                className="w-full mt-2 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-brand-600 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join Video Conference</span>
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Schedule Meeting Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Schedule Client Appointment
            </h3>

            <form onSubmit={handleCreateApt} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Architecture Steering Review"
                  value={newApt.title}
                  onChange={(e) => setNewApt({ ...newApt, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer / Client</label>
                <input
                  type="text"
                  required
                  value={newApt.customer_name}
                  onChange={(e) => setNewApt({ ...newApt, customer_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newApt.start_time}
                    onChange={(e) => setNewApt({ ...newApt, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location / Platform</label>
                  <input
                    type="text"
                    value={newApt.location}
                    onChange={(e) => setNewApt({ ...newApt, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-navy-900 text-white font-bold hover:bg-slate-800"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
