import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import {
  BadgeIndianRupee,
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Eye,
  EyeOff,
  FileArchive,
  FileSignature,
  Filter,
  GraduationCap,
  Grid2X2,
  LayoutDashboard,
  Mail,
  Megaphone,
  Pencil,
  PlaneTakeoff,
  ReceiptIndianRupee,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  Timer,
  Upload,
  UserPlus,
  UserRound,
  UsersRound,
  XCircle
} from 'lucide-react';
import './styles.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE_URL });

function resolveFileUrl(url) {
  if (!url) return '';
  if (/^(https?:)?\/\//i.test(url) || /^blob:/i.test(url)) return url;
  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/i, '').replace(/\/$/, '');
  return `${apiOrigin}/${String(url).replace(/^\/+/, '')}`;
}

const moduleGroups = [
  { title: 'Dashboard', icon: LayoutDashboard, route: 'dashboard' },
  { title: 'Inbox', icon: Mail, route: 'inbox' },
  { title: 'Recruitment Management', icon: BriefcaseBusiness, items: [
    ['recruitment-jobs', BriefcaseBusiness, 'Job Listings'],
    ['recruitment-applications', UsersRound, 'Applications'],
    ['recruitment-add-candidate', UserPlus, 'Add Candidates'],
    ['recruitment-tests', ClipboardCheck, 'Candidate Tests'],
    ['recruitment-interviews', CalendarDays, 'Interviews'],
    ['recruitment-documents', FileArchive, 'Candidate Documents'],
    ['recruitment-offers', FileSignature, 'Offer Letters'],
    ['recruitment-onboarding', UserRound, 'Onboarding']
  ] },
  { title: 'Offer Creation', icon: FileSignature, route: 'offer-creation' },
  { title: 'Employees', icon: UsersRound, items: [
    ['employees', UsersRound, 'Employee Directory'],
    ['employee-profiles', UserRound, 'Employee Profiles'],
    ['org-department', Building2, 'Departments'],
    ['org-designation', BriefcaseBusiness, 'Designations'],
    ['documents', ClipboardCheck, 'Employee Documents'],
    ['employee-status', ShieldCheck, 'Employee Status']
  ] },
  { title: 'Learning & Development', icon: GraduationCap, items: [
    ['learning-paths', ClipboardCheck, 'Learning Paths'],
    ['learning-beginner', BookOpen, 'Beginner Programs'],
    ['learning-intermediate', GraduationCap, 'Intermediate Programs'],
    ['learning-advanced', Sparkles, 'Advanced Programs'],
    ['learning-assessments', ClipboardCheck, 'Assessments'],
    ['learning-reports', BarChart3, 'Learning Reports']
  ] },
  { title: 'Project Assignment', icon: BriefcaseBusiness, route: 'project-assignments' },
  { title: 'Certifications', icon: FileSignature, route: 'certifications' },
  { title: 'Attendance Management', icon: Timer, items: [
    ['attendance', LayoutDashboard, 'Attendance Dashboard'],
    ['attendance-daily', Timer, 'Daily Attendance'],
    ['leave', CalendarDays, 'Leave Management'],
    ['leave-holidays', CalendarDays, 'Holidays'],
    ['attendance-shift', Timer, 'Shift Management']
  ] },
  { title: 'Payroll Management', icon: BadgeIndianRupee, items: [
    ['payroll', LayoutDashboard, 'Payroll Dashboard'],
    ['payroll-structures', BadgeIndianRupee, 'Salary Structures'],
    ['payroll-processing', ReceiptIndianRupee, 'Payroll Processing'],
    ['payroll-payslips', FileSignature, 'Payslips'],
    ['payroll-deductions', ShieldCheck, 'Deductions'],
    ['payroll-benefits', Star, 'Benefits'],
    ['payroll-reports', BarChart3, 'Payroll Reports']
  ] },
  { title: 'Tasks & Approvals', icon: ClipboardCheck, items: [
    ['work', BriefcaseBusiness, 'Work Management'],
    ['expenses', ReceiptIndianRupee, 'Reimbursement Approvals'],
    ['tickets', Ticket, 'Employee Requests'],
    ['resignation', PlaneTakeoff, 'Resignation Management']
  ] },
  { title: 'Performance & Rewards', icon: Star, items: [
    ['performance', Star, 'Performance'],
    ['incentives', Star, 'Sales Incentives']
  ] },
  { title: 'Compliance & Assets', icon: ShieldCheck, items: [
    ['org-policies', ClipboardCheck, 'Company Policies'],
    ['org-roles', ShieldCheck, 'Roles & Access'],
    ['organisation', Building2, 'Organisation Design']
  ] },
  { title: 'Reports & Analytics', icon: BarChart3, items: [
    ['analytics', BarChart3, 'Company Analytics'],
    ['hr-insights', BarChart3, 'HR Manager Insights'],
    ['ops-insights', BarChart3, 'Admin/Ops Insights'],
    ['smart-insights', Sparkles, 'Smart Insights']
  ] },
  { title: 'Communication & Admin', icon: Settings, items: [
    ['communications', Megaphone, 'Communications'],
    ['email-automation', Mail, 'Email Automation'],
    ['billing', ReceiptIndianRupee, 'Billing & Subscriptions'],
    ['setup', Settings, 'System Configuration']
  ] }
];

const recruitmentRouteTabs = {
  'recruitment-jobs': 'jobs',
  'recruitment-applications': 'candidates',
  'recruitment-add-candidate': 'add candidate',
  'recruitment-tests': 'ai tests',
  'recruitment-interviews': 'interviews',
  'recruitment-documents': 'lifecycle control',
  'recruitment-offers': 'offer letters',
  'recruitment-onboarding': 'lifecycle control'
};

const learningRouteTabs = {
  'learning-beginner': 'beginner programs',
  'learning-intermediate': 'intermediate programs',
  'learning-advanced': 'advanced programs',
  'learning-assessments': 'learning programs',
  'learning-reports': 'resources'
};

const payrollRouteTabs = {
  'payroll-structures': 'salary structures',
  'payroll-processing': 'payroll processing',
  'payroll-payslips': 'payslips',
  'payroll-deductions': 'deductions',
  'payroll-benefits': 'benefits'
};

const permissionForms = [
  ['inbox', 'Inbox', 'Send and review organization messages'],
  ['myportal', 'My Profile', 'Employee self-service dashboard'],
  ['attendance', 'Mark Attendance', 'Daily check-in/check-out'],
  ['attendance-regularisation', 'Attendance Regularisation', 'Request correction for missed/late punch'],
  ['leave-apply', 'Apply for Leave', 'Create leave request'],
  ['leave-balance', 'Leave Balance', 'View balance and history'],
  ['mypayroll', 'My Payroll', 'View salary structure and payslips'],
  ['expenses', 'Expense Claims', 'Submit and track reimbursements'],
  ['learning-my', 'My Learning', 'Assigned learning and tests'],
  ['learning', 'Available Programs', 'Browse and enroll programs'],
  ['tickets', 'My Tickets', 'Raise helpdesk requests'],
  ['resignation', 'Resignation', 'Submit and track resignation'],
  ['documents', 'Documents', 'View generated letters and document status'],
  ['employees', 'Employee Master', 'Manage employee records'],
  ['recruitment', 'Recruitment', 'Jobs, candidates, interviews and offers'],
  ['payroll', 'Payroll Processing', 'Payroll runs, compliance and salary crediting'],
  ['org-roles', 'Roles', 'Manage roles and access policies'],
  ['org-policies', 'Company Policies', 'Maintain policy templates'],
  ['analytics', 'Company Analytics', 'View company dashboards']
];

const rolePolicies = {
  'Employee Policy': ['inbox', 'myportal', 'attendance', 'attendance-regularisation', 'leave-apply', 'leave-balance', 'mypayroll', 'expenses', 'learning-my', 'learning', 'tickets', 'resignation', 'documents'],
  'Manager Policy': ['inbox', 'myportal', 'attendance', 'leave-apply', 'leave-balance', 'mypayroll', 'expenses', 'learning-my', 'learning', 'tickets', 'employees', 'performance', 'analytics'],
  'Recruiter Policy': ['inbox', 'recruitment', 'documents', 'offer', 'analytics', 'learning-my'],
  'Payroll Admin Policy': ['inbox', 'payroll', 'payroll-reports', 'payroll-compliance', 'payroll-form16', 'payroll-tax', 'expenses', 'mypayroll', 'analytics'],
  'HR Admin Policy': permissionForms.map(([route]) => route),
  'Panelist Policy': ['inbox', 'myportal', 'recruitment', 'learning-my', 'tickets']
};

function App() {
  const [data, setData] = useState(null);
  const [active, setActive] = useState('dashboard');
  const [expandedGroup, setExpandedGroup] = useState('Dashboard');
  const [toast, setToast] = useState('');
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem('hrmsAdminSession') || 'null'));
  const [accountOpen, setAccountOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const employeeAllowedRoutes = new Set(rolePolicies['Employee Policy']);
  const inboxAllowed = canUseInbox(session);
 const visibleModuleGroups = session?.role === 'Employee'
    ? [
        { title: 'My Portal', icon: UserRound, route: 'myportal' },
        { title: 'My Learning', icon: GraduationCap, route: 'learning-my' },
        { title: 'My Payroll', icon: BadgeIndianRupee, route: 'mypayroll' },
        ...moduleGroups.map((group) => group.route
          ? (employeeAllowedRoutes.has(group.route) && group.route !== 'inbox' ? group : null)
          : { ...group, items: group.items.filter(([id]) => employeeAllowedRoutes.has(id) && id !== 'inbox') }).filter((group) => group && (group.route || group.items.length))
      ].filter((group) => group)
    : moduleGroups.filter((group) => group.route !== 'inbox' || inboxAllowed);
  const activeGroup = visibleModuleGroups.find((group) => group.route === active || group.items?.some(([id]) => id === active))?.title || 'Dashboard';

  const load = async () => {
    const response = await api.get('/bootstrap');
    setData(response.data);
  };

  useEffect(() => {
    load().catch((error) => setToast(error?.message || 'API is not reachable. Check server and VITE_API_URL.'));
  }, []);

  useEffect(() => {
    setExpandedGroup(activeGroup);
  }, [activeGroup]);

  useEffect(() => {
    if (session?.role === 'Employee' && !employeeAllowedRoutes.has(active)) {
      setActive('myportal');
    }
    if (active === 'inbox' && !inboxAllowed) {
      setActive('dashboard');
    }
  }, [session?.role, active, inboxAllowed]);

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3600);
  };
  const notifications = data?.employees?.flatMap((employee) => (employee.Notifications || []).map((note) => ({ ...note, employeeName: employee.name }))) || [];

  if (!data) {
    return (
      <main className="loading">
        <img src="/logo.png" alt="Company logo" />
        <Sparkles />
        <p>{toast || 'Preparing HRMS suite...'}</p>
      </main>
    );
  }

  if (window.location.pathname.startsWith('/candidate-test/')) {
    return <CandidateTestPortal data={data} reload={load} notify={notify} />;
  }

  if (!session) {
    return <LoginScreen onLogin={(user) => { localStorage.setItem('hrmsAdminSession', JSON.stringify(user)); setSession(user); }} />;
  }

  const sessionEmployee = employeeForSession(data, session);
  const today = new Date().toISOString().slice(0, 10);
  const topbarAttendance = sessionEmployee?.AttendanceRecords?.find((record) => record.date === today);
  const topbarCanClockIn = !!sessionEmployee && !topbarAttendance?.checkIn;
  const topbarCanClockOut = !!sessionEmployee && !!topbarAttendance?.checkIn && !topbarAttendance?.checkOut;
  const inboxUnreadCount = (data.mails || []).filter((mail) => isInboundMail(mail) && mail.status === 'Unread').length;
  const topbarClock = async (type) => {
    if (!sessionEmployee) return notify('No employee profile is linked to this login.');
    await api.post(`/attendance/${type}`, {
      EmployeeId: sessionEmployee.id,
      date: today,
      location: 'Hyderabad Office',
      workMode: 'Office',
      remarks: 'Marked from top bar'
    });
    await load();
    notify(type === 'clock-in' ? 'Clock in recorded.' : 'Clock out recorded.');
  };

  return (
    <div className="suite-shell">
      <aside className="suite-sidebar">
        <div className="suite-brand">
          <img src="/logo.png" alt="Company logo" />
        </div>
        <nav>
          {visibleModuleGroups.map((group) => (
            <section className={`nav-group ${expandedGroup === group.title ? 'expanded' : ''}`} key={group.title}>
              {group.route ? (
                <button className={`nav-group-toggle direct ${active === group.route ? 'active' : ''}`} onClick={() => { setActive(group.route); setExpandedGroup(group.title); }}>
                  <group.icon /> <span>{group.title}</span>{group.route === 'inbox' && inboxUnreadCount > 0 && <b className="nav-count green">{inboxUnreadCount}</b>}
                </button>
              ) : (
                <>
                  <button className="nav-group-toggle" onClick={() => setExpandedGroup((current) => current === group.title ? '' : group.title)}>
                    <group.icon /> <span>{group.title}</span><ChevronDown />
                  </button>
                  {expandedGroup === group.title && group.items.map(([id, Icon, label]) => (
                    <button key={id} className={`nav-link ${active === id ? 'active' : ''}`} onClick={() => { setActive(id); setExpandedGroup(group.title); }}>
                      <Icon /> <span>{label}</span>{id === 'inbox' && inboxUnreadCount > 0 && <b className="nav-count green">{inboxUnreadCount}</b>}
                    </button>
                  ))}
                </>
              )}
            </section>
          ))}
        </nav>
      </aside>
      <section className="suite-main">
        <header className="suite-topbar">
          <button className="icon-only ghost" aria-label="Menu"><LayoutDashboard /></button>
                    <div className="tenant-mark">
            {/* <Sparkles /> */}
            <strong>{session?.role === 'Employee' ? 'HRMS Management System' : 'HRMS Admin'}</strong>
          </div>
          <div className="topbar-actions">
            <div className="topbar-clock">
              <span>{sessionEmployee ? (topbarAttendance?.checkIn ? `In ${topbarAttendance.checkIn}${topbarAttendance.checkOut ? ` | Out ${topbarAttendance.checkOut}` : ''}` : 'Not clocked in') : 'No linked employee profile'}</span>
              <button disabled={!topbarCanClockIn} onClick={() => topbarClock('clock-in')}><Timer /> Clock In</button>
              <button className="ghost" disabled={!topbarCanClockOut} onClick={() => topbarClock('clock-out')}><CheckCircle2 /> Clock Out</button>
            </div>
            <div className="notification-menu">
              <button className="icon-only ghost notification-button" aria-label="Notifications" onClick={() => setNotificationsOpen((current) => !current)}>
                <Bell />
                {!!notifications.length && <span>{notifications.length}</span>}
              </button>
              {notificationsOpen && (
                <div className="notification-popover">
                  <header><strong>Notifications</strong><small>{notifications.length} active</small></header>
                  {notifications.slice(0, 6).map((note) => <article key={note.id}><strong>{note.title}</strong><small>{note.employeeName} | {note.channel}</small><p>{note.body}</p></article>)}
                  {!notifications.length && <Empty text="No notifications." />}
                </div>
              )}
            </div>
            <div className="account-menu">
              <button className="profile-chip" onClick={() => setAccountOpen((current) => !current)} aria-expanded={accountOpen} aria-haspopup="menu">
                <img src="/logo.png" alt="" />
                <span>{session.role === 'Employee' ? session.name : 'HR Admin'}<small>{session.email}</small></span>
                <ChevronDown />
              </button>
              {accountOpen && (
                <div className="account-popover" role="menu">
                  <strong>{session.role === 'Employee' ? session.name : 'HR Admin'}</strong>
                  <small>{session.email}</small>
                  <span>{session.role}</span>
                  <button
                    className="ghost"
                    onClick={() => {
                      setActive('myportal');
                      setAccountOpen(false);
                    }}
                  >
                    <UserRound /> My Profile
                  </button>
                  <button
                    className="ghost"
                    onClick={() => {
                      localStorage.removeItem('hrmsAdminSession');
                      setSession(null);
                      setAccountOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="suite-content">
          {toast && <div className="toast">{toast}</div>}
          {active === 'dashboard' && <Dashboard data={data} setActive={setActive} />}
          {active === 'analytics' && <Analytics data={data} />}
          {active === 'hr-insights' && <Insights title="HR Manager Insights" data={data} />}
          {active === 'ops-insights' && <Insights title="Admin/Ops Insights" data={data} />}
          {active === 'smart-insights' && <SmartInsights data={data} />}
          {['recruitment', ...Object.keys(recruitmentRouteTabs)].includes(active) && active !== 'recruitment-offers' && <Recruitment data={data} reload={load} notify={notify} initialTab={recruitmentRouteTabs[active]} />}
          {active === 'inbox' && <Inbox data={data} reload={load} notify={notify} session={session} />}
          {active === 'documents' && <Documents data={data} reload={load} notify={notify} />}
          {['offer', 'offer-creation', 'recruitment-offers'].includes(active) && <OfferLetters data={data} reload={load} notify={notify} />}
          {active === 'organisation' && <Organisation data={data} />}
          {['org-department', 'org-designation', 'org-roles', 'org-policies'].includes(active) && <OrganisationSubmodule active={active} data={data} reload={load} notify={notify} />}
          {['employees', 'employee-profiles', 'employee-status', 'employee-add', 'employee-history', 'employee-access', 'employee-promotion', 'employee-onboarding', 'employee-edit', 'employee-migration'].includes(active) && <Employees data={data} reload={load} notify={notify} initialTab={employeeTabFor(active)} />}
          {['attendance', 'attendance-daily', 'attendance-reports', 'attendance-monthly', 'attendance-settings', 'attendance-shift', 'attendance-regularisation', 'attendance-devices'].includes(active) && <Attendance data={data} reload={load} notify={notify} activeRoute={active} session={session} />}
          {['leave', 'leave-balance', 'leave-policies', 'leave-holidays', 'leave-apply', 'leave-ot'].includes(active) && <Leave data={data} reload={load} notify={notify} activeRoute={active} />}
          {['payroll', 'payroll-reports', 'payroll-compliance', 'payroll-form16', 'payroll-access', 'payroll-tax', 'payroll-pt', 'payroll-labour', ...Object.keys(payrollRouteTabs)].includes(active) && <Payroll data={data} reload={load} notify={notify} activeRoute={active} />}
          {active === 'expenses' && <Expenses data={data} reload={load} notify={notify} />}
          {active === 'incentives' && <Incentives data={data} />}
          {['learning', 'learning-my', 'learning-paths', 'learning-resources', ...Object.keys(learningRouteTabs)].includes(active) && <Learning data={data} reload={load} notify={notify} initialRoute={active} session={session} />}
          {active === 'performance' && <Performance data={data} />}
          {active === 'tickets' && <Tickets data={data} />}
          {active === 'communications' && <Communications data={data} />}
          {active === 'email-automation' && <EmailAutomation data={data} reload={load} notify={notify} />}
          {active === 'work' && <WorkManagement data={data} reload={load} notify={notify} />}
          {active === 'project-assignments' && <WorkManagement data={data} reload={load} notify={notify} initialView="projects" compact />}
          {active === 'certifications' && <WorkManagement data={data} reload={load} notify={notify} initialView="certifications" compact />}
          {active === 'myportal' && <MyPortal data={data} session={session} />}
          {active === 'learning-my' && <MyLearning data={data} session={session} />}
          {active === 'mypayroll' && <MyPayroll data={data} />}
          {active === 'resignation' && <Resignation data={data} />}
          {active === 'billing' && <Billing data={data} reload={load} notify={notify} />}
          {active === 'setup' && <AdminSettings data={data} />}
        </main>
        <button className="assistant-fab" aria-label="Ask HR assistant"><Mail /></button>
      </section>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('Info@infolinx.com');
  const [password, setPassword] = useState('Admin@2026');
  const [message, setMessage] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      onLogin(response.data.user);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  };
  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <img src="/logo.png" alt="Company logo" />
        <h1>HRMS Portal Login</h1>
        <p>Email is the username. Admin decides access after onboarding.</p>
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email username" type="email" />
        <PasswordField value={password} onChange={setPassword} placeholder="Password" />
        <button>Login</button>
        {message && <small>{message}</small>}
      </form>
    </main>
  );
}

function CandidateTestPortal({ data, reload, notify }) {
  const testId = window.location.pathname.split('/').filter(Boolean).pop();
  const test = (data.candidateTests || []).find((item) => String(item.id) === String(testId));
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [remaining, setRemaining] = useState((test?.durationMinutes || 45) * 60);
  useEffect(() => {
    if (!test || result) return undefined;
    const timer = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [test?.id, result]);
  useEffect(() => {
    if (remaining === 0 && test && !result) submit();
  }, [remaining]);
  const setAnswer = (id, value) => setAnswers((current) => ({ ...current, [id]: value }));
  const submit = async () => {
    if (!test || result) return;
    const response = await api.post(`/candidate-tests/${test.id}/submit`, { answers });
    setResult(response.data);
    await reload();
    notify('Test submitted successfully.');
  };
  if (!test) return <main className="loading"><img src="/logo.png" alt="Company logo" /><p>Candidate test link is invalid or expired.</p></main>;
  return (
    <main className="candidate-test-shell">
      <section className="candidate-test-head">
        <img src="/logo.png" alt="Infolinx logo" />
        <div><span>Candidate Dashboard</span><h1>{test.title}</h1><p>{test.Candidate?.name} | {test.Candidate?.email}</p></div>
        <strong>{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</strong>
      </section>
      <section className="assessment-board">
        {(test.questions || []).map((question, index) => (
          <article className="question-card" key={question.id}>
            <strong>{index + 1}. {question.level} | {question.skill} | {question.type}</strong>
            <p>{question.question}</p>
            {['MCQ', 'Multiple Select'].includes(question.type) ? (
              <select value={answers[question.id] || ''} onChange={(event) => setAnswer(question.id, event.target.value)}><option value="">Select answer</option>{(question.options || []).map((option) => <option key={option}>{option}</option>)}</select>
            ) : (
              <textarea value={answers[question.id] || ''} onChange={(event) => setAnswer(question.id, event.target.value)} placeholder="Write your answer here." />
            )}
          </article>
        ))}
      </section>
      {result && <div className="assessment-result"><strong>Submitted</strong><span>Score: {Math.round(result.score || 0)}%</span><p>{result.recommendation}</p></div>}
      <footer className="candidate-test-actions"><button onClick={submit} disabled={!!result}><CheckCircle2 /> Submit Test</button></footer>
    </main>
  );
}

function PasswordField({ value, onChange, placeholder }) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="password-field">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={visible ? 'text' : 'password'}
      />
      <button
        aria-label={visible ? 'Hide password' : 'Show password'}
        onClick={() => setVisible((current) => !current)}
        type="button"
      >
        {visible ? <EyeOff /> : <Eye />}
      </button>
    </label>
  );
}

function Dashboard({ data, setActive }) {
  const documents = data.employees.flatMap((employee) => employee.OnboardingTasks || []);
  const pendingDocs = documents.filter((task) => task.status !== 'Verified').length;
  const cards = [
    ['Total Employees', data.employees.length, 'active profiles', UsersRound],
    ['Open Job Postings', data.jds.length, 'approved requisitions', BriefcaseBusiness],
    ['Interviews', data.interviews.length, 'Teams enabled', CalendarDays],
    ['Pending Documents', pendingDocs, 'approval queue', ClipboardCheck]
  ];
  return (
    <>
      <section className="stat-grid">{cards.map(([label, value, detail, Icon]) => <Stat key={label} label={label} value={value} detail={detail} icon={<Icon />} />)}</section>
      <section className="workbench-grid">
        <Panel title="Module Usage Breakdown" icon={<BarChart3 />}>
          {[
            ['Recruitment', data.candidates.length, 'recruitment'],
            ['Documents', pendingDocs, 'documents'],
            ['Learning', data.learningCourses?.length || 0, 'learning'],
            ['Payroll', data.employees.flatMap((employee) => employee.PayrollRuns || []).length, 'payroll']
          ].map(([name, value, route]) => <UsageBar key={name} label={name} value={value} onClick={() => setActive(route)} />)}
        </Panel>
        <Panel title="Approval Center" icon={<ShieldCheck />}>
          <ApprovalRow title="Document approvals" status={`${pendingDocs} Pending`} action="Review" onClick={() => setActive('documents')} />
          <ApprovalRow title="Leave requests" status={`${countNested(data.employees, 'LeaveRequests')} Open`} action="Open" onClick={() => setActive('leave')} />
          <ApprovalRow title="Expense claims" status={`${countNested(data.employees, 'ExpenseClaims')} Submitted`} action="Verify" onClick={() => setActive('expenses')} />
          <ApprovalRow title="Resignations" status={`${countNested(data.employees, 'RelievingCases')} Cases`} action="Track" onClick={() => setActive('resignation')} />
        </Panel>
      </section>
    </>
  );
}

function Recruitment({ data, reload, notify, initialTab = 'jobs' }) {
  const [tab, setTab] = useState(initialTab);
  useEffect(() => setTab(initialTab), [initialTab]);
  const [jobModal, setJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [careersOpen, setCareersOpen] = useState(false);
  const [candidateFormOpen, setCandidateFormOpen] = useState(false);
  const [jdId, setJdId] = useState(data.jds[0]?.id || '');
  const [candidateIds, setCandidateIds] = useState([]);
  const [panelistIds, setPanelistIds] = useState(data.panelists.slice(0, 1).map((panelist) => panelist.id));
  const [scheduledAt, setScheduledAt] = useState('');
  const [candidateModal, setCandidateModal] = useState(null);
  const [search, setSearch] = useState('');
  const [candidateJobFilter, setCandidateJobFilter] = useState('all');
  const [busyAction, setBusyAction] = useState('');
  const jd = data.jds.find((item) => String(item.id) === String(jdId)) || data.jds[0];
  const filteredByJob = candidateJobFilter === 'all'
    ? data.candidates
    : data.candidates.filter((candidate) => String(candidate.JobDescriptionId) === String(candidateJobFilter));
  const visibleCandidates = filteredByJob.filter((candidate) => {
    const query = search.toLowerCase();
    const jobTitle = candidate.JobDescription?.title || data.jds.find((job) => job.id === candidate.JobDescriptionId)?.title || '';
    return !query || [candidate.name, candidate.email, candidate.roleApplied, jobTitle, ...(candidate.skills || [])].join(' ').toLowerCase().includes(query);
  });
  const teams = data.integrations?.teams;

  const shortlist = async () => {
    if (busyAction) return;
    setBusyAction('shortlist');
    try {
      await api.post(`/jds/${jdId}/shortlist`, { threshold: 65 });
      await reload();
      notify('Suitable candidates refreshed for selected JD.');
    } catch (error) {
      await reload();
      notify(error.response?.data?.lastError || error.response?.data?.message || 'Shortlist refresh failed.');
    } finally {
      setBusyAction('');
    }
  };

  const schedule = async () => {
    if (!candidateIds.length) return notify('Select candidate(s) before sending mail.');
    if (!panelistIds.length) return notify('Select panel member(s).');
    if (!scheduledAt) return notify('Fix interview date and time first.');
    if (busyAction) return;
    setBusyAction('schedule');
    try {
      await api.post('/recruitment/schedule', { jdId, candidateIds, panelistIds, scheduledAt, stage: 'Technical Round 1' });
      await reload();
      notify('Interview mails queued to candidates and panel members.');
    } catch (error) {
      await reload();
      notify(error.response?.data?.lastError || error.response?.data?.message || 'Interview mail failed.');
    } finally {
      setBusyAction('');
    }
  };
  const candidateAction = async (candidate, action) => {
    const key = `candidate-${candidate.id}-${action}`;
    if (busyAction) return;
    setBusyAction(key);
    try {
      await api.post(`/candidates/${candidate.id}/action`, { action });
      await reload();
      notify(`${candidate.name}: ${action} mail processed.`);
    } catch (error) {
      await reload();
      notify(error.response?.data?.lastError || error.response?.data?.message || `${candidate.name}: ${action} failed.`);
    } finally {
      setBusyAction('');
    }
  };
  const sendCandidateTest = async (candidate) => {
    const key = `test-${candidate.id}`;
    if (busyAction) return;
    setBusyAction(key);
    try {
      await api.post(`/candidates/${candidate.id}/tests/generate`, { sendNow: true });
      await reload();
      notify(`${candidate.name}: AI assessment generated and test link mailed.`);
    } catch (error) {
      await reload();
      notify(error.response?.data?.lastError || error.response?.data?.message || `${candidate.name}: test link failed.`);
    } finally {
      setBusyAction('');
    }
  };
  const deleteJob = async (job) => {
    if (!window.confirm(`Delete job posting "${job.title}"?`)) return;
    await api.delete(`/jds/${job.id}`);
    await reload();
    notify('Job posting deleted.');
  };

  return (
    <>
      <section className="stat-grid">
        <Stat label="Active Job Postings" value={data.jds.length} detail="published openings" icon={<BriefcaseBusiness />} />
        <Stat label="Total Candidates" value={data.candidates.length} detail="candidate database" icon={<UsersRound />} />
        <Stat label="Total Interviews" value={data.interviews.length} detail="scheduled rounds" icon={<CalendarDays />} />
        <Stat label="Hired Candidates" value={data.candidates.filter((candidate) => candidate.status === 'Onboarding' || candidate.status === 'Joined').length} detail="converted profiles" icon={<CheckCircle2 />} />
      </section>
      <TabBar active={tab} setActive={setTab} tabs={['jobs', 'candidates', 'add candidate', 'ai tests', 'interviews', 'offer letters', 'lifecycle control', 'saved candidates', 'analytics']} />
      {tab === 'jobs' && (
        <>
          <Panel title="Job Postings" icon={<BriefcaseBusiness />} actions={<><button className="ghost" onClick={() => setCareersOpen(true)}><Eye /> View Careers Page</button><button onClick={() => setJobModal(true)}><BriefcaseBusiness /> Create Job Posting</button></>}>
            <DataTable columns={['Title', 'Department', 'Location', 'Status', 'Applications', 'Actions']} rows={data.jds.map((job) => [
              job.title,
              job.department,
              job.location,
              <Pill tone="success">{job.status || 'Published'}</Pill>,
              data.candidates.filter((candidate) => candidate.JobDescriptionId === job.id).length,
              <div className="inline-actions"><button className="ghost" onClick={() => setEditingJob(job)}><Pencil /> Edit</button><button className="danger" onClick={() => deleteJob(job)}><XCircle /> Delete</button></div>
            ])} />
          </Panel>
          <Panel title="Shortlist and Schedule Interview Mail" icon={<Sparkles />}>
            <div className="form-grid two-col">
              <label>Job Description<select value={jdId} onChange={(event) => { setJdId(event.target.value); setCandidateIds([]); }}>{data.jds.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
              <label>Interview Date<input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} /></label>
            </div>
            <div className="chips">{jd?.requiredSkills?.map((skill) => <span key={skill}>{skill}</span>)}</div>
            <div className="panelist-strip">
              {data.panelists.map((panelist) => (
                <label key={panelist.id} className="check-tile">
                  <input type="checkbox" checked={panelistIds.includes(panelist.id)} onChange={() => setPanelistIds(toggleId(panelistIds, panelist.id))} />
                  <span>{panelist.name}<small>{panelist.expertise}</small></span>
                </label>
              ))}
            </div>
            <div className="inline-actions">
              <button disabled={busyAction === 'shortlist'} onClick={shortlist}>{busyAction === 'shortlist' ? <Timer /> : <Sparkles />} {busyAction === 'shortlist' ? 'Refreshing...' : 'Refresh Suitable List'}</button>
              <button disabled={busyAction === 'schedule'} onClick={schedule}>{busyAction === 'schedule' ? <Timer /> : <Send />} {busyAction === 'schedule' ? 'Sending...' : 'Send Interview Mail'}</button>
            </div>
            <div className="integration-note">Teams: {teams?.configured ? 'Microsoft Graph configured' : 'Demo Teams links'} | Calendar: Google event is created after candidate acceptance.</div>
          </Panel>
        </>
      )}
      {tab === 'candidates' && (
        <Panel title="Candidates" icon={<UsersRound />} actions={<><div className="toolbar"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, email, skill or JD" /></div><label className="toolbar-select"><Filter /> <select value={candidateJobFilter} onChange={(event) => { setCandidateJobFilter(event.target.value); setCandidateIds([]); }}><option value="all">All job descriptions</option>{data.jds.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><button onClick={() => setCandidateFormOpen(true)}><UserPlus /> Add Candidate</button></>}>
          <div className="candidate-table">
            <DataTable columns={['Select', 'Candidate', 'Job Description', 'Role', 'Experience', 'Skills', 'Status', 'Actions']} rows={visibleCandidates.map((candidate) => [
              <input type="checkbox" checked={candidateIds.includes(candidate.id)} onChange={() => setCandidateIds(toggleId(candidateIds, candidate.id))} />,
              <EmployeeCell name={candidate.name} code={candidate.email} />,
              candidate.JobDescription?.title || data.jds.find((job) => job.id === candidate.JobDescriptionId)?.title || 'Not assigned',
              candidate.roleApplied,
              `${candidate.experienceYears} years`,
              <span className="skill-tooltip" data-tooltip={(candidate.skills || []).join(', ')}>View Skills</span>,
              <Pill tone={candidate.status === 'Shortlisted' ? 'success' : 'warning'}>{candidate.status}</Pill>,
              <div className="candidate-actions">
                <button className="icon-only ghost" title="View candidate" aria-label={`View ${candidate.name}`} onClick={() => setCandidateModal(candidate)}><Eye /></button>
                <button className="icon-only ghost" title="Send test link" aria-label={`Send test link to ${candidate.name}`} disabled={busyAction === `test-${candidate.id}`} onClick={() => sendCandidateTest(candidate)}>{busyAction === `test-${candidate.id}` ? <Timer /> : <ClipboardCheck />}</button>
                <button className="icon-only" title="Approve interview" aria-label={`Approve interview for ${candidate.name}`} disabled={busyAction === `candidate-${candidate.id}-interview`} onClick={() => candidateAction(candidate, 'interview')}>{busyAction === `candidate-${candidate.id}-interview` ? <Timer /> : <CheckCircle2 />}</button>
                <button className="icon-only ghost" title="Approve document upload" aria-label={`Approve document upload for ${candidate.name}`} disabled={busyAction === `candidate-${candidate.id}-documents`} onClick={() => candidateAction(candidate, 'documents')}>{busyAction === `candidate-${candidate.id}-documents` ? <Timer /> : <FileArchive />}</button>
                <button className="icon-only ghost" title="Approve onboarding" aria-label={`Approve onboarding for ${candidate.name}`} disabled={busyAction === `candidate-${candidate.id}-onboarding`} onClick={() => candidateAction(candidate, 'onboarding')}>{busyAction === `candidate-${candidate.id}-onboarding` ? <Timer /> : <UserRound />}</button>
              </div>
            ])} />
          </div>
        </Panel>
      )}
      {tab === 'add candidate' && <CandidateForm data={data} reload={reload} notify={notify} onClose={(candidate) => { if (candidate?.JobDescriptionId) setJdId(candidate.JobDescriptionId); setCandidateJobFilter('all'); setTab('candidates'); }} embedded />}
      {tab === 'ai tests' && <CandidateTestPanel data={data} reload={reload} notify={notify} selectedIds={candidateIds} />}
      {tab === 'interviews' && <InterviewTable data={data} reload={reload} notify={notify} />}
      {tab === 'offer letters' && <OfferLetters data={data} reload={reload} notify={notify} />}
      {tab === 'lifecycle control' && <RecruitmentLifecyclePanel data={data} reload={reload} notify={notify} />}
      {tab === 'saved candidates' && <Panel title="Saved Candidates" icon={<Star />}><DataTable columns={['Candidate', 'Role', 'Email', 'Match', 'Status']} rows={data.candidates.filter((candidate) => candidate.shortlistScore >= 80).map((candidate) => [candidate.name, candidate.roleApplied, candidate.email, `${candidate.shortlistScore}%`, <Pill tone="success">{candidate.status}</Pill>])} /></Panel>}
      {tab === 'analytics' && <Analytics data={data} compact />}
      {candidateModal && <CandidateModal candidate={candidateModal} onClose={() => setCandidateModal(null)} />}
      {jobModal && <JobPostingModal data={data} reload={reload} notify={notify} onClose={() => setJobModal(false)} />}
      {editingJob && <JobPostingModal job={editingJob} data={data} reload={reload} notify={notify} onClose={() => setEditingJob(null)} />}
      {careersOpen && <CareersPreviewModal jobs={data.jds} reload={reload} notify={notify} onClose={() => setCareersOpen(false)} />}
      {candidateFormOpen && <CandidateForm data={data} reload={reload} notify={notify} onClose={(candidate) => { if (candidate?.JobDescriptionId) setJdId(candidate.JobDescriptionId); setCandidateJobFilter('all'); setCandidateFormOpen(false); }} />}
    </>
  );
}

function InterviewTable({ data, reload, notify }) {
  const accept = async (id) => {
    await api.post(`/interviews/${id}/accept`);
    await reload();
    notify('Candidate acceptance recorded and calendar status updated.');
  };
  return (
    <Panel title="Interview Running Process" icon={<CalendarDays />}>
      <DataTable columns={['Candidate', 'Panel', 'Round', 'Schedule', 'Response', 'Calendar', 'Actions']} rows={data.interviews.map((interview) => [
        interview.Candidate?.name,
        interview.Panelist?.name,
        interview.stage,
        formatDate(interview.scheduledAt),
        <Pill tone={interview.candidateResponse === 'Accepted' ? 'success' : 'warning'}>{interview.candidateResponse}</Pill>,
        interview.calendarStatus,
        <div className="inline-actions"><a className="text-action" href={interview.meetingLink} target="_blank" rel="noreferrer">Teams</a><button onClick={() => accept(interview.id)}>Accept</button></div>
      ])} />
    </Panel>
  );
}

function CandidateTestPanel({ data, reload, notify, selectedIds = [] }) {
  const [candidateId, setCandidateId] = useState(data.candidates[0]?.id || '');
  const [busyAction, setBusyAction] = useState('');
  const tests = data.candidateTests || [];
  const generateOne = async () => {
    if (!candidateId) return notify('Select a candidate first.');
    if (busyAction) return;
    setBusyAction('one');
    try {
      await api.post(`/candidates/${candidateId}/tests/generate`, { sendNow: true });
      await reload();
      notify('Unique AI assessment generated and test mail queued.');
    } catch (error) {
      await reload();
      notify(error.response?.data?.lastError || error.response?.data?.message || 'Test mail failed.');
    } finally {
      setBusyAction('');
    }
  };
  const generateBulk = async () => {
    if (busyAction) return;
    setBusyAction('bulk');
    try {
      await api.post('/candidates/tests/bulk-generate', { candidateIds: selectedIds });
      await reload();
      notify(selectedIds.length ? 'Selected candidates received test links.' : 'All candidates received test links.');
    } catch (error) {
      await reload();
      notify(error.response?.data?.lastError || error.response?.data?.message || 'Bulk test mail failed.');
    } finally {
      setBusyAction('');
    }
  };
  const submitDemo = async (test) => {
    const answers = Object.fromEntries((test.questions || []).map((question) => [question.id, question.answer || 'Strongly aligned']));
    await api.post(`/candidate-tests/${test.id}/submit`, { answers });
    await reload();
    notify('Assessment submitted and admin result mail queued.');
  };
  return (
    <section className="workbench-grid">
      <Panel title="AI Test Generation Engine" icon={<Sparkles />}>
        <div className="form-grid two-col">
          <label>Candidate<select value={candidateId} onChange={(event) => setCandidateId(event.target.value)}>{data.candidates.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name} - {candidate.roleApplied}</option>)}</select></label>
          <label>Question Mix<select><option>Beginner + Intermediate + Advanced</option><option>Project heavy</option><option>Scenario heavy</option></select></label>
        </div>
        <div className="inline-actions">
          <button disabled={busyAction === 'one'} onClick={generateOne}>{busyAction === 'one' ? <Timer /> : <Send />} {busyAction === 'one' ? 'Sending...' : 'Send Test Link'}</button>
          <button className="ghost" disabled={busyAction === 'bulk'} onClick={generateBulk}>{busyAction === 'bulk' ? <Timer /> : <UsersRound />} {busyAction === 'bulk' ? 'Sending...' : 'Send To Selected / All'}</button>
        </div>
        <div className="integration-note">Questions are generated from resume/profile skills, experience, project responsibilities, and JD skills. Admin can skip tests from the candidate action buttons.</div>
      </Panel>
      <Panel title="Assessment Reports" icon={<ClipboardCheck />}>
        <DataTable columns={['Candidate', 'Score', 'Breakdown', 'Status', 'Recommendation', 'Actions']} rows={tests.map((test) => [
          <EmployeeCell name={test.Candidate?.name || 'Candidate'} code={test.Candidate?.email || ''} />,
          `${Math.round(test.score || 0)}%`,
          Object.entries(test.skillBreakdown || {}).slice(0, 3).map(([skill, score]) => `${skill}: ${score}%`).join(' | ') || `${test.questions?.length || 0} questions`,
          <Pill tone={test.status === 'Submitted' ? 'success' : 'warning'}>{test.status}</Pill>,
          test.recommendation || 'Awaiting submission',
          <div className="inline-actions"><button className="ghost" onClick={() => submitDemo(test)}><CheckCircle2 /> Demo Submit</button></div>
        ])} />
      </Panel>
    </section>
  );
}

function RecruitmentLifecyclePanel({ data, reload, notify }) {
  const updateBgv = async (check, status) => {
    await api.patch(`/bgv/${check.id}`, { status, remarks: `${status} by HR Admin` });
    await reload();
    notify(`BGV ${status.toLowerCase()}.`);
  };
  const bgvRows = data.employees.flatMap((employee) => (employee.BgvChecks || []).map((check) => ({ ...check, employeeName: employee.name, employeeCode: employee.employeeCode })));
  const stages = ['Applied', 'Test Link Sent', 'Test Passed', 'Approved for Interview', 'Document Upload Requested', 'Offer Generated', 'Onboarding', 'Joined'];
  return (
    <>
      <Panel title="Guided Admin Decision Workflow" icon={<ShieldCheck />}>
        <DataTable columns={['Candidate', 'Current Stage', 'Next Admin Controls']} rows={data.candidates.slice(0, 12).map((candidate) => [
          <EmployeeCell name={candidate.name} code={candidate.email} />,
          <Pill tone={candidate.status?.includes('Rejected') ? 'danger' : 'warning'}>{candidate.status}</Pill>,
          <div className="inline-actions">
            {['interview', 'documents', 'onboarding', 'reject'].map((action) => <button key={action} className={action === 'reject' ? 'danger' : 'ghost'} onClick={async () => { await api.post(`/candidates/${candidate.id}/action`, { action }); await reload(); notify(`${candidate.name}: ${action} processed.`); }}>{toTitle(action)}</button>)}
          </div>
        ])} />
      </Panel>
      <section className="workbench-grid">
        <Panel title="Lifecycle Stage Coverage" icon={<BarChart3 />}>{stages.map((stage) => <UsageBar key={stage} label={stage} value={data.candidates.filter((candidate) => candidate.status === stage || candidate.status?.includes(stage)).length} />)}</Panel>
        <Panel title="BGV Approval Gate" icon={<ShieldCheck />}>
          <DataTable columns={['Employee', 'Area', 'Status', 'Actions']} rows={bgvRows.map((check) => [
            <EmployeeCell name={check.employeeName} code={check.employeeCode} />,
            check.type,
            <Pill tone={['Clear', 'Approved'].includes(check.status) ? 'success' : check.status === 'Failed' ? 'danger' : 'warning'}>{check.status}</Pill>,
            <div className="inline-actions"><button onClick={() => updateBgv(check, 'Approved')}>Approve</button><button className="danger" onClick={() => updateBgv(check, 'Failed')}>Fail</button></div>
          ])} />
        </Panel>
      </section>
    </>
  );
}

function JobPostingModal({ job, data, reload, notify, onClose }) {
  const [form, setForm] = useState({
    title: job?.title || '',
    department: job?.department || data.jds[0]?.department || 'Product Engineering',
    location: job?.location || 'Hyderabad / Remote',
    employmentType: job?.employmentType || 'Full-time',
    minExperience: job?.minExperience || 3,
    openings: job?.openings || 1,
    salaryMin: job?.salaryMin || 800000,
    salaryMax: job?.salaryMax || 1800000,
    requiredSkills: job?.requiredSkills?.join(', ') || 'React, Node.js, PostgreSQL',
    responsibilities: job?.responsibilities || 'Own product features, collaborate with teams, and deliver reliable software.',
    qualification: job?.qualification || 'B.Tech / MCA or equivalent experience.',
    reportingManager: job?.reportingManager || 'HR Admin',
    status: job?.status || 'Published',
    description: job?.description || 'A high-impact role in the Infolinx HRMS team.'
  });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      minExperience: Number(form.minExperience),
      openings: Number(form.openings),
      salaryMin: Number(form.salaryMin),
      salaryMax: Number(form.salaryMax),
      requiredSkills: form.requiredSkills.split(',').map((skill) => skill.trim()).filter(Boolean)
    };
    if (job) await api.patch(`/jds/${job.id}`, payload);
    else await api.post('/jds', payload);
    await reload();
    notify(job ? 'Job posting updated.' : 'Job posting created.');
    onClose();
  };
  return (
    <div className="modal-backdrop">
      <article className="large-modal">
        <header><h2>{job ? 'Edit Job Posting' : 'Create Job Posting'}</h2><button className="ghost" onClick={onClose}>Close</button></header>
        <form className="form-grid two-col" onSubmit={submit}>
          <label>Job Title<input required value={form.title} onChange={(event) => update('title', event.target.value)} /></label>
          <label>Department<input value={form.department} onChange={(event) => update('department', event.target.value)} /></label>
          <label>Location<input value={form.location} onChange={(event) => update('location', event.target.value)} /></label>
          <label>Employment Type<select value={form.employmentType} onChange={(event) => update('employmentType', event.target.value)}><option>Full-time</option><option>Contract</option><option>Internship</option></select></label>
          <label>Experience<input type="number" value={form.minExperience} onChange={(event) => update('minExperience', event.target.value)} /></label>
          <label>Openings<input type="number" value={form.openings} onChange={(event) => update('openings', event.target.value)} /></label>
          <label>Salary Min<input type="number" value={form.salaryMin} onChange={(event) => update('salaryMin', event.target.value)} /></label>
          <label>Salary Max<input type="number" value={form.salaryMax} onChange={(event) => update('salaryMax', event.target.value)} /></label>
          <label>Skills<input value={form.requiredSkills} onChange={(event) => update('requiredSkills', event.target.value)} /></label>
          <label>Reporting Manager<input value={form.reportingManager} onChange={(event) => update('reportingManager', event.target.value)} /></label>
          <label>Status<select value={form.status} onChange={(event) => update('status', event.target.value)}><option>Draft</option><option>Open</option><option>Closed</option></select></label>
          <label>Responsibilities<textarea value={form.responsibilities} onChange={(event) => update('responsibilities', event.target.value)} /></label>
          <label>Qualification<textarea value={form.qualification} onChange={(event) => update('qualification', event.target.value)} /></label>
          <div className="form-actions"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button><BriefcaseBusiness /> {job ? 'Update Job' : 'Create Job'}</button></div>
        </form>
      </article>
    </div>
  );
}

function CareersPreviewModal({ jobs, reload, notify, onClose }) {
  const apply = async (job) => {
    const stamp = Date.now().toString().slice(-5);
    await api.post('/candidates', {
      name: `Demo Applicant ${stamp}`,
      email: `demo.applicant.${stamp}@example.com`,
      phone: '+91 90000 00000',
      roleApplied: job.title,
      experienceYears: Number(job.minExperience || 1),
      skills: job.requiredSkills || [],
      cvUrl: `/demo-resumes/${slugify(job.title)}-${stamp}.pdf`,
      source: 'Careers Page',
      status: 'New',
      JobDescriptionId: job.id
    });
    await reload();
    notify(`Demo application captured for ${job.title}.`);
  };
  return (
    <div className="modal-backdrop">
      <article className="large-modal">
        <header><h2>Careers Page Preview</h2><button className="ghost" onClick={onClose}>Close</button></header>
        <div className="learning-card-grid compact">
          {jobs.map((job) => <article className="learning-program-card" key={job.id}><div className="learning-card-icon tone-orange"><BriefcaseBusiness /></div><h3>{job.title}</h3><p>{job.location} | {job.minExperience}+ yrs | {job.openings} openings</p><div className="chips">{job.requiredSkills?.slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}</div><button onClick={() => apply(job)}>Apply Now</button></article>)}
        </div>
      </article>
    </div>
  );
}

function OfferLetters({ data, reload, notify }) {
  const [modalMode, setModalMode] = useState(null);
  const [previewOffer, setPreviewOffer] = useState(data.offers[0] || null);
  const [fullViewOffer, setFullViewOffer] = useState(null);
  const [dispatchingId, setDispatchingId] = useState(null);
  const updateOffer = async (offer, payload, message) => {
    await api.patch(`/offers/${offer.id}`, payload);
    await reload();
    notify(message);
  };
  const exportOfferWord = (offer) => {
    downloadHtmlDocument(offer, 'doc');
    notify('Word offer letter downloaded.');
  };
  const exportOfferPdf = (offer) => {
    printOfferAsPdf(offer);
    notify('PDF export window opened. Choose Save as PDF in the print dialog.');
  };
  const dispatchOffer = async (offer) => {
    if (dispatchingId) return;
    setDispatchingId(offer.id);
    try {
      await api.post(`/offers/${offer.id}/dispatch`, { regenerateHtml: true });
      await reload();
      notify('Offer letter dispatched and recorded in Sent.');
    } catch (error) {
      await reload();
      notify(error.response?.data?.lastError || error.response?.data?.message || 'Offer dispatch failed.');
    } finally {
      setDispatchingId(null);
    }
  };
  const offers = data.offers || [];
  return (
    <>
      <section className="offers-page">
        <Panel title="Offer Letters" icon={<FileSignature />} actions={<button onClick={() => setModalMode({ type: 'create' })}><FileSignature /> Create Offer</button>}>
          <div className="offer-list">
            {offers.map((offer) => {
              const candidateName = offer.Candidate?.name || data.candidates.find((candidate) => candidate.id === offer.CandidateId)?.name || 'Candidate';
              const candidateEmail = offer.Candidate?.email || data.candidates.find((candidate) => candidate.id === offer.CandidateId)?.email || '';
              return (
                <article className="offer-list-row" key={offer.id}>
                  <button className="offer-link" onClick={() => setFullViewOffer(offer)}>
                    <span>{candidateName}</span>
                    <small>{offer.designation || 'Designation pending'} | {offer.department || 'Department pending'} | Joining {offer.joiningDate || 'Not fixed'}</small>
                    <small>{candidateEmail}</small>
                  </button>
                  <div className="offer-row-meta">
                    <Pill tone={offer.status === 'Accepted' ? 'success' : offer.status === 'Rejected' || offer.status === 'Expired' ? 'danger' : 'warning'}>{offer.status}</Pill>
                  </div>
                  <div className="inline-actions offer-row-actions">
                    <button className="ghost" onClick={() => setFullViewOffer(offer)}><Eye /> View</button>
                    <button className="ghost" onClick={() => setModalMode({ type: 'edit', offer })}><Pencil /> Edit</button>
                    <button className="ghost" onClick={() => exportOfferWord(offer)}><Download /> Word</button>
                    <button className="ghost" onClick={() => exportOfferPdf(offer)}><Download /> PDF</button>
                    <button disabled={dispatchingId === offer.id} onClick={() => dispatchOffer(offer)}>{dispatchingId === offer.id ? <Timer /> : <Send />} Dispatch</button>
                  </div>
                </article>
              );
            })}
            {!offers.length && <Empty text="No offers yet. Click Create Offer to generate the first offer letter." />}
          </div>
        </Panel>
      </section>
      {modalMode && <OfferEditorModal mode={modalMode} data={data} reload={reload} notify={notify} onClose={() => setModalMode(null)} onPreview={setPreviewOffer} />}
      {fullViewOffer && <OfferFullViewModal offer={fullViewOffer} onClose={() => setFullViewOffer(null)} onWord={() => exportOfferWord(fullViewOffer)} onPdf={() => exportOfferPdf(fullViewOffer)} onDispatch={() => dispatchOffer(fullViewOffer)} dispatching={dispatchingId === fullViewOffer.id} />}
    </>
  );
}

function offerFileName(offer, extension) {
  const candidate = offer.Candidate?.name || 'Candidate';
  return `Infolinx-Offer-${candidate}`.replace(/[^a-z0-9-]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + `.${extension}`;
}

function offerHtmlDocument(offer) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${offerFileName(offer, 'html')}</title></head><body>${offer.html || '<p>Offer letter is not generated yet.</p>'}</body></html>`;
}

function downloadHtmlDocument(offer, extension = 'doc') {
  const blob = new Blob([offerHtmlDocument(offer)], { type: extension === 'doc' ? 'application/msword' : 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = offerFileName(offer, extension);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function printOfferAsPdf(offer) {
  const win = window.open('', '_blank', 'width=980,height=820');
  if (!win) return;
  win.document.write(`${offerHtmlDocument(offer)}<script>window.onload=function(){setTimeout(function(){window.print();},300)}<\/script>`);
  win.document.close();
}

function learningPdfDocument(item) {
  const title = item.title || 'Learning Material';
  const html = item.materialHtml || `<article class="learning-pdf-sheet"><h1>${title}</h1><p>${item.textContent || 'Learning material prepared by HR Admin.'}</p></article>`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>@page{margin:18mm}body{font-family:Arial,Helvetica,sans-serif;color:#1f2937;margin:0}.learning-pdf-sheet{max-width:820px;margin:auto}.learning-pdf-sheet header{display:flex;gap:16px;align-items:center;border-bottom:3px solid #f08a00;padding-bottom:14px;margin-bottom:18px}.learning-pdf-sheet img{height:54px;object-fit:contain}.learning-pdf-sheet h1{color:#0b2f4f;margin:0;font-size:26px}.learning-pdf-sheet h2{color:#0b2f4f;margin:20px 0 8px;font-size:17px}.learning-pdf-sheet p,.learning-pdf-sheet li{font-size:13.5px;line-height:1.58}.learning-pdf-sheet li{margin-bottom:4px}.learning-pdf-sheet section{break-inside:avoid-page}.learning-pdf-sheet ul{padding-left:22px}</style></head><body>${html}</body></html>`;
}

function printLearningPdf(item) {
  const win = window.open('', '_blank', 'width=980,height=820');
  if (!win) return;
  win.document.write(`${learningPdfDocument(item)}<script>window.onload=function(){setTimeout(function(){window.print();},300)}<\/script>`);
  win.document.close();
}

function OfferFullViewModal({ offer, onClose, onWord, onPdf, onDispatch, dispatching }) {
  return (
    <div className="modal-backdrop">
      <article className="large-modal offer-full-modal">
        <header>
          <div>
            <h2>Offer Letter Full View</h2>
            <p>{offer.Candidate?.name || 'Candidate'} | {offer.designation || 'Offer'} | INR {money(offer.annualCtc)}</p>
          </div>
          <div className="inline-actions">
            <button className="ghost" onClick={onWord}><Download /> Word</button>
            <button className="ghost" onClick={onPdf}><Download /> PDF</button>
            <button disabled={dispatching} onClick={onDispatch}>{dispatching ? <Timer /> : <Send />} Dispatch</button>
            <button className="ghost" onClick={onClose}>Close</button>
          </div>
        </header>
        <div className="offer-full-scroll" dangerouslySetInnerHTML={{ __html: offer.html || '<p>Generate the offer first.</p>' }} />
      </article>
    </div>
  );
}

function OfferEditorModal({ mode, data, reload, notify, onClose, onPreview }) {
  const editing = mode.type === 'edit' ? mode.offer : null;
  const firstCandidate = data.candidates.find((candidate) => !['Rejected'].includes(candidate.status)) || data.candidates[0];
  const [candidateId, setCandidateId] = useState(editing?.CandidateId || firstCandidate?.id || '');
  const candidate = data.candidates.find((item) => String(item.id) === String(candidateId)) || editing?.Candidate || firstCandidate;
  const candidateJob = data.jds.find((job) => job.id === candidate?.JobDescriptionId);
  const [form, setForm] = useState({
    offerDate: editing?.offerDate || new Date().toISOString().slice(0, 10),
    designation: editing?.designation || candidate?.roleApplied || candidateJob?.title || 'Software Engineer',
    department: editing?.department || candidateJob?.department || 'Product Engineering',
    annualCtc: editing?.annualCtc || candidate?.expectedCtc || candidateJob?.salaryMax || 1200000,
    joiningDate: editing?.joiningDate || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    candidateAddress: editing?.candidateAddress || 'Hyderabad, Telangana, India',
    workLocation: editing?.workLocation || candidateJob?.location || 'Hyderabad, Telangana',
    bandLevel: editing?.bandLevel || 'L2',
    compensationPeriod: editing?.compensationPeriod || 'Per Annum',
    probationPeriod: editing?.probationPeriod || 'As per company policy',
    noticePeriod: editing?.noticePeriod || '30 days',
    acceptanceDueDate: editing?.acceptanceDueDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    reportingManager: editing?.reportingManager || candidateJob?.reportingManager || 'Hiring Manager',
    hrName: editing?.hrName || 'HR Admin',
    status: editing?.status || 'Draft'
  });
  useEffect(() => {
    if (editing) return;
    setForm((current) => ({
      ...current,
      designation: candidate?.roleApplied || candidateJob?.title || current.designation,
      department: candidateJob?.department || current.department,
      annualCtc: candidate?.expectedCtc || candidateJob?.salaryMax || current.annualCtc,
      workLocation: candidateJob?.location || current.workLocation,
      reportingManager: candidateJob?.reportingManager || current.reportingManager
    }));
  }, [candidateId]);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const save = async (event) => {
    event.preventDefault();
    const payload = {
      CandidateId: Number(candidateId),
      designation: form.designation,
      department: form.department,
      annualCtc: Number(form.annualCtc || 0),
      offerDate: form.offerDate,
      joiningDate: form.joiningDate,
      candidateAddress: form.candidateAddress,
      workLocation: form.workLocation,
      bandLevel: form.bandLevel,
      compensationPeriod: form.compensationPeriod,
      probationPeriod: form.probationPeriod,
      noticePeriod: form.noticePeriod,
      acceptanceDueDate: form.acceptanceDueDate,
      reportingManager: form.reportingManager,
      hrName: form.hrName,
      status: form.status,
      regenerateHtml: true
    };
    const response = editing
      ? await api.patch(`/offers/${editing.id}`, payload)
      : await api.post('/offers', payload);
    await reload();
    onPreview(response.data);
    notify(editing ? 'Offer updated and preview refreshed.' : 'Offer generated, preview ready, and offer mail queued.');
    onClose();
  };
  return (
    <div className="modal-backdrop">
      <article className="large-modal">
        <header><h2>{editing ? 'Edit Offer Letter' : 'Generate Offer Letter'}</h2><button className="ghost" onClick={onClose}>Close</button></header>
        <form className="form-grid two-col" onSubmit={save}>
          <label>Candidate Name<select value={candidateId} onChange={(event) => setCandidateId(event.target.value)} disabled={!!editing}>{data.candidates.map((item) => <option key={item.id} value={item.id}>{item.name} - {item.email}</option>)}</select></label>
          <label>Candidate Email<input value={candidate?.email || ''} readOnly /></label>
          <label>Offer Date<input required type="date" value={form.offerDate} onChange={(event) => update('offerDate', event.target.value)} /></label>
          <label>Designation<input required value={form.designation} onChange={(event) => update('designation', event.target.value)} /></label>
          <label>Department<input required value={form.department} onChange={(event) => update('department', event.target.value)} /></label>
          <label>Annual CTC<input required type="number" value={form.annualCtc} onChange={(event) => update('annualCtc', event.target.value)} /></label>
          <label>Joining Date<input required type="date" value={form.joiningDate} onChange={(event) => update('joiningDate', event.target.value)} /></label>
          <label>Acceptance Due Date<input type="date" value={form.acceptanceDueDate} onChange={(event) => update('acceptanceDueDate', event.target.value)} /></label>
          <label>Work Location<input value={form.workLocation} onChange={(event) => update('workLocation', event.target.value)} /></label>
          <label>Band / Level<input value={form.bandLevel} onChange={(event) => update('bandLevel', event.target.value)} /></label>
          <label>Compensation Period<input value={form.compensationPeriod} onChange={(event) => update('compensationPeriod', event.target.value)} /></label>
          <label>Probation Period<input value={form.probationPeriod} onChange={(event) => update('probationPeriod', event.target.value)} /></label>
          <label>Notice Period<input value={form.noticePeriod} onChange={(event) => update('noticePeriod', event.target.value)} /></label>
          <label>Reporting Manager<input value={form.reportingManager} onChange={(event) => update('reportingManager', event.target.value)} /></label>
          <label>HR Name<input value={form.hrName} onChange={(event) => update('hrName', event.target.value)} /></label>
          <label>Status<select value={form.status} onChange={(event) => update('status', event.target.value)}><option>Draft</option><option>Sent</option><option>Viewed</option><option>Accepted</option><option>Rejected</option><option>Expired</option></select></label>
          <label>Candidate Skills<input value={(candidate?.skills || []).join(', ')} readOnly /></label>
          <label className="full-span">Candidate Address<textarea rows="3" value={form.candidateAddress} onChange={(event) => update('candidateAddress', event.target.value)} /></label>
          <div className="form-actions"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button><FileSignature /> Generate Preview</button></div>
        </form>
      </article>
    </div>
  );
}

function Inbox({ data, reload, notify, session }) {
  const [recipient, setRecipient] = useState(session?.role === 'Employee' ? 'HR_ADMIN' : 'ALL_EMPLOYEES');
  const [externalEmail, setExternalEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [query, setQuery] = useState('');
  const [sending, setSending] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [sentOpen, setSentOpen] = useState(false);
  const isAdmin = session?.role !== 'Employee';
  const inboxAllowed = canUseInbox(session);
  const employeeOptions = data.employees
    .filter((employee) => employee.email && employee.status !== 'Relieved')
    .sort((a, b) => a.name.localeCompare(b.name));
  const filteredOptions = employeeOptions.filter((employee) => {
    const text = `${employee.name} ${employee.email} ${employee.employeeCode}`.toLowerCase();
    return !query || text.includes(query.toLowerCase());
  });
  const inbox = data.mails.filter(isInboundMail);
  const sent = data.mails.filter((mail) => !isInboundMail(mail));
  const openMail = selectedMail || inbox[0] || null;
  const syncInbox = async ({ quiet = false } = {}) => {
    if (syncing) return;
    setSyncing(true);
    try {
      const response = await api.post('/mail/inbox/sync');
      await reload();
      if (!quiet) notify(`Inbox synced. ${response.data.created || 0} new, ${response.data.updated || 0} updated.`);
    } catch (error) {
      if (!quiet) notify(error.response?.data?.message || 'Inbox sync failed.');
    } finally {
      setSyncing(false);
    }
  };
  useEffect(() => {
    if (inboxAllowed) syncInbox({ quiet: true });
  }, [inboxAllowed]);
  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 5);
    const encoded = await Promise.all(files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
        size: file.size,
        content: String(reader.result).split(',')[1],
        encoding: 'base64'
      });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })));
    setAttachments(encoded);
  };
  const send = async (event) => {
    event.preventDefault();
    if (!inboxAllowed) return notify('Inbox is available only for admins and active @infolinx.com users.');
    if (sending) return;
    const selectedRecipient = recipient === 'EXTERNAL_EMAIL' ? externalEmail.trim() : recipient;
    const sender = data.integrations?.email?.from || 'Info@infolinx.com';
    setSending(true);
    try {
      await api.post('/mail/send', {
        to: selectedRecipient,
        subject,
        body,
        attachments,
        from: sender
      });
      setSubject('');
      setBody('');
      setExternalEmail('');
      setAttachments([]);
      await reload();
      notify(selectedRecipient === 'ALL_EMPLOYEES' ? 'Message sent to all employees.' : 'Message sent to selected recipient.');
      setComposeOpen(false);
    } catch (error) {
      await reload();
      notify(error.response?.data?.lastError || error.response?.data?.message || 'Email sending failed.');
    } finally {
      setSending(false);
    }
  };
  if (!inboxAllowed) {
    return <Panel title="Inbox" icon={<Mail />}><Empty text="Inbox is available only for admins and active @infolinx.com users." /></Panel>;
  }
  return (
    <>
      <section className="mail-page">
        <div className="mail-page-toolbar">
          <div>
            <h2>Inbox</h2>
            <p>{inbox.length} received | {sent.length} sent</p>
          </div>
          <div className="inline-actions">
            <button onClick={() => setComposeOpen(true)}><Send /> Compose</button>
            <button className="ghost" onClick={() => setSentOpen(true)}><Mail /> Sent</button>
            <button className="ghost" disabled={syncing} onClick={() => syncInbox()}>{syncing ? <Timer /> : <RefreshCw />} {syncing ? 'Syncing...' : 'Sync Inbox'}</button>
          </div>
        </div>
        <div className="mail-reader-layout">
          <aside className="mail-list-panel">
            {inbox.length ? inbox.map((mail) => <MailCard key={mail.id} mail={mail} active={openMail?.id === mail.id} onOpen={setSelectedMail} />) : <Empty text="No inbox messages yet." />}
          </aside>
          <main className="mail-reading-panel">
            {openMail ? <MailReadingPane mail={openMail} /> : <Empty text="Select an email to read." />}
          </main>
        </div>
      </section>
      {composeOpen && (
        <ComposeMailModal
          attachments={attachments}
          body={body}
          externalEmail={externalEmail}
          filteredOptions={filteredOptions}
          handleFiles={handleFiles}
          isAdmin={isAdmin}
          query={query}
          recipient={recipient}
          send={send}
          sending={sending}
          setBody={setBody}
          setComposeOpen={setComposeOpen}
          setExternalEmail={setExternalEmail}
          setQuery={setQuery}
          setRecipient={setRecipient}
          setSubject={setSubject}
          subject={subject}
        />
      )}
      {sentOpen && <SentItemsModal mails={sent} onClose={() => setSentOpen(false)} />}
    </>
  );
}

function CreateLearningProgramModal({ course, reload, notify, onClose }) {
  const [form, setForm] = useState({
    title: course?.title || '',
    category: course?.category || 'Technical',
    audience: course?.audience || 'All Employees',
    durationMinutes: course?.durationMinutes || 30,
    status: course?.status || 'Published',
    textContent: course?.textContent || '',
    materialHtml: course?.materialHtml || '',
    pdfFileName: course?.pdfFileName || ''
  });
  const [generating, setGenerating] = useState(false);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const autoGenerate = async () => {
    if (!form.title.trim()) return notify('Enter a program title before auto generating content.');
    setGenerating(true);
    try {
      const response = await api.post('/learning-courses/auto-generate', {
        title: form.title,
        category: form.category,
        audience: form.audience,
        durationMinutes: Number(form.durationMinutes || 30)
      });
      setForm((current) => ({ ...current, ...response.data }));
      notify('PDF learning content and assessment questions generated.');
    } catch (error) {
      notify(error.response?.data?.message || 'Auto generation failed.');
    } finally {
      setGenerating(false);
    }
  };
  const save = async (event) => {
    event.preventDefault();
    const payload = { ...form, videoUrl: null, durationMinutes: Number(form.durationMinutes || 0), autoGenerate: !form.materialHtml };
    if (course) await api.patch(`/learning-courses/${course.id}`, payload);
    else await api.post('/learning-courses', payload);
    await reload();
    notify(course ? 'Learning program updated.' : 'Learning program created and published.');
    onClose();
  };
  return (
    <div className="modal-backdrop">
      <article className="large-modal program-modal">
        <header><h2>{course ? 'Edit Learning Program' : 'Create Learning Program'}</h2><button className="ghost" onClick={onClose}>Close</button></header>
        <form onSubmit={save}>
          <div className="form-grid two-col">
            <label>Program Title<input required value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="Program title" /></label>
            <label>Category<select value={form.category} onChange={(event) => update('category', event.target.value)}><option>Compliance</option><option>Technical</option><option>HR Operations</option><option>Leadership</option><option>Recruitment</option></select></label>
            <label>Audience<select value={form.audience} onChange={(event) => update('audience', event.target.value)}><option>All Employees</option><option>New Hires</option><option>Managers and Panelists</option><option>Product Engineering</option><option>HR Team</option></select></label>
            <label>Duration Minutes<input type="number" value={form.durationMinutes} onChange={(event) => update('durationMinutes', event.target.value)} /></label>
            <label>PDF File Name<input value={form.pdfFileName} onChange={(event) => update('pdfFileName', event.target.value)} placeholder="auto-generated after content creation" /></label>
            <label>Status<select value={form.status} onChange={(event) => update('status', event.target.value)}><option>Published</option><option>Draft</option><option>Archived</option></select></label>
          </div>
          <label>Text Content / Prerequisites / Learning Outcome<textarea value={form.textContent} onChange={(event) => update('textContent', event.target.value)} placeholder="Text content / prerequisites / learning outcome" /></label>
          {form.materialHtml && <div className="learning-material-preview" dangerouslySetInnerHTML={{ __html: form.materialHtml }} />}
          <div className="inline-actions"><button type="button" className="ghost" disabled={generating} onClick={autoGenerate}>{generating ? <Timer /> : <Sparkles />} {generating ? 'Generating...' : 'Auto Generate PDF Content'}</button>{form.materialHtml && <button type="button" className="ghost" onClick={() => printLearningPdf(form)}><Download /> PDF Preview</button>}<button><CheckCircle2 /> {course ? 'Update Program' : 'Create Program'}</button></div>
        </form>
      </article>
    </div>
  );
}

function LearningPlayerModal({ course, onStartTest, onClose }) {
  return (
    <div className="modal-backdrop">
      <article className="large-modal learning-player-modal">
        <header><div><h2>{course.title}</h2><p>{course.category} | {course.audience}</p></div><button className="ghost" onClick={onClose}>Close</button></header>
        <div className="learning-player-grid">
          <div className="learning-material-preview large" dangerouslySetInnerHTML={{ __html: course.materialHtml || `<article class="learning-pdf-sheet"><h1>${course.title}</h1><p>${course.textContent || 'Learning material is being prepared.'}</p></article>` }} />
          <section className="learning-summary">
            <h3>PDF Learning Material</h3>
            <p>{course.textContent}</p>
            <Mini label="Duration" value={`${course.durationMinutes} mins`} />
            <Mini label="Audience" value={course.audience} />
            <button className="ghost" onClick={() => printLearningPdf(course)}><Download /> Download / Save PDF</button>
          </section>
        </div>
        <footer><button onClick={onStartTest}><ClipboardCheck /> Start Self Test</button></footer>
      </article>
    </div>
  );
}

function AssessmentModal({ course, answers, setAnswers, result, onSubmit, onClose }) {
  const generatedQuestions = buildAssessmentQuestions(course);
  const setAnswer = (id, value) => setAnswers((current) => ({ ...current, [id]: value }));
  const toggleMulti = (id, option) => {
    const current = answers[id] || [];
    setAnswer(id, current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
  };
  return (
    <div className="modal-backdrop locked">
      <article className="large-modal assessment-modal">
        <header>
          <div>
            <h2>{course.title} - Self Assessment</h2>
            <p>Complete the test in this focused window. Results are stored for admin review and shown immediately.</p>
          </div>
          <button className="ghost" onClick={onClose}>Close Test</button>
        </header>
        <section className="assessment-board">
          {generatedQuestions.map((question, index) => (
            <article className="question-card" key={question.id}>
              <strong>{index + 1}. {question.question}</strong>
              {question.type === 'select' && (
                <select value={answers[question.id] || ''} onChange={(event) => setAnswer(question.id, event.target.value)}>
                  <option value="">Select answer</option>
                  {question.options.map((option) => <option key={option}>{option}</option>)}
                </select>
              )}
              {question.type === 'checkbox' && (
                <div className="choice-grid">
                  {question.options.map((option) => <label key={option}><input type="checkbox" checked={(answers[question.id] || []).includes(option)} onChange={() => toggleMulti(question.id, option)} /> {option}</label>)}
                </div>
              )}
              {question.type === 'textarea' && <textarea value={answers[question.id] || ''} onChange={(event) => setAnswer(question.id, event.target.value)} placeholder="Write your explanation with examples." />}
              {question.type === 'coding' && <textarea className="code-answer" value={answers[question.id] || ''} onChange={(event) => setAnswer(question.id, event.target.value)} placeholder="// Write your code or pseudocode here" />}
            </article>
          ))}
        </section>
        {result && <div className="assessment-result"><strong>Result: {result.status}</strong><span>Score: {result.score}%</span><p>Your result has been sent to HR Admin for learning review.</p></div>}
        <footer><button className="ghost" onClick={onClose}>Close Test</button><button onClick={onSubmit}><CheckCircle2 /> Submit Assessment</button></footer>
      </article>
    </div>
  );
}

function Documents({ data, reload, notify }) {
  const [tab, setTab] = useState('pending approvals');
  const [preview, setPreview] = useState(null);
  const tasks = data.employees.flatMap((employee) => (employee.OnboardingTasks || []).map((task) => ({ ...task, employeeName: employee.name, employeeCode: employee.employeeCode })));
  const approve = async (id) => {
    await api.patch(`/onboarding/${id}`, { status: 'Verified' });
    await reload();
    setPreview(null);
    notify('Document approved.');
  };
  const decline = async (id) => {
    await api.patch(`/onboarding/${id}/decline`, { reason: 'Document not clear. Please re-upload.' });
    await reload();
    setPreview(null);
    notify('Document declined and mail queued.');
  };
  return (
    <>
      <TabBar active={tab} setActive={setTab} tabs={['pending approvals', 'generate for employee', 'document history', 'document templates']} />
      {tab === 'pending approvals' && (
        <Panel title="Documents Pending Approval" icon={<ClipboardCheck />} actions={<button className="ghost"><Download /> Export</button>}>
          <DataTable columns={['Employee', 'Document', 'Type', 'Status', 'Actions']} rows={tasks.map((task) => [
            <EmployeeCell name={task.employeeName} code={task.employeeCode} />,
            <button className="text-action" onClick={() => setPreview(task)}>{task.title}</button>,
            task.category,
            <Pill tone={task.status === 'Verified' ? 'success' : task.status === 'Declined' ? 'danger' : 'warning'}>{task.status}</Pill>,
            <div className="inline-actions"><button className="ghost" onClick={() => setPreview(task)}><Eye /></button><button onClick={() => approve(task.id)}><CheckCircle2 /></button><button className="danger" onClick={() => decline(task.id)}><XCircle /></button></div>
          ])} />
        </Panel>
      )}
      {tab === 'generate for employee' && <TemplateGenerator data={data} />}
      {tab === 'document history' && <HistoryTable title="Generated Document History" rows={tasks.map((task) => [task.employeeName, task.title, task.status, task.updatedAt ? formatDate(task.updatedAt) : 'Demo'])} />}
      {tab === 'document templates' && <TemplateLibrary />}
      {preview && <DocumentPreview task={preview} onClose={() => setPreview(null)} onApprove={() => approve(preview.id)} onDecline={() => decline(preview.id)} />}
    </>
  );
}

function OfferWelcome({ data, reload, notify, embedded = false }) {
  const [candidateId, setCandidateId] = useState(data.candidates[0]?.id || '');
  const [busyAction, setBusyAction] = useState('');
  const [fullViewOffer, setFullViewOffer] = useState(null);
  const candidate = data.candidates.find((item) => String(item.id) === String(candidateId));
  const offer = data.offers.find((item) => item.CandidateId === Number(candidateId));
  const [offerForm, setOfferForm] = useState({
    offerDate: new Date().toISOString().slice(0, 10),
    designation: candidate?.roleApplied || 'Software Engineer',
    joiningDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    acceptanceDueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    annualCtc: candidate?.expectedCtc || 1200000,
    department: data.jds.find((job) => job.id === candidate?.JobDescriptionId)?.department || 'Product Engineering',
    candidateAddress: 'Hyderabad, Telangana, India',
    workLocation: data.jds.find((job) => job.id === candidate?.JobDescriptionId)?.location || 'Hyderabad, Telangana',
    bandLevel: 'L2',
    probationPeriod: 'As per company policy',
    noticePeriod: '30 days',
    reportingManager: data.jds.find((job) => job.id === candidate?.JobDescriptionId)?.reportingManager || 'Hiring Manager',
    hrName: 'HR Admin'
  });
  useEffect(() => {
    const job = data.jds.find((item) => item.id === candidate?.JobDescriptionId);
    setOfferForm((current) => ({
      ...current,
      designation: candidate?.roleApplied || current.designation,
      annualCtc: candidate?.expectedCtc || current.annualCtc,
      department: job?.department || current.department,
      workLocation: job?.location || current.workLocation,
      reportingManager: job?.reportingManager || current.reportingManager
    }));
  }, [candidateId]);
  const updateOffer = (key, value) => setOfferForm((current) => ({ ...current, [key]: value }));
  const createOffer = async () => {
    if (!candidateId) return notify('Select candidate first.');
    if (busyAction) return;
    setBusyAction('offer');
    try {
      await api.post('/offers', {
        CandidateId: candidateId,
        designation: offerForm.designation,
        annualCtc: Number(offerForm.annualCtc || 0),
        offerDate: offerForm.offerDate,
        joiningDate: offerForm.joiningDate,
        acceptanceDueDate: offerForm.acceptanceDueDate,
        department: offerForm.department,
        candidateAddress: offerForm.candidateAddress,
        workLocation: offerForm.workLocation,
        bandLevel: offerForm.bandLevel,
        probationPeriod: offerForm.probationPeriod,
        noticePeriod: offerForm.noticePeriod,
        reportingManager: offerForm.reportingManager,
        hrName: offerForm.hrName
      });
      await reload();
      notify('HTML offer generated and offer mail queued.');
    } catch (error) {
      await reload();
      notify(error.response?.data?.lastError || error.response?.data?.message || 'Offer generation failed.');
    } finally {
      setBusyAction('');
    }
  };
  const welcome = async () => {
    if (!offer) return notify('Generate offer first.');
    if (busyAction) return;
    setBusyAction('welcome');
    try {
      await api.post(`/offers/${offer.id}/welcome`);
      await reload();
      notify('Welcome mail queued.');
    } catch (error) {
      await reload();
      notify(error.response?.data?.lastError || error.response?.data?.message || 'Welcome mail failed.');
    } finally {
      setBusyAction('');
    }
  };
  const dispatchOffer = async () => {
    if (!offer) return notify('Generate offer first.');
    if (busyAction) return;
    setBusyAction('dispatch');
    try {
      await api.post(`/offers/${offer.id}/dispatch`, { regenerateHtml: true });
      await reload();
      notify('Offer letter dispatched and recorded in Sent.');
    } catch (error) {
      await reload();
      notify(error.response?.data?.lastError || error.response?.data?.message || 'Offer dispatch failed.');
    } finally {
      setBusyAction('');
    }
  };
  return (
    <>
      <section className={embedded ? 'workbench-grid' : 'workbench-grid'}>
        <Panel title="Offer Letter Workflow" icon={<FileSignature />}>
          <div className="form-grid two-col">
            <label>Candidate<select value={candidateId} onChange={(event) => setCandidateId(event.target.value)}>{data.candidates.map((item) => <option key={item.id} value={item.id}>{item.name} - {item.status}</option>)}</select></label>
            <label>Offer Date<input type="date" value={offerForm.offerDate} onChange={(event) => updateOffer('offerDate', event.target.value)} /></label>
            <label>Designation<input value={offerForm.designation} onChange={(event) => updateOffer('designation', event.target.value)} /></label>
            <label>Joining Date<input type="date" value={offerForm.joiningDate} onChange={(event) => updateOffer('joiningDate', event.target.value)} /></label>
            <label>Acceptance Due Date<input type="date" value={offerForm.acceptanceDueDate} onChange={(event) => updateOffer('acceptanceDueDate', event.target.value)} /></label>
            <label>Annual CTC<input type="number" value={offerForm.annualCtc} onChange={(event) => updateOffer('annualCtc', event.target.value)} /></label>
            <label>Department<input value={offerForm.department} onChange={(event) => updateOffer('department', event.target.value)} /></label>
            <label>Work Location<input value={offerForm.workLocation} onChange={(event) => updateOffer('workLocation', event.target.value)} /></label>
            <label>Band / Level<input value={offerForm.bandLevel} onChange={(event) => updateOffer('bandLevel', event.target.value)} /></label>
            <label>Reporting Manager<input value={offerForm.reportingManager} onChange={(event) => updateOffer('reportingManager', event.target.value)} /></label>
            <label>Notice Period<input value={offerForm.noticePeriod} onChange={(event) => updateOffer('noticePeriod', event.target.value)} /></label>
            <label>Probation Period<input value={offerForm.probationPeriod} onChange={(event) => updateOffer('probationPeriod', event.target.value)} /></label>
            <label>HR Name<input value={offerForm.hrName} onChange={(event) => updateOffer('hrName', event.target.value)} /></label>
            <label className="full-span">Candidate Address<textarea rows="3" value={offerForm.candidateAddress} onChange={(event) => updateOffer('candidateAddress', event.target.value)} /></label>
          </div>
          <div className="inline-actions">
            <button disabled={busyAction === 'offer'} onClick={createOffer}>{busyAction === 'offer' ? <Timer /> : <FileSignature />} {busyAction === 'offer' ? 'Generating...' : 'Generate Offer'}</button>
            <button disabled={busyAction === 'welcome'} onClick={welcome}>{busyAction === 'welcome' ? <Timer /> : <Mail />} {busyAction === 'welcome' ? 'Sending...' : 'Welcome Mail'}</button>
          </div>
          <Mini label="Offer status" value={offer?.status || 'Not generated'} />
          <Mini label="Candidate" value={candidate?.name || 'Select candidate'} />
        </Panel>
        <Panel title="HTML Offer Preview" icon={<Eye />} actions={offer && <div className="inline-actions"><button className="ghost" onClick={() => setFullViewOffer(offer)}><Eye /> Full View</button><button className="ghost" onClick={() => downloadHtmlDocument(offer, 'doc')}><Download /> Word</button><button className="ghost" onClick={() => printOfferAsPdf(offer)}><Download /> PDF</button><button disabled={busyAction === 'dispatch'} onClick={dispatchOffer}>{busyAction === 'dispatch' ? <Timer /> : <Send />} Dispatch</button></div>}>{offer ? <div className="offer-preview" dangerouslySetInnerHTML={{ __html: offer.html }} /> : <Empty text="Offer preview will appear after generation." />}</Panel>
      </section>
      {fullViewOffer && <OfferFullViewModal offer={fullViewOffer} onClose={() => setFullViewOffer(null)} onWord={() => downloadHtmlDocument(fullViewOffer, 'doc')} onPdf={() => printOfferAsPdf(fullViewOffer)} onDispatch={dispatchOffer} dispatching={busyAction === 'dispatch'} />}
    </>
  );
}

function Employees({ data, reload, notify, initialTab = 'all employees' }) {
  const [tab, setTab] = useState(initialTab);
  const [editingEmployee, setEditingEmployee] = useState(null);
  useEffect(() => setTab(initialTab), [initialTab]);
  const deleteEmployee = async (employee) => {
    if (!window.confirm(`Delete employee record for ${employee.name}?`)) return;
    await api.delete(`/employees/${employee.id}`);
    await reload();
    notify('Employee deleted.');
  };
  return (
    <>
      <TabBar active={tab} setActive={setTab} tabs={['all employees', 'add employees', 'employee history', 'access management', 'promotion management', 'employee self onboarding', 'employee edit approvals', 'data migration']} />
      {tab === 'all employees' && (
        <Panel title={`All Employees (${data.employees.length})`} icon={<UsersRound />}>
          <div className="filter-card"><input placeholder="Search by name, email, phone" /><select><option>Department</option></select><select><option>Designation</option></select></div>
          <DataTable columns={['Employee', 'Contact', 'Department', 'Designation', 'Manager', 'Status', 'Actions']} rows={data.employees.map((employee) => [
            <EmployeeCell name={employee.name} code={employee.employeeCode} />,
            employee.email,
            employee.department,
            employee.designation,
            employee.manager,
            <Pill tone={employee.status === 'Active' ? 'success' : 'warning'}>{employee.status}</Pill>,
            <div className="inline-actions">
              <button className="ghost" onClick={() => setEditingEmployee(employee)}><Pencil /> Edit</button>
              <button className="danger" onClick={() => deleteEmployee(employee)}><XCircle /> Delete</button>
            </div>
          ])} />
        </Panel>
      )}
      {tab === 'add employees' && <EmployeeForm data={data} reload={reload} notify={notify} onDone={() => setTab('all employees')} />}
      {tab === 'employee history' && <HistoryTable title="Employee History Overview" rows={data.employees.map((employee, index) => [employee.name, employee.department, index + 1, 'Salary Structure', employee.manager])} columns={['Employee', 'Department', 'Total Changes', 'Last Change Type', 'Changed By']} />}
      {tab === 'data migration' && <MigrationPanel data={data} reload={reload} notify={notify} />}
      {tab !== 'all employees' && tab !== 'add employees' && tab !== 'employee history' && tab !== 'data migration' && <AdminPlaceholder title={tab} data={data} reload={reload} notify={notify} />}
      {editingEmployee && (
        <div className="modal-backdrop">
          <article className="large-modal employee-modal">
            <header>
              <div>
                <h2>Edit Employee</h2>
                <p>Update the employee master data used across attendance, leave and payroll.</p>
              </div>
              <button className="ghost" onClick={() => setEditingEmployee(null)}>Close</button>
            </header>
            <EmployeeForm employee={editingEmployee} data={data} reload={reload} notify={notify} onDone={() => setEditingEmployee(null)} compact />
          </article>
        </div>
      )}
    </>
  );
}

function EmployeeForm({ employee, data, reload, notify, onDone, compact = false }) {
  const departments = unique([...data.employees.map((item) => item.department), ...data.jds.map((jd) => jd.department)]);
  const managers = unique(data.employees.map((item) => item.name));
  const [form, setForm] = useState({
    employeeCode: employee?.employeeCode || `EMP${String(Date.now()).slice(-4)}`,
    name: employee?.name || '',
    email: employee?.email || '',
    department: employee?.department || departments[0] || 'Product Engineering',
    designation: employee?.designation || '',
    joiningDate: employee?.joiningDate || new Date().toISOString().slice(0, 10),
    manager: employee?.manager || managers[0] || 'HR Admin',
    salaryAnnual: employee?.salaryAnnual || 0,
    status: employee?.status || 'Active',
    leaveBalance: employee?.leaveBalance ?? 24,
    createPortalAccess: !employee
  });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      salaryAnnual: Number(form.salaryAnnual || 0),
      leaveBalance: Number(form.leaveBalance || 0)
    };
    if (employee) await api.patch(`/employees/${employee.id}`, payload);
    else await api.post('/employees', payload);
    await reload();
    notify(employee ? 'Employee updated.' : 'Employee created.');
    onDone?.();
  };
  return (
    <Panel title={employee ? 'Employee Master Form' : 'Add Employee'} icon={<UserRound />}>
      <form className={`form-grid two-col employee-form ${compact ? 'compact' : ''}`} onSubmit={submit}>
        <label>Employee ID<input required value={form.employeeCode} onChange={(event) => update('employeeCode', event.target.value)} /></label>
        <label>Full Name<input required value={form.name} onChange={(event) => update('name', event.target.value)} /></label>
        <label>Email<input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} /></label>
        <label>Department<input list="department-options" required value={form.department} onChange={(event) => update('department', event.target.value)} /></label>
        <label>Designation<input required value={form.designation} onChange={(event) => update('designation', event.target.value)} /></label>
        <label>Joining Date<input type="date" required value={form.joiningDate} onChange={(event) => update('joiningDate', event.target.value)} /></label>
        <label>Manager<input list="manager-options" value={form.manager} onChange={(event) => update('manager', event.target.value)} /></label>
        <label>Annual Salary<input type="number" min="0" value={form.salaryAnnual} onChange={(event) => update('salaryAnnual', event.target.value)} /></label>
        <label>Status<select value={form.status} onChange={(event) => update('status', event.target.value)}><option>Active</option><option>Probation</option><option>Confirmed</option><option>Notice Period</option><option>Relieved</option><option>Terminated</option></select></label>
        <label>Leave Balance<input type="number" min="0" value={form.leaveBalance} onChange={(event) => update('leaveBalance', event.target.value)} /></label>
        {!employee && <label className="check-tile"><input type="checkbox" checked={form.createPortalAccess} onChange={(event) => update('createPortalAccess', event.target.checked)} /> Create employee portal login and queue welcome credentials</label>}
        <div className="form-actions">
          <button type="button" className="ghost" onClick={onDone}>Cancel</button>
          <button><CheckCircle2 /> {employee ? 'Update Employee' : 'Create Employee'}</button>
        </div>
        <datalist id="department-options">{departments.map((department) => <option key={department} value={department} />)}</datalist>
        <datalist id="manager-options">{managers.map((manager) => <option key={manager} value={manager} />)}</datalist>
      </form>
    </Panel>
  );
}

function CandidateForm({ data, onClose, reload, notify, embedded = false }) {
  const jds = data.jds || [];
  const linkedinPrefix = 'www.linkedin.com/in/';
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    currentCompany: '',
    currentCtc: 0,
    expectedCtc: 0,
    noticePeriod: '',
    linkedin: '',
    github: '',
    roleApplied: '',
    experienceYears: 0,
    skills: '',
    source: '',
    status: 'In Library',
    shortlistScore: 0,
    notes: '',
    JobDescriptionId: jds[0]?.id || '',
    resume: null
  });
  const [uploading, setUploading] = useState(false);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateLinkedin = (value) => {
    const profile = value
      .replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, '')
      .replace(/^www\.linkedin\.com\/in\//i, '')
      .replace(/^linkedin\.com\/in\//i, '')
      .replace(/^\/+/, '');
    update('linkedin', profile);
  };
  const handleResume = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const payload = new FormData();
      payload.append('resume', file);
      const response = await api.post('/upload', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      update('resume', response.data.url);
      notify('Resume uploaded.');
    } catch (error) {
      notify(error.response?.data?.message || 'Resume upload failed.');
    } finally {
      setUploading(false);
    }
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!form.resume) return notify('Resume upload is required.');
    const payload = {
      ...form,
      currentCtc: Number(form.currentCtc || 0),
      expectedCtc: Number(form.expectedCtc || 0),
      experienceYears: Number(form.experienceYears || 0),
      shortlistScore: Number(form.shortlistScore || 0),
      JobDescriptionId: form.JobDescriptionId ? Number(form.JobDescriptionId) : null,
      linkedin: form.linkedin ? `${linkedinPrefix}${form.linkedin.replace(/^\/+|\/+$/g, '')}` : '',
      skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      cvUrl: form.resume
    };
    const response = await api.post('/candidates', payload);
    await reload();
    notify('Candidate created.');
    onClose(response.data);
  };
  const formBody = (
    <form className="form-grid two-col candidate-form" onSubmit={submit}>
          <label>Full Name <input required value={form.name} onChange={(event) => update('name', event.target.value)} /></label>
          <label>Email <input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} /></label>
          <label>Phone <input value={form.phone} onChange={(event) => update('phone', event.target.value)} /></label>
          <label>Current Company <input value={form.currentCompany} onChange={(event) => update('currentCompany', event.target.value)} /></label>
          <label>Current CTC <input type="number" min="0" value={form.currentCtc} onChange={(event) => update('currentCtc', event.target.value)} /></label>
          <label>Expected CTC <input type="number" min="0" value={form.expectedCtc} onChange={(event) => update('expectedCtc', event.target.value)} /></label>
          <label>Notice Period <input value={form.noticePeriod} onChange={(event) => update('noticePeriod', event.target.value)} placeholder="e.g. 30 days" /></label>
          <label>LinkedIn <span className="prefixed-input"><span>{linkedinPrefix}</span><input value={form.linkedin} onChange={(event) => updateLinkedin(event.target.value)} placeholder="profile-name" /></span></label>
          <label>GitHub <input value={form.github} onChange={(event) => update('github', event.target.value)} /></label>
          <label>Role Applied <input required value={form.roleApplied} onChange={(event) => update('roleApplied', event.target.value)} /></label>
          <label>Experience (years) <input type="number" min="0" step="0.1" value={form.experienceYears} onChange={(event) => update('experienceYears', event.target.value)} /></label>
          <label>Skills (comma separated) <input value={form.skills} onChange={(event) => update('skills', event.target.value)} placeholder="React, Node.js, SQL" /></label>
          <label>Source <input value={form.source} onChange={(event) => update('source', event.target.value)} placeholder="LinkedIn, Referral, Naukri" /></label>
          <label>Status <select value={form.status} onChange={(event) => update('status', event.target.value)}><option>In Library</option><option>New</option><option>Screened</option><option>Shortlisted</option><option>Interview Scheduled</option><option>Offer Generated</option><option>Onboarding</option><option>Joined</option><option>Rejected</option></select></label>
          <label>Job Description <select value={form.JobDescriptionId} onChange={(event) => update('JobDescriptionId', event.target.value)}>{jds.map((jd) => <option key={jd.id} value={jd.id}>{jd.title}</option>)}</select></label>
          <label className="full-span">Resume (PDF / DOC) <input required type="file" accept=".pdf,.doc,.docx" onChange={handleResume} /> {uploading && <small>Uploading...</small>} {form.resume && <small className="success">Uploaded</small>}</label>
          <label className="full-span">Notes <textarea value={form.notes} onChange={(event) => update('notes', event.target.value)} /></label>
          <div className="form-actions"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button disabled={uploading}><UserPlus /> Create Candidate</button></div>
        </form>
  );
  if (embedded) {
    return <Panel title="Add Candidate" icon={<UserPlus />}>{formBody}</Panel>;
  }
  return (
    <div className="modal-backdrop">
      <article className="large-modal">
        <header><h2>Add Candidate</h2><button className="ghost" onClick={onClose}>Close</button></header>
        {formBody}
      </article>
    </div>
  );
}

function Organisation({ data }) {
  const [legendOpen, setLegendOpen] = useState(true);
  const [orgZoom, setOrgZoom] = useState(46);
  const [orgCollapsed, setOrgCollapsed] = useState(false);
  const departments = unique([...data.employees.map((employee) => employee.department), ...data.jds.map((jd) => jd.department)]);
  const orgPeople = [
    { name: 'Kumar', role: 'HR Admin', department: 'Administration', initials: 'KU' },
    { name: 'Sai Kiran Reddy', role: 'Senior React Engineer', department: 'Information Technology', initials: 'SK' },
    { name: 'Priya Menon', role: 'Frontend Architect', department: 'Information Technology', initials: 'PM' },
    { name: 'Rohan Iyer', role: 'Backend Lead', department: 'Information Technology', initials: 'RI' },
    { name: 'Sara Thomas', role: 'HR Business Partner', department: 'Human Resources', initials: 'ST' },
    { name: 'Lakshmi Narayana', role: 'Payroll Officer', department: 'Finance & Accounts', initials: 'LN' },
    { name: 'Kavya Reddy', role: 'DevOps Engineer', department: 'Cloud Operations', initials: 'KR' },
    { name: 'Lahari Naidu', role: 'Product Designer', department: 'Design', initials: 'LN' }
  ];
  return (
    <>
      <section className="org-hero">
        <div><h2>Organisation tree</h2><p>{orgPeople.length + data.employees.length} employees · {departments.length} departments · 3 levels</p></div>
        <div className="org-tools">
          <div className="toolbar"><Search /><input placeholder="Search by name or role" /></div>
          <div className="segmented"><button className="active">Tree</button><button>List</button><button>Grid</button></div>
          <button className="ghost"><Filter /> Filter</button>
          <button className="ghost"><Download /> Export</button>
        </div>
      </section>
      <section className="org-canvas">
        <div className="org-controls">
          <button className="ghost" onClick={() => setOrgZoom((value) => Math.min(100, value + 8))}>+</button>
          <button className="ghost" onClick={() => setOrgZoom((value) => Math.max(34, value - 8))}>-</button>
          <button className="ghost" onClick={() => setOrgZoom(46)}>{orgZoom}%</button>
          <button className="text-action" onClick={() => setOrgCollapsed(true)}>Collapse all</button>
          <button className="text-action" onClick={() => setOrgCollapsed(false)}>Expand all</button>
        </div>
        <div className={`org-tree ${orgCollapsed ? 'collapsed' : ''}`} style={{ '--org-scale': orgZoom / 46 }}>
          <div className="org-level root"><OrgNode person={orgPeople[0]} tone="admin" /></div>
          {!orgCollapsed && (
            <>
              <div className="org-connect vertical" />
              <div className="org-level managers">
                {orgPeople.slice(1, 6).map((person) => <OrgNode key={person.name} person={person} />)}
              </div>
              <div className="org-connect horizontal" />
              <div className="org-level team">
                {orgPeople.slice(6).map((person) => <OrgNode key={person.name} person={person} />)}
                {data.employees.map((employee) => <OrgNode key={employee.id} person={{ name: employee.name, role: employee.designation, department: employee.department, initials: initials(employee.name) }} />)}
              </div>
            </>
          )}
        </div>
        {legendOpen && (
          <aside className="department-legend">
            <header><h3>Departments</h3><button className="icon-only ghost" onClick={() => setLegendOpen(false)} aria-label="Close departments legend"><XCircle /></button></header>
            {departments.map((department, index) => <span key={department}><i style={{ background: departmentColor(index) }} /> {department}</span>)}
          </aside>
        )}
        {!legendOpen && <button className="legend-toggle ghost" onClick={() => setLegendOpen(true)}><Building2 /> Departments</button>}
      </section>
      <section className="workbench-grid">
        <Panel title="Department Master" icon={<Building2 />}>{departments.map((department) => <Mini key={department} label={department} value="Active" />)}</Panel>
        <Panel title="Roles and Policies" icon={<ShieldCheck />}>{['Super Admin', 'HR Admin', 'Recruiter', 'Payroll Admin', 'Manager', 'Employee', 'Panelist'].map((role) => <Mini key={role} label={role} value="Configured" />)}</Panel>
      </section>
    </>
  );
}

function OrgNode({ person, tone = '' }) {
  return (
    <article className={`org-node ${tone}`}>
      <span>{person.initials}</span>
      <strong>{person.name}</strong>
      <small>{person.role}</small>
      <em>{person.department}</em>
    </article>
  );
}

function OrganisationSubmodule({ active, data, reload, notify }) {
  const [departmentModal, setDepartmentModal] = useState(null);
  const [viewDepartment, setViewDepartment] = useState(null);
  const [genericModal, setGenericModal] = useState(null);
  const departmentRecords = data.departments?.length
    ? data.departments
    : unique([...data.employees.map((employee) => employee.department), ...data.jds.map((jd) => jd.department)]).map((name) => ({ name, status: 'Active' }));
  const departments = departmentRecords.map((department) => department.name);
  const deleteDepartment = async (department) => {
    if (!department.id) return notify('This department is derived from employee/JD data. Create it in master first to manage it.');
    if (!window.confirm(`Delete department "${department.name}"?`)) return;
    await api.delete(`/departments/${department.id}`);
    await reload();
    notify('Department deleted.');
  };
  if (active === 'org-roles') return <RoleAccessManagement data={data} />;
  if (active === 'org-department') {
    return (
      <>
        <Panel title="Department" icon={<Building2 />} actions={<button onClick={() => setDepartmentModal({})}><FileArchive /> Add New</button>}>
          <DataTable columns={['Department', 'Code', 'Head', 'Location', 'Employees', 'Status', 'Actions']} rows={departmentRecords.map((department) => [
            department.name,
            department.code || '-',
            department.head || 'HR Admin',
            department.location || 'Hyderabad',
            data.employees.filter((employee) => employee.department === department.name).length,
            <Pill tone={department.status === 'Active' ? 'success' : 'warning'}>{department.status || 'Active'}</Pill>,
            <div className="inline-actions">
              <button className="ghost" onClick={() => setViewDepartment(department)}><Eye /> View</button>
              <button className="ghost" onClick={() => setDepartmentModal(department)}><Pencil /> Edit</button>
              <button className="danger" onClick={() => deleteDepartment(department)}><XCircle /> Delete</button>
            </div>
          ])} />
        </Panel>
        {viewDepartment && <DepartmentViewModal department={viewDepartment} employeeCount={data.employees.filter((employee) => employee.department === viewDepartment.name).length} onClose={() => setViewDepartment(null)} />}
        {departmentModal && <DepartmentModal department={departmentModal.id ? departmentModal : null} reload={reload} notify={notify} onClose={() => setDepartmentModal(null)} />}
      </>
    );
  }
  if (active === 'org-designation') {
    return <MasterRecordPanel title="Designation" module="designation" data={data} reload={reload} notify={notify} icon={<BriefcaseBusiness />} columns={['Designation', 'Category', 'Code', 'Owner', 'Status', 'Description', 'Actions']} />;
  }
  if (active === 'org-policies') {
    return <MasterRecordPanel title="Company Policies" module="company-policy" data={data} reload={reload} notify={notify} icon={<ClipboardCheck />} columns={['Policy', 'Category', 'Code', 'Owner', 'Status', 'Description', 'Actions']} />;
  }
  const config = {
  }[active];
  const [title, Icon, rows, columns] = config;
  return (
    <>
      <Panel title={title} icon={<Icon />} actions={<button onClick={() => setGenericModal(title)}><FileArchive /> Add New</button>}><DataTable columns={columns} rows={rows} /></Panel>
      {genericModal && <SimpleMasterModal title={genericModal} onClose={() => setGenericModal(null)} onSave={() => { notify(`${genericModal} sample saved.`); setGenericModal(null); }} />}
    </>
  );
}

function DepartmentViewModal({ department, employeeCount, onClose }) {
  return (
    <div className="modal-backdrop">
      <article className="large-modal action-modal">
        <header><h2>{department.name}</h2><button className="ghost" onClick={onClose}>Close</button></header>
        <div className="details-grid">
          <Mini label="Department Name" value={department.name} />
          <Mini label="Department Code" value={department.code || '-'} />
          <Mini label="Department Head" value={department.head || 'HR Admin'} />
          <Mini label="Location" value={department.location || 'Hyderabad'} />
          <Mini label="Employees" value={`${employeeCount} employees`} />
          <Mini label="Status" value={department.status || 'Active'} />
        </div>
        <div className="document-sheet">
          <h3>Description</h3>
          <p>{department.description || 'Department master record used for employee master, organisation tree, hiring and reporting filters.'}</p>
        </div>
      </article>
    </div>
  );
}

function MasterRecordPanel({ title, module, data, reload, notify, icon, columns }) {
  const [editing, setEditing] = useState(null);
  const records = (data.masterRecords || []).filter((record) => record.module === module);
  const deleteRecord = async (record) => {
    if (!window.confirm(`Delete "${record.name}"?`)) return;
    await api.delete(`/master-records/${record.id}`);
    await reload();
    notify(`${title} record deleted.`);
  };
  const rows = records.map((record) => [
    record.name,
    record.category || '-',
    record.code || '-',
    record.owner || 'HR Admin',
    <Pill tone={record.status === 'Active' || record.status === 'Published' || record.status === 'Completed' ? 'success' : 'warning'}>{record.status}</Pill>,
    record.description || record.metadata?.location || '-',
    <div className="inline-actions">
      <button className="ghost" onClick={() => setEditing({ ...record, mode: 'view' })}><Eye /> View</button>
      <button className="ghost" onClick={() => setEditing(record)}><Pencil /> Edit</button>
      <button className="danger" onClick={() => deleteRecord(record)}><XCircle /> Delete</button>
    </div>
  ]);
  return (
    <>
      <Panel title={title} icon={icon} actions={<button onClick={() => setEditing({ module })}><FileArchive /> Add New</button>}>
        <DataTable columns={columns || ['Name', 'Category', 'Code', 'Owner', 'Status', 'Description', 'Actions']} rows={rows} />
      </Panel>
      {editing && <MasterRecordModal title={title} module={module} record={editing.id ? editing : null} readOnly={editing.mode === 'view'} reload={reload} notify={notify} onClose={() => setEditing(null)} />}
    </>
  );
}

function MasterRecordModal({ title, module, record, readOnly, reload, notify, onClose }) {
  const [form, setForm] = useState({
    module,
    name: record?.name || '',
    code: record?.code || '',
    category: record?.category || '',
    owner: record?.owner || 'HR Admin',
    status: record?.status || 'Active',
    amount: record?.amount || '',
    effectiveDate: record?.effectiveDate || '',
    dueDate: record?.dueDate || '',
    description: record?.description || '',
    metadata: record?.metadata || {}
  });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form, amount: form.amount === '' ? null : Number(form.amount) };
    if (record) await api.patch(`/master-records/${record.id}`, payload);
    else await api.post('/master-records', payload);
    await reload();
    notify(record ? `${title} record updated.` : `${title} record created.`);
    onClose();
  };
  return (
    <div className="modal-backdrop">
      <article className="large-modal action-modal">
        <header><h2>{readOnly ? 'View' : record ? 'Edit' : 'Add'} {title}</h2><button className="ghost" onClick={onClose}>Close</button></header>
        {readOnly ? (
          <div className="details-grid">
            <Mini label="Name" value={form.name} />
            <Mini label="Code" value={form.code || '-'} />
            <Mini label="Category" value={form.category || '-'} />
            <Mini label="Owner" value={form.owner || '-'} />
            <Mini label="Status" value={form.status || '-'} />
            <Mini label="Description" value={form.description || '-'} />
          </div>
        ) : (
          <form className="form-grid two-col" onSubmit={submit}>
            <label>Name<input required value={form.name} onChange={(event) => update('name', event.target.value)} /></label>
            <label>Code<input value={form.code} onChange={(event) => update('code', event.target.value)} /></label>
            <label>Category<input value={form.category} onChange={(event) => update('category', event.target.value)} /></label>
            <label>Owner<input value={form.owner} onChange={(event) => update('owner', event.target.value)} /></label>
            <label>Status<select value={form.status} onChange={(event) => update('status', event.target.value)}><option>Active</option><option>Inactive</option><option>Draft</option><option>Published</option><option>Completed</option><option>Overdue</option></select></label>
            <label>Amount<input type="number" value={form.amount} onChange={(event) => update('amount', event.target.value)} /></label>
            <label>Effective Date<input type="date" value={form.effectiveDate || ''} onChange={(event) => update('effectiveDate', event.target.value)} /></label>
            <label>Due Date<input type="date" value={form.dueDate || ''} onChange={(event) => update('dueDate', event.target.value)} /></label>
            <label>Description<textarea value={form.description} onChange={(event) => update('description', event.target.value)} /></label>
            <div className="form-actions"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button><CheckCircle2 /> Save</button></div>
          </form>
        )}
      </article>
    </div>
  );
}

function SimpleMasterModal({ title, onSave, onClose }) {
  return (
    <div className="modal-backdrop">
      <article className="large-modal action-modal">
        <header><h2>Add {title}</h2><button className="ghost" onClick={onClose}>Close</button></header>
        <form className="form-grid two-col" onSubmit={(event) => { event.preventDefault(); onSave(); }}>
          <label>Name<input required placeholder={`${title} name`} /></label>
          <label>Code<input placeholder="Code" /></label>
          <label>Status<select defaultValue="Active"><option>Active</option><option>Inactive</option><option>Draft</option></select></label>
          <label>Owner<input defaultValue="HR Admin" /></label>
          <label>Description<textarea placeholder="Description / notes" /></label>
          <div className="form-actions"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button><CheckCircle2 /> Save</button></div>
        </form>
      </article>
    </div>
  );
}

function DepartmentModal({ department, reload, notify, onClose }) {
  const [form, setForm] = useState({
    name: department?.name || '',
    code: department?.code || '',
    head: department?.head || 'HR Admin',
    location: department?.location || 'Hyderabad',
    status: department?.status || 'Active',
    description: department?.description || ''
  });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    if (department) await api.patch(`/departments/${department.id}`, form);
    else await api.post('/departments', form);
    await reload();
    notify(department ? 'Department updated.' : 'Department created.');
    onClose();
  };
  return (
    <div className="modal-backdrop">
      <article className="large-modal">
        <header><h2>{department ? 'Edit Department' : 'Add Department'}</h2><button className="ghost" onClick={onClose}>Close</button></header>
        <form className="form-grid two-col" onSubmit={submit}>
          <label>Department Name<input required value={form.name} onChange={(event) => update('name', event.target.value)} /></label>
          <label>Code<input value={form.code} onChange={(event) => update('code', event.target.value)} /></label>
          <label>Department Head<input value={form.head} onChange={(event) => update('head', event.target.value)} /></label>
          <label>Location<input value={form.location} onChange={(event) => update('location', event.target.value)} /></label>
          <label>Status<select value={form.status} onChange={(event) => update('status', event.target.value)}><option>Active</option><option>Inactive</option></select></label>
          <label>Description<textarea value={form.description} onChange={(event) => update('description', event.target.value)} /></label>
          <div className="form-actions"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button><CheckCircle2 /> {department ? 'Update Department' : 'Create Department'}</button></div>
        </form>
      </article>
    </div>
  );
}

function RoleAccessManagement({ data }) {
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policyAccess, setPolicyAccess] = useState(rolePolicies);
  const [showEmployeeLogin, setShowEmployeeLogin] = useState(false);
  const employee = data.employees[0];
  const activePolicy = selectedPolicy || 'Employee Policy';
  const enabled = new Set(policyAccess[activePolicy] || []);
  const togglePermission = (route) => {
    setPolicyAccess((current) => {
      const currentSet = new Set(current[activePolicy] || []);
      if (currentSet.has(route)) currentSet.delete(route);
      else currentSet.add(route);
      return { ...current, [activePolicy]: [...currentSet] };
    });
  };
  const roleRows = Object.entries(policyAccess).map(([policy, routes]) => {
    const isEmployee = policy === 'Employee Policy';
    return [
      <strong>{policy.replace(' Policy', '')}</strong>,
      <Pill tone={isEmployee ? 'blue' : 'success'}>Enabled</Pill>,
      `${routes.length} modules`,
      primaryAccessSummary(policy, routes),
      <div className="inline-actions">
        <button className="ghost" onClick={() => setSelectedPolicy(policy)}><Eye /> Manage access</button>
        {isEmployee && <button className="ghost" onClick={() => setShowEmployeeLogin(true)}><UserRound /> Test login</button>}
      </div>
    ];
  });
  return (
    <section className="role-access-page">
      <header className="role-access-hero">
        <div>
          <h2>Roles</h2>
          <p>Manage role policies without crowding the screen. Detailed permissions open in a focused popup.</p>
        </div>
        <button><ShieldCheck /> Save Policy</button>
      </header>
      <section className="role-summary-grid">
        <Stat label="Configured Roles" value={Object.keys(policyAccess).length} detail="active access policies" icon={<ShieldCheck />} />
        <Stat label="Employee Access" value={policyAccess['Employee Policy'].length} detail="self-service modules" icon={<UserRound />} />
        <Stat label="Total Forms" value={permissionForms.length} detail="permission-controlled screens" icon={<Grid2X2 />} />
        <Stat label="Access Review" value="Role Wise" detail="open a role to review permissions" icon={<Eye />} />
      </section>
      <Panel title="Role Access Policies" icon={<ShieldCheck />} actions={<button className="ghost"><Download /> Export Access</button>}>
        <DataTable columns={['Role', 'Status', 'Access', 'Primary Scope', 'Actions']} rows={roleRows} />
      </Panel>
      {selectedPolicy && (
        <div className="modal-backdrop">
          <article className="large-modal role-modal">
            <header>
              <div>
                <h2>{selectedPolicy} Permissions</h2>
                <p>Select the forms and modules this role can use.</p>
              </div>
              <button className="ghost" onClick={() => setSelectedPolicy(null)}>Close</button>
            </header>
            <DataTable columns={['Enable', 'Form / Module', 'Access Scope', 'Industry Practice']} rows={permissionForms.map(([route, label, scope]) => [
              <input type="checkbox" checked={enabled.has(route)} onChange={() => togglePermission(route)} />,
              label,
              scope,
              recommendedAccessFor(selectedPolicy, route)
            ])} />
            <footer>
              <span>{enabled.size} of {permissionForms.length} permissions enabled</span>
              <button onClick={() => setSelectedPolicy(null)}><ShieldCheck /> Save & Close</button>
            </footer>
          </article>
        </div>
      )}
      {showEmployeeLogin && (
        <div className="modal-backdrop">
          <article className="large-modal role-modal compact">
            <header>
              <div>
                <h2>Employee Login for Testing</h2>
                <p>Use this sample employee to verify the Employee Policy experience.</p>
              </div>
              <button className="ghost" onClick={() => setShowEmployeeLogin(false)}>Close</button>
            </header>
            <ProfileGrid employee={employee} />
            <div className="credential-card">
              <strong>Employee Portal Login</strong>
              <Mini label="Employee ID" value={employee?.employeeCode || 'EMP1001'} />
              <Mini label="Username" value={employee?.email || 'sai.kiran.reddy@company.com'} />
              <Mini label="Password" value="SaiK@1001" />
              <p>Login with this user to see the dashboard filtered by Employee Policy.</p>
            </div>
            <h3>Employee Policy Includes</h3>
            <div className="allowed-list">
              {policyAccess['Employee Policy'].map((route) => <Pill key={route} tone="blue">{permissionForms.find(([id]) => id === route)?.[1] || route}</Pill>)}
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

function Attendance({ data, reload, notify, activeRoute = 'attendance', session }) {
  const activeTab = ({
    attendance: 'mark attendance',
    'attendance-daily': 'mark attendance',
    'attendance-reports': 'attendance reports',
    'attendance-monthly': 'monthly attendance report',
    'attendance-settings': 'attendance settings',
    'attendance-shift': 'shift management',
    'attendance-regularisation': 'regularisation',
    'attendance-devices': 'biometric devices'
  })[activeRoute] || 'mark attendance';
  const employee = employeeForSession(data, session) || data.employees[0];
  const employeeScoped = session?.role === 'Employee';
  const records = (employeeScoped && employee
    ? (employee.AttendanceRecords || []).map((record) => ({ ...record, employeeName: employee.name }))
    : data.employees.flatMap((item) => (item.AttendanceRecords || []).map((record) => ({ ...record, employeeName: item.name }))));
  const today = new Date().toISOString().slice(0, 10);
  const employeeRecords = employee?.AttendanceRecords || [];
  const todayRecord = employeeRecords.find((record) => record.date === today);
  const clock = async (type, payload) => {
    if (!employee) return notify('No employee profile found.');
    await api.post(`/attendance/${type}`, { EmployeeId: employee.id, date: today, ...payload });
    await reload();
    notify(type === 'clock-in' ? 'Clock in recorded.' : 'Clock out recorded.');
  };
  return (
    <>
      <TabBar active={activeTab} setActive={() => {}} tabs={['mark attendance', 'attendance reports', 'monthly attendance report', 'attendance settings', 'shift management', 'regularisation', 'biometric devices']} />
      {activeTab === 'biometric devices' && <MasterRecordPanel title="Biometric Device Management" module="biometric-device" data={data} reload={reload} notify={notify} icon={<Timer />} columns={['Device', 'Type', 'Serial Number', 'Location', 'Status', 'Last Sync', 'Actions']} />}
      {activeTab === 'mark attendance' && <MarkAttendancePanel employee={employee} today={today} todayRecord={todayRecord} records={employeeRecords} onClock={clock} />}
      {activeTab === 'attendance reports' && <AttendanceReportPanel records={records} />}
      {activeTab === 'monthly attendance report' && <MonthlyAttendancePanel data={data} />}
      {activeTab === 'attendance settings' && <MasterRecordPanel title="Attendance Settings" module="attendance-settings" data={data} reload={reload} notify={notify} icon={<Settings />} />}
      {activeTab === 'shift management' && <MasterRecordPanel title="Shift Management" module="attendance-shift" data={data} reload={reload} notify={notify} icon={<Timer />} />}
      {activeTab === 'regularisation' && <AttendanceRegularisationPanel data={data} reload={reload} notify={notify} />}
    </>
  );
}

function AttendanceRegularisationPanel({ data, reload, notify }) {
  const records = (data.masterRecords || []).filter((record) => record.module === 'attendance-regularisation');
  const updateStatus = async (record, status) => {
    await api.patch(`/master-records/${record.id}`, { status });
    await reload();
    notify(`Regularisation ${status.toLowerCase()}.`);
  };
  return (
    <>
      <section className="workbench-grid">
        <Panel title="What Regularisation Means" icon={<ClipboardCheck />}>
          <p className="helper-copy">Employees use attendance regularisation to request corrections for missed punches, late arrival approvals, wrong work mode, incorrect location, or clock-in/clock-out mistakes. HR or the reporting manager reviews the request before it affects attendance and payroll.</p>
        </Panel>
        <Panel title="Common Request Types" icon={<Timer />}>
          {['Missed Clock In', 'Missed Clock Out', 'Late Arrival', 'Work Mode Correction', 'Wrong Location'].map((item) => <Mini key={item} label={item} value="Employee request + manager approval" />)}
        </Panel>
      </section>
      <Panel title="Attendance Regularisation Requests" icon={<ClipboardCheck />} actions={<button><FileArchive /> Add New</button>}>
        <DataTable columns={['Employee', 'Date', 'Issue', 'Actual', 'Requested Correction', 'Reason', 'Approver', 'Status', 'Actions']} rows={records.map((record) => [
          <EmployeeCell name={record.metadata?.employeeName || record.name} code={record.metadata?.employeeCode || record.code} />,
          record.effectiveDate || '-',
          record.category,
          record.metadata?.actual || '-',
          record.metadata?.requested || '-',
          record.metadata?.reason || record.description || '-',
          record.metadata?.approver || record.owner || 'HR Admin',
          <Pill tone={record.status === 'Approved' ? 'success' : record.status === 'Rejected' ? 'danger' : 'warning'}>{record.status}</Pill>,
          <div className="inline-actions"><button onClick={() => updateStatus(record, 'Approved')}>Approve</button><button className="danger" onClick={() => updateStatus(record, 'Rejected')}>Reject</button></div>
        ])} />
      </Panel>
    </>
  );
}

function MarkAttendancePanel({ employee, today, todayRecord, records, onClock }) {
  const [location, setLocation] = useState('Hyderabad Office');
  const [workMode, setWorkMode] = useState('Office');
  const [remarks, setRemarks] = useState('Marked from HRMS portal');
  const presentDays = records.filter((record) => ['Present', 'Half Day', 'Late'].includes(record.status)).length;
  const lateDays = records.filter((record) => record.status === 'Late').length;
  const absentDays = Math.max(0, 30 - presentDays);
  const totalHours = records.reduce((sum, record) => sum + Number(record.totalHours || 0), 0);
  const attendanceRate = records.length ? Math.round((presentDays / records.length) * 100) : 0;
  const canClockIn = !todayRecord?.checkIn;
  const canClockOut = todayRecord?.checkIn && !todayRecord?.checkOut;
  return (
    <>
      <section className="attendance-layout">
        <Panel title="Mark Attendance" icon={<Timer />}>
          <div className="attendance-hero-card">
            <EmployeeCell name={employee?.name || 'Employee'} code={employee?.employeeCode || 'EMP'} />
            <p>{todayRecord?.checkIn ? `Clocked in at ${todayRecord.checkIn}` : 'No attendance record for today'}</p>
            <div className="form-grid two-col">
              <label>Work Mode<select value={workMode} onChange={(event) => setWorkMode(event.target.value)}><option>Office</option><option>Remote</option><option>Hybrid</option><option>Client Location</option></select></label>
              <label>Location<input value={location} onChange={(event) => setLocation(event.target.value)} /></label>
              <label>Remarks<textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} /></label>
            </div>
            <div className="attendance-actions">
              <button disabled={!canClockIn} onClick={() => onClock('clock-in', { location, workMode, remarks })}><Timer /> Clock In</button>
              <button className="ghost" disabled={!canClockOut} onClick={() => onClock('clock-out', { location, remarks })}><CheckCircle2 /> Clock Out</button>
            </div>
          </div>
        </Panel>
        <section className="attendance-metrics">
          <Stat label="Attendance Rate" value={`${attendanceRate}%`} detail="current records" icon={<BarChart3 />} />
          <Stat label="Total Hours" value={`${totalHours.toFixed(1)}h`} detail="recorded work" icon={<Timer />} />
          <Stat label="Present Days" value={presentDays} detail="this cycle" icon={<CheckCircle2 />} />
          <Stat label="Late Days" value={lateDays} detail="exceptions" icon={<Bell />} />
          <Stat label="Absent Days" value={absentDays} detail="estimated month" icon={<XCircle />} />
        </section>
      </section>
      <Panel title={`Recent Attendance History (${new Date().toLocaleString('en-IN', { month: 'short', year: 'numeric' })})`} icon={<Timer />}>
        <DataTable columns={['Date', 'Clock In', 'Clock Out', 'Total Hours', 'Status', 'Clock In Location', 'Clock Out Location', 'Remarks']} rows={records.map((record) => [
          record.date,
          record.checkIn || '-',
          record.checkOut || '-',
          `${Number(record.totalHours || 0).toFixed(1)}h`,
          <Pill tone={record.status === 'Present' ? 'success' : 'warning'}>{record.status}</Pill>,
          record.clockInLocation || record.workMode || '-',
          record.clockOutLocation || '-',
          record.remarks || '-'
        ])} />
      </Panel>
    </>
  );
}

function AttendanceReportPanel({ records }) {
  return (
    <Panel title="Attendance Reports" icon={<BarChart3 />}>
      <DataTable columns={['Employee', 'Date', 'Check In', 'Check Out', 'Total Hours', 'Status', 'Mode']} rows={records.map((record) => [
        record.employeeName,
        record.date,
        record.checkIn || '-',
        record.checkOut || '-',
        `${Number(record.totalHours || 0).toFixed(1)}h`,
        <Pill tone={record.status === 'Present' ? 'success' : 'warning'}>{record.status}</Pill>,
        record.workMode
      ])} />
    </Panel>
  );
}

function MonthlyAttendancePanel({ data }) {
  const rows = data.employees.map((employee) => {
    const records = employee.AttendanceRecords || [];
    const present = records.filter((record) => ['Present', 'Half Day', 'Late'].includes(record.status)).length;
    const hours = records.reduce((sum, record) => sum + Number(record.totalHours || 0), 0);
    return [employee.name, employee.department, present, Math.max(0, 30 - present), `${hours.toFixed(1)}h`, <Pill tone="success">Generated</Pill>];
  });
  return <Panel title="Monthly Attendance Report" icon={<BarChart3 />}><DataTable columns={['Employee', 'Department', 'Present Days', 'Absent Days', 'Total Hours', 'Status']} rows={rows} /></Panel>;
}

function Leave({ data, reload, notify, activeRoute = 'leave' }) {
  const routeTab = ({
    leave: 'leave requests',
    'leave-balance': 'leave balance',
    'leave-policies': 'leave policies',
    'leave-holidays': 'holiday list',
    'leave-apply': 'apply for leave',
    'leave-ot': 'ot to leave report'
  })[activeRoute] || 'leave requests';
  const [tab, setTab] = useState(routeTab);
  useEffect(() => setTab(routeTab), [routeTab]);
  const updateLeave = async (id, status) => {
    await api.patch(`/leaves/${id}`, { status });
    await reload();
    notify(`Leave ${status.toLowerCase()}.`);
  };
  const leaves = data.employees.flatMap((employee) => (employee.LeaveRequests || []).map((leave) => ({ ...leave, employeeName: employee.name })));
  return (
    <>
      <TabBar active={tab} setActive={setTab} tabs={['leave requests', 'leave balance', 'leave policies', 'holiday list', 'apply for leave']} />
      {tab === 'leave requests' && <Panel title="Leave Requests" icon={<CalendarDays />}><DataTable columns={['Employee', 'Type', 'Dates', 'Days', 'Status', 'Actions']} rows={leaves.map((leave) => [leave.employeeName, leave.type, `${leave.startDate} to ${leave.endDate}`, leave.days, <Pill tone="warning">{leave.status}</Pill>, <div className="inline-actions"><button onClick={() => updateLeave(leave.id, 'Approved')}>Approve</button><button className="ghost" onClick={() => updateLeave(leave.id, 'Rejected')}>Reject</button></div>])} /></Panel>}
      {tab === 'holiday list' && <HolidayPanel data={data} reload={reload} notify={notify} />}
      {tab !== 'leave requests' && tab !== 'holiday list' && <AdminPlaceholder title={tab} data={data} reload={reload} notify={notify} />}
    </>
  );
}

function Payroll({ data, reload, notify, activeRoute = 'payroll' }) {
  const [previewRun, setPreviewRun] = useState(null);
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const routeTab = ({
    payroll: 'dashboard',
    ...payrollRouteTabs,
    'payroll-reports': 'payroll reports',
    'payroll-compliance': 'compliance',
    'payroll-form16': 'form 16',
    'payroll-access': 'employee access management',
    'payroll-tax': 'tax calculations',
    'payroll-pt': 'professional tax',
    'payroll-labour': 'labour welfare fund'
  })[activeRoute] || 'dashboard';
  const employees = data.employees.filter((employee) => {
    const haystack = [employee.name, employee.employeeCode, employee.email, employee.department, employee.designation].join(' ').toLowerCase();
    return !query || haystack.includes(query.toLowerCase());
  });
  const runs = data.employees.flatMap((employee) => (employee.PayrollRuns || []).map((run) => ({ ...run, employeeName: employee.name, employeeCode: employee.employeeCode, department: employee.department, designation: employee.designation })));
  const visibleRuns = runs.filter((run) => {
    const haystack = [run.employeeName, run.employeeCode, run.month, run.status, run.department].join(' ').toLowerCase();
    return !query || haystack.includes(query.toLowerCase());
  });
  const latestRunFor = (employee) => [...(employee.PayrollRuns || [])].sort((a, b) => String(b.month || '').localeCompare(String(a.month || '')))[0];
  const processPayroll = async (employeeId) => {
    await api.post('/payroll/run', { EmployeeId: employeeId, month });
    await reload();
    notify(employeeId ? 'Employee payroll generated.' : 'Payroll generated for all active employees.');
  };
  const creditRun = async (run) => {
    await api.patch(`/payroll/${run.id}/credit`);
    await reload();
    notify(`${run.employeeName || 'Employee'} salary credited.`);
  };
  const exportPayroll = () => {
    const rows = [['Month', 'Employee Code', 'Employee', 'Department', 'Gross', 'Deductions', 'Reimbursements', 'Net Pay', 'Status'], ...visibleRuns.map((run) => [run.month, run.employeeCode, run.employeeName, run.department, run.grossPay, run.deductions, run.reimbursements, run.netPay, run.status])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `payroll-export-${month}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    notify('Payroll CSV exported.');
  };
  return (
    <>
      <TabBar active={routeTab} setActive={() => {}} tabs={['dashboard', 'salary structures', 'payroll processing', 'payslips', 'deductions', 'benefits', 'payroll reports', 'compliance', 'form 16', 'tax calculations']} />
      <section className="stat-grid">
        <Stat label="Employees" value={data.employees.length} detail="payroll enabled" icon={<UsersRound />} />
        <Stat label="Monthly Gross" value={`INR ${money(runs.reduce((sum, run) => sum + Number(run.grossPay || 0), 0))}`} detail="latest processed" icon={<BadgeIndianRupee />} />
        <Stat label="Net Pay" value={`INR ${money(runs.reduce((sum, run) => sum + Number(run.netPay || 0), 0))}`} detail="salary credit file" icon={<Download />} />
        <Stat label="Payslips" value={runs.length} detail="preview/download ready" icon={<FileSignature />} />
      </section>
      <Panel title="Admin Payroll Center" icon={<BadgeIndianRupee />} actions={<div className="toolbar"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employee, code, department or payroll month" /><input className="short-select" type="month" value={month} onChange={(event) => setMonth(event.target.value)} /><button onClick={() => processPayroll()}><ReceiptIndianRupee /> Generate All</button><button className="ghost" onClick={exportPayroll}><Download /> Export</button></div>}>
        {['dashboard', 'payroll processing', 'salary structures'].includes(routeTab) && (
          <DataTable columns={['Employee', 'Department', 'Annual CTC', 'Latest Payroll', 'Net Pay', 'Status', 'Actions']} rows={employees.map((employee) => {
            const latest = latestRunFor(employee);
            return [
              <EmployeeCell name={employee.name} code={`${employee.employeeCode} | ${employee.email}`} />,
              `${employee.department || '-'} | ${employee.designation || '-'}`,
              `INR ${money(employee.salaryAnnual)}`,
              latest?.month || 'Not generated',
              latest ? `INR ${money(latest.netPay)}` : 'INR 0',
              <Pill tone={latest?.status === 'Credited' ? 'success' : latest ? 'warning' : 'neutral'}>{latest?.status || 'Pending'}</Pill>,
              <div className="inline-actions"><button className="ghost" onClick={() => processPayroll(employee.id)}><ReceiptIndianRupee /> Generate</button>{latest && <button className="ghost" onClick={() => setPreviewRun({ ...latest, employeeName: employee.name })}><Eye /> Payslip</button>}{latest && latest.status !== 'Credited' && <button onClick={() => creditRun({ ...latest, employeeName: employee.name })}><CheckCircle2 /> Credit</button>}</div>
            ];
          })} />
        )}
        {routeTab === 'payslips' && (
          <DataTable columns={['Month/Year', 'Employee', 'Gross', 'Deductions', 'Net Pay', 'Status', 'Actions']} rows={visibleRuns.map((run) => [run.month, <EmployeeCell name={run.employeeName} code={run.employeeCode} />, `INR ${money(run.grossPay)}`, `INR ${money(run.deductions)}`, `INR ${money(run.netPay)}`, <Pill tone={run.status === 'Credited' ? 'success' : 'warning'}>{run.status}</Pill>, <div className="inline-actions"><button className="ghost" onClick={() => setPreviewRun(run)}><Eye /> Preview</button><button className="ghost" onClick={() => setPreviewRun(run)}><Download /> Download</button></div>])} />
        )}
        {routeTab === 'deductions' && (
          <DataTable columns={['Employee', 'Month', 'PF', 'Professional Tax', 'TDS', 'Total']} rows={visibleRuns.map((run) => [<EmployeeCell name={run.employeeName} code={run.employeeCode} />, run.month, `INR ${money(Math.round(Number(run.deductions || 0) * .45))}`, `INR ${money(Math.round(Number(run.deductions || 0) * .1))}`, `INR ${money(Math.round(Number(run.deductions || 0) * .45))}`, `INR ${money(run.deductions)}`])} />
        )}
        {routeTab === 'benefits' && (
          <DataTable columns={['Employee', 'Month', 'Reimbursements', 'Benefits Status']} rows={visibleRuns.map((run) => [<EmployeeCell name={run.employeeName} code={run.employeeCode} />, run.month, `INR ${money(run.reimbursements)}`, <Pill tone={Number(run.reimbursements || 0) ? 'success' : 'neutral'}>{Number(run.reimbursements || 0) ? 'Included' : 'No claim'}</Pill>])} />
        )}
        {['payroll reports', 'compliance', 'form 16', 'tax calculations', 'professional tax', 'labour welfare fund', 'employee access management'].includes(routeTab) && (
          <DataTable columns={['Month/Year', 'Employee', 'Gross', 'Deductions', 'Net Pay', 'Status', 'Actions']} rows={visibleRuns.map((run) => [run.month, <EmployeeCell name={run.employeeName} code={run.employeeCode} />, `INR ${money(run.grossPay)}`, `INR ${money(run.deductions)}`, `INR ${money(run.netPay)}`, <Pill tone={run.status === 'Credited' ? 'success' : 'warning'}>{run.status}</Pill>, <div className="inline-actions"><button className="ghost" onClick={() => setPreviewRun(run)}><Eye /> View</button><button className="ghost" onClick={exportPayroll}><Download /> Export</button></div>])} />
        )}
      </Panel>
      {previewRun && <PayslipModal run={previewRun} employee={data.employees.find((item) => item.id === previewRun.EmployeeId)} onClose={() => setPreviewRun(null)} />}
    </>
  );
}

function Expenses({ data, reload, notify }) {
  const updateExpense = async (id, status) => {
    await api.patch(`/expenses/${id}`, { status });
    await reload();
    notify(`Expense marked ${status}.`);
  };
  const claims = data.employees.flatMap((employee) => (employee.ExpenseClaims || []).map((claim) => ({ ...claim, employeeName: employee.name })));
  return (
    <Panel title="Reimbursement Approvals" icon={<ReceiptIndianRupee />}>
      <DataTable columns={['Employee', 'Category', 'Amount', 'Spent On', 'Status', 'Actions']} rows={claims.map((claim) => [claim.employeeName, claim.category, `INR ${money(claim.amount)}`, claim.spentOn, <Pill tone="warning">{claim.status}</Pill>, <div className="inline-actions"><button onClick={() => updateExpense(claim.id, 'Approved')}>Approve</button><button className="ghost" onClick={() => updateExpense(claim.id, 'Rejected')}>Reject</button></div>])} />
    </Panel>
  );
}

function Incentives({ data }) {
  return (
    <section className="workbench-grid">
      <Panel title="Create Sales Target" icon={<Star />}>
        <div className="form-grid two-col"><input placeholder="Employee email" /><select><option>Plan</option></select><input placeholder="Period start" /><input placeholder="Target value (INR)" defaultValue="100000" /></div>
        <button>Create</button>
      </Panel>
      <Panel title="My Incentives" icon={<Star />}>{data.employees.map((employee) => <Mini key={employee.id} label={employee.name} value="No active target" />)}</Panel>
    </section>
  );
}

function Learning({ data, reload, notify, initialRoute = 'learning', session }) {
  const [employeeId, setEmployeeId] = useState(data.employees[0]?.id || '');
  
  // For employees, always use their own profile
  const isEmployee = session?.role === 'Employee';
  const sessionEmployee = isEmployee ? employeeForSession(data, session) : null;
  const employee = sessionEmployee || (data.employees.find((item) => String(item.id) === String(employeeId)) || data.employees[0]);
  
  const routeTab = ({
    'learning-my': 'my learning',
    learning: 'available programs',
    'learning-paths': 'learning paths',
    'learning-resources': 'resources',
    ...learningRouteTabs
  })[initialRoute] || 'my learning';
  
  // Only declare tab ONCE - no duplicates!
  const [tab, setTab] = useState(routeTab);
  useEffect(() => {
    // If it's an employee accessing learning-my, force them to 'my learning' tab
    if (isEmployee && initialRoute === 'learning-my') {
      setTab('my learning');
    } else {
      setTab(routeTab);
    }
  }, [routeTab, isEmployee, initialRoute]);}

function LearningStat({ icon, value, label, tone, featured }) {
  return (
    <article className={`learning-stat ${featured ? 'featured' : ''}`}>
      <span className={`learning-stat-icon tone-${tone}`}>{icon}</span>
      <div><strong>{value}</strong><small>{label}</small></div>
    </article>
  );
}

function LearningLevelFocus({ employee, employees, setEmployeeId, level, onGenerate, onCompleteTest, notify }) {
  const titleLevel = toTitle(level);
  const path = (employee?.LearningPaths || []).find((item) => item.level === titleLevel);
  return (
    <section className="learning-progress career-entry">
      <div className="career-entry-head">
        <div>
          <h2>{titleLevel} Programs</h2>
          <p>{titleLevel} learning material, assessments, progress, and references for the selected employee.</p>
        </div>
        <div className="inline-actions">
          <select value={employee?.id || ''} onChange={(event) => setEmployeeId(event.target.value)}>{employees.map((item) => <option key={item.id} value={item.id}>{item.name} - {item.designation}</option>)}</select>
          <button onClick={onGenerate}><Sparkles /> Auto Generate</button>
        </div>
      </div>
      <div className="learning-level-grid single">
        <LearningLevelCard path={path} level={titleLevel} onCompleteTest={onCompleteTest} notify={notify} />
      </div>
    </section>
  );
}

function LearningLevelCard({ path, level, onCompleteTest, notify }) {
  const fallback = {
    title: `${level} Career Track`,
    status: level === 'Beginner' ? 'Ready to generate' : 'Locked',
    progress: 0,
    durationDays: level === 'Beginner' ? 7 : level === 'Intermediate' ? 10 : 20,
    extensionDays: level === 'Beginner' ? 3 : level === 'Intermediate' ? 5 : 10,
    curriculum: { skills: [], pdfs: [], exercises: [], tests: [] }
  };
  const item = path || fallback;
  const curriculum = Array.isArray(item.curriculum) ? { skills: [], pdfs: [], exercises: item.curriculum, tests: [] } : (item.curriculum || fallback.curriculum);
  const tests = curriculum.tests?.length ? curriculum.tests : [1, 2, 3].map((testNo) => ({ id: `${level.toLowerCase()}-${testNo}`, title: `${level} Assessment ${testNo}`, day: testNo, status: 'Pending' }));
  const downloadPdf = (pdf) => {
    printLearningPdf({
      title: pdf.title,
      category: level,
      audience: item.title,
      textContent: `Generated PDF reference for ${item.title}. Skills: ${(curriculum.skills || []).join(', ')}`,
      materialHtml: pdf.materialHtml || `<article class="learning-pdf-sheet"><header><img src="/logo.png" alt="Infolinx" /><div><h1>${pdf.title}</h1><p>${level} Reference | ${item.title}</p></div></header><section><h2>Purpose</h2><p>This reference supports ${item.title} without external video material.</p></section><section><h2>Skills Covered</h2><ul>${(curriculum.skills || []).map((skill) => `<li>${skill}</li>`).join('')}</ul></section><section><h2>Practice</h2><ul>${(curriculum.exercises || []).slice(0, 4).map((exercise) => `<li>${exercise}</li>`).join('')}</ul></section></article>`
    });
    notify(`${pdf.title} PDF preview opened.`);
  };
  return (
    <article className={`learning-level-card ${item.status === 'Locked' ? 'locked' : ''}`}>
      <header>
        <div><h3>{item.title}</h3><p>{item.durationDays} days | extension {item.extensionDays} days | {item.status}</p></div>
        <Pill tone={item.status === 'Completed' ? 'success' : item.status === 'Locked' ? 'neutral' : 'warning'}>{item.progress || 0}%</Pill>
      </header>
      <div className="learning-progress-track"><span style={{ width: `${item.progress || 0}%` }} /></div>
      <div className="chips">{(curriculum.skills || []).map((skill) => <span key={skill}>{skill}</span>)}</div>
      <section className="level-materials">
        <h4>PDF References</h4>
        {(curriculum.pdfs || []).map((pdf) => <button key={pdf.title} className="text-action" onClick={() => downloadPdf(pdf)}>{pdf.title}</button>)}
        <h4>Practice Exercises</h4>
        {(curriculum.exercises || []).slice(0, 3).map((exercise) => <small key={exercise}>{exercise}</small>)}
      </section>
      <section className="level-tests">
        {tests.map((test) => <article key={test.id}><strong>{test.title}</strong><small>Due day {test.day} | {test.status}{test.score !== null && test.score !== undefined ? ` | ${test.score}%` : ''}</small><button disabled={!path || item.status === 'Locked' || test.status === 'Passed'} onClick={() => onCompleteTest(path, test)}><ClipboardCheck /> Mark Passed</button></article>)}
      </section>
    </article>
  );
}

function LearningProgressCard({ item, onOpen, action = 'Continue' }) {
  const progress = Math.max(0, Math.min(100, Number(item.progress || 0)));
  return (
    <article className="learning-progress-card">
      <div className="learning-card-head">
        <h3>{item.title}</h3>
        <Pill tone="blue">{item.status}</Pill>
      </div>
      <p>{item.desc}</p>
      <div className="learning-progress-track"><span style={{ width: `${progress}%` }} /></div>
      <div className="learning-card-footer"><small>{progress}% complete</small><button onClick={onOpen}>{action}</button></div>
    </article>
  );
}

function LearningProgramCard({ item, onOpen, action = 'Open' }) {
  return (
    <article className="learning-program-card">
      <div className="learning-card-icon tone-blue"><BookOpen /></div>
      <h3>{item.title}</h3>
      <p>{item.textContent}</p>
      <div className="learning-meta"><span>{item.category}</span><span>{item.durationMinutes} mins</span></div>
      <button onClick={onOpen}>{action}</button>
    </article>
  );
}

function Performance({ data }) {
  return (
    <>
      <TabBar active="goal management" setActive={() => {}} tabs={['goal management', 'employee review management', 'performance feedback', 'calibration', 'reporting']} />
      <Panel title="Team Goal Management" icon={<Star />}>
        <select><option>TestGoal Annual (07 May 2026)</option></select>
        {data.employees.map((employee) => <article className="goal-row" key={employee.id}><EmployeeCell name={employee.name} code={employee.employeeCode} /><Pill>3 Goals</Pill><button><Star /> Add Goal</button></article>)}
      </Panel>
    </>
  );
}

function Tickets({ data }) {
  return (
    <Panel title="Team Tickets" icon={<Ticket />}>
      <DataTable columns={['Ticket', 'Employee', 'Category', 'Priority', 'Status', 'Assigned To']} rows={data.employees.map((employee, index) => [`HR-${2026 + index}`, employee.name, index % 2 ? 'Payroll Query' : 'Document Help', index % 2 ? 'Medium' : 'High', <Pill tone="warning">Open</Pill>, employee.manager])} />
    </Panel>
  );
}

function Communications() {
  return (
    <section className="workbench-grid">
      <Panel title="Announcements" icon={<Megaphone />}><textarea placeholder="Write internal communication..." /><button><Send /> Publish</button></Panel>
      <Panel title="Recent Broadcasts" icon={<Mail />}>{['Payroll cut-off reminder', 'Holiday calendar published', 'Learning assessment due'].map((item) => <Mini key={item} label={item} value="Sent" />)}</Panel>
    </section>
  );
}

function EmailAutomation({ data, reload, notify }) {
  const [busyMailId, setBusyMailId] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const retry = async (mail) => {
    if (busyMailId) return;
    setBusyMailId(mail.id);
    try {
      await api.post(`/mail/${mail.id}/retry`);
      await reload();
      notify('Email retry sent.');
    } catch (error) {
      await reload();
      notify(error.response?.data?.lastError || error.response?.data?.message || 'Email retry failed.');
    } finally {
      setBusyMailId(null);
    }
  };
  const verifyMail = async () => {
    if (verifying) return;
    setVerifying(true);
    try {
      const response = await api.get('/mail/status');
      notify(response.data.message || 'Email status verified.');
    } catch (error) {
      notify(error.response?.data?.message || 'Email verification failed.');
    } finally {
      setVerifying(false);
    }
  };
  const events = ['Test Invitation', 'Interview Invitation', 'Document Request', 'Offer Letter', 'BGV Updates', 'Onboarding Approval', 'Credentials Delivery', 'Learning Reminders', 'Assessment Reminders', 'Extension Approvals', 'Project Assignment', 'Certification Completion'];
  return (
    <>
      <section className="stat-grid">
        <Stat label="Queued/Sent Emails" value={data.mails?.length || 0} detail="latest delivery logs" icon={<Mail />} />
        <Stat label="Failures" value={(data.mails || []).filter((mail) => mail.status === 'Failed').length} detail="retry available" icon={<XCircle />} />
        <Stat label="SMTP Host" value={data.integrations?.email?.host || 'smtp.office365.com'} detail={data.integrations?.email?.mode || 'queue'} icon={<Settings />} />
        <Stat label="Audit Logs" value={data.auditLogs?.length || 0} detail="tracked admin actions" icon={<ShieldCheck />} />
      </section>
      <section className="workbench-grid">
        <Panel title="Email Event Templates" icon={<FileSignature />} actions={<button disabled={verifying} onClick={verifyMail}>{verifying ? <Timer /> : <Mail />} {verifying ? 'Verifying...' : 'Verify Sender'}</button>}>{events.map((event) => <Mini key={event} label={event} value="Queue + retry + audit enabled" />)}</Panel>
        <Panel title="Delivery Logs" icon={<Mail />}>
          <DataTable columns={['To', 'Subject', 'Kind', 'Status', 'Attempts', 'Actions']} rows={(data.mails || []).map((mail) => [
            mail.to,
            mail.subject,
            mail.kind,
            <Pill tone={mail.status === 'Sent' ? 'success' : mail.status === 'Failed' ? 'danger' : 'warning'}>{mail.status}</Pill>,
            mail.attempts || 0,
            <button className="ghost" disabled={busyMailId === mail.id} onClick={() => retry(mail)}>{busyMailId === mail.id ? <Timer /> : <Send />} {busyMailId === mail.id ? 'Retrying...' : 'Retry'}</button>
          ])} />
        </Panel>
      </section>
      <Panel title="Audit Trail" icon={<ShieldCheck />}>
        <DataTable columns={['When', 'Actor', 'Action', 'Entity']} rows={(data.auditLogs || []).map((log) => [formatDate(log.createdAt), log.actor, log.action, `${log.entityType || ''} #${log.entityId || ''}`])} />
      </Panel>
    </>
  );
}

function MyPortal({ data, session }) {
  const [previewRun, setPreviewRun] = useState(null);
  const [learningCourse, setLearningCourse] = useState(null);
  const [selectedMail, setSelectedMail] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const employee = employeeForSession(data, session);
  
  // Get only the courses assigned to this employee
  const employeeCourses = (data.learningCourses || []).filter(course => 
    employee.AssignedCourses?.includes(course.id)
  );
  // Sort courses by their order in the learning path
  const sortedCourses = employeeCourses.sort((a, b) => (a.order || 0) - (b.order || 0));
  
  if (!employee) return <Empty text="No employee profile available." />;
  return (
    <section className="workbench-grid">
      <Panel title="My Profile" icon={<UserRound />}><ProfileGrid employee={employee} /></Panel>
      <Panel title="My Payroll" icon={<BadgeIndianRupee />}>{employee.PayrollRuns?.map((run) => <ApprovalRow key={run.id} title={`${run.month} Payslip`} status={`Net INR ${money(run.netPay)} | ${run.status}`} action="View" onClick={() => setPreviewRun(run)} />)}</Panel>
      <Panel title="My Learning" icon={<GraduationCap />}>
        {sortedCourses.map((course, index) => {
          const isCompleted = employee.CompletedCourses?.includes(course.id);
          const isCurrent = !isCompleted && sortedCourses.slice(0, index).every(c => employee.CompletedCourses?.includes(c.id));
          return (
            <ApprovalRow 
              key={course.id} 
              title={course.title} 
              status={`${course.category} | ${course.durationMinutes} mins | ${isCompleted ? '✓ Completed' : isCurrent ? '📖 In Progress' : '🔒 Locked - Complete previous courses first'}`}
              action={isCurrent ? 'Continue Learning' : isCompleted ? 'Review' : 'Locked'}
              onClick={() => isCurrent && setLearningCourse(course)}
            />
          );
        })}
        {!sortedCourses.length && <Empty text="No learning programs assigned yet." />}
      </Panel>
      <Panel title="Inbox" icon={<Mail />}>
        {(employee.Mails || []).map((mail) => (
          <ApprovalRow 
            key={mail.id} 
            title={mail.subject} 
            status={`From: ${mail.from} | ${mail.date}`}
            action="View"
            onClick={() => setSelectedMail(mail)}
          />
        ))}
        {(!employee.Mails || employee.Mails.length === 0) && <Empty text="No messages in your inbox." />}
      </Panel>
      <Panel title="My Notifications" icon={<Bell />}>{employee.Notifications?.map((note) => <Mini key={note.id} label={note.title} value={note.channel} />)}</Panel>
      {previewRun && <PayslipModal run={previewRun} employee={employee} onClose={() => setPreviewRun(null)} />}
      {learningCourse && <LearningPlayerModal course={learningCourse} onStartTest={() => { setLearningCourse(null); }} onClose={() => setLearningCourse(null)} />}
      {selectedMail && (
        <div className="modal-overlay" onClick={() => setSelectedMail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedMail.subject}</h3>
            <p><strong>From:</strong> {selectedMail.from}</p>
            <p><strong>Date:</strong> {selectedMail.date}</p>
            <p>{selectedMail.body}</p>
            <textarea 
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply here..."
              rows={4}
              style={{ width: '100%', margin: '10px 0', padding: '8px' }}
            />
            <div className="modal-actions">
              <button onClick={() => { setSelectedMail(null); setReplyContent(''); }}>Close</button>
              <button onClick={async () => {
                await api.post(`/mails/${selectedMail.id}/reply`, { reply: replyContent });
                setSelectedMail(null);
                setReplyContent('');
                notify('Reply sent successfully.');
              }}>Send Reply</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function MyLearning({ data, session }) {
  const [learningCourse, setLearningCourse] = useState(null);
  const employee = employeeForSession(data, session);
  
  // Get only BEGINNER courses assigned to this employee FIRST
  const assignedBeginnerCourses = (data.learningCourses || []).filter(course => 
    employee.AssignedCourses?.includes(course.id) && course.category === 'Beginner'
  );
  
  // Check if all beginner courses are completed to unlock intermediate
  const allBeginnerCompleted = assignedBeginnerCourses.length > 0 && 
    assignedBeginnerCourses.every(course => employee.CompletedCourses?.includes(course.id));
  
  // Only get intermediate courses if all beginners are completed
  const assignedIntermediateCourses = allBeginnerCompleted ? (data.learningCourses || []).filter(course => 
    employee.AssignedCourses?.includes(course.id) && course.category === 'Intermediate'
  ) : [];
  
  // Only get advanced courses if all intermediates are completed
  const allIntermediateCompleted = assignedIntermediateCourses.length > 0 && 
    assignedIntermediateCourses.every(course => employee.CompletedCourses?.includes(course.id));
  const assignedAdvancedCourses = allIntermediateCompleted ? (data.learningCourses || []).filter(course => 
    employee.AssignedCourses?.includes(course.id) && course.category === 'Advanced'
  ) : [];

  if (!employee) return <Empty text="No learning data available." />;
  
  return (
    <>
      <section className="workbench-grid">
        <LearningStat icon={<GraduationCap />} value={`${employee.AssignedCourses?.length || 0}`} label="Total assigned courses" />
        <LearningStat icon={<CheckCircle2 />} value={`${employee.CompletedCourses?.length || 0}`} label="Completed" tone="success" featured />
        <LearningStat icon={<BarChart3 />} value={`${Math.round(((employee.CompletedCourses?.length || 0) / (employee.AssignedCourses?.length || 1)) * 100)}%`} label="Overall progress" />
        
        {/* Show BEGINNER courses first - always visible */}
        <Panel title="Beginner Programs - Start Here" icon={<GraduationCap />}>
          {assignedBeginnerCourses.map((course, index) => {
            const isCompleted = employee.CompletedCourses?.includes(course.id);
            const allPreviousCompleted = assignedBeginnerCourses.slice(0, index).every(c => employee.CompletedCourses?.includes(c.id));
            const isCurrent = allPreviousCompleted && !isCompleted;
            return (
              <LearningProgressCard 
                key={course.id}
                item={course}
                onOpen={() => isCurrent && setLearningCourse(course)}
                action={isCurrent ? 'Continue Learning' : isCompleted ? '✓ Completed' : '🔒 Locked - Complete previous courses first'}
              />
            );
          })}
          {assignedBeginnerCourses.length === 0 && <Empty text="No beginner programs assigned yet. Please contact your HR admin." />}
        </Panel>
        
        {/* Only show Intermediate if all beginners are completed */}
        {assignedIntermediateCourses.length > 0 && (
          <Panel title="Intermediate Programs" icon={<BookOpen />}>
            {assignedIntermediateCourses.map((course, index) => {
              const isCompleted = employee.CompletedCourses?.includes(course.id);
              const allPreviousCompleted = assignedIntermediateCourses.slice(0, index).every(c => employee.CompletedCourses?.includes(c.id));
              const isCurrent = allPreviousCompleted && !isCompleted;
              return (
                <LearningProgressCard 
                  key={course.id}
                  item={course}
                  onOpen={() => isCurrent && setLearningCourse(course)}
                  action={isCurrent ? 'Continue Learning' : isCompleted ? '✓ Completed' : '🔒 Locked'}
                />
              );
            })}
          </Panel>
        )}
        
        {/* Only show Advanced if all intermediates are completed */}
        {assignedAdvancedCourses.length > 0 && (
          <Panel title="Advanced Programs" icon={<Briefcase />}>
            {assignedAdvancedCourses.map((course, index) => {
              const isCompleted = employee.CompletedCourses?.includes(course.id);
              const allPreviousCompleted = assignedAdvancedCourses.slice(0, index).every(c => employee.CompletedCourses?.includes(c.id));
              const isCurrent = allPreviousCompleted && !isCompleted;
              return (
                <LearningProgressCard 
                  key={course.id}
                  item={course}
                  onOpen={() => isCurrent && setLearningCourse(course)}
                  action={isCurrent ? 'Continue Learning' : isCompleted ? '✓ Completed' : '🔒 Locked'}
                />
              );
            })}
          </Panel>
        )}
        
        {/* NO optional programs - remove that panel completely */}
      </section>
      {learningCourse && <LearningPlayerModal course={learningCourse} onStartTest={() => { setLearningCourse(null); }} onClose={() => setLearningCourse(null)} />}
    </>
  );
}

function Resignation({ data }) {
  const rows = data.employees.flatMap((employee) => (employee.RelievingCases || []).map((exitCase) => [employee.name, employee.designation, exitCase.resignationDate || 'Not submitted', exitCase.lastWorkingDate || 'Pending', <Pill tone="warning">{exitCase.status}</Pill>, exitCase.fullAndFinal]));
  return (
    <Panel title="Resignation Approval Management" icon={<PlaneTakeoff />} actions={<button>Submit Resignation on Behalf</button>}>
      <div className="filter-card"><select><option>Pending</option><option>Approved</option><option>Relieved</option></select></div>
      <DataTable columns={['Employee', 'Designation', 'Resignation Date', 'Last Working Date', 'Status', 'Full & Final']} rows={rows} />
    </Panel>
  );
}

function Analytics({ data, compact }) {
  const departments = unique(data.employees.map((employee) => employee.department));
  return (
    <>
      {!compact && <section className="stat-grid"><Stat label="Total Employees" value={data.employees.length} detail="active records" icon={<UsersRound />} /><Stat label="Departments" value={departments.length} detail="configured" icon={<Building2 />} /><Stat label="Designations" value={unique(data.employees.map((employee) => employee.designation)).length} detail="employee master" icon={<UserRound />} /><Stat label="Avg CTC" value={`INR ${money(avg(data.employees.map((employee) => employee.salaryAnnual)))}`} detail="annual" icon={<BadgeIndianRupee />} /></section>}
      <section className="workbench-grid">
        <Panel title="Recruitment Funnel" icon={<BarChart3 />}>{['New', 'Screened', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Offer Generated', 'Onboarding'].map((status) => <UsageBar key={status} label={status} value={data.candidates.filter((candidate) => candidate.status === status).length} />)}</Panel>
        <Panel title="Department Distribution" icon={<Building2 />}>{departments.map((department) => <UsageBar key={department} label={department} value={data.employees.filter((employee) => employee.department === department).length} />)}</Panel>
      </section>
    </>
  );
}

function Insights({ title, data }) {
  return (
    <>
      <section className="stat-grid">
        <Stat label="Headcount" value={data.employees.length} detail="active employees" icon={<UsersRound />} />
        <Stat label="Hiring Velocity" value="18 days" detail="avg time to schedule" icon={<Timer />} />
        <Stat label="Document SLA" value="92%" detail="approval compliance" icon={<ClipboardCheck />} />
        <Stat label="Payroll Readiness" value="86%" detail="inputs completed" icon={<BadgeIndianRupee />} />
      </section>
      <section className="workbench-grid">
        <Panel title={title} icon={<BarChart3 />}>
          <UsageBar label="Recruitment workload" value={data.candidates.length} />
          <UsageBar label="Leave and attendance exceptions" value={countNested(data.employees, 'LeaveRequests')} />
          <UsageBar label="Payroll exceptions" value={countNested(data.employees, 'PayrollRuns')} />
          <UsageBar label="Learning pending" value={data.learningCourses?.length || 0} />
        </Panel>
        <Panel title="Actionable Alerts" icon={<Bell />}>
          {['Document approval pending', 'Interview feedback overdue', 'Payroll compliance due date approaching', 'Learning assessment pending'].map((item) => <ApprovalRow key={item} title={item} status="Needs review" action="Open" />)}
        </Panel>
      </section>
    </>
  );
}

function SmartInsights({ data }) {
  return (
    <section className="workbench-grid">
      <Panel title="Smart HR Assistant" icon={<Sparkles />}>
        <textarea placeholder="Ask anything about HR, payroll, recruitment, leave, attendance or documents..." />
        <div className="inline-actions"><button><Send /> Ask</button><button className="ghost">Voice</button></div>
      </Panel>
      <Panel title="Suggested Insights" icon={<BarChart3 />}>
        <Mini label="Best matching JD" value={data.jds[0]?.title || 'No JD'} />
        <Mini label="Strongest candidate" value={data.candidates.sort((a, b) => Number(b.shortlistScore || 0) - Number(a.shortlistScore || 0))[0]?.name || 'No candidate'} />
        <Mini label="Next payroll risk" value="Pending reimbursement approvals" />
        <Mini label="Learning risk" value="Assessments not attempted" />
      </Panel>
    </section>
  );
}

function WorkManagement({ data, reload, notify, initialView = 'tasks', compact = false }) {
  const [view, setView] = useState(initialView);
  useEffect(() => setView(initialView), [initialView]);
  const updateTask = async (task, status) => {
    await api.patch(`/work-tasks/${task.id}`, { status, dailyUpdate: `Moved to ${status}` });
    await reload();
    notify('Task updated.');
  };
  const updateProject = async (project, status) => {
    await api.patch(`/projects/${project.id}`, { status, reviewNotes: `${status} by HR Admin` });
    await reload();
    notify('Project review updated.');
  };
  return (
    <>
      {!compact && <TabBar active={view} setActive={setView} tabs={['tasks', 'projects', 'sprints', 'certifications']} />}
      {view === 'tasks' && <Panel title="Scrum Task Management" icon={<BriefcaseBusiness />}>
        <DataTable columns={['Task', 'Owner', 'Sprint', 'Story Points', 'Timesheet', 'Status', 'Actions']} rows={(data.workTasks || []).map((task) => [
          task.title,
          task.Employee?.name || 'Unassigned',
          task.SprintBoard?.name || 'Backlog',
          task.storyPoints,
          `${task.timesheetHours || 0}h`,
          <Pill tone={task.status === 'Done' ? 'success' : 'warning'}>{task.status}</Pill>,
          <div className="inline-actions">{['To Do', 'In Progress', 'Review', 'Testing', 'Done'].map((status) => <button key={status} className="ghost" onClick={() => updateTask(task, status)}>{status}</button>)}</div>
        ])} />
      </Panel>}
      {view === 'projects' && <Panel title="Mini Project Assignment" icon={<ClipboardCheck />}>
        <DataTable columns={['Project', 'Employee', 'Duration', 'Deliverables', 'Status', 'Actions']} rows={(data.projectAssignments || []).map((project) => [
          project.title,
          project.Employee?.name || 'Employee',
          `${project.durationDays} days`,
          project.deliverables,
          <Pill tone={project.status === 'Passed' ? 'success' : project.status === 'Failed' ? 'danger' : 'warning'}>{project.status}</Pill>,
          <div className="inline-actions">{['Passed', 'Rework Required', 'Failed'].map((status) => <button key={status} className={status === 'Failed' ? 'danger' : 'ghost'} onClick={() => updateProject(project, status)}>{status}</button>)}</div>
        ])} />
      </Panel>}
      {view === 'sprints' && <Panel title="Sprint Boards" icon={<Grid2X2 />}>
        <DataTable columns={['Sprint', 'Owner', 'Goal', 'Dates', 'Status']} rows={(data.sprintBoards || []).map((board) => [board.name, board.Employee?.name || 'Team', board.sprintGoal, `${board.startDate || ''} to ${board.endDate || ''}`, <Pill tone="blue">{board.status}</Pill>])} />
      </Panel>}
      {view === 'certifications' && <Panel title="Certification Completion" icon={<GraduationCap />}>
        <DataTable columns={['Certification', 'Employee', 'Level', 'Issued', 'Status', 'Actions']} rows={(data.certifications || []).map((cert) => [
          cert.title,
          cert.Employee?.name || 'Employee',
          cert.level,
          cert.issuedAt || 'Pending',
          <Pill tone={cert.status === 'Completed' ? 'success' : 'warning'}>{cert.status}</Pill>,
          <button onClick={async () => { await api.patch(`/certifications/${cert.id}`, { status: 'Completed' }); await reload(); notify('Certification completed and mail queued.'); }}><CheckCircle2 /> Complete</button>
        ])} />
      </Panel>}
    </>
  );
}

function MyPayroll({ data, session }) {
  const [previewRun, setPreviewRun] = useState(null);
  // Use employeeForSession to get the correct logged-in employee, not data.employees[0]
  const employee = employeeForSession(data, session);
  if (!employee) return <Empty text="No employee profile available." />;
  return (
    <>
      <TabBar active="salary structure" setActive={() => {}} tabs={['tax regime', 'investment declaration', 'investment proof', 'salary structure', 'my incentives']} />
      <section className="workbench-grid">
        <Panel title="Salary Structure" icon={<BadgeIndianRupee />}><ProfileGrid employee={employee} /><Mini label="Annual CTC" value={`INR ${money(employee.salaryAnnual)}`} /><Mini label="Monthly Gross" value={`INR ${money(Number(employee.salaryAnnual || 0) / 12)}`} /></Panel>
        <Panel title="Payslips" icon={<Download />}>{employee.PayrollRuns?.map((run) => <ApprovalRow key={run.id} title={`${run.month} Payslip`} status={`Net INR ${money(run.netPay)} | ${run.status}`} action="View" onClick={() => setPreviewRun(run)} />)}</Panel>
      </section>
      {previewRun && <PayslipModal run={previewRun} employee={employee} onClose={() => setPreviewRun(null)} />}
    </>
  );
}

function Billing({ data, reload, notify }) {
  return <MasterRecordPanel title="Billing & Subscriptions" module="billing" data={data} reload={reload} notify={notify} icon={<ReceiptIndianRupee />} columns={['Invoice', 'Type', 'Code', 'Owner', 'Status', 'Notes', 'Actions']} />;
}

function AdminSettings({ data }) {
  return (
    <section className="workbench-grid">
      <Panel title="Company Setup" icon={<Building2 />}><Mini label="Company" value="Infolinx" /><Mini label="Branches" value="Hyderabad, Visakhapatnam, Remote" /><Mini label="Work model" value="Hybrid" /></Panel>
      <Panel title="Access Management" icon={<ShieldCheck />}>{['Admin', 'HR Admin', 'Recruiter', 'Manager', 'Payroll Admin', 'Panelist', 'Employee'].map((role) => <Mini key={role} label={role} value="Enabled" />)}</Panel>
      <Panel title="Integration Status" icon={<Settings />}><Mini label="Microsoft Teams" value={data.integrations?.teams?.mode || 'Demo'} /><Mini label="Google Calendar" value="Acceptance-triggered demo" /><Mini label="Email Service" value="Queue enabled" /></Panel>
    </section>
  );
}

function TemplateGenerator({ data }) {
  return <Panel title="Generate Document for Employee" icon={<FileSignature />}><div className="form-grid two-col"><select>{data.employees.map((employee) => <option key={employee.id}>{employee.name}</option>)}</select><select><option>Experience Letter</option><option>Relieving Letter</option><option>Appointment Letter</option></select><input placeholder="Valid until" /><button>Generate</button></div></Panel>;
}

const documentTemplateSamples = [
  {
    name: 'Offer Letter',
    use: 'Sent after selection and before joining confirmation.',
    placeholders: ['{{candidateName}}', '{{designation}}', '{{department}}', '{{annualCtc}}', '{{joiningDate}}', '{{reportingManager}}'],
    html: `<div class="template-preview-sheet"><h2>Offer of Employment</h2><p>Dear {{candidateName}},</p><p>We are pleased to offer you the position of <strong>{{designation}}</strong> in the <strong>{{department}}</strong> department at Infolinx.</p><p>Your annual CTC will be <strong>INR {{annualCtc}}</strong>. Your expected date of joining is <strong>{{joiningDate}}</strong>, and you will report to <strong>{{reportingManager}}</strong>.</p><p>This offer is subject to successful document verification, background verification, and acceptance of company policies.</p><p>Regards,<br/>HR Department<br/>Infolinx</p></div>`
  },
  {
    name: 'Appointment Letter',
    use: 'Issued after offer acceptance and onboarding approval.',
    placeholders: ['{{employeeName}}', '{{employeeId}}', '{{designation}}', '{{department}}', '{{joiningDate}}', '{{workLocation}}'],
    html: `<div class="template-preview-sheet"><h2>Appointment Letter</h2><p>Dear {{employeeName}},</p><p>Welcome to Infolinx. This letter confirms your appointment as <strong>{{designation}}</strong> in <strong>{{department}}</strong>.</p><p>Your employee ID is <strong>{{employeeId}}</strong>. Your joining date is <strong>{{joiningDate}}</strong>, and your primary work location is <strong>{{workLocation}}</strong>.</p><p>You are expected to follow company policies, information security practices, attendance rules, and confidentiality requirements.</p><p>Regards,<br/>HR Department<br/>Infolinx</p></div>`
  },
  {
    name: 'Experience Letter',
    use: 'Generated for employees after exit clearance or HR approval.',
    placeholders: ['{{employeeName}}', '{{employeeId}}', '{{designation}}', '{{department}}', '{{fromDate}}', '{{toDate}}'],
    html: `<div class="template-preview-sheet"><h2>Experience Letter</h2><p>This is to certify that <strong>{{employeeName}}</strong> (Employee ID: {{employeeId}}) worked with Infolinx as <strong>{{designation}}</strong> in the <strong>{{department}}</strong> department from <strong>{{fromDate}}</strong> to <strong>{{toDate}}</strong>.</p><p>During this period, the employee contributed to assigned responsibilities and project deliverables.</p><p>We wish {{employeeName}} success in future endeavors.</p><p>Regards,<br/>HR Department<br/>Infolinx</p></div>`
  },
  {
    name: 'Relieving Letter',
    use: 'Issued after resignation approval, asset clearance, and final settlement review.',
    placeholders: ['{{employeeName}}', '{{employeeId}}', '{{designation}}', '{{lastWorkingDate}}', '{{clearanceStatus}}'],
    html: `<div class="template-preview-sheet"><h2>Relieving Letter</h2><p>Dear {{employeeName}},</p><p>This is to confirm that you have been relieved from your duties as <strong>{{designation}}</strong> with effect from the close of business on <strong>{{lastWorkingDate}}</strong>.</p><p>Your clearance status is recorded as <strong>{{clearanceStatus}}</strong>. Subject to company policy, final settlement will be processed by payroll.</p><p>We appreciate your contribution to Infolinx.</p><p>Regards,<br/>HR Department<br/>Infolinx</p></div>`
  },
  {
    name: 'Salary Revision Letter',
    use: 'Issued after appraisal, promotion, or compensation revision approval.',
    placeholders: ['{{employeeName}}', '{{employeeId}}', '{{effectiveDate}}', '{{oldCtc}}', '{{newCtc}}', '{{designation}}'],
    html: `<div class="template-preview-sheet"><h2>Salary Revision Letter</h2><p>Dear {{employeeName}},</p><p>Based on your performance review and management approval, your compensation has been revised effective <strong>{{effectiveDate}}</strong>.</p><p>Previous annual CTC: <strong>INR {{oldCtc}}</strong><br/>Revised annual CTC: <strong>INR {{newCtc}}</strong></p><p>Your designation will be recorded as <strong>{{designation}}</strong>. Detailed salary breakup will be available in payroll records.</p><p>Regards,<br/>HR Department<br/>Infolinx</p></div>`
  }
];

function TemplateLibrary() {
  const [preview, setPreview] = useState(documentTemplateSamples[0]);
  return (
    <section className="workbench-grid">
      <Panel title="Document Templates" icon={<FileSignature />}>
        {documentTemplateSamples.map((template) => (
          <article className={`template-row ${preview.name === template.name ? 'active' : ''}`} key={template.name}>
            <div>
              <strong>{template.name}</strong>
              <small>{template.use}</small>
              <span>{template.placeholders.join('  ')}</span>
            </div>
            <button className="ghost" onClick={() => setPreview(template)}><Eye /> Preview</button>
          </article>
        ))}
      </Panel>
      <Panel title={`${preview.name} Preview`} icon={<Eye />}>
        <div className="template-meta">
          <Mini label="Format" value="HTML template" />
          <Mini label="Placeholders" value={preview.placeholders.join(', ')} />
        </div>
        <div className="offer-preview" dangerouslySetInnerHTML={{ __html: preview.html }} />
      </Panel>
    </section>
  );
}

function MigrationPanel({ data, reload, notify }) {
  return <MasterRecordPanel title="Data Migration" module="migration" data={data} reload={reload} notify={notify} icon={<Upload />} columns={['File / Batch', 'Type', 'Code', 'Owner', 'Status', 'Notes', 'Actions']} />;
}

function HolidayPanel({ data, reload, notify }) {
  return <MasterRecordPanel title="Holiday List" module="holiday" data={data} reload={reload} notify={notify} icon={<CalendarDays />} columns={['Holiday', 'Type', 'Code', 'Owner', 'Status', 'Description', 'Actions']} />;
}

function AdminPlaceholder({ title, data, reload, notify }) {
  return <MasterRecordPanel title={toTitle(title)} module={slugify(title)} data={data} reload={reload} notify={notify} icon={<Settings />} />;
}

function CandidateModal({ candidate, onClose }) {
  const downloadResume = () => {
    const resumeUrl = resolveFileUrl(candidate.cvUrl);
    if (resumeUrl) window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  };
  return (
    <div className="modal-backdrop">
      <article className="large-modal">
        <header><h2>Candidate Details</h2><button className="ghost" onClick={onClose}>Close</button></header>
        <div className="details-grid">
          <Mini label="Name" value={candidate.name} />
          <Mini label="Email" value={candidate.email} />
          <Mini label="Phone" value={candidate.phone} />
          <Mini label="Current Company" value={candidate.currentCompany} />
          <Mini label="Current Role" value={candidate.roleApplied} />
          <Mini label="Total Experience" value={`${candidate.experienceYears} years`} />
          <Mini label="Expected Salary" value={`INR ${money(candidate.expectedCtc)}`} />
          <Mini label="Notice Period" value={candidate.noticePeriod} />
        </div>
        <div className="chips">{candidate.skills?.map((skill) => <span key={skill}>{skill}</span>)}</div>
        <button className="ghost" onClick={downloadResume} disabled={!candidate.cvUrl}><Download /> Download Resume</button>
      </article>
    </div>
  );
}

function DocumentPreview({ task, onClose, onApprove, onDecline }) {
  return (
    <div className="modal-backdrop">
      <article className="large-modal">
        <header><div><h2>{task.title}</h2><p>{task.employeeName} | {task.employeeCode}</p></div><button className="ghost" onClick={onClose}>Close</button></header>
        <div className="document-sheet">
          <h3>{task.title}</h3>
          <p><strong>Employee:</strong> {task.employeeName}</p>
          <p><strong>Submitted file:</strong> {task.documentUrl || 'Awaiting upload'}</p>
          <p>This preview area is where uploaded PDF/image documents are reviewed before approval or decline.</p>
        </div>
        <footer><button onClick={onApprove}><CheckCircle2 /> Approve</button><button className="danger" onClick={onDecline}><XCircle /> Decline</button></footer>
      </article>
    </div>
  );
}

function HistoryTable({ title, rows, columns = ['Employee', 'Document', 'Status', 'Changed At'] }) {
  return <Panel title={title} icon={<ClipboardCheck />}><DataTable columns={columns} rows={rows} /></Panel>;
}

function DataTable({ columns, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
        <tbody>{rows.length ? rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>) : <tr><td colSpan={columns.length}><Empty text="No records found." /></td></tr>}</tbody>
      </table>
    </div>
  );
}

function TabBar({ tabs, active, setActive }) {
  return <div className="tabbar">{tabs.map((tab) => <button key={tab} className={active === tab ? 'active' : ''} onClick={() => setActive(tab)}>{toTitle(tab)}</button>)}</div>;
}

function Panel({ title, icon, children, actions }) {
  return <article className="panel"><div className="panel-head"><h2>{icon} {title}</h2>{actions && <div className="panel-actions">{actions}</div>}</div>{children}</article>;
}

function Stat({ icon, label, value, detail }) {
  return <article className="stat">{icon}<span>{label}</span><strong>{value}</strong><small>{detail}</small></article>;
}

function UsageBar({ label, value, onClick }) {
  const width = Math.min(100, 22 + Number(value || 0) * 14);
  return <button className="usage-row" onClick={onClick} style={{ '--w': `${width}%` }}><span>{label}</span><strong>{value}</strong></button>;
}

function ApprovalRow({ title, status, action, onClick }) {
  return <article className="approval-row"><div><strong>{title}</strong><small>{status}</small></div><button onClick={onClick}>{action}</button></article>;
}

function MailCard({ mail, onOpen, active = false }) {
  const inbound = isInboundMail(mail);
  const sender = mail.fromName ? `${mail.fromName} <${mail.from || ''}>` : mail.from || 'System';
  const statusTone = mail.status === 'Unread' ? 'blue' : mail.status === 'Sent' || mail.status === 'Received' ? 'success' : mail.status === 'Failed' ? 'danger' : 'warning';
  const primaryLabel = inbound ? 'From' : 'To';
  const primaryValue = inbound ? sender : mail.to || '-';
  return (
    <button className={`mail-card ${inbound ? 'inbound' : 'outbound'} ${active ? 'active' : ''}`} onClick={() => onOpen?.(mail)}>
      <header>
        <div className="mail-card-main">
          <strong>{mail.subject || '(No subject)'}</strong>
          <span>{primaryLabel} | {formatDate(mail.createdAt)} | {mail.kind || (inbound ? 'Inbound Mail' : 'Outbound Mail')}</span>
          <small>{primaryValue}</small>
        </div>
        <Pill tone={statusTone}>{mail.status || (inbound ? 'Received' : 'Queued')}</Pill>
      </header>
      {!!mail.attachments?.length && (
        <div className="mail-attachments">
          {mail.attachments.map((attachment, index) => (
            <span key={`${attachment.filename || attachment.name}-${index}`}>
              <FileArchive /> {attachment.filename || attachment.name || 'attachment'}{attachment.size ? ` (${formatBytes(attachment.size)})` : ''}
            </span>
          ))}
        </div>
      )}
      {mail.lastError && <small className="mail-error">{mail.lastError}</small>}
    </button>
  );
}

function ComposeMailModal({ attachments, body, externalEmail, filteredOptions, handleFiles, isAdmin, query, recipient, send, sending, setBody, setComposeOpen, setExternalEmail, setQuery, setRecipient, setSubject, subject }) {
  return (
    <div className="modal-backdrop">
      <article className="large-modal compose-modal">
        <header><h2>Compose Message</h2><button className="ghost" onClick={() => setComposeOpen(false)}>Close</button></header>
        <form className="form-grid two-col" onSubmit={send}>
          <label className="full-span">Find Employee or Group<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Start typing name, employee code, or email" /></label>
          <label className="full-span">To<select value={recipient} onChange={(event) => setRecipient(event.target.value)}>
            <option value="HR_ADMIN">HR Admin</option>
            {isAdmin && <option value="ALL_EMPLOYEES">All Employees</option>}
            {isAdmin && <option value="EXTERNAL_EMAIL">External Email</option>}
            {filteredOptions.map((employee) => <option key={employee.id} value={employee.email}>{employee.name} - {employee.email}</option>)}
          </select></label>
          {recipient === 'EXTERNAL_EMAIL' && <label className="full-span">External Email<input required type="email" value={externalEmail} onChange={(event) => setExternalEmail(event.target.value)} placeholder="name@gmail.com, name@hotmail.com, or any valid email" /></label>}
          <label className="full-span">Subject<input required value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Mail subject" /></label>
          <label className="full-span">Mail Body<textarea required value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write the message body" /></label>
          <label className="full-span">Attachments<input type="file" multiple onChange={handleFiles} /></label>
          {!!attachments.length && <div className="chips full-span">{attachments.map((attachment) => <span key={attachment.filename}>{attachment.filename}</span>)}</div>}
          <div className="form-actions"><button type="button" className="ghost" onClick={() => setComposeOpen(false)}>Cancel</button><button disabled={sending}>{sending ? <Timer /> : <Send />} {sending ? 'Sending...' : 'Send Message'}</button></div>
        </form>
      </article>
    </div>
  );
}

function SentItemsModal({ mails, onClose }) {
  const [selected, setSelected] = useState(mails[0] || null);
  return (
    <div className="modal-backdrop">
      <article className="large-modal sent-modal">
        <header><div><h2>Sent Items</h2><p>{mails.length} dispatched messages</p></div><button className="ghost" onClick={onClose}>Close</button></header>
        <div className="mail-reader-layout modal-mail-layout">
          <aside className="mail-list-panel">{mails.length ? mails.map((mail) => <MailCard key={mail.id} mail={mail} active={selected?.id === mail.id} onOpen={setSelected} />) : <Empty text="No sent messages yet." />}</aside>
          <main className="mail-reading-panel">{selected ? <MailReadingPane mail={selected} /> : <Empty text="Select a sent email to read." />}</main>
        </div>
      </article>
    </div>
  );
}

function MailReadingPane({ mail }) {
  const inbound = isInboundMail(mail);
  const sender = mail.fromName ? `${mail.fromName} <${mail.from || ''}>` : mail.from || 'System';
  const statusTone = mail.status === 'Unread' ? 'blue' : mail.status === 'Sent' || mail.status === 'Received' ? 'success' : mail.status === 'Failed' ? 'danger' : 'warning';
  const fromValue = inbound ? sender : sender;
  const toValue = mail.to || '-';
  return (
    <article className="mail-reading-content">
      <header>
        <div>
          <h2>{mail.subject || '(No subject)'}</h2>
          <p>From | To | Date</p>
          <small>{fromValue}</small>
          <small>{toValue}</small>
          <small>{formatDate(mail.createdAt)} | {mail.kind || (inbound ? 'Inbound Mail' : 'Outbound Mail')}</small>
        </div>
        <Pill tone={statusTone}>{mail.status || (inbound ? 'Received' : 'Queued')}</Pill>
      </header>
      <div className="mail-viewer-body" dangerouslySetInnerHTML={{ __html: mail.html || '<p>No message body.</p>' }} />
      {!!mail.attachments?.length && (
        <section className="mail-viewer-attachments">
          <h3>Attachments</h3>
          <div className="mail-attachments">
            {mail.attachments.map((attachment, index) => (
              <span key={`${attachment.filename || attachment.name}-${index}`}>
                <FileArchive /> {attachment.filename || attachment.name || 'attachment'}{attachment.size ? ` (${formatBytes(attachment.size)})` : ''}
              </span>
            ))}
          </div>
        </section>
      )}
      {mail.lastError && <small className="mail-error">{mail.lastError}</small>}
    </article>
  );
}

function MailViewerModal({ mail, onClose }) {
  const inbound = isInboundMail(mail);
  const sender = mail.fromName ? `${mail.fromName} <${mail.from || ''}>` : mail.from || 'System';
  const statusTone = mail.status === 'Unread' ? 'blue' : mail.status === 'Sent' || mail.status === 'Received' ? 'success' : mail.status === 'Failed' ? 'danger' : 'warning';
  return (
    <div className="modal-backdrop">
      <article className="large-modal mail-viewer-modal">
        <header>
          <div>
            <h2>{mail.subject || '(No subject)'}</h2>
            <p>{inbound ? 'Inbox message' : 'Sent message'} | {formatDate(mail.createdAt)}</p>
          </div>
          <button className="ghost" onClick={onClose}>Close</button>
        </header>
        <div className="details-grid">
          <Mini label={inbound ? 'From' : 'To'} value={inbound ? sender : mail.to || '-'} />
          <Mini label={inbound ? 'To' : 'From'} value={inbound ? mail.to || '-' : sender} />
          <Mini label="Status" value={mail.status || (inbound ? 'Received' : 'Queued')} />
          <Mini label="Type" value={mail.kind || (inbound ? 'Inbound Mail' : 'Outbound Mail')} />
        </div>
        <div className="mail-viewer-body" dangerouslySetInnerHTML={{ __html: mail.html || '<p>No message body.</p>' }} />
        {!!mail.attachments?.length && (
          <section className="mail-viewer-attachments">
            <h3>Attachments</h3>
            <div className="mail-attachments">
              {mail.attachments.map((attachment, index) => (
                <span key={`${attachment.filename || attachment.name}-${index}`}>
                  <FileArchive /> {attachment.filename || attachment.name || 'attachment'}{attachment.size ? ` (${formatBytes(attachment.size)})` : ''}
                </span>
              ))}
            </div>
          </section>
        )}
        {mail.lastError && <small className="mail-error">{mail.lastError}</small>}
        <footer><Pill tone={statusTone}>{mail.status || (inbound ? 'Received' : 'Queued')}</Pill></footer>
      </article>
    </div>
  );
}

function EmployeeCell({ name, code }) {
  return <div className="employee-cell"><span>{initials(name)}</span><div><strong>{name}</strong><small>{code}</small></div></div>;
}

function ProfileGrid({ employee }) {
  return <div className="details-grid"><Mini label="Employee ID" value={employee.employeeCode} /><Mini label="Email" value={employee.email} /><Mini label="Department" value={employee.department} /><Mini label="Designation" value={employee.designation} /><Mini label="Manager" value={employee.manager} /><Mini label="Leave Balance" value={`${employee.leaveBalance} days`} /></div>;
}

function PayslipModal({ run, employee, onClose }) {
  const gross = Number(run.grossPay || 0);
  const deductions = Number(run.deductions || 0);
  const reimbursements = Number(run.reimbursements || 0);
  const earnings = [
    ['Basic', Math.round(gross * .45)],
    ['HRA', Math.round(gross * .22)],
    ['Special Allowance', Math.round(gross * .25)],
    ['Reimbursements', reimbursements]
  ];
  const deductionRows = [
    ['Provident Fund', Math.round(deductions * .45)],
    ['Professional Tax', Math.round(deductions * .1)],
    ['TDS', Math.round(deductions * .45)]
  ];
  const employeeName = employee?.name || run.employeeName || 'Employee';
  const employeeCode = employee?.employeeCode || run.employeeCode || 'EMP';
  const downloadPayslip = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Payslip ${employeeCode} ${run.month}</title><style>body{font-family:Arial,sans-serif;margin:32px;color:#243142}.sheet{border:1px solid #d9e1e8;padding:24px;max-width:820px;margin:auto}h1{margin:0 0 4px;color:#0b2f4f}.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:18px 0}.row{display:flex;justify-content:space-between;border:1px solid #e6edf3;padding:10px}.total{background:#1d4ed8;color:white;padding:16px;display:flex;justify-content:space-between;font-size:20px}</style></head><body><main class="sheet"><h1>Infolinx Payslip</h1><p>Salary Slip for ${run.month}</p><section class="grid"><div class="row"><span>Employee</span><strong>${employeeName}</strong></div><div class="row"><span>Employee ID</span><strong>${employeeCode}</strong></div><div class="row"><span>Department</span><strong>${employee?.department || run.department || 'Product Engineering'}</strong></div><div class="row"><span>Designation</span><strong>${employee?.designation || run.designation || 'Employee'}</strong></div></section><h2>Earnings</h2>${earnings.map(([label, value]) => `<div class="row"><span>${label}</span><strong>INR ${money(value)}</strong></div>`).join('')}<h2>Deductions</h2>${deductionRows.map(([label, value]) => `<div class="row"><span>${label}</span><strong>INR ${money(value)}</strong></div>`).join('')}<p class="total"><span>Net Pay</span><strong>INR ${money(run.netPay)}</strong></p></main></body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `payslip-${employeeCode}-${run.month || 'sample'}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const printPayslip = () => window.print();
  return (
    <div className="modal-backdrop">
      <article className="large-modal payslip-modal">
        <header><h2>Payslip Preview</h2><div className="inline-actions"><button className="ghost" onClick={downloadPayslip}><Download /> Download</button><button className="ghost" onClick={printPayslip}><FileSignature /> Print</button><button className="ghost" onClick={onClose}>Close</button></div></header>
        <section className="payslip-sheet">
          <div className="payslip-head">
            <img src="/logo.png" alt="Infolinx logo" />
            <div><strong>Infolinx</strong><span>Salary Slip for {run.month}</span></div>
          </div>
          <div className="details-grid">
            <Mini label="Employee" value={employeeName} />
            <Mini label="Employee ID" value={employeeCode} />
            <Mini label="Department" value={employee?.department || run.department || 'Product Engineering'} />
            <Mini label="Designation" value={employee?.designation || run.designation || 'Employee'} />
          </div>
          <div className="payslip-columns">
            <div><h3>Earnings</h3>{earnings.map(([label, value]) => <Mini key={label} label={label} value={`INR ${money(value)}`} />)}</div>
            <div><h3>Deductions</h3>{deductionRows.map(([label, value]) => <Mini key={label} label={label} value={`INR ${money(value)}`} />)}</div>
          </div>
          <div className="payslip-total"><span>Net Pay</span><strong>INR {money(run.netPay)}</strong></div>
        </section>
      </article>
    </div>
  );
}

function Mini({ label, value }) {
  return <div className="mini-row"><span>{label}</span><strong>{value}</strong></div>;
}

function Pill({ children, tone = 'neutral' }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

function TableActions({ title = 'Record', details = [] }) {
  const [mode, setMode] = useState(null);
  const rows = details.length ? details : [['Status', 'Demo record'], ['Editable', 'Yes'], ['Audit', 'Tracked']];
  return (
    <>
      <div className="table-actions">
        <button className="icon-only ghost" onClick={() => setMode('view')} aria-label="View"><Eye /></button>
        <button className="icon-only ghost" onClick={() => setMode('edit')} aria-label="Edit"><Pencil /></button>
        <button className="icon-only ghost" onClick={() => setMode('download')} aria-label="Download"><Download /></button>
      </div>
      {mode && (
        <div className="modal-backdrop">
          <article className="large-modal action-modal">
            <header><h2>{toTitle(mode)} {title}</h2><button className="ghost" onClick={() => setMode(null)}>Close</button></header>
            {mode === 'edit' ? (
              <form className="form-grid two-col">
                {rows.map(([label, value]) => <label key={label}>{label}<input defaultValue={value || ''} /></label>)}
                <div className="form-actions"><button type="button" className="ghost" onClick={() => setMode(null)}>Cancel</button><button type="button" onClick={() => setMode(null)}><CheckCircle2 /> Save Demo Edit</button></div>
              </form>
            ) : (
              <div className="details-grid">{rows.map(([label, value]) => <Mini key={label} label={label} value={String(value ?? '')} />)}</div>
            )}
            {mode === 'download' && <p className="empty">Download package prepared for {title}. In live deployment this exports PDF/CSV.</p>}
          </article>
        </div>
      )}
    </>
  );
}

function Empty({ text }) {
  return <p className="empty">{text}</p>;
}

function toggleId(list, id) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

function unique(list) {
  return [...new Set(list.filter(Boolean))];
}

function countNested(items, key) {
  return items.flatMap((item) => item[key] || []).length;
}

function employeeForSession(data, session) {
  if (!data?.employees?.length || !session?.email) return null;
  return data.employees.find((employee) => employee.email?.toLowerCase() === session.email.toLowerCase()) || null;
}

function canUseInbox(session) {
  if (!session?.email) return false;
  if (session.role && session.role !== 'Employee') return true;
  return session.email.toLowerCase().endsWith('@infolinx.com');
}

function isInboundMail(mail) {
  return mail?.direction === 'inbound' || /^Inbound/i.test(mail?.kind || '');
}

function mailBodyText(html = '') {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(String(html), 'text/html');
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
}

function formatBytes(value) {
  const bytes = Number(value || 0);
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function employeeTabFor(route) {
  return ({
    employees: 'all employees',
    'employee-profiles': 'all employees',
    'employee-status': 'employee edit approvals',
    'employee-add': 'add employees',
    'employee-history': 'employee history',
    'employee-access': 'access management',
    'employee-promotion': 'promotion management',
    'employee-onboarding': 'employee self onboarding',
    'employee-edit': 'employee edit approvals',
    'employee-migration': 'data migration'
  })[route] || 'all employees';
}

function recommendedAccessFor(policy, route) {
  if (policy === 'Employee Policy') {
    return rolePolicies['Employee Policy'].includes(route) ? 'Employee self-service allowed' : 'Hidden for employee';
  }
  if (policy === 'HR Admin Policy') return 'Full HR operational access';
  if (policy === 'Payroll Admin Policy') return route.includes('payroll') || route === 'expenses' ? 'Payroll/finance ownership' : 'Usually restricted';
  if (policy === 'Recruiter Policy') return ['recruitment', 'documents'].includes(route) ? 'Recruitment workflow access' : 'Restricted unless assigned';
  if (policy === 'Manager Policy') return ['employees', 'performance', 'expenses', 'leave-balance'].includes(route) ? 'Team management access' : 'Limited self-service';
  if (policy === 'Panelist Policy') return route === 'recruitment' ? 'Interview feedback access only' : 'Limited self-service';
  return 'Review required';
}

function buildAssessmentQuestions(course) {
  const baseQuestions = (course.questions || []).map((question) => ({
    ...question,
    type: question.type || 'select'
  }));
  const topic = course.title || 'the subject';
  return [
    ...baseQuestions,
    {
      id: `theory-${course.id}`,
      type: 'textarea',
      question: `Explain the most important idea you learned from ${topic}. Include one practical workplace example.`
    },
    {
      id: `multi-${course.id}`,
      type: 'checkbox',
      question: `Select the learning actions that show good understanding of ${topic}.`,
      options: ['Apply the concept in a real scenario', 'Memorize only the title', 'Document assumptions clearly', 'Ignore feedback from reviewers'],
      answer: ['Apply the concept in a real scenario', 'Document assumptions clearly']
    },
    {
      id: `code-${course.id}`,
      type: 'coding',
      question: `Write pseudocode, steps, or a small code-like solution that demonstrates ${topic} in practice.`
    }
  ];
}

function primaryAccessSummary(policy, routes) {
  const labels = routes
    .map((route) => permissionForms.find(([id]) => id === route)?.[1])
    .filter(Boolean)
    .slice(0, 3);
  if (policy === 'HR Admin Policy') return 'All HRMS modules';
  if (!labels.length) return 'No modules assigned';
  return `${labels.join(', ')}${routes.length > labels.length ? ` +${routes.length - labels.length} more` : ''}`;
}

function avg(values) {
  const nums = values.map(Number).filter(Boolean);
  return nums.length ? Math.round(nums.reduce((sum, value) => sum + value, 0) / nums.length) : 0;
}

function money(value) {
  return Number(value || 0).toLocaleString('en-IN');
}

function initials(name = '') {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function toTitle(value = '') {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function slugify(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'master-record';
}

function formatDate(value) {
  if (!value) return 'Not fixed';
  return new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

function departmentColor(index) {
  return ['#62a51b', '#d64d7f', '#24a979', '#0b5f87', '#f08a00', '#7c3aed'][index % 6];
}

createRoot(document.getElementById('root')).render(<App />);
