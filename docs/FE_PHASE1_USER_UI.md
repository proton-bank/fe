# Frontend Phase 1: User UI Implementation

> **Tech Stack**: React 18 + TypeScript + Vite + TailwindCSS + React Router v6
> **Backend**: FastAPI tại `http://localhost:8000`
> **Auth**: JWT Bearer Token (lưu localStorage)

---

## 1. Tổng quan & Mục tiêu

Phase 1 triển khai toàn bộ giao diện người dùng **không bao gồm Chat/Agent**. Bao gồm:

- **Landing Page** – Giới thiệu sản phẩm, hướng dẫn sử dụng cho interviewer
- **Auth** – Đăng ký / Đăng nhập (PIN-based)
- **Dashboard** – Tổng quan tài khoản, số dư, giao dịch gần đây
- **Transfer** – Chuyển tiền (Deposit / Withdraw / Transfer)
- **Transaction History** – Lịch sử giao dịch
- **Contacts** – Quản lý danh bạ người nhận
- **FAQ Browser** – Xem câu hỏi thường gặp (user)
- **FAQ Management** – CRUD FAQ (admin only)

---

## 2. Layout hệ thống & Chia màn hình

### 2.1 Layout tổng thể (Sau đăng nhập)

```
┌─────────────────────────────────────────────────────────────────┐
│                        TOP NAV BAR                              │
│  [Logo Proton Bank]              [User: Alice ▼] [Logout]       │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│   SIDEBAR    │              MAIN CONTENT AREA                   │
│   (240px)    │              (flex-1, scrollable)                 │
│              │                                                  │
│  ┌────────┐  │  ┌──────────────────────────────────────────┐    │
│  │Dashboard│  │  │                                          │    │
│  │Transfer │  │  │   Dynamic content based on route         │    │
│  │History  │  │  │                                          │    │
│  │Contacts │  │  │                                          │    │
│  │FAQ      │  │  │                                          │    │
│  │─────────│  │  │                                          │    │
│  │FAQ Mgmt │  │  │                                          │    │
│  │(admin)  │  │  │                                          │    │
│  └────────┘  │  └──────────────────────────────────────────┘    │
│              │                                                  │
│  ┌────────┐  │                                                  │
│  │AI Chat │  │  (Chat button → Phase 2)                         │
│  │(Phase2)│  │                                                  │
│  └────────┘  │                                                  │
├──────────────┴──────────────────────────────────────────────────┤
│                        FOOTER (optional)                        │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Responsive behavior

| Breakpoint   | Sidebar       | Content         |
|-------------|---------------|-----------------|
| `>= 1024px` | Cố định 240px | Flex-1          |
| `768–1023px` | Collapsible (icon only 64px) | Flex-1 |
| `< 768px`   | Hidden, hamburger menu overlay | Full width |

---

## 3. UI/UX Flow chi tiết

### 3.1 Landing Page (Route: `/`)

**Mục đích**: Trang chào mừng dành cho interviewer, giới thiệu cách hoạt động của app.

```
┌─────────────────────────────────────────────────────────────┐
│                     HERO SECTION                            │
│                                                             │
│       🏦  Welcome to Proton Bank                            │
│       "AI-Powered Digital Banking Platform"                 │
│                                                             │
│       [Get Started]  [Login]                                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                  HOW IT WORKS (3 cards)                      │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  1. AskChat │ │  2. PayChat │ │  3. Classic  │           │
│  │  ──────────-│ │  ──────────-│ │     UI       │           │
│  │  Hỏi đáp   │ │  Chuyển tiền│ │  ──────────- │           │
│  │  FAQ ngân   │ │  qua AI     │ │  Giao diện   │           │
│  │  hàng số    │ │  chatbot    │ │  truyền thống│           │
│  │  bằng AI    │ │             │ │  đầy đủ      │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│              ARCHITECTURE OVERVIEW                          │
│                                                             │
│   Diagram minh họa kiến trúc:                               │
│   Frontend → FastAPI → Service Layer → SQLite + ChromaDB    │
│   Agent (GPT-5.4) → Tool Calling → cùng Service Layer       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│              DEMO ACCOUNTS                                  │
│                                                             │
│   ┌─────────────────────────────────────────────┐           │
│   │  Username: alice  │  PIN: 123456  │  user   │           │
│   │  Username: bob    │  PIN: 654321  │  user   │           │
│   │  Username: admin  │  PIN: 000000  │  admin  │           │
│   └─────────────────────────────────────────────┘           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│              TECH STACK (badges)                             │
│  React · FastAPI · SQLite · ChromaDB · OpenAI GPT-5.4       │
│  JWT Auth · SSE Streaming · ReAct Agent Loop                │
│                                                             │
│                    [Get Started →]                           │
└─────────────────────────────────────────────────────────────┘
```

**Nội dung bắt buộc:**

1. **Hero**: Tên app, tagline, 2 CTA buttons (Get Started → `/signup`, Login → `/login`)
2. **How It Works**: 3 cards giải thích AskChat, PayChat, Classic UI
3. **Architecture**: Diagram đơn giản (có thể dùng ảnh hoặc CSS) mô tả flow
4. **Demo Accounts**: Bảng hiển thị tài khoản demo để interviewer test nhanh
5. **Tech Stack**: Badges các công nghệ sử dụng
6. **CTA cuối trang**: Nút bắt đầu

### 3.2 Auth: Signup (Route: `/signup`)

```
┌──────────────────────────────────────┐
│         Create Your Account          │
│                                      │
│  Full Name    [________________]     │
│  Username     [________________]     │
│  PIN          [______] (4-12 digits) │
│  Confirm PIN  [______]               │
│  Role         (○ User  ○ Admin)      │
│                                      │
│           [Sign Up]                  │
│                                      │
│  Already have an account? [Login]    │
└──────────────────────────────────────┘
```

**API**: `POST /api/auth/signup`
```json
// Request
{ "username": "alice", "full_name": "Alice Nguyen", "pin": "123456", "role": "user" }

// Response 200
{ "access_token": "eyJ...", "token_type": "bearer" }
```

**UX Flow**:
1. User điền form → validate client-side (username 3-50 chars, PIN 4-12 digits, confirm PIN match)
2. Submit → call API → nhận JWT
3. Lưu JWT vào `localStorage` → redirect `/dashboard`
4. Nếu lỗi (username trùng) → hiện toast error

### 3.3 Auth: Login (Route: `/login`)

```
┌──────────────────────────────────────┐
│           Welcome Back               │
│                                      │
│  Username     [________________]     │
│  PIN          [______]               │
│                                      │
│           [Login]                    │
│                                      │
│  Don't have an account? [Sign Up]    │
└──────────────────────────────────────┘
```

**API**: `POST /api/auth/login`
```json
// Request
{ "username": "alice", "pin": "123456" }

// Response 200
{ "access_token": "eyJ...", "token_type": "bearer" }
```

### 3.4 Dashboard (Route: `/dashboard`)

```
┌──────────────────────────────────────────────────────────────┐
│  Good morning, Alice!                                        │
│                                                              │
│  ┌─────────────────────────────┐  ┌────────────────────────┐ │
│  │  ACCOUNT BALANCE            │  │  QUICK ACTIONS         │ │
│  │                             │  │                        │ │
│  │  50,000,000 VND             │  │  [Transfer Money]      │ │
│  │                             │  │  [Deposit]             │ │
│  │  Account: 1001000001        │  │  [Withdraw]            │ │
│  │  Currency: VND              │  │  [View Contacts]       │ │
│  └─────────────────────────────┘  └────────────────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  RECENT TRANSACTIONS (5 gần nhất)                        ││
│  │                                                          ││
│  │  ↗ Transfer   -500,000 VND   → Bob Tran    10:30 AM     ││
│  │  ↙ Deposit  +1,000,000 VND                  09:15 AM     ││
│  │  ↗ Transfer   -200,000 VND   → Bob Tran    Yesterday     ││
│  │                                                          ││
│  │                    [View All →]                           ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

**APIs cần gọi khi mount**:
- `GET /api/accounts/me` → lấy balance, account_number
- `GET /api/transactions/history?limit=5` → 5 giao dịch gần nhất

**Hiển thị**:
- Balance format: `Intl.NumberFormat('vi-VN')` → `50.000.000 VND`
- Transaction type icon: deposit (↙ xanh), withdrawal (↗ đỏ), transfer (↗ cam)
- Relative time: "10:30 AM", "Yesterday", "Mar 12"

### 3.5 Transfer Money (Route: `/transfer`)

UI chia 3 tabs: **Transfer** | **Deposit** | **Withdraw**

#### Tab Transfer

```
┌──────────────────────────────────────────────────┐
│  [Transfer]  [Deposit]  [Withdraw]               │
│                                                  │
│  ┌──── STEP 1: Recipient ─────────────────────┐  │
│  │                                             │  │
│  │  To Account Number  [__________]  [Lookup]  │  │
│  │                                             │  │
│  │  ✓ Bob Tran (bob) - 1001000002              │  │
│  │                                             │  │
│  │  ── OR select from contacts ──              │  │
│  │  [▼ Select Contact     ]                    │  │
│  │                                             │  │
│  └─────────────────────────────────────────────┘  │
│                                                  │
│  ┌──── STEP 2: Amount & Description ──────────┐  │
│  │                                             │  │
│  │  Amount (VND)   [__________]                │  │
│  │  Description    [__________]  (optional)    │  │
│  │                                             │  │
│  │  Your balance: 50,000,000 VND               │  │
│  └─────────────────────────────────────────────┘  │
│                                                  │
│  ┌──── STEP 3: Confirm ───────────────────────┐  │
│  │                                             │  │
│  │  From: 1001000001 (You)                     │  │
│  │  To:   1001000002 (Bob Tran)                │  │
│  │  Amount: 500,000 VND                        │  │
│  │  Description: "Trả tiền ăn trưa"           │  │
│  │                                             │  │
│  │         [Cancel]  [Confirm Transfer]        │  │
│  └─────────────────────────────────────────────┘  │
│                                                  │
│  ── RESULT ──────────────────────────────────-   │
│  ✅ Transfer successful!                         │
│  Transaction ID: abc-123-def                     │
│  Amount: 500,000 VND                             │
│  New balance: 49,500,000 VND                     │
└──────────────────────────────────────────────────┘
```

**APIs**:
- `GET /api/accounts/{account_number}` → lookup recipient info
- `GET /api/contacts` → populate contact dropdown
- `POST /api/transactions/transfer` → execute transfer
- `GET /api/accounts/me` → refresh balance after transfer

```json
// POST /api/transactions/transfer
// Request
{ "to_account_number": "1001000002", "amount": 500000, "description": "Trả tiền ăn trưa" }

// Response 200
{
  "id": "uuid",
  "type": "transfer",
  "from_account_id": "uuid",
  "to_account_id": "uuid",
  "amount": 500000,
  "description": "Trả tiền ăn trưa",
  "status": "success",
  "created_at": "2026-03-13T10:30:00Z"
}
```

#### Tab Deposit / Withdraw

```
┌──────────────────────────────────────┐
│  Amount (VND)   [__________]         │
│  Description    [__________]         │
│                                      │
│         [Confirm Deposit]            │
│                                      │
│  Current balance: 50,000,000 VND     │
└──────────────────────────────────────┘
```

**APIs**:
- `POST /api/transactions/deposit` → `{ "amount": 1000000, "description": "Nạp tiền" }`
- `POST /api/transactions/withdraw` → `{ "amount": 500000, "description": "Rút tiền" }`

### 3.6 Transaction History (Route: `/history`)

```
┌──────────────────────────────────────────────────────────────────┐
│  Transaction History                                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Type ▼ │ Amount      │ Counterpart    │ Description │ Date   ││
│  │────────│─────────────│────────────────│─────────────│────────││
│  │ ↗ Txfr │ -500,000    │ → Bob Tran     │ Tiền ăn     │ 10:30  ││
│  │ ↙ Dep  │ +1,000,000  │ System         │ Nạp tiền    │ 09:15  ││
│  │ ↗ Wdr  │ -200,000    │ System         │ Rút ATM     │ Y'day  ││
│  │ ↙ Txfr │ +300,000    │ ← Alice Nguyen │ Trả nợ     │ Mar 11 ││
│  │ ...    │             │                │             │        ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Showing 20 of 20 transactions          [Load More (limit=50)]   │
└──────────────────────────────────────────────────────────────────┘
```

**API**: `GET /api/transactions/history?limit=20`

**UX Details**:
- Color coding: incoming (xanh lá), outgoing (đỏ)
- Amount format: `+1.000.000` / `-500.000`
- Load more: tăng `limit` lên 50, 100

### 3.7 Contacts (Route: `/contacts`)

```
┌────────────────────────────────────────────────────────────────┐
│  My Contacts                                    [+ Add Contact]│
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 👤 Bob Tran (bob)                                        │  │
│  │    Account: 1001000002                                   │  │
│  │    Nickname: "Bob"                   [Transfer] [Delete] │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ 👤 Charlie Le (charlie)                                  │  │
│  │    Account: 1001000003                                   │  │
│  │    Nickname: "Chú Charlie"           [Transfer] [Delete] │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ── Add Contact Dialog ──                                      │
│  ┌──────────────────────────────────────────┐                  │
│  │  Username    [__________]                │                  │
│  │  Nickname    [__________] (optional)     │                  │
│  │              [Cancel] [Add]              │                  │
│  └──────────────────────────────────────────┘                  │
└────────────────────────────────────────────────────────────────┘
```

**APIs**:
- `GET /api/contacts` → danh sách contacts
- `POST /api/contacts` → `{ "contact_username": "bob", "nickname": "Bob" }`
- `DELETE /api/contacts/{contact_id}` → xóa contact
- `GET /api/contacts/users` → danh sách users để suggest

**UX**: Nút [Transfer] → navigate đến `/transfer` với account_number pre-filled.

### 3.8 FAQ Browser (Route: `/faq`)

```
┌────────────────────────────────────────────────────────────────┐
│  Frequently Asked Questions                                    │
│                                                                │
│  [🔍 Search FAQs...                              ]             │
│                                                                │
│  Categories: [All] [Tài khoản] [Chuyển tiền] [Bảo mật] [...]  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ▶ Làm sao để mở tài khoản ngân hàng số?                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ ▼ Hạn mức chuyển tiền một ngày?                          │  │
│  │   Tối đa 500 triệu VND/ngày cho cá nhân. Doanh nghiệp  │  │
│  │   tối đa 2 tỷ VND/ngày...                                │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ ▶ Phí chuyển tiền là bao nhiêu?                          │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ ▶ Cách đổi mã PIN?                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

**APIs**:
- `GET /api/faqs` → tất cả FAQs
- `GET /api/faqs/search?q=chuyển+tiền` → tìm kiếm (semantic search)
- `GET /api/faqs/categories` → danh mục

**UX**: Accordion expand/collapse. Search có debounce 300ms.

### 3.9 FAQ Management – Admin Only (Route: `/admin/faqs`)

```
┌────────────────────────────────────────────────────────────────┐
│  FAQ Management                                [+ Add FAQ]     │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Category │ Question                    │ Published │ Act  │  │
│  │──────────│─────────────────────────────│───────────│──────│  │
│  │ Tài khoản│ Mở tài khoản ngân hàng số? │    ✅     │ ✏️ 🗑│  │
│  │ Chuyển   │ Hạn mức chuyển tiền?        │    ✅     │ ✏️ 🗑│  │
│  │ Bảo mật  │ Cách đổi mã PIN?            │    ❌     │ ✏️ 🗑│  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ── Create/Edit FAQ Dialog ──                                  │
│  ┌──────────────────────────────────────────────┐              │
│  │  Category    [▼ Select Category     ]         │              │
│  │  Question    [________________________]       │              │
│  │  Answer      [                        ]       │              │
│  │              [                        ]       │              │
│  │  Published   [✓]                              │              │
│  │              [Cancel] [Save]                  │              │
│  └──────────────────────────────────────────────┘              │
│                                                                │
│  ── Category Management ──                [+ Add Category]     │
│  ┌──────────────────────────────────────────────┐              │
│  │ Tài khoản | Chuyển tiền | Bảo mật | Hỗ trợ  │              │
│  └──────────────────────────────────────────────┘              │
└────────────────────────────────────────────────────────────────┘
```

**APIs**:
- `GET /api/faqs` → danh sách
- `POST /api/faqs` → tạo mới
- `PUT /api/faqs/{faq_id}` → cập nhật
- `DELETE /api/faqs/{faq_id}` → xóa
- `GET /api/faqs/categories` → danh mục
- `POST /api/faqs/categories` → tạo danh mục

```json
// POST /api/faqs
{ "category_id": "uuid", "question": "...", "answer": "...", "is_published": true }

// PUT /api/faqs/{id}
{ "question": "...", "answer": "...", "is_published": false }

// POST /api/faqs/categories
{ "name": "Tài khoản", "description": "Câu hỏi về tài khoản" }
```

**Guard**: Chỉ hiển thị menu "FAQ Management" khi user có `role === "admin"` (decode JWT payload).

---

## 4. Routing & Navigation

```
/                   → Landing Page (public)
/login              → Login (public)
/signup             → Sign Up (public)
/dashboard          → Dashboard (auth required)
/transfer           → Transfer / Deposit / Withdraw (auth required)
/history            → Transaction History (auth required)
/contacts           → Contacts Management (auth required)
/faq                → FAQ Browser (auth required)
/admin/faqs         → FAQ Management (admin only)
```

### Route Guard Logic

```typescript
// ProtectedRoute: redirect to /login if no valid JWT
// AdminRoute: redirect to /dashboard if role !== "admin"

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (user?.role !== "admin") return <Navigate to="/dashboard" />;
  return children;
}
```

---

## 5. Component Architecture

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Router setup
│
├── api/
│   ├── client.ts               # Axios/fetch wrapper với JWT interceptor
│   ├── auth.ts                 # signup(), login()
│   ├── accounts.ts             # getMyAccount(), lookupAccount()
│   ├── transactions.ts         # transfer(), deposit(), withdraw(), getHistory()
│   ├── contacts.ts             # getContacts(), addContact(), deleteContact()
│   └── faqs.ts                 # getFaqs(), searchFaqs(), createFaq(), updateFaq(), ...
│
├── hooks/
│   ├── useAuth.ts              # Auth context hook
│   ├── useAccount.ts           # Account data hook
│   └── useToast.ts             # Toast notification hook
│
├── contexts/
│   └── AuthContext.tsx          # JWT storage, user state, login/logout
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx        # Sidebar + TopNav + Content
│   │   ├── Sidebar.tsx
│   │   ├── TopNav.tsx
│   │   └── Footer.tsx
│   ├── ui/                      # Reusable primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Badge.tsx
│   │   ├── Tabs.tsx
│   │   ├── Accordion.tsx
│   │   └── Toast.tsx
│   └── shared/
│       ├── AccountCard.tsx      # Balance display
│       ├── TransactionRow.tsx   # Single transaction display
│       └── ContactCard.tsx      # Single contact display
│
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx
│   ├── TransferPage.tsx
│   ├── HistoryPage.tsx
│   ├── ContactsPage.tsx
│   ├── FaqPage.tsx
│   └── admin/
│       └── FaqManagementPage.tsx
│
├── utils/
│   ├── formatCurrency.ts       # Intl.NumberFormat('vi-VN')
│   ├── formatDate.ts           # Relative date formatting
│   └── jwt.ts                  # Decode JWT, check expiry
│
└── types/
    ├── auth.ts
    ├── account.ts
    ├── transaction.ts
    ├── contact.ts
    └── faq.ts
```

---

## 6. State Management

Dùng **React Context** + **hooks** (không cần Redux cho scope này).

### 6.1 AuthContext

```typescript
interface AuthState {
  token: string | null;
  user: { id: string; username: string; role: string } | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (username: string, pin: string) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
}
```

**JWT Decode** (không cần thư viện, dùng `atob`):
```typescript
function decodeJWT(token: string): { sub: string; username: string; role: string; exp: number } {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload;
}
```

### 6.2 API Client

```typescript
const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 7. API Reference chi tiết

### 7.1 Auth

| Method | Endpoint | Auth | Request Body | Response |
|--------|----------|------|-------------|----------|
| `POST` | `/api/auth/signup` | No | `{ username, full_name, pin, role }` | `{ access_token, token_type }` |
| `POST` | `/api/auth/login` | No | `{ username, pin }` | `{ access_token, token_type }` |

### 7.2 Accounts

| Method | Endpoint | Auth | Request Body | Response |
|--------|----------|------|-------------|----------|
| `GET` | `/api/accounts/me` | Bearer | – | `{ id, user_id, account_number, balance, currency, created_at }` |
| `GET` | `/api/accounts/{account_number}` | Bearer | – | `{ account_number, full_name, username }` |
| `GET` | `/api/accounts/system-balance` | No | – | `{ system_balance }` |

### 7.3 Transactions

| Method | Endpoint | Auth | Request Body | Response |
|--------|----------|------|-------------|----------|
| `POST` | `/api/transactions/transfer` | Bearer | `{ to_account_number, amount, description? }` | `TransactionResponse` |
| `POST` | `/api/transactions/deposit` | Bearer | `{ amount, description? }` | `TransactionResponse` |
| `POST` | `/api/transactions/withdraw` | Bearer | `{ amount, description? }` | `TransactionResponse` |
| `GET` | `/api/transactions/history?limit=20` | Bearer | – | `TransactionResponse[]` |

**TransactionResponse**: `{ id, type, from_account_id, to_account_id, amount, description, status, created_at }`

### 7.4 Contacts

| Method | Endpoint | Auth | Request Body | Response |
|--------|----------|------|-------------|----------|
| `GET` | `/api/contacts` | Bearer | – | `ContactResponse[]` |
| `POST` | `/api/contacts` | Bearer | `{ contact_username, nickname? }` | `ContactResponse` |
| `DELETE` | `/api/contacts/{contact_id}` | Bearer | – | `{ status: "deleted" }` |
| `GET` | `/api/contacts/users` | Bearer | – | `User[]` |

**ContactResponse**: `{ id, user_id, contact_user_id, nickname, created_at, contact_username, contact_full_name, contact_account_number }`

### 7.5 FAQs

| Method | Endpoint | Auth | Request Body | Response |
|--------|----------|------|-------------|----------|
| `GET` | `/api/faqs` | No | – | `FAQResponse[]` |
| `GET` | `/api/faqs/search?q=...&limit=5` | No | – | `FAQSearchResult[]` |
| `GET` | `/api/faqs/{faq_id}` | No | – | `FAQResponse` |
| `POST` | `/api/faqs` | Admin | `{ category_id?, question, answer, is_published? }` | `FAQResponse` |
| `PUT` | `/api/faqs/{faq_id}` | Admin | `{ category_id?, question?, answer?, is_published? }` | `FAQResponse` |
| `DELETE` | `/api/faqs/{faq_id}` | Admin | – | `{ status: "deleted" }` |
| `GET` | `/api/faqs/categories` | No | – | `CategoryResponse[]` |
| `POST` | `/api/faqs/categories` | Admin | `{ name, description? }` | `CategoryResponse` |

---

## 8. TypeScript Types

```typescript
// auth.ts
interface SignupRequest {
  username: string;
  full_name: string;
  pin: string;
  role: 'user' | 'admin';
}

interface LoginRequest {
  username: string;
  pin: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

// account.ts
interface AccountResponse {
  id: string;
  user_id: string;
  account_number: string;
  balance: number;
  currency: string;
  created_at: string;
}

interface AccountPublicInfo {
  account_number: string;
  full_name: string;
  username: string;
}

// transaction.ts
interface TransferRequest {
  to_account_number: string;
  amount: number;
  description?: string;
}

interface DepositRequest {
  amount: number;
  description?: string;
}

interface WithdrawRequest {
  amount: number;
  description?: string;
}

interface TransactionResponse {
  id: string;
  type: 'transfer' | 'deposit' | 'withdrawal';
  from_account_id: string;
  to_account_id: string;
  amount: number;
  description: string;
  status: 'pending' | 'success' | 'failed';
  created_at: string;
}

// contact.ts
interface ContactAdd {
  contact_username: string;
  nickname?: string;
}

interface ContactResponse {
  id: string;
  user_id: string;
  contact_user_id: string;
  nickname: string;
  created_at: string;
  contact_username: string;
  contact_full_name: string;
  contact_account_number: string;
}

// faq.ts
interface FAQCreate {
  category_id?: string;
  question: string;
  answer: string;
  is_published?: boolean;
}

interface FAQUpdate {
  category_id?: string;
  question?: string;
  answer?: string;
  is_published?: boolean;
}

interface FAQResponse {
  id: string;
  category_id: string | null;
  question: string;
  answer: string;
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface FAQSearchResult {
  faq: FAQResponse;
  score: number;
}

interface CategoryCreate {
  name: string;
  description?: string;
}

interface CategoryResponse {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  created_at: string;
}
```

---

## 9. UX Guidelines

### 9.1 Design System

- **Colors**: Primary blue (#2563EB), Success green (#16A34A), Error red (#DC2626), Warning amber (#F59E0B)
- **Font**: Inter hoặc system font stack
- **Border radius**: 8px (cards), 6px (inputs), 9999px (badges)
- **Shadows**: `shadow-sm` cho cards, `shadow-lg` cho modals
- **Spacing**: dùng TailwindCSS spacing scale (p-4, m-6, gap-4)

### 9.2 Loading States

- Skeleton loaders cho data fetching (không dùng spinner full-page)
- Button loading: disable + spinner icon nhỏ trong button
- Optimistic updates cho delete contact

### 9.3 Error Handling

- Toast notifications cho success/error (góc phải trên, auto-dismiss 5s)
- Inline validation errors dưới input fields
- Empty states: illustration + message khi không có data

### 9.4 Accessibility

- Semantic HTML (`<nav>`, `<main>`, `<section>`)
- `aria-label` cho icon buttons
- Focus management cho modals
- Keyboard navigation cho forms

---

## 10. Setup & Development

```bash
# Tạo project
npm create vite@latest proton-bank-fe -- --template react-ts
cd proton-bank-fe

# Install dependencies
npm install react-router-dom axios tailwindcss @tailwindcss/vite
npm install -D @types/react @types/react-dom

# Vite config: proxy /api → http://localhost:8000
# hoặc set VITE_API_URL=http://localhost:8000
```

### Vite proxy config

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
    },
  },
});
```

---

## 11. Checklist Phase 1

- [ ] Project setup (Vite + React + TS + Tailwind)
- [ ] API client với JWT interceptor
- [ ] AuthContext + ProtectedRoute
- [ ] Landing Page
- [ ] Login / Signup pages
- [ ] AppLayout (Sidebar + TopNav)
- [ ] Dashboard page
- [ ] Transfer page (Transfer/Deposit/Withdraw tabs)
- [ ] Transaction History page
- [ ] Contacts page
- [ ] FAQ Browser page
- [ ] FAQ Management page (admin)
- [ ] Toast notification system
- [ ] Responsive design
- [ ] Error handling & loading states
