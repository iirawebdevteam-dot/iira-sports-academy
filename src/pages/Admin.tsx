import { useState } from "react";
import { getSiteData, updateSiteData, SiteData } from "@/lib/siteData";
import { Save, Plus, Trash2, ArrowLeft, LayoutDashboard, Trophy, Calendar, Image, Dumbbell, Users, FileText, Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type Tab = "sports" | "gallery" | "events" | "schedule" | "achievements" | "coaches" | "documents" | "inquiries";

export default function AdminPage() {
  const [data, setData] = useState<SiteData>(getSiteData());
  const [tab, setTab] = useState<Tab>("sports");

  const save = (partial: Partial<SiteData>) => {
    const updated = updateSiteData(partial);
    setData(updated);
    toast.success("Changes saved!");
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "sports", label: "Sports", icon: <Dumbbell size={16} /> },
    { id: "coaches", label: "Coaches", icon: <Users size={16} /> },
    { id: "gallery", label: "Gallery", icon: <Image size={16} /> },
    { id: "events", label: "Events", icon: <Calendar size={16} /> },
    { id: "schedule", label: "Schedule", icon: <Calendar size={16} /> },
    { id: "achievements", label: "Achievements", icon: <Trophy size={16} /> },
    { id: "documents", label: "Documents", icon: <FileText size={16} /> },
    { id: "inquiries", label: "Inquiries", icon: <Inbox size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#111] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-white/50 hover:text-primary transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <LayoutDashboard size={20} className="text-primary" />
              <h1 className="font-hero text-xl text-primary tracking-wider">ADMIN PANEL</h1>
            </div>
          </div>
          <Link to="/" className="text-white/40 text-sm font-body hover:text-white transition-colors">View Site →</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm whitespace-nowrap transition-all duration-300 ${
                tab === t.id ? "bg-primary text-white shadow-[0_4px_20px_rgba(232,101,26,0.4)]" : "liquid-glass text-white/50 hover:text-white"
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "sports" && <SportsManager data={data} onSave={save} />}
        {tab === "coaches" && <CoachesManager data={data} onSave={save} />}
        {tab === "gallery" && <GalleryManager data={data} onSave={save} />}
        {tab === "events" && <EventsManager data={data} onSave={save} />}
        {tab === "schedule" && <ScheduleManager data={data} onSave={save} />}
        {tab === "achievements" && <AchievementsManager data={data} onSave={save} />}
        {tab === "documents" && <DocumentsManager data={data} onSave={save} />}
        {tab === "inquiries" && <InquiriesManager />}
      </div>
    </div>
  );
}

function AdminInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-body text-white/40 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-body text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
    </div>
  );
}

function AdminSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-xs font-body text-white/40 mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-body text-sm focus:ring-1 focus:ring-primary outline-none">
        {options.map(o => <option key={o.value} value={o.value} className="bg-[#1a1a1a]">{o.label}</option>)}
      </select>
    </div>
  );
}

/* ── IMAGE UPLOAD HELPER ─────────────────────────────── */
function ImageUpload({ src, fieldLabel, onUpload, onRemove }: { src: string; fieldLabel: string; onUpload: (b64: string) => void; onRemove: () => void }) {
  return (
    <div>
      <label className="block text-xs font-body text-white/40 mb-2">{fieldLabel}</label>
      <div className="flex items-center gap-4">
        {src && (
          <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button onClick={onRemove} className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 text-red-400 hover:text-red-300"><Trash2 size={10} /></button>
          </div>
        )}
        <label className="flex-1 cursor-pointer">
          <div className="px-4 py-3 rounded-lg bg-white/5 border border-dashed border-white/20 text-center hover:border-primary/50 hover:bg-white/10 transition-all">
            <span className="text-white/50 text-sm font-body">{src ? "Change photo" : "📷 Click to upload photo"}</span>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={e => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB for localStorage"); return; }
            const reader = new FileReader();
            reader.onload = () => onUpload(reader.result as string);
            reader.readAsDataURL(file);
          }} />
        </label>
      </div>
      <p className="text-white/20 text-xs font-body mt-1">Max 2MB. Stored in browser localStorage.</p>
    </div>
  );
}

/* ── SPORTS ──────────────────────────────────────────── */
function SportsManager({ data, onSave }: { data: SiteData; onSave: (p: Partial<SiteData>) => void }) {
  const [sports, setSports] = useState(data.sports);

  const update = (index: number, field: string, value: string) => {
    const updated = [...sports];
    (updated[index] as Record<string, unknown>)[field] = value;
    setSports(updated);
  };

  const addSport = () => {
    setSports([...sports, {
      id: `sport-${Date.now()}`, name: "New Sport", category: "sports" as const, image: "",
      ageGroup: "5-18 yrs", timings: "6:00-8:00 AM", coach: "Coach Name",
      fee: "₹2,000-4,000/mo", levels: ["Beginner", "Advanced"], description: "Description here"
    }]);
  };

  const remove = (index: number) => setSports(sports.filter((_, i) => i !== index));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-hero text-2xl text-primary tracking-wider">MANAGE SPORTS</h2>
        <div className="flex gap-2">
          <button onClick={addSport} className="liquid-glass px-4 py-2 text-sm font-body text-white/70 hover:text-white flex items-center gap-2 transition-colors">
            <Plus size={14} /> Add Sport
          </button>
          <button onClick={() => onSave({ sports })} className="btn-primary-cta !py-2 !px-5 text-xs flex items-center gap-2">
            <Save size={14} /> Save
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {sports.map((s, i) => (
          <div key={s.id} className="liquid-glass p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-body font-semibold text-white">{s.name}</h3>
              <button onClick={() => remove(i)} className="text-red-400/60 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AdminInput label="Name" value={s.name} onChange={v => update(i, "name", v)} />
              <AdminInput label="ID (slug)" value={s.id} onChange={v => update(i, "id", v)} />
              <AdminSelect label="Category" value={s.category} onChange={v => update(i, "category", v)} options={[{ value: "sports", label: "Sports" }, { value: "performing-arts", label: "Performing Arts" }]} />
              <AdminInput label="Age Group" value={s.ageGroup} onChange={v => update(i, "ageGroup", v)} />
              <AdminInput label="Timings" value={s.timings} onChange={v => update(i, "timings", v)} />
              <AdminInput label="Coach" value={s.coach} onChange={v => update(i, "coach", v)} />
              <AdminInput label="Fee" value={s.fee} onChange={v => update(i, "fee", v)} />
              <AdminInput label="Description" value={s.description} onChange={v => update(i, "description", v)} />
              <div className="sm:col-span-2 lg:col-span-3">
                <ImageUpload src={s.image} fieldLabel="Sport Photo" onUpload={v => update(i, "image", v)} onRemove={() => update(i, "image", "")} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── COACHES ─────────────────────────────────────────── */
function CoachesManager({ data, onSave }: { data: SiteData; onSave: (p: Partial<SiteData>) => void }) {
  const [coaches, setCoaches] = useState(data.coaches ?? []);

  const update = (i: number, field: string, value: string) => {
    const updated = [...coaches];
    (updated[i] as Record<string, unknown>)[field] = value;
    setCoaches(updated);
  };

  const addCoach = () => setCoaches([...coaches, {
    id: `c-${Date.now()}`, name: "Coach Name", photo: "", teaches: "Sport / Discipline",
    description: "Brief description of the coach's background and expertise.", masteryLevel: "National Level"
  }]);

  const remove = (i: number) => setCoaches(coaches.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-hero text-2xl text-primary tracking-wider">MANAGE COACHES</h2>
        <div className="flex gap-2">
          <button onClick={addCoach} className="liquid-glass px-4 py-2 text-sm font-body text-white/70 hover:text-white flex items-center gap-2">
            <Plus size={14} /> Add Coach
          </button>
          <button onClick={() => onSave({ coaches })} className="btn-primary-cta !py-2 !px-5 text-xs flex items-center gap-2">
            <Save size={14} /> Save
          </button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {coaches.map((c, i) => (
          <div key={c.id} className="liquid-glass p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {c.photo ? (
                  <img src={c.photo} alt={c.name} className="w-12 h-12 rounded-full object-cover border border-primary/40" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/30 text-xs font-body">No photo</div>
                )}
                <div>
                  <p className="font-body font-semibold text-white text-sm">{c.name}</p>
                  <p className="text-primary text-xs font-body">{c.teaches}</p>
                </div>
              </div>
              <button onClick={() => remove(i)} className="text-red-400/60 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
            <div className="space-y-3">
              <AdminInput label="Full Name" value={c.name} onChange={v => update(i, "name", v)} />
              <AdminInput label="What They Teach" value={c.teaches} onChange={v => update(i, "teaches", v)} />
              <AdminInput label="Mastery Level / Title" value={c.masteryLevel} onChange={v => update(i, "masteryLevel", v)} />
              <div>
                <label className="block text-xs font-body text-white/40 mb-1">Description</label>
                <textarea value={c.description} onChange={e => update(i, "description", e.target.value)} rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-body text-sm focus:ring-1 focus:ring-primary outline-none resize-none" />
              </div>
              <ImageUpload src={c.photo} fieldLabel="Coach Photo" onUpload={v => update(i, "photo", v)} onRemove={() => update(i, "photo", "")} />
            </div>
          </div>
        ))}
        {coaches.length === 0 && (
          <div className="sm:col-span-2 liquid-glass p-12 text-center text-white/30 font-body text-sm">
            No coaches yet. Click "Add Coach" to get started.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── GALLERY ─────────────────────────────────────────── */
function GalleryManager({ data, onSave }: { data: SiteData; onSave: (p: Partial<SiteData>) => void }) {
  const [gallery, setGallery] = useState(data.gallery);
  const update = (i: number, field: string, value: string) => {
    const updated = [...gallery];
    (updated[i] as Record<string, unknown>)[field] = value;
    setGallery(updated);
  };
  const addItem = () => setGallery([...gallery, { id: `g-${Date.now()}`, src: "", category: "Events", caption: "New photo" }]);
  const remove = (i: number) => setGallery(gallery.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-hero text-2xl text-primary tracking-wider">MANAGE GALLERY</h2>
        <div className="flex gap-2">
          <button onClick={addItem} className="liquid-glass px-4 py-2 text-sm font-body text-white/70 hover:text-white flex items-center gap-2"><Plus size={14} /> Add Photo</button>
          <button onClick={() => onSave({ gallery })} className="btn-primary-cta !py-2 !px-5 text-xs flex items-center gap-2"><Save size={14} /> Save</button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map((g, i) => (
          <div key={g.id} className="liquid-glass p-5">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs text-primary font-body">{g.category}</span>
              <button onClick={() => remove(i)} className="text-red-400/60 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
            <div className="space-y-3">
              <AdminInput label="Category" value={g.category} onChange={v => update(i, "category", v)} />
              <AdminInput label="Caption" value={g.caption} onChange={v => update(i, "caption", v)} />
              <div>
                <label className="block text-xs font-body text-white/40 mb-2">Photo</label>
                <div className="flex items-center gap-3">
                  {g.src && (
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-white/10 shrink-0">
                      <img src={g.src} alt={g.caption} className="w-full h-full object-cover" />
                      <button onClick={() => update(i, "src", "")} className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 text-red-400 hover:text-red-300"><Trash2 size={10} /></button>
                    </div>
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-dashed border-white/20 text-center hover:border-primary/50 hover:bg-white/10 transition-all">
                      <span className="text-white/50 text-xs font-body">{g.src ? "Change photo" : "📷 Upload from desktop"}</span>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB for localStorage"); return; }
                      const reader = new FileReader();
                      reader.onload = () => update(i, "src", reader.result as string);
                      reader.readAsDataURL(file);
                    }} />
                  </label>
                </div>
                <p className="text-white/20 text-xs font-body mt-1">Max 2MB. Stored in browser localStorage.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── EVENTS ──────────────────────────────────────────── */
function EventsManager({ data, onSave }: { data: SiteData; onSave: (p: Partial<SiteData>) => void }) {
  const [events, setEvents] = useState(data.events);
  const update = (i: number, field: string, value: string) => {
    const updated = [...events];
    (updated[i] as Record<string, unknown>)[field] = value;
    setEvents(updated);
  };
  const addItem = () => setEvents([...events, { id: `e-${Date.now()}`, title: "New Event", date: new Date().toISOString().split("T")[0], description: "Event description" }]);
  const remove = (i: number) => setEvents(events.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-hero text-2xl text-primary tracking-wider">MANAGE EVENTS</h2>
        <div className="flex gap-2">
          <button onClick={addItem} className="liquid-glass px-4 py-2 text-sm font-body text-white/70 hover:text-white flex items-center gap-2"><Plus size={14} /> Add Event</button>
          <button onClick={() => onSave({ events })} className="btn-primary-cta !py-2 !px-5 text-xs flex items-center gap-2"><Save size={14} /> Save</button>
        </div>
      </div>
      <div className="space-y-4">
        {events.map((ev, i) => (
          <div key={ev.id} className="liquid-glass p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-body font-semibold text-white">{ev.title}</h3>
              <button onClick={() => remove(i)} className="text-red-400/60 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <AdminInput label="Title" value={ev.title} onChange={v => update(i, "title", v)} />
              <AdminInput label="Date" value={ev.date} onChange={v => update(i, "date", v)} type="date" />
              <AdminInput label="Description" value={ev.description} onChange={v => update(i, "description", v)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SCHEDULE ────────────────────────────────────────── */
function ScheduleManager({ data, onSave }: { data: SiteData; onSave: (p: Partial<SiteData>) => void }) {
  const [schedule, setSchedule] = useState(data.schedule);
  const update = (i: number, field: string, value: string) => {
    const updated = [...schedule];
    (updated[i] as Record<string, unknown>)[field] = value;
    setSchedule(updated);
  };
  const addItem = () => setSchedule([...schedule, { sport: "New Sport", color: "#E8651A", morning: "—", evening: "—", days: "Mon-Fri" }]);
  const remove = (i: number) => setSchedule(schedule.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-hero text-2xl text-primary tracking-wider">MANAGE SCHEDULE</h2>
        <div className="flex gap-2">
          <button onClick={addItem} className="liquid-glass px-4 py-2 text-sm font-body text-white/70 hover:text-white flex items-center gap-2"><Plus size={14} /> Add Row</button>
          <button onClick={() => onSave({ schedule })} className="btn-primary-cta !py-2 !px-5 text-xs flex items-center gap-2"><Save size={14} /> Save</button>
        </div>
      </div>
      <div className="liquid-glass overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-3 text-white/40">Sport</th>
              <th className="text-left p-3 text-white/40">Color</th>
              <th className="text-left p-3 text-white/40">Morning</th>
              <th className="text-left p-3 text-white/40">Evening</th>
              <th className="text-left p-3 text-white/40">Days</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((s, i) => (
              <tr key={i} className="border-b border-white/5">
                <td className="p-2"><input value={s.sport} onChange={e => update(i, "sport", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-primary" /></td>
                <td className="p-2"><input type="color" value={s.color} onChange={e => update(i, "color", e.target.value)} className="w-10 h-8 rounded cursor-pointer bg-transparent" /></td>
                <td className="p-2"><input value={s.morning} onChange={e => update(i, "morning", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-primary" /></td>
                <td className="p-2"><input value={s.evening} onChange={e => update(i, "evening", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-primary" /></td>
                <td className="p-2"><input value={s.days} onChange={e => update(i, "days", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-primary" /></td>
                <td className="p-2"><button onClick={() => remove(i)} className="text-red-400/60 hover:text-red-400"><Trash2 size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── ACHIEVEMENTS ────────────────────────────────────── */
function AchievementsManager({ data, onSave }: { data: SiteData; onSave: (p: Partial<SiteData>) => void }) {
  const [achievements, setAchievements] = useState(data.achievements);
  const update = (i: number, field: string, value: string) => {
    const updated = [...achievements];
    (updated[i] as Record<string, unknown>)[field] = value;
    setAchievements(updated);
  };
  const addItem = () => setAchievements([...achievements, {
    id: `a-${Date.now()}`, title: "New Achievement", student: "Student Name", sport: "Cricket", medal: "gold" as const, year: "2025", description: "Achievement description"
  }]);
  const remove = (i: number) => setAchievements(achievements.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-hero text-2xl text-primary tracking-wider">MANAGE ACHIEVEMENTS</h2>
        <div className="flex gap-2">
          <button onClick={addItem} className="liquid-glass px-4 py-2 text-sm font-body text-white/70 hover:text-white flex items-center gap-2"><Plus size={14} /> Add</button>
          <button onClick={() => onSave({ achievements })} className="btn-primary-cta !py-2 !px-5 text-xs flex items-center gap-2"><Save size={14} /> Save</button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {achievements.map((a, i) => (
          <div key={a.id} className="liquid-glass p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-2xl">{a.medal === "gold" ? "🥇" : a.medal === "silver" ? "🥈" : "🥉"}</div>
              <button onClick={() => remove(i)} className="text-red-400/60 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <AdminInput label="Title" value={a.title} onChange={v => update(i, "title", v)} />
              <AdminInput label="Student" value={a.student} onChange={v => update(i, "student", v)} />
              <AdminInput label="Sport" value={a.sport} onChange={v => update(i, "sport", v)} />
              <AdminSelect label="Medal" value={a.medal} onChange={v => update(i, "medal", v)} options={[{ value: "gold", label: "🥇 Gold" }, { value: "silver", label: "🥈 Silver" }, { value: "bronze", label: "🥉 Bronze" }]} />
              <AdminInput label="Year" value={a.year} onChange={v => update(i, "year", v)} />
              <AdminInput label="Description" value={a.description} onChange={v => update(i, "description", v)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── DOCUMENTS ───────────────────────────────────────── */
function DocumentsManager({ data, onSave }: { data: SiteData; onSave: (p: Partial<SiteData>) => void }) {
  const [docs, setDocs] = useState<string[]>(data.inquiryDocuments ?? []);
  const [newDoc, setNewDoc] = useState("");

  const addDoc = () => {
    const trimmed = newDoc.trim();
    if (!trimmed) return;
    setDocs([...docs, trimmed]);
    setNewDoc("");
  };

  const remove = (i: number) => setDocs(docs.filter((_, idx) => idx !== i));

  const updateDoc = (i: number, val: string) => {
    const updated = [...docs];
    updated[i] = val;
    setDocs(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-hero text-2xl text-primary tracking-wider">DOCUMENTS REQUIRED</h2>
          <p className="text-white/40 font-body text-sm mt-1">These appear in the Inquiry Form on the Admissions page.</p>
        </div>
        <button onClick={() => onSave({ inquiryDocuments: docs })} className="btn-primary-cta !py-2 !px-5 text-xs flex items-center gap-2">
          <Save size={14} /> Save
        </button>
      </div>
      <div className="liquid-glass p-6 space-y-3 mb-4">
        {docs.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-primary font-body text-sm shrink-0">📄</span>
            <input value={d} onChange={e => updateDoc(i, e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-body text-sm focus:ring-1 focus:ring-primary outline-none" />
            <button onClick={() => remove(i)} className="text-red-400/60 hover:text-red-400 shrink-0"><Trash2 size={14} /></button>
          </div>
        ))}
        {docs.length === 0 && (
          <p className="text-white/30 font-body text-sm text-center py-4">No documents listed yet.</p>
        )}
      </div>
      {/* Add new */}
      <div className="liquid-glass p-4 flex gap-3">
        <input value={newDoc} onChange={e => setNewDoc(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addDoc()}
          placeholder="e.g. Birth certificate or age proof"
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-body text-sm focus:ring-1 focus:ring-primary outline-none placeholder:text-white/20" />
        <button onClick={addDoc} className="liquid-glass px-4 py-2 text-sm font-body text-white/70 hover:text-white flex items-center gap-2">
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
}

/* ── INQUIRIES ───────────────────────────────────────── */
interface InquiryRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  sport: string;
  age: string;
  message: string;
  submittedAt: string;
}

function InquiriesManager() {
  const loadInquiries = (): InquiryRecord[] => {
    try {
      const stored = localStorage.getItem("inquiries");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  };

  const [inquiries, setInquiries] = useState<InquiryRecord[]>(loadInquiries);

  const remove = (id: string) => {
    const updated = inquiries.filter(q => q.id !== id);
    localStorage.setItem("inquiries", JSON.stringify(updated));
    setInquiries(updated);
    toast.success("Inquiry deleted.");
  };

  const clearAll = () => {
    if (!confirm("Delete all inquiries? This cannot be undone.")) return;
    localStorage.removeItem("inquiries");
    setInquiries([]);
    toast.success("All inquiries cleared.");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-hero text-2xl text-primary tracking-wider">INQUIRIES</h2>
          <p className="text-white/40 font-body text-sm mt-1">{inquiries.length} submission{inquiries.length !== 1 ? "s" : ""} received</p>
        </div>
        {inquiries.length > 0 && (
          <button onClick={clearAll} className="liquid-glass px-4 py-2 text-sm font-body text-red-400/70 hover:text-red-400 flex items-center gap-2">
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      {inquiries.length === 0 ? (
        <div className="liquid-glass p-16 text-center">
          <Inbox size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40 font-body">No inquiries yet. They'll appear here once someone submits the Admissions form.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...inquiries].reverse().map((q) => (
            <div key={q.id} className="liquid-glass p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-body font-semibold text-white">{q.name}</h3>
                  <p className="text-white/30 text-xs font-body mt-0.5">{new Date(q.submittedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                </div>
                <button onClick={() => remove(q.id)} className="text-red-400/40 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm font-body">
                <div><span className="text-white/30 text-xs">Phone</span><p className="text-white/80">{q.phone || "—"}</p></div>
                <div><span className="text-white/30 text-xs">Email</span><p className="text-white/80">{q.email || "—"}</p></div>
                <div><span className="text-white/30 text-xs">Sport</span><p className="text-primary">{q.sport || "—"}</p></div>
                <div><span className="text-white/30 text-xs">Age</span><p className="text-white/80">{q.age || "—"}</p></div>
              </div>
              {q.message && (
                <p className="mt-3 text-white/50 text-sm font-body border-t border-white/10 pt-3 italic">"{q.message}"</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
