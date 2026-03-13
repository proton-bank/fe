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
            <Badge variant="outline">Interview Demo · Proton Bank</Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
              Welcome to Proton Bank
            </h1>
            <p className="text-slate-400">
              AI-powered digital banking platform. This Phase 1 frontend focuses
              on the classic UI: accounts, transfers, history, contacts, and
              FAQ management — without chat.
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
              What you can test in this demo:
            </p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Create a user or login with demo accounts</li>
              <li>• View balance and recent transactions</li>
              <li>• Transfer, deposit, withdraw between accounts</li>
              <li>• Manage contacts and FAQs (admin)</li>
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card
            title="AskChat"
            description="(Phase 2 – Chat UI)"
            className="bg-slate-900/70"
          >
            <p className="text-sm text-slate-400">
              Hỏi đáp về sản phẩm và tính năng ngân hàng số qua AI chatbot.
            </p>
          </Card>
          <Card
            title="PayChat"
            description="(Phase 2 – Chat UI)"
            className="bg-slate-900/70"
          >
            <p className="text-sm text-slate-400">
              Chuyển tiền trực tiếp trong ngữ cảnh hội thoại với AI.
            </p>
          </Card>
          <Card
            title="Classic UI"
            description="(Phase 1 – This project)"
            className="bg-slate-900/70"
          >
            <p className="text-sm text-slate-400">
              Giao diện web banking truyền thống: Dashboard, chuyển tiền,
              lịch sử, danh bạ, FAQ, và quản trị FAQ.
            </p>
          </Card>
        </section>

        {/* Architecture */}
        <section className="grid gap-6 md:grid-cols-[3fr,2fr]">
          <Card title="Architecture Overview">
            <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300">
              <p className="mb-3 text-slate-200">
                Frontend Phase 1 chỉ sử dụng classic UI:
              </p>
              <div className="space-y-2">
                <p>Frontend (React + Vite + Tailwind)</p>
                <p>→ FastAPI backend (`http://localhost:8000`)</p>
                <p>→ Service layer (accounts, transactions, contacts, FAQs)</p>
                <p>→ SQLite + ChromaDB (cho Phase 2 AI)</p>
              </div>
            </div>
          </Card>
          <Card title="Tech Stack" className="bg-slate-900/70">
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {[
                'React',
                'TypeScript',
                'Vite',
                'TailwindCSS',
                'FastAPI',
                'SQLite',
                'JWT Auth',
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-700 px-3 py-1 text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </Card>
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

