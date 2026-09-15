'use client';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  LayoutDashboard,
  ShieldCheck,
  Bookmark,
  CircleHelp,
  Check,
  Clock3,
  Users,
  Compass,
  ChevronRight,
  Award,
  Search,
  FileCheck2,
  LockKeyhole,
  GitBranch,
  Flag,
  Code2,
  Network,
  Handshake,
  Download,
  ExternalLink,
  CheckCircle2,
  X,
  Info,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  chapters,
  roles,
  pathway,
  assessment,
  type Role,
  type Chapter,
} from './content';

type View =
  | 'My journey'
  | 'Learning library'
  | 'My playbook'
  | 'My readiness'
  | 'My role'
  | 'Help & guidance'
  | 'Chapter'
  | 'Assessment';
type RecordState = {
  role: Role;
  name: string;
  completed: number[];
  saved: number[];
  notes: Record<number, string>;
  lastChapter: number;
  result: { score: number; date: string } | null;
};
const initial: RecordState = {
  role: 'Everyone',
  name: '',
  completed: [],
  saved: [],
  notes: {},
  lastChapter: 1,
  result: null,
};
const icons = [
  Compass,
  Users,
  ShieldCheck,
  LockKeyhole,
  GitBranch,
  Flag,
  FileCheck2,
  Code2,
  Network,
  Handshake,
];
const navItems = [
  { icon: LayoutDashboard, label: 'My journey' },
  { icon: BookOpen, label: 'Learning library' },
  { icon: Bookmark, label: 'My playbook' },
  { icon: Award, label: 'My readiness' },
] as const;
const STORAGE = 'pa-vanguard-lto-v1';
function saveFile(filename: string, text: string, type = 'text/plain') {
  const a = document.createElement('a');
  const url = URL.createObjectURL(new Blob([text], { type }));
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Brand() {
  return (
    <div className="brand-lockup">
      <img
        src="/brand/pa-consulting.svg"
        alt="PA Consulting"
        className="pa-logo"
      />
      <span>×</span>
      <img src="/brand/vanguard.svg" alt="Vanguard" className="vanguard-logo" />
    </div>
  );
}
function Navigation({
  view,
  navigate,
  saved,
}: {
  view: View;
  navigate: (v: View) => void;
  saved: number;
}) {
  const { setOpenMobile } = useSidebar();
  const go = (v: View) => {
    navigate(v);
    setOpenMobile(false);
  };
  return (
    <Sidebar>
      <SidebarHeader className="brand-panel">
        <Brand />
        <div className="brand-caption">CLIENT DELIVERY ENABLEMENT</div>
      </SidebarHeader>
      <SidebarContent>
        <div className="workspace-label">YOUR WORKSPACE</div>
        <SidebarMenu>
          {navItems.map(({ icon: Icon, label }) => (
            <SidebarMenuItem key={label}>
              <SidebarMenuButton
                onClick={() => go(label)}
                className="nav-button"
                isActive={
                  view === label ||
                  (view === 'Chapter' && label === 'Learning library') ||
                  (view === 'Assessment' && label === 'My readiness')
                }
                aria-current={view === label ? 'page' : undefined}
              >
                <Icon />
                <span>{label}</span>
                {label === 'My playbook' && saved > 0 ? (
                  <span className="nav-count">{saved}</span>
                ) : (
                  view === label && <ChevronRight />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="workspace-label second-label">YOUR ENGAGEMENT</div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="nav-button"
              isActive={view === 'My role'}
              onClick={() => go('My role')}
            >
              <Users />
              <span>My role</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="side-guide">
          <span className="eyebrow">ONE TEAM. SHARED STANDARDS.</span>
          <p>
            Build confidence.
            <br />
            Deliver with care.
          </p>
          <span>Your guide throughout the engagement.</span>
        </div>
      </SidebarContent>
      <SidebarFooter className="side-footer">
        <button onClick={() => go('Help & guidance')}>
          <CircleHelp size={18} />
          Help & guidance
        </button>
        <small>
          PA × Vanguard
          <br />
          Licence to Operate · Review edition
        </small>
      </SidebarFooter>
    </Sidebar>
  );
}
export default function Home() {
  return (
    <SidebarProvider
      style={{ '--sidebar-width': '252px' } as React.CSSProperties}
    >
      <Workspace />
    </SidebarProvider>
  );
}
function Workspace() {
  const [view, setView] = useState<View>('My journey');
  const [record, setRecord] = useState<RecordState>(initial);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All modules');
  const [chapterId, setChapterId] = useState(1);
  const [section, setSection] = useState(0);
  const [answer, setAnswer] = useState<string>('');
  const [checked, setChecked] = useState(false);
  const [notice, setNotice] = useState('');
  const [examAnswers, setExamAnswers] = useState<Record<number, string>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const d = JSON.parse(raw);
        if (
          roles.includes(d.role) &&
          Array.isArray(d.completed) &&
          Array.isArray(d.saved)
        ) {
          const ids = (arr: unknown[]) =>
            arr.filter(
              (n): n is number =>
                typeof n === 'number' && chapters.some((c) => c.id === n),
            );
          setRecord({
            ...initial,
            role: d.role,
            name: typeof d.name === 'string' ? d.name.slice(0, 80) : '',
            completed: [...new Set(ids(d.completed))],
            saved: [...new Set(ids(d.saved))],
            notes:
              d.notes && typeof d.notes === 'object'
                ? Object.fromEntries(
                    Object.entries(d.notes).filter(
                      (entry): entry is [string, string] =>
                        typeof entry[1] === 'string',
                    ),
                  )
                : {},
            lastChapter: chapters.some((c) => c.id === d.lastChapter)
              ? d.lastChapter
              : 1,
            result:
              d.result &&
              Number.isFinite(d.result.score) &&
              typeof d.result.date === 'string'
                ? d.result
                : null,
          });
        }
      }
    } catch {
      setStorageError(true);
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded)
      try {
        localStorage.setItem(STORAGE, JSON.stringify(record));
      } catch {
        setStorageError(true);
      }
  }, [record, loaded]);
  const current = useRef({ record, view, chapterId });
  current.current = { record, view, chapterId };
  useEffect(() => {
    type Tool = {
      name: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean };
      execute: (input: unknown) => unknown;
    };
    const ctx = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: Tool,
            options: { signal: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!ctx?.registerTool) return;
    const lifecycle = new AbortController();
    const tools: Tool[] = [
      {
        name: 'get_learning_status',
        description:
          'Read the device-local role, required modules, completed modules and saved playbook. Learning completion does not represent client approval.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true },
        execute: (input) => {
          if (!input || typeof input !== 'object' || Object.keys(input).length)
            throw new Error('This read tool accepts an empty object.');
          const r = current.current.record;
          return {
            view: current.current.view,
            openModule:
              current.current.view === 'Chapter'
                ? current.current.chapterId
                : null,
            role: r.role,
            required: pathway(r.role).map((c) => ({
              id: c.id,
              title: c.title,
            })),
            completed: r.completed,
            saved: r.saved,
            assessment: r.result,
          };
        },
      },
      {
        name: 'open_learning_module',
        description:
          'Open a learning module at its first section. Does not mark it complete or submit an assessment.',
        inputSchema: {
          type: 'object',
          properties: {
            moduleId: { type: 'integer', minimum: 1, maximum: 10 },
          },
          required: ['moduleId'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false },
        execute: (input) => {
          const id = (input as { moduleId?: number })?.moduleId;
          if (!Number.isInteger(id) || !chapters.some((c) => c.id === id))
            throw new Error('Choose an existing module ID between 1 and 10.');
          flushSync(() => {
            setChapterId(id!);
            setSection(0);
            setAnswer('');
            setChecked(false);
            setView('Chapter');
          });
          return {
            opened: id,
            title: chapters.find((c) => c.id === id)!.title,
          };
        },
      },
    ];
    for (const tool of tools) {
      try {
        Promise.resolve(
          ctx.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => {});
      } catch {}
    }
    return () => lifecycle.abort();
  }, []);
  function navigate(next: View) {
    setView(next);
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'instant' });
    requestAnimationFrame(() => main.current?.focus({ preventScroll: true }));
  }
  function openChapter(id: number) {
    setChapterId(id);
    setSection(0);
    setAnswer('');
    setChecked(false);
    setRecord((r) => ({ ...r, lastChapter: id }));
    navigate('Chapter');
  }
  function toggleSave(id: number) {
    const isSaved = record.saved.includes(id);
    setRecord((r) => ({
      ...r,
      saved: isSaved ? r.saved.filter((x) => x !== id) : [...r.saved, id],
    }));
    setNotice(
      isSaved ? 'Removed from your playbook.' : 'Saved to your playbook.',
    );
  }
  const required = pathway(record.role);
  const completed = required.filter((c) => record.completed.includes(c.id));
  const percent = Math.round((completed.length / required.length) * 100);
  const ready = completed.length === required.length;
  const passed = ready && !!record.result && record.result.score >= 80;
  const next = required.find((c) => !record.completed.includes(c.id));
  const active = chapters.find((c) => c.id === chapterId)!;
  const remaining = required
    .filter((c) => !record.completed.includes(c.id))
    .reduce((s, c) => s + c.minutes, 0);
  const hasStarted = record.completed.length > 0 || record.lastChapter !== 1;
  const filtered = chapters.filter(
    (c) =>
      (filter === 'All modules' ||
        (filter === 'My pathway' && required.includes(c)) ||
        (filter === 'Completed' && record.completed.includes(c.id))) &&
      `${c.title} ${c.description} ${c.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  function moduleRow(c: Chapter) {
    const Icon = icons[c.id - 1];
    const done = record.completed.includes(c.id);
    return (
      <button
        className="module-row"
        key={c.id}
        onClick={() => openChapter(c.id)}
      >
        <span className={'module-icon' + (done ? ' done' : '')}>
          {done ? <Check size={23} /> : <Icon size={23} />}
        </span>
        <span className="module-copy">
          <span className="eyebrow">
            {c.category}{' '}
            <span>
              · {c.minutes} MIN{!required.includes(c) ? ' · OPTIONAL' : ''}
            </span>
          </span>
          <strong>{c.title}</strong>
          <span>{c.description}</span>
        </span>
        <span className="module-index">
          {done ? 'Complete' : String(c.id).padStart(2, '0')}
        </span>
        <ArrowRight size={18} />
      </button>
    );
  }
  function exportRecord() {
    saveFile(
      'PA-Vanguard-readiness-record.txt',
      `PA × VANGUARD — LEARNING RECORD\nReview edition | ${new Date().toLocaleDateString('en-GB')}\n\nName: ${record.name || 'Not provided'}\nPathway: ${record.role}\nRequired modules: ${completed.length}/${required.length}\nAssessment: ${record.result ? record.result.score + '% on ' + new Date(record.result.date).toLocaleDateString('en-GB') : 'Not attempted'}\nReadiness: ${passed ? 'Learning complete — engagement review required' : 'Learning in progress'}\n\n${required.map((c) => `${record.completed.includes(c.id) ? '[Complete]' : '[Not complete]'} ${c.title}`).join('\n')}\n\nThis device-local review-edition record is not an official training certificate, compliance attestation, access authorisation or client sign-off. An engagement lead must confirm approved training and mobilisation requirements.`,
    );
  }
  return (
    <>
      <Navigation view={view} navigate={navigate} saved={record.saved.length} />
      <div className="app-shell">
        <header className="topbar">
          <div>
            <SidebarTrigger />
            <span>Licence to Operate</span>
            <ChevronRight size={14} />
            <span className="muted">
              {view === 'Chapter' ? 'Learning library' : view}
            </span>
          </div>
          <div className="top-right">
            <span className="review-dot" />
            Content review edition
            <button
              className="avatar"
              aria-label="Edit your role"
              onClick={() => navigate('My role')}
            >
              {record.name
                ? record.name
                    .split(' ')
                    .map((x) => x[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'PA'}
            </button>
          </div>
        </header>
        <main
          id="main-content"
          ref={main}
          tabIndex={-1}
          className="main-content"
        >
          {storageError && (
            <div className="status-banner" role="alert">
              Your browser cannot save progress. Keep this page open and
              download your learning record before leaving.
            </div>
          )}
          {notice && (
            <div className="toast" role="status">
              <CheckCircle2 size={18} />
              {notice}
              <button
                aria-label="Dismiss notification"
                onClick={() => setNotice('')}
              >
                <X size={16} />
              </button>
            </div>
          )}
          {view === 'My journey' && (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow red">YOUR LICENCE TO OPERATE</p>
                  <h1>
                    {passed
                      ? 'Ready for your review.'
                      : record.name
                        ? `Your next chapter, ${record.name.split(' ')[0]}.`
                        : 'Ready for what’s next.'}
                  </h1>
                  <p>A clear path to confident delivery at Vanguard.</p>
                </div>
                <button
                  className="secondary"
                  onClick={() => navigate('My role')}
                >
                  <Users size={16} />
                  {record.role === 'Everyone'
                    ? 'Choose your role'
                    : record.role}
                </button>
              </div>
              <div className="dashboard-grid">
                <div>
                  <section className="next-card">
                    <div className="eyebrow">
                      YOUR NEXT STEP{' '}
                      <span>
                        {String(
                          Math.min(completed.length + 1, required.length),
                        ).padStart(2, '0')}{' '}
                        / {String(required.length).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="next-body">
                      <div>
                        <span className="pill">
                          {ready
                            ? 'Your learning milestone'
                            : hasStarted
                              ? 'Keep your momentum'
                              : 'Start with the foundations'}
                        </span>
                        <h2>
                          {ready ? (
                            passed ? (
                              'Put your learning\ninto practice.'
                            ) : (
                              'Bring your learning\ntogether.'
                            )
                          ) : hasStarted ? (
                            next?.title
                          ) : (
                            <>
                              Great delivery starts
                              <br />
                              with shared understanding.
                            </>
                          )}
                        </h2>
                        <p>
                          {ready ? (
                            passed ? (
                              'Review your learning record and mobilisation requirements with your engagement lead.'
                            ) : (
                              'Complete five practical scenarios to check your understanding.'
                            )
                          ) : hasStarted ? (
                            next?.description
                          ) : (
                            <>
                              Get to know Vanguard, how we work together,
                              <br className="desktop" /> and the standards that
                              guide every engagement.
                            </>
                          )}
                        </p>
                        <button
                          className="primary"
                          onClick={() =>
                            ready
                              ? navigate(passed ? 'My readiness' : 'Assessment')
                              : openChapter(next!.id)
                          }
                        >
                          {ready
                            ? passed
                              ? 'View my readiness'
                              : 'Start assessment'
                            : hasStarted
                              ? 'Continue learning'
                              : 'Start my journey'}
                          <ArrowRight size={18} />
                        </button>
                      </div>
                      <Compass className="hero-icon" strokeWidth={0.7} />
                    </div>
                    <div className="next-footer">
                      <Clock3 size={15} />
                      {next ? `${next.minutes} min` : '5 scenarios'}
                      <span>•</span>
                      {next ? next.title : 'Readiness assessment'}
                    </div>
                  </section>
                  <div className="section-heading">
                    <h2>Your learning pathway</h2>
                    <button
                      className="text-button"
                      onClick={() => {
                        setFilter('My pathway');
                        navigate('Learning library');
                      }}
                    >
                      View all modules <ArrowUpRight size={16} />
                    </button>
                  </div>
                  <div className="module-list">
                    {required.slice(0, 3).map(moduleRow)}
                  </div>
                  <div className="pathway-footnote">
                    <span>
                      {required.length} modules ·{' '}
                      {required.reduce((s, c) => s + c.minutes, 0)} min
                      estimated reading
                    </span>
                    <span>
                      {record.role === 'Everyone'
                        ? 'Core pathway'
                        : record.role}
                    </span>
                  </div>
                </div>
                <aside className="right-rail">
                  <section className="readiness-card">
                    <div className="rail-title">
                      <h2>Your readiness</h2>
                      <ShieldCheck size={20} />
                    </div>
                    <div className="score">
                      {percent}
                      <span>%</span>
                    </div>
                    <p>
                      {ready
                        ? 'Your pathway is complete.'
                        : completed.length
                          ? 'You’re making progress.'
                          : 'You’re at the starting line.'}
                    </p>
                    <Progress
                      value={percent}
                      aria-label="Required learning progress"
                    />
                    <div className="progress-caption">
                      <strong>
                        {completed.length} of {required.length}
                      </strong>
                      <span>modules complete</span>
                    </div>
                    {[
                      {
                        title: 'Build your foundation',
                        sub: 'Complete your learning pathway',
                        done: ready,
                      },
                      {
                        title: 'Check your understanding',
                        sub: 'Pass the readiness assessment',
                        done: passed,
                      },
                      {
                        title: 'Confirm you’re ready',
                        sub: 'Review with your engagement lead',
                        done: false,
                      },
                    ].map((m, i) => (
                      <div
                        className={'milestone' + (m.done ? ' complete' : '')}
                        key={m.title}
                      >
                        <span>{m.done ? <Check size={13} /> : i + 1}</span>
                        <div>
                          <strong>{m.title}</strong>
                          <small>{m.sub}</small>
                        </div>
                      </div>
                    ))}
                  </section>
                  <section className="note-card">
                    <BookOpen size={22} />
                    <h3>More than onboarding.</h3>
                    <p>
                      Save the guidance you need. Your playbook stays useful
                      throughout delivery.
                    </p>
                    <button
                      className="text-button"
                      onClick={() => navigate('My playbook')}
                    >
                      Explore the playbook <ArrowRight size={16} />
                    </button>
                  </section>
                </aside>
              </div>
            </>
          )}
          {view === 'Learning library' && (
            <>
              <PageHeading
                eyebrow="THE LEARNING LIBRARY"
                title="A shared foundation. A role that’s yours."
                text="Practical guidance for your engagement, one focused module at a time."
              />
              <div className="library-toolbar">
                <label className="search-field">
                  <Search size={18} />
                  <input
                    aria-label="Search modules"
                    placeholder="Search modules…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query && (
                    <button
                      aria-label="Clear search"
                      onClick={() => setQuery('')}
                    >
                      <X size={16} />
                    </button>
                  )}
                </label>
                <Select value={filter} onValueChange={(v) => v && setFilter(v)}>
                  <SelectTrigger
                    className="filter-select"
                    aria-label="Filter modules"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['All modules', 'My pathway', 'Completed'].map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="result-count">{filtered.length} modules</span>
              </div>
              {filtered.length ? (
                <div className="module-list full-library">
                  {filtered.map(moduleRow)}
                </div>
              ) : (
                <Empty
                  icon={Search}
                  title="No modules found"
                  text="Try another search or switch to all modules."
                  action="Clear filters"
                  onClick={() => {
                    setQuery('');
                    setFilter('All modules');
                  }}
                />
              )}
              <div className="info-note">
                <Info size={18} />
                <p>
                  Core modules apply to everyone. Your role adds relevant
                  specialist modules. You can explore any module, even when it
                  is optional for your pathway.
                </p>
              </div>
            </>
          )}
          {view === 'My role' && (
            <>
              <PageHeading
                eyebrow="YOUR ENGAGEMENT"
                title="Make the pathway yours."
                text="Choose the closest match to your work. You can change this as your role evolves."
              />
              <div className="profile-layout">
                <section className="surface profile-card">
                  <label className="field-label" htmlFor="display-name">
                    Your name <span>Optional</span>
                  </label>
                  <input
                    id="display-name"
                    className="text-input"
                    value={record.name}
                    maxLength={80}
                    placeholder="How would you like to be addressed?"
                    onChange={(e) =>
                      setRecord((r) => ({ ...r, name: e.target.value }))
                    }
                  />
                  <fieldset>
                    <legend className="field-label">Your role pathway</legend>
                    <RadioGroup
                      value={record.role}
                      onValueChange={(v) => {
                        if (roles.includes(v as Role))
                          setRecord((r) => ({
                            ...r,
                            role: v as Role,
                            result: null,
                          }));
                      }}
                    >
                      {roles.map((role, i) => (
                        <label
                          className={
                            'role-option' +
                            (record.role === role ? ' selected' : '')
                          }
                          key={role}
                        >
                          <RadioGroupItem value={role} />
                          <span>
                            <strong>
                              {role === 'Everyone'
                                ? 'Core delivery pathway'
                                : role}
                            </strong>
                            <small>
                              {
                                [
                                  'A foundation for every PA team member',
                                  'Workstream leads, delivery managers and change practitioners',
                                  'Engineers, architects and technology specialists',
                                  'Data analysts, data engineers and analytics specialists',
                                  'Risk, security and assurance practitioners',
                                ][i]
                              }
                            </small>
                          </span>
                          <span className="role-module-count">
                            {pathway(role).length} modules
                          </span>
                        </label>
                      ))}
                    </RadioGroup>
                  </fieldset>
                  <button
                    className="primary"
                    onClick={() => navigate('My journey')}
                  >
                    View my pathway <ArrowRight size={17} />
                  </button>
                  <p className="micro">
                    Saved automatically on this device. Changing your role
                    resets the assessment result; module completions are
                    retained.
                  </p>
                </section>
                <aside className="surface profile-aside">
                  <Users size={25} />
                  <h2>Your pathway includes</h2>
                  <strong>{required.length} modules</strong>
                  <p>
                    {required.reduce((s, c) => s + c.minutes, 0)} minutes of
                    estimated reading, plus knowledge checks and reflection.
                  </p>
                  <ul className="clean-list">
                    {required.map((c) => (
                      <li key={c.id}>
                        <Check size={15} />
                        {c.title}
                      </li>
                    ))}
                  </ul>
                  <div className="inline-note">
                    Confirm your actual training requirements with your
                    engagement lead.
                  </div>
                </aside>
              </div>
            </>
          )}
          {view === 'Chapter' && (
            <>
              <button
                className="back-link"
                onClick={() => navigate('Learning library')}
              >
                <ArrowLeft size={16} />
                Back to learning library
              </button>
              <div className="chapter-heading">
                <div>
                  <p className="eyebrow red">
                    MODULE {String(active.id).padStart(2, '0')} ·{' '}
                    {active.category.toUpperCase()}
                  </p>
                  <h1>{active.title}</h1>
                  <p>{active.description}</p>
                </div>
                <button
                  className={
                    'secondary' +
                    (record.saved.includes(active.id) ? ' saved' : '')
                  }
                  onClick={() => toggleSave(active.id)}
                  aria-pressed={record.saved.includes(active.id)}
                >
                  <Bookmark
                    size={17}
                    fill={
                      record.saved.includes(active.id) ? 'currentColor' : 'none'
                    }
                  />
                  {record.saved.includes(active.id)
                    ? 'Saved'
                    : 'Save to playbook'}
                </button>
              </div>
              <div className="chapter-layout">
                <aside className="chapter-contents surface">
                  <span className="eyebrow">IN THIS MODULE</span>
                  {active.sections.map((s, i) => (
                    <button
                      key={s.title}
                      className={section === i ? 'current' : ''}
                      aria-current={section === i ? 'step' : undefined}
                      onClick={() => {
                        if (
                          i <= section ||
                          record.completed.includes(active.id)
                        )
                          setSection(i);
                      }}
                      disabled={
                        i > section && !record.completed.includes(active.id)
                      }
                    >
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      {s.title}
                    </button>
                  ))}
                  <button
                    className={section === 3 ? 'current' : ''}
                    onClick={() => setSection(3)}
                    disabled={
                      section < 3 && !record.completed.includes(active.id)
                    }
                  >
                    <span>04</span>Check & reflect
                  </button>
                  <div className="reading-time">
                    <Clock3 size={15} />
                    {active.minutes} min estimated reading
                  </div>
                </aside>
                <article className="surface lesson">
                  <div className="lesson-progress">
                    <span>Step {section + 1} of 4</span>
                    <Progress
                      aria-label="Module reading progress"
                      value={(section + 1) * 25}
                    />
                  </div>
                  {section < 3 ? (
                    <>
                      <p className="eyebrow">UNDERSTAND & APPLY</p>
                      <h2>{active.sections[section].title}</h2>
                      <p className="lesson-body">
                        {active.sections[section].body}
                      </p>
                      <div className="actions-box">
                        <h3>In your day-to-day work</h3>
                        <ul>
                          {active.sections[section].actions.map((a) => (
                            <li key={a}>
                              <CheckCircle2 size={18} />
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="lesson-navigation">
                        <button
                          className="text-button"
                          disabled={section === 0}
                          onClick={() => setSection((s) => s - 1)}
                        >
                          <ArrowLeft size={16} />
                          Previous
                        </button>
                        <button
                          className="primary"
                          onClick={() => {
                            setSection((s) => s + 1);
                            window.scrollTo({ top: 0, behavior: 'instant' });
                          }}
                        >
                          {section === 2 ? 'Knowledge check' : 'Continue'}
                          <ArrowRight size={17} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="eyebrow">PUT IT INTO PRACTICE</p>
                      <h2>A quick knowledge check</h2>
                      <p className="question-text" id="chapter-question">
                        {active.question}
                      </p>
                      <RadioGroup
                        value={answer}
                        onValueChange={(v) => {
                          setAnswer(String(v));
                          setChecked(false);
                        }}
                        aria-labelledby="chapter-question"
                      >
                        {active.options.map((o, i) => (
                          <label className="answer-option" key={o}>
                            <RadioGroupItem value={String(i)} />
                            <span>{o}</span>
                          </label>
                        ))}
                      </RadioGroup>
                      {checked && (
                        <div
                          role="status"
                          className={
                            'answer-feedback ' +
                            (Number(answer) === active.answer
                              ? 'correct'
                              : 'incorrect')
                          }
                        >
                          <strong>
                            {Number(answer) === active.answer
                              ? 'That’s right.'
                              : 'Take another look.'}
                          </strong>
                          <p>{active.explanation}</p>
                        </div>
                      )}
                      <button
                        className="secondary check-answer"
                        disabled={answer === ''}
                        onClick={() => setChecked(true)}
                      >
                        Check my answer
                      </button>
                      {checked && Number(answer) === active.answer && (
                        <div className="reflection">
                          <label className="field-label" htmlFor="reflection">
                            How will you apply this? <span>Optional</span>
                          </label>
                          <textarea
                            id="reflection"
                            value={record.notes[active.id] || ''}
                            maxLength={1500}
                            placeholder="A reminder for your next piece of work…"
                            onChange={(e) =>
                              setRecord((r) => ({
                                ...r,
                                notes: {
                                  ...r.notes,
                                  [active.id]: e.target.value,
                                },
                              }))
                            }
                          />
                          <p className="micro">
                            Keep notes general. Do not include client
                            information or incident details.
                          </p>
                          <button
                            className="primary"
                            onClick={() => {
                              setRecord((r) => ({
                                ...r,
                                completed: [
                                  ...new Set([...r.completed, active.id]),
                                ],
                              }));
                              navigate('My journey');
                              setNotice(
                                'Module complete. Your pathway has been updated.',
                              );
                            }}
                          >
                            <Check size={17} />
                            {record.completed.includes(active.id)
                              ? 'Return to my journey'
                              : 'Complete module'}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </article>
              </div>
            </>
          )}
          {view === 'My playbook' && (
            <>
              <PageHeading
                eyebrow="YOUR DAY-TO-DAY GUIDE"
                title="The guidance you’ll come back to."
                text="Saved modules and personal reminders, ready when you need them."
              />
              {record.saved.length > 0 ? (
                <>
                  <div className="section-heading">
                    <span className="muted">
                      {record.saved.length} saved modules
                    </span>
                    <button
                      className="secondary"
                      onClick={() =>
                        saveFile(
                          'PA-Vanguard-my-playbook.txt',
                          `PA × Vanguard — My playbook\nReview edition. Device-local notes.\n\n${chapters
                            .filter((c) => record.saved.includes(c.id))
                            .map(
                              (c) =>
                                `${c.title}\n${c.takeaway}\n${record.notes[c.id] ? 'My reminder: ' + record.notes[c.id] : ''}`,
                            )
                            .join('\n\n')}`,
                        )
                      }
                    >
                      <Download size={16} />
                      Download playbook
                    </button>
                  </div>
                  <div className="saved-grid">
                    {chapters
                      .filter((c) => record.saved.includes(c.id))
                      .map((c) => (
                        <section className="surface saved-card" key={c.id}>
                          <div className="saved-card-top">
                            <span className="eyebrow red">{c.category}</span>
                            <button
                              aria-label={`Remove ${c.title} from playbook`}
                              onClick={() => toggleSave(c.id)}
                            >
                              <Bookmark size={19} fill="currentColor" />
                            </button>
                          </div>
                          <h2>{c.title}</h2>
                          <p>{c.takeaway}</p>
                          {record.notes[c.id] && (
                            <blockquote>
                              <span className="eyebrow">YOUR REMINDER</span>
                              <p>{record.notes[c.id]}</p>
                            </blockquote>
                          )}
                          <button
                            className="text-button"
                            onClick={() => openChapter(c.id)}
                          >
                            Revisit module <ArrowRight size={16} />
                          </button>
                        </section>
                      ))}
                  </div>
                </>
              ) : (
                <Empty
                  icon={Bookmark}
                  title="Make this your working playbook."
                  text="Save a module while you read it. Your key takeaways and personal reminders will appear here."
                  action="Explore learning modules"
                  onClick={() => navigate('Learning library')}
                />
              )}
              <div className="info-note">
                <BookOpen size={19} />
                <p>
                  Revisit your playbook before a new deliverable, a review or a
                  handover. Saved guidance remains available independently of
                  module completion.
                </p>
              </div>
            </>
          )}
          {view === 'My readiness' && (
            <>
              <PageHeading
                eyebrow="YOUR LEARNING RECORD"
                title={
                  passed
                    ? 'Learning complete. Review comes next.'
                    : 'Build your readiness, step by step.'
                }
                text="Track your learning and prepare for a conversation with your engagement lead."
              />
              <div className="readiness-layout">
                <section className="surface readiness-main">
                  <div className="readiness-status">
                    <div className="module-icon">
                      <ShieldCheck size={26} />
                    </div>
                    <div>
                      <span className="eyebrow red">
                        {passed
                          ? 'READY FOR ENGAGEMENT REVIEW'
                          : 'LEARNING IN PROGRESS'}
                      </span>
                      <h2>{record.name || 'Your readiness record'}</h2>
                      <p>
                        {record.role === 'Everyone'
                          ? 'Core delivery pathway'
                          : record.role}
                      </p>
                    </div>
                  </div>
                  <Progress value={percent} aria-label="Pathway completion" />
                  <div className="progress-caption">
                    <strong>
                      {completed.length} of {required.length}
                    </strong>
                    <span>required modules complete</span>
                  </div>
                  <div className="readiness-checklist">
                    {required.map((c) => (
                      <button key={c.id} onClick={() => openChapter(c.id)}>
                        {record.completed.includes(c.id) ? (
                          <CheckCircle2 className="green" size={19} />
                        ) : (
                          <span className="hollow-circle" />
                        )}
                        <span>{c.title}</span>
                        <ChevronRight size={16} />
                      </button>
                    ))}
                  </div>
                  <button className="secondary" onClick={exportRecord}>
                    <Download size={17} />
                    Download learning record
                  </button>
                </section>
                <aside>
                  <section className="surface assessment-card">
                    <Award size={29} />
                    <h2>Readiness assessment</h2>
                    <p>
                      Five practical scenarios. Score at least 80% to complete
                      this learning pathway.
                    </p>
                    <div className="assessment-facts">
                      <span>5 questions</span>
                      <span>80% pass mark</span>
                      <span>Retakes available</span>
                    </div>
                    {record.result && (
                      <div className="assessment-result">
                        <strong>{record.result.score}%</strong>
                        <span>
                          Last attempt ·{' '}
                          {new Date(record.result.date).toLocaleDateString(
                            'en-GB',
                          )}
                        </span>
                      </div>
                    )}
                    <button
                      className="primary"
                      disabled={!ready}
                      onClick={() => {
                        setExamAnswers({});
                        setExamSubmitted(false);
                        navigate('Assessment');
                      }}
                    >
                      {!ready ? (
                        <LockKeyhole size={16} />
                      ) : (
                        <ArrowRight size={16} />
                      )}{' '}
                      {!ready
                        ? 'Complete your pathway first'
                        : passed
                          ? 'Retake assessment'
                          : 'Start assessment'}
                    </button>
                    {!ready && (
                      <p className="micro">
                        {required.length - completed.length} required modules
                        remaining · approximately {remaining} min reading
                      </p>
                    )}
                  </section>
                  <section className="note-card review-note">
                    <FileCheck2 size={23} />
                    <h3>Learning is one part of readiness.</h3>
                    <p>
                      Your engagement lead still needs to confirm the applicable
                      policies, mandatory training, role responsibilities and
                      access approvals. This record does not grant authority to
                      operate.
                    </p>
                  </section>
                </aside>
              </div>
            </>
          )}
          {view === 'Assessment' && (
            <>
              <button
                className="back-link"
                onClick={() => navigate('My readiness')}
              >
                <ArrowLeft size={16} />
                Back to my readiness
              </button>
              <PageHeading
                eyebrow="CHECK YOUR UNDERSTANDING"
                title="Bring your learning together."
                text="Choose one answer for each scenario. You need four out of five correct answers to pass."
              />
              {!ready ? (
                <Empty
                  icon={LockKeyhole}
                  title="Your pathway comes first."
                  text="Complete the required modules for your role to unlock this assessment."
                  action="Continue my journey"
                  onClick={() => navigate('My journey')}
                />
              ) : (
                <section className="surface exam">
                  {examSubmitted && (
                    <div
                      role="status"
                      className={
                        'exam-result ' +
                        (record.result!.score >= 80 ? 'correct' : 'incorrect')
                      }
                    >
                      <Award size={30} />
                      <div>
                        <h2>
                          {record.result!.score >= 80
                            ? 'Learning milestone achieved.'
                            : 'A little more review will help.'}
                        </h2>
                        <p>
                          You scored {record.result!.score}%.{' '}
                          {record.result!.score >= 80
                            ? 'Your next step is an engagement readiness review.'
                            : 'Review the feedback below, then try again.'}
                        </p>
                      </div>
                    </div>
                  )}
                  {assessment.map((q, i) => (
                    <fieldset className="exam-question" key={q.question}>
                      <legend>
                        <span className="eyebrow">SCENARIO {i + 1} / 5</span>
                        {q.question}
                      </legend>
                      <RadioGroup
                        value={examAnswers[i] ?? ''}
                        disabled={examSubmitted}
                        onValueChange={(v) =>
                          setExamAnswers((a) => ({ ...a, [i]: String(v) }))
                        }
                      >
                        {q.options.map((o, j) => (
                          <label className="answer-option" key={o}>
                            <RadioGroupItem value={String(j)} />
                            <span>{o}</span>
                          </label>
                        ))}
                      </RadioGroup>
                      {examSubmitted && (
                        <p
                          className={
                            'exam-feedback ' +
                            (Number(examAnswers[i]) === q.answer
                              ? 'green'
                              : 'red')
                          }
                        >
                          {Number(examAnswers[i]) === q.answer
                            ? 'Correct. '
                            : 'Review this. '}
                          {q.explanation}
                        </p>
                      )}
                    </fieldset>
                  ))}
                  <div className="exam-footer">
                    {examSubmitted ? (
                      <>
                        <button
                          className="primary"
                          onClick={() => navigate('My readiness')}
                        >
                          View my readiness <ArrowRight size={17} />
                        </button>
                        <button
                          className="secondary"
                          onClick={() => {
                            setExamAnswers({});
                            setExamSubmitted(false);
                            window.scrollTo({ top: 0, behavior: 'instant' });
                          }}
                        >
                          Try again
                        </button>
                      </>
                    ) : (
                      <>
                        <span>
                          {Object.keys(examAnswers).length} of 5 answered
                        </span>
                        <button
                          className="primary"
                          disabled={Object.keys(examAnswers).length !== 5}
                          onClick={() => {
                            const score = assessment.reduce(
                              (n, q, i) =>
                                n +
                                (Number(examAnswers[i]) === q.answer ? 20 : 0),
                              0,
                            );
                            setRecord((r) => ({
                              ...r,
                              result: { score, date: new Date().toISOString() },
                            }));
                            setExamSubmitted(true);
                            window.scrollTo({ top: 0, behavior: 'instant' });
                          }}
                        >
                          Submit assessment <ArrowRight size={17} />
                        </button>
                      </>
                    )}
                  </div>
                </section>
              )}
            </>
          )}
          {view === 'Help & guidance' && (
            <>
              <PageHeading
                eyebrow="HELP & GUIDANCE"
                title="Know where to turn."
                text="Use this playbook alongside your engagement’s approved sources and support routes."
              />
              <div className="help-grid">
                <section className="surface help-card">
                  <Users size={25} />
                  <h2>Your engagement support</h2>
                  <p>
                    Contact your PA engagement lead for scope, responsibilities
                    and delivery concerns. Use your Vanguard counterpart to
                    confirm the applicable client processes and decision owners.
                  </p>
                  <h3>Before starting delivery, locate:</h3>
                  <ul className="bullet-list">
                    <li>Your PA lead and Vanguard delivery counterpart</li>
                    <li>
                      The approved client incident and service-support routes
                    </li>
                    <li>
                      The current statement of work and acceptance criteria
                    </li>
                    <li>
                      The authoritative policy and mandatory training locations
                    </li>
                  </ul>
                </section>
                <section className="surface help-card">
                  <Info size={25} />
                  <h2>About this review edition</h2>
                  <p>
                    This is proposed content for PA teams working with Vanguard.
                    General delivery guidance has been adapted from the
                    reference playbook; government-specific products, frameworks
                    and operating assumptions have been removed.
                  </p>
                  <p>
                    It has not been approved by PA or Vanguard as mandatory
                    training. The module selection, assessment threshold and
                    readiness process require engagement-owner review.
                  </p>
                  <p>
                    Names, progress, notes and assessment results stay in this
                    browser. They are not sent to a learning system or a
                    management dashboard.
                  </p>
                </section>
                <section className="surface help-card">
                  <ExternalLink size={25} />
                  <h2>Public context & brand sources</h2>
                  <a
                    href="https://www.paconsulting.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    PA Consulting: bringing ingenuity to life{' '}
                    <ArrowUpRight size={16} />
                  </a>
                  <a
                    href="https://corporate.vanguard.com/content/corporatesite/us/en/corp/why-vanguard/sets-us-apart/index.html"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Vanguard: what sets us apart <ArrowUpRight size={16} />
                  </a>
                  <a
                    href="https://corporate.vanguard.com/content/corporatesite/us/en/corp/why-vanguard/sets-us-apart/ethics-and-integrity.html"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Vanguard: ethics and integrity <ArrowUpRight size={16} />
                  </a>
                  <p className="micro">
                    Logos are sourced from the organisations’ public websites.
                    Their use here identifies the proposed audience; it does not
                    imply approval.
                  </p>
                </section>
                <section className="surface help-card">
                  <BookOpen size={25} />
                  <h2>Using your playbook</h2>
                  <ol className="bullet-list">
                    <li>Choose your role to see the relevant pathway.</li>
                    <li>Read each module and complete its knowledge check.</li>
                    <li>Save useful guidance and add general reminders.</li>
                    <li>
                      Pass the assessment and download your learning record.
                    </li>
                    <li>
                      Review outstanding mobilisation requirements with your
                      engagement lead.
                    </li>
                  </ol>
                  <button
                    className="text-button"
                    onClick={() => navigate('My journey')}
                  >
                    Return to my journey <ArrowRight size={16} />
                  </button>
                </section>
              </div>
            </>
          )}
          <footer className="page-footer">
            <span>Built around responsible delivery.</span>
            <button onClick={() => navigate('Help & guidance')}>
              Review edition · Progress stays on this device
            </button>
          </footer>
        </main>
      </div>
    </>
  );
}
function PageHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow red">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </div>
  );
}
function Empty({
  icon: Icon,
  title,
  text,
  action,
  onClick,
}: {
  icon: typeof Search;
  title: string;
  text: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <section className="surface empty-state">
      <span className="empty-icon">
        <Icon size={30} />
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="primary" onClick={onClick}>
        {action}
        <ArrowRight size={17} />
      </button>
    </section>
  );
}
