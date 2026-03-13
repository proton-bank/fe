import { Link, Navigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { useAuth } from '../hooks/useAuth'

const demoAccounts = [
  { username: 'alice', pin: '123456', role: 'user' },
  { username: 'bob', pin: '654321', role: 'user' },
  { username: 'admin', pin: '000000', role: 'admin' },
]

export default function LandingPage() {
  const { isAuthenticated, isHydrated } = useAuth()

  if (isHydrated && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10">
        {/* Hero */}
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-5">
            <Badge variant="outline">Proton Bank · AI Banking Demo</Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
              AI-powered Digital Banking Platform
            </h1>
            <p className="text-slate-400">
              Production-style demo for interviewers that showcases a full-stack
              AI banking app: classic web banking UI, AI AskChat for FAQs, and
              PayChat for natural-language money transfers.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="lg">
                  Login
                </Button>
              </Link>
            </div>
          </div>
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
            <p className="text-sm font-medium text-slate-300">
              How to demo in 2 minutes:
            </p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Login with a demo account or create a new one.</li>
              <li>• Explore dashboard, transfers, history, contacts, and FAQs.</li>
              <li>• Open the AI chat panel to try AskChat and PayChat flows.</li>
              <li>• Observe live tool calling and balance updates after chat transfers.</li>
            </ul>
          </div>
        </section>

        {/* Core capabilities */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card
            title="AskChat"
            description="AI-powered FAQ & product Q&A"
            className="bg-slate-900/70"
          >
            <p className="text-sm text-slate-400">
              Hỏi đáp về ngân hàng số qua AI. Agent sử dụng LanceDB + OpenAI
              embeddings để tìm kiếm FAQ theo ngữ nghĩa và trả lời có ngữ cảnh.
            </p>
          </Card>
          <Card
            title="PayChat"
            description="Money transfers via chatbot"
            className="bg-slate-900/70"
          >
            <p className="text-sm text-slate-400">
              Chuyển tiền bằng ngôn ngữ tự nhiên. Agent gọi các tools như
              <span className="font-mono"> transfer_money</span> và{' '}
              <span className="font-mono">list_contacts</span> để thực thi giao
              dịch thật trên backend.
            </p>
          </Card>
          <Card
            title="Classic Banking UI"
            description="Production-style internet banking"
            className="bg-slate-900/70"
          >
            <p className="text-sm text-slate-400">
              Giao diện web banking truyền thống: Dashboard, chuyển tiền,
              lịch sử, danh bạ, FAQ, và quản trị FAQ. Được bảo vệ bằng JWT,
              routing bằng React Router, và gọi FastAPI backend qua REST APIs.
            </p>
          </Card>
        </section>

        {/* Architecture */}
        <section className="grid gap-6 md:grid-cols-[3fr,2fr]">
          <Card title="Architecture Overview">
            <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300">
              <p className="mb-3 text-slate-200">
                End-to-end flow from browser to AI agent and databases:
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-slate-300">
                    Frontend (React + TypeScript)
                  </p>
                  <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                    <p>• Classic banking UI (dashboard, transfers, FAQ).</p>
                    <p>• AI Chat panel (AskChat &amp; PayChat) streaming via SSE.</p>
                    <p>• Auth via JWT stored in <span className="font-mono">localStorage</span>.</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-slate-300">
                    Backend &amp; Data (FastAPI + Python)
                  </p>
                  <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                    <p>• REST API layer at <span className="font-mono">/api</span>.</p>
                    <p>• Services for accounts, transactions, contacts, FAQs.</p>
                    <p>• SQLite for core banking data.</p>
                    <p>• LanceDB for FAQ embeddings (semantic search).</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                  <p className="mb-1 text-[11px] font-semibold text-sky-300">
                    AI Agent Layer
                  </p>
                  <p>
                    ReAct loop + OpenAI GPT-5.4. Agent nhận context từ
                    FastAPI, gọi tools và trả lời qua SSE.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                  <p className="mb-1 text-[11px] font-semibold text-emerald-300">
                    Tool Calling
                  </p>
                  <p>
                    Tools thao tác trực tiếp với service layer (chuyển tiền,
                    xem lịch sử, tìm FAQ, đọc danh bạ).
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                  <p className="mb-1 text-[11px] font-semibold text-violet-300">
                    Data Stores
                  </p>
                  <p>SQLite cho transactional data, LanceDB cho vector search.</p>
                </div>
              </div>
            </div>
          </Card>
          <Card title="Tech Stack" className="bg-slate-900/70">
            <div className="mt-3 grid gap-4 text-xs md:grid-cols-2">
              <div>
                <p className="mb-2 font-semibold text-slate-200">Frontend</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'React 19',
                    'TypeScript',
                    'Vite 8',
                    'TailwindCSS',
                    'React Router v7',
                    'Axios',
                    'SSE (fetch + ReadableStream)',
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-700 px-3 py-1 text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-slate-200">Backend</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Python 3.11',
                    'FastAPI',
                    'SQLite (aiosqlite)',
                    'LanceDB (vector search)',
                    'OpenAI GPT-5.4',
                    'text-embedding-3-small',
                    'JWT Auth (bcrypt)',
                    'ReAct Agent + Tools',
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-700 px-3 py-1 text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* AI Agent deep dive */}
        <section className="grid gap-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-6 md:grid-cols-[2fr,3fr]">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              AI Agent · ReAct + Tool Calling
            </h2>
            <p className="text-sm text-slate-400">
              Agent chạy trong FastAPI sử dụng OpenAI Responses API với mô hình
              GPT-5.4. Mỗi message có thể kích hoạt vòng lặp ReAct tối đa 6 bước
              để suy nghĩ, gọi tools, đọc kết quả rồi trả lời.
            </p>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>
                • <span className="font-medium text-slate-200">ReAct loop</span>:
                Think → Act (tool) → Observe → lặp lại cho đến khi có câu trả lời.
              </li>
              <li>
                • <span className="font-medium text-slate-200">Tools</span>:{' '}
                <span className="font-mono">transfer_money</span>,{' '}
                <span className="font-mono">get_transaction_history</span>,{' '}
                <span className="font-mono">search_faq</span>,{' '}
                <span className="font-mono">list_contacts</span>.
              </li>
              <li>
                • <span className="font-medium text-slate-200">User context</span>:
                Agent nhận profile (username, account, balance) để trả lời đúng
                cho từng user.
              </li>
            </ul>
          </div>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="mb-2 text-[11px] font-semibold text-slate-200">
                Example: PayChat transfer flow
              </p>
              <ol className="space-y-1">
                <li>1. User: “Chuyển 500k cho Bob”.</li>
                <li>2. Agent gửi event <span className="font-mono">status: thinking</span>.</li>
                <li>
                  3. Agent gọi tool{' '}
                  <span className="font-mono">list_contacts()</span> để tìm Bob.
                </li>
                <li>
                  4. Agent confirm qua message: “Chuyển 500.000 VND cho Bob (1001000002)
                  – đồng ý chứ?”.
                </li>
                <li>
                  5. Sau khi user xác nhận, agent gọi{' '}
                  <span className="font-mono">transfer_money</span> và trả về kết quả.
                </li>
                <li>
                  6. Frontend nhận event{' '}
                  <span className="font-mono">tool_result</span> và tự động refresh
                  số dư.
                </li>
              </ol>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="mb-2 text-[11px] font-semibold text-slate-200">
                SSE event stream (simplified)
              </p>
              <pre className="overflow-x-auto text-[10px] leading-relaxed text-slate-300">
                <code>
                  event: status{'\n'}
                  data: &#123;&#34;status&#34;: &#34;thinking&#34;&#125;{'\n'}
                  {'\n'}
                  event: tool_call{'\n'}
                  data: &#123;&#34;name&#34;: &#34;transfer_money&#34;, ...&#125;
                  {'\n'}
                  {'\n'}
                  event: tool_result{'\n'}
                  data: &#123;&#34;status&#34;: &#34;success&#34;, ...&#125;{'\n'}
                  {'\n'}
                  event: message{'\n'}
                  data: &#123;&#34;content&#34;: &#34;Đã chuyển thành công...&#34;&#125;
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Demo accounts */}
        <section>
          <Card title="Demo Accounts">
            <div className="mt-3 overflow-hidden rounded-xl border border-slate-800">
              <table className="min-w-full text-sm text-slate-200">
                <thead className="bg-slate-900/80 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-2 text-left">Username</th>
                    <th className="px-4 py-2 text-left">PIN</th>
                    <th className="px-4 py-2 text-left">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {demoAccounts.map((acc) => (
                    <tr
                      key={acc.username}
                      className="border-t border-slate-800/80 bg-slate-950/60"
                    >
                      <td className="px-4 py-2 font-mono text-xs">
                        {acc.username}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs">
                        {acc.pin}
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={acc.role === 'admin' ? 'warning' : 'default'}
                        >
                          {acc.role}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Final CTA */}
        <section className="flex flex-col items-center gap-3 border-t border-slate-800 pt-6 text-center">
          <p className="text-sm text-slate-300">
            Ready to explore? Use a demo account or create a new one.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/signup">
              <Button size="md">Create an account</Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="md">
                Login with demo accounts
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

