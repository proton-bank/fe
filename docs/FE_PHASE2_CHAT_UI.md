# Frontend Phase 2: AI Chat Window Implementation

> **Prerequisite**: Phase 1 hoàn thành (Auth, Layout, API client đã có)
> **Core Feature**: AskChat (FAQ Q&A) + PayChat (Transfer via chatbot)
> **Protocol**: Server-Sent Events (SSE) streaming

---

## 1. Tổng quan

Phase 2 triển khai **AI Chat Window** – cửa sổ chat tương tác với Agent AI, cho phép:

- **AskChat**: Hỏi đáp FAQ ngân hàng số (semantic search qua ChromaDB)
- **PayChat**: Thực hiện giao dịch qua hội thoại tự nhiên (check balance, transfer, lookup account)
- **Conversation Management**: Lịch sử hội thoại, tạo mới, xem lại

---

## 2. Layout tích hợp Chat

### 2.1 Chat button + Sliding panel

Chat window **không phải** một page riêng, mà là một **sliding panel** bên phải, hoạt động overlay/alongside content hiện tại.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           TOP NAV BAR                                   │
├──────────┬─────────────────────────────────┬────────────────────────────┤
│          │                                 │                            │
│ SIDEBAR  │      MAIN CONTENT               │      CHAT PANEL            │
│ (240px)  │      (flex-1)                   │      (420px, sliding)      │
│          │                                 │                            │
│ Dashboard│  ┌─────────────────────────┐    │  ┌──────────────────────┐  │
│ Transfer │  │                         │    │  │  CHAT HEADER         │  │
│ History  │  │  (Current page content) │    │  │  Proton AI ✦  [✕]   │  │
│ Contacts │  │                         │    │  ├──────────────────────┤  │
│ FAQ      │  │                         │    │  │                      │  │
│ ──────── │  │                         │    │  │  MESSAGES AREA       │  │
│ FAQ Mgmt │  │                         │    │  │  (scrollable)        │  │
│          │  │                         │    │  │                      │  │
│          │  │                         │    │  │  User: Số dư?        │  │
│          │  └─────────────────────────┘    │  │  ┌────────────────┐  │  │
│          │                                 │  │  │🔧 Checking...  │  │  │
│          │                                 │  │  │get_account_    │  │  │
│          │                                 │  │  │balance         │  │  │
│          │                                 │  │  └────────────────┘  │  │
│          │                                 │  │  AI: Số dư hiện tại │  │
│          │                                 │  │  là 50.000.000 VND  │  │
│          │                                 │  │                      │  │
│ ┌──────┐ │                                 │  ├──────────────────────┤  │
│ │💬 AI │ │                                 │  │  MESSAGE INPUT       │  │
│ │ Chat │ │                                 │  │  [Type message...] ➤ │  │
│ └──────┘ │                                 │  └──────────────────────┘  │
├──────────┴─────────────────────────────────┴────────────────────────────┤
│                             FOOTER                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Chat Panel States

| State | Behavior |
|-------|----------|
| **Closed** | Chat button visible ở sidebar (hoặc floating button). Main content full width. |
| **Open** | Panel slides in từ phải (420px). Main content co lại. Transition 300ms ease. |
| **Mobile** (`< 768px`) | Panel full-screen overlay với nút back. |
| **Expanded** | Optional: double-click header → panel mở rộng 600px hoặc full width. |

### 2.3 Conversation list mode vs Chat mode

```
CHAT PANEL có 2 trạng thái nội bộ:

┌────────────────────────┐     ┌────────────────────────┐
│   CONVERSATION LIST    │     │     ACTIVE CHAT        │
│                        │     │                        │
│  [+ New Chat]          │     │  [← Back]  Title  [✕]  │
│                        │     │                        │
│  ┌──────────────────┐  │     │  ┌──────────────────┐  │
│  │ Hỏi về số dư     │  │ ──► │  │ Messages...      │  │
│  │ 10:30 AM         │  │     │  │                  │  │
│  ├──────────────────┤  │     │  │                  │  │
│  │ Chuyển tiền cho  │  │     │  │                  │  │
│  │ Bob              │  │     │  │                  │  │
│  │ Yesterday        │  │     │  │                  │  │
│  ├──────────────────┤  │     │  │                  │  │
│  │ FAQ tài khoản    │  │     │  │                  │  │
│  │ Mar 11           │  │     │  └──────────────────┘  │
│  └──────────────────┘  │     │                        │
│                        │     │  [Type message...] ➤   │
└────────────────────────┘     └────────────────────────┘
```

---

## 3. SSE Protocol chi tiết

### 3.1 API Endpoint

```
POST /api/chat
Content-Type: application/json
Authorization: Bearer <jwt_token>

Body: {
  "conversation_id": "uuid" | null,   // null = tạo conversation mới
  "message": "Số dư của tôi là bao nhiêu?"
}

Response: text/event-stream (SSE)
```

### 3.2 SSE Event Types

Server gửi về các event theo thứ tự:

```
event: conversation_created
data: {"conversation_id": "uuid"}

event: title_generated
data: {"conversation_id": "uuid", "title": "Hỏi về số dư tài khoản"}

event: status
data: {"status": "thinking"}

event: tool_call
data: {"name": "get_account_balance", "call_id": "call_abc123", "arguments": {}}

event: tool_result
data: {"name": "get_account_balance", "call_id": "call_abc123", "output": {"balance": 50000000, "currency": "VND", "account_number": "1001000001"}}

event: status
data: {"status": "thinking"}

event: message
data: {"content": "Số dư tài khoản hiện tại của bạn là 50.000.000 VND."}

event: done
data: {"conversation_id": "uuid"}
```

**Khi có lỗi:**
```
event: error
data: {"message": "Max iterations reached without final answer."}
```

### 3.3 Flow theo kịch bản

#### Kịch bản 1: Hỏi FAQ đơn giản
```
→ User: "Phí chuyển tiền bao nhiêu?"
← conversation_created
← title_generated
← status: thinking
← tool_call: search_faq(query="Phí chuyển tiền")
← tool_result: search_faq → [FAQ results...]
← status: thinking
← message: "Phí chuyển tiền nội bộ Proton Bank miễn phí..."
← done
```

#### Kịch bản 2: Chuyển tiền (multi-turn)
```
→ User: "Chuyển 500k cho Bob"
← status: thinking
← tool_call: list_contacts()
← tool_result: [{bob: 1001000002}]
← status: thinking
← message: "Tôi sẽ chuyển 500.000 VND cho Bob (1001000002). Xác nhận?"

→ User: "OK, chuyển đi"
← status: thinking
← tool_call: transfer_money(to_account_number="1001000002", amount=500000)
← tool_result: {status: "success", ...}
← status: thinking
← message: "Đã chuyển thành công 500.000 VND cho Bob Tran."
← done
```

#### Kịch bản 3: Check balance + trả lời trực tiếp
```
→ User: "Số dư?"
← status: thinking
← tool_call: get_account_balance()
← tool_result: {balance: 50000000, currency: "VND"}
← status: thinking
← message: "Số dư hiện tại: 50.000.000 VND"
← done
```

---

## 4. Component Architecture

### 4.1 Component Tree

```
src/
├── components/
│   └── chat/
│       ├── ChatPanel.tsx           # Container chính, sliding panel
│       ├── ChatToggleButton.tsx    # Nút mở/đóng chat ở sidebar
│       │
│       ├── ConversationList.tsx    # Danh sách conversations
│       ├── ConversationItem.tsx    # Một conversation row
│       │
│       ├── ChatWindow.tsx         # Active chat view
│       ├── ChatHeader.tsx         # Title + back button + close
│       ├── MessageList.tsx        # Scrollable message container
│       ├── ChatMessage.tsx        # Một message bubble
│       ├── ToolCallCard.tsx       # Tool call visualization
│       ├── ToolResultCard.tsx     # Tool result display
│       ├── ThinkingIndicator.tsx  # "AI is thinking..." animation
│       ├── ChatInput.tsx          # Input + send button
│       │
│       └── MarkdownRenderer.tsx   # Render markdown trong responses
│
├── hooks/
│   ├── useChat.ts                 # Chat state management hook
│   ├── useSSE.ts                  # SSE connection hook
│   └── useConversations.ts        # Conversation list hook
│
├── contexts/
│   └── ChatContext.tsx            # Chat panel open/close state
│
└── types/
    └── chat.ts                    # Chat-specific types
```

### 4.2 Types

```typescript
// types/chat.ts

type MessageRole = 'user' | 'assistant' | 'tool';
type MessageType = 'message' | 'function_call' | 'function_call_output';

interface ChatMessage {
  id: string;
  role: MessageRole;
  type: MessageType;
  content?: string;
  function_name?: string;
  function_arguments?: string;
  function_output?: string;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

// SSE Event Types
type SSEEventType =
  | 'conversation_created'
  | 'title_generated'
  | 'status'
  | 'tool_call'
  | 'tool_result'
  | 'message'
  | 'done'
  | 'error';

interface SSEEvent {
  event: SSEEventType;
  data: Record<string, any>;
}

// UI State for rendering
interface UIMessage {
  id: string;
  type: 'user' | 'assistant' | 'tool_call' | 'tool_result' | 'thinking' | 'error';
  content?: string;
  toolName?: string;
  toolCallId?: string;
  toolArguments?: Record<string, any>;
  toolOutput?: Record<string, any>;
  timestamp: Date;
}

type ChatPanelView = 'conversation_list' | 'active_chat';
type ChatStatus = 'idle' | 'sending' | 'thinking' | 'streaming' | 'error';
```

---

## 5. SSE Client Implementation

### 5.1 useSSE Hook

```typescript
// hooks/useSSE.ts
import { useCallback, useRef } from 'react';

interface UseSSEOptions {
  onEvent: (event: SSEEvent) => void;
  onError: (error: Error) => void;
  onComplete: () => void;
}

export function useSSE({ onEvent, onError, onComplete }: UseSSEOptions) {
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async (conversationId: string | null, message: string) => {
    // Abort previous connection if any
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let currentEvent = '';
        let currentData = '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            currentData = line.slice(6).trim();
          } else if (line === '' && currentEvent && currentData) {
            try {
              const parsed: SSEEvent = {
                event: currentEvent as SSEEventType,
                data: JSON.parse(currentData),
              };
              onEvent(parsed);
            } catch (e) {
              console.error('SSE parse error:', e);
            }
            currentEvent = '';
            currentData = '';
          }
        }
      }

      onComplete();
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        onError(error);
      }
    }
  }, [onEvent, onError, onComplete]);

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { send, abort };
}
```

### 5.2 useChat Hook

```typescript
// hooks/useChat.ts
import { useCallback, useState } from 'react';
import { useSSE } from './useSSE';

interface UseChatReturn {
  messages: UIMessage[];
  status: ChatStatus;
  conversationId: string | null;
  title: string | null;
  sendMessage: (text: string) => void;
  loadConversation: (convId: string) => Promise<void>;
  newConversation: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  const handleEvent = useCallback((event: SSEEvent) => {
    switch (event.event) {
      case 'conversation_created':
        setConversationId(event.data.conversation_id);
        break;

      case 'title_generated':
        setTitle(event.data.title);
        break;

      case 'status':
        if (event.data.status === 'thinking') {
          setStatus('thinking');
          setMessages(prev => {
            // Replace existing thinking indicator or add new one
            const withoutThinking = prev.filter(m => m.type !== 'thinking');
            return [...withoutThinking, {
              id: `thinking-${Date.now()}`,
              type: 'thinking',
              timestamp: new Date(),
            }];
          });
        }
        break;

      case 'tool_call':
        setMessages(prev => {
          const withoutThinking = prev.filter(m => m.type !== 'thinking');
          return [...withoutThinking, {
            id: `tool-call-${event.data.call_id}`,
            type: 'tool_call',
            toolName: event.data.name,
            toolCallId: event.data.call_id,
            toolArguments: event.data.arguments,
            timestamp: new Date(),
          }];
        });
        break;

      case 'tool_result':
        setMessages(prev => [...prev, {
          id: `tool-result-${event.data.call_id}`,
          type: 'tool_result',
          toolName: event.data.name,
          toolCallId: event.data.call_id,
          toolOutput: event.data.output,
          timestamp: new Date(),
        }]);
        break;

      case 'message':
        setMessages(prev => {
          const withoutThinking = prev.filter(m => m.type !== 'thinking');
          return [...withoutThinking, {
            id: `assistant-${Date.now()}`,
            type: 'assistant',
            content: event.data.content,
            timestamp: new Date(),
          }];
        });
        setStatus('idle');
        break;

      case 'done':
        setStatus('idle');
        break;

      case 'error':
        setMessages(prev => {
          const withoutThinking = prev.filter(m => m.type !== 'thinking');
          return [...withoutThinking, {
            id: `error-${Date.now()}`,
            type: 'error',
            content: event.data.message,
            timestamp: new Date(),
          }];
        });
        setStatus('error');
        break;
    }
  }, []);

  const { send, abort } = useSSE({
    onEvent: handleEvent,
    onError: (err) => {
      setStatus('error');
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        type: 'error',
        content: err.message,
        timestamp: new Date(),
      }]);
    },
    onComplete: () => setStatus('idle'),
  });

  const sendMessage = useCallback((text: string) => {
    const userMsg: UIMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setStatus('sending');
    send(conversationId, text);
  }, [conversationId, send]);

  const loadConversation = useCallback(async (convId: string) => {
    setConversationId(convId);
    setStatus('idle');

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/chat/conversations/${convId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: ChatMessage[] = await res.json();

    const uiMessages: UIMessage[] = data
      .filter(m => m.type === 'message' && (m.role === 'user' || m.role === 'assistant'))
      .map(m => ({
        id: m.id,
        type: m.role as 'user' | 'assistant',
        content: m.content || '',
        timestamp: new Date(m.created_at),
      }));

    setMessages(uiMessages);
  }, []);

  const newConversation = useCallback(() => {
    abort();
    setConversationId(null);
    setTitle(null);
    setMessages([]);
    setStatus('idle');
  }, [abort]);

  return {
    messages,
    status,
    conversationId,
    title,
    sendMessage,
    loadConversation,
    newConversation,
  };
}
```

---

## 6. UI Components chi tiết

### 6.1 ChatPanel (Container chính)

```
┌───────────────────────────────────┐
│  Chat panel container (420px)     │
│  position: fixed right            │
│  height: 100vh - navbar           │
│  background: white                │
│  border-left: 1px solid gray-200  │
│  box-shadow: -4px 0 20px rgba()   │
│  z-index: 40                      │
│  transition: transform 300ms      │
│                                   │
│  Closed: translateX(100%)         │
│  Open:   translateX(0)            │
└───────────────────────────────────┘
```

**Logic**: Dùng `ChatContext` để toggle `isOpen`. Khi open, AppLayout co `main-content` lại.

### 6.2 ChatHeader

```
┌────────────────────────────────────────┐
│  [←]  Proton AI Assistant  ✦    [✕]    │
│        (hoặc conversation title)       │
│  ───────────────────────────────────── │
│  [+ New Chat]                          │
└────────────────────────────────────────┘
```

- `[←]` Back: quay về conversation list
- `[✕]` Close: đóng panel
- `[+ New Chat]`: tạo conversation mới

### 6.3 ConversationList

```
┌────────────────────────────────────────┐
│  🔍 [Search conversations...]          │
│                                        │
│  Today                                 │
│  ┌──────────────────────────────────┐  │
│  │ 💬 Hỏi về số dư tài khoản       │  │
│  │    10:30 AM                     │  │
│  ├──────────────────────────────────┤  │
│  │ 💬 Chuyển tiền cho Bob          │  │
│  │    09:15 AM                     │  │
│  └──────────────────────────────────┘  │
│                                        │
│  Yesterday                             │
│  ┌──────────────────────────────────┐  │
│  │ 💬 FAQ về bảo mật               │  │
│  │    Mar 12                       │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

**API**: `GET /api/chat/conversations`

**Response**:
```json
[
  { "id": "uuid", "title": "Hỏi về số dư", "created_at": "...", "updated_at": "..." },
  ...
]
```

**UX**: Group by date (Today, Yesterday, This week, Older). Click → `loadConversation(id)`.

### 6.4 MessageList + ChatMessage

```
┌────────────────────────────────────────┐
│                                        │
│                       ┌──────────────┐ │
│                       │ Số dư của tôi│ │  ← User message (right, blue bg)
│                       │ bao nhiêu?   │ │
│                       └──────────────┘ │
│                                        │
│  ┌─────────────────────────────────┐   │
│  │ 🔧 Calling: get_account_balance │   │  ← Tool call card (left, gray bg)
│  │    Arguments: {}                │   │
│  └─────────────────────────────────┘   │
│                                        │
│  ┌─────────────────────────────────┐   │
│  │ ✅ Result: get_account_balance  │   │  ← Tool result card
│  │    Balance: 50,000,000 VND      │   │
│  └─────────────────────────────────┘   │
│                                        │
│  ┌─────────────────────────────────┐   │
│  │ ✦ Số dư tài khoản hiện tại     │   │  ← Assistant message (left, white bg)
│  │   của bạn là 50.000.000 VND.    │   │
│  │   Số tài khoản: 1001000001     │   │
│  └─────────────────────────────────┘   │
│                                        │
│  ┌─────────────────────────────────┐   │
│  │ ●●● AI đang suy nghĩ...        │   │  ← Thinking indicator (animated)
│  └─────────────────────────────────┘   │
│                                        │
└────────────────────────────────────────┘
```

### 6.5 ToolCallCard – Visualization tool calling

```
┌──────────────────────────────────────────┐
│  🔧  get_account_balance                 │
│  ─────────────────────────────────────── │
│  No arguments                            │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  🔧  transfer_money                      │
│  ─────────────────────────────────────── │
│  to_account_number: "1001000002"         │
│  amount: 500000                          │
│  description: "Trả tiền ăn trưa"        │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  🔧  search_faq                          │
│  ─────────────────────────────────────── │
│  query: "phí chuyển tiền"               │
└──────────────────────────────────────────┘
```

**Styling**:
- Background: `bg-gray-50`, border-left: `border-l-4 border-blue-400`
- Collapsible: click để expand/collapse arguments
- Icon mapping: mỗi tool có icon riêng

### 6.6 ToolResultCard – Hiển thị kết quả tool

```
┌──────────────────────────────────────────┐
│  ✅  get_account_balance                 │
│  ─────────────────────────────────────── │
│  balance: 50,000,000                     │
│  currency: VND                           │
│  account_number: 1001000001              │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  ✅  transfer_money                      │
│  ─────────────────────────────────────── │
│  status: success                         │
│  amount: 500,000                         │
│  transaction_id: abc-123                 │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  ❌  transfer_money (error)              │
│  ─────────────────────────────────────── │
│  error: Insufficient balance             │
└──────────────────────────────────────────┘
```

**Styling**:
- Success: `border-l-4 border-green-400`, icon ✅
- Error: `border-l-4 border-red-400`, icon ❌
- Default collapsed, click to expand raw JSON

### 6.7 ThinkingIndicator

```
┌────────────────────────────────┐
│  ✦  ● ● ●                     │  ← 3 dots bouncing animation
│     AI đang suy nghĩ...       │
└────────────────────────────────┘
```

**CSS Animation**:
```css
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }
.dot:nth-child(3) { animation-delay: 0s; }
```

### 6.8 ChatInput

```
┌────────────────────────────────────────────┐
│  ┌──────────────────────────────────┐  ┌─┐│
│  │ Nhập tin nhắn...                 │  │➤││
│  │                                  │  │ ││
│  └──────────────────────────────────┘  └─┘│
└────────────────────────────────────────────┘
```

**Behavior**:
- `textarea` auto-resize (1-4 lines)
- Enter to send, Shift+Enter for new line
- Disabled khi `status !== 'idle'`
- Send button: disabled khi empty hoặc đang loading

---

## 7. Tool Name Mapping cho UI

Hiển thị tên tool thân thiện thay vì tên kỹ thuật:

```typescript
const TOOL_DISPLAY_MAP: Record<string, { label: string; icon: string; color: string }> = {
  get_account_balance:    { label: 'Kiểm tra số dư',     icon: '💰', color: 'blue' },
  lookup_account:         { label: 'Tra cứu tài khoản',  icon: '🔍', color: 'purple' },
  transfer_money:         { label: 'Chuyển tiền',         icon: '💸', color: 'green' },
  get_transaction_history:{ label: 'Lịch sử giao dịch',  icon: '📋', color: 'orange' },
  search_faq:             { label: 'Tìm kiếm FAQ',       icon: '❓', color: 'teal' },
  list_contacts:          { label: 'Danh bạ',             icon: '👥', color: 'indigo' },
  add_contact:            { label: 'Thêm liên hệ',       icon: '➕', color: 'cyan' },
};
```

---

## 8. State Management

### 8.1 ChatContext

```typescript
interface ChatContextValue {
  isOpen: boolean;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
}
```

Tích hợp vào `AppLayout`:
```tsx
function AppLayout() {
  const { isOpen } = useChat();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ${isOpen ? 'mr-[420px]' : ''}`}>
        <Outlet />
      </main>
      <ChatPanel />
    </div>
  );
}
```

### 8.2 Chat State Flow

```
                    ┌─────────────────────────────┐
                    │       CONVERSATION LIST      │
                    │                              │
                    │  Click conversation          │
                    │  ──────────────────►         │
                    │           OR                  │
                    │  Click "New Chat"            │
                    │  ──────────────────►         │
                    └──────────┬──────────────────┘
                               │
                               ▼
                    ┌─────────────────────────────┐
                    │        ACTIVE CHAT           │
                    │                              │
                    │  status: idle                │
                    │    │                          │
                    │    │ User types & sends       │
                    │    ▼                          │
                    │  status: sending              │
                    │    │                          │
                    │    │ SSE connection opens      │
                    │    ▼                          │
                    │  status: thinking             │
                    │    │                          │
                    │    │ ← tool_call events        │
                    │    │ ← tool_result events      │
                    │    │ ← more thinking           │
                    │    ▼                          │
                    │  status: idle (message recv)  │
                    │    │                          │
                    │    │ Can send again            │
                    │    └──► back to idle           │
                    └─────────────────────────────┘
```

---

## 9. Auto-scroll & UX Details

### 9.1 Auto-scroll

```typescript
// MessageList.tsx
const messagesEndRef = useRef<HTMLDivElement>(null);
const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  // Auto-scroll only if user is near bottom (within 100px)
  const isNearBottom =
    container.scrollHeight - container.scrollTop - container.clientHeight < 100;

  if (isNearBottom) {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages]);
```

### 9.2 Retry on error

Khi nhận event `error`, hiển thị nút "Retry" dưới error message:
```
┌─────────────────────────────────┐
│ ❌ Đã xảy ra lỗi.              │
│    Max iterations reached.      │
│                                 │
│    [🔄 Retry]                   │
└─────────────────────────────────┘
```

### 9.3 Welcome message

Khi tạo conversation mới (messages rỗng), hiển thị welcome:

```
┌─────────────────────────────────┐
│                                 │
│     ✦ Proton AI Assistant       │
│                                 │
│  Xin chào! Tôi có thể giúp     │
│  bạn:                           │
│                                 │
│  • Kiểm tra số dư tài khoản    │
│  • Chuyển tiền                  │
│  • Tra cứu thông tin giao dịch  │
│  • Trả lời câu hỏi về ngân     │
│    hàng số                      │
│                                 │
│  Hãy hỏi tôi bất cứ điều gì!   │
│                                 │
│  ┌───────────┐ ┌──────────────┐ │
│  │ Số dư?    │ │ FAQ phí      │ │  ← Quick action chips
│  └───────────┘ │ chuyển tiền  │ │
│  ┌───────────┐ └──────────────┘ │
│  │ Lịch sử   │                  │
│  │ giao dịch │                  │
│  └───────────┘                  │
└─────────────────────────────────┘
```

**Quick action chips**: Pre-filled messages, click → auto-send.

### 9.4 Markdown rendering

Assistant messages có thể chứa markdown. Dùng `react-markdown` hoặc lightweight renderer:
- Bold/italic
- Lists (ordered/unordered)
- Code blocks (inline)
- Links

---

## 10. Integration với Phase 1

### 10.1 Sidebar update

Thêm nút "AI Chat" vào sidebar (cuối cùng, với icon đặc biệt):

```tsx
// Sidebar.tsx - thêm vào cuối
<button onClick={openChat} className="...">
  <SparklesIcon /> AI Chat
</button>
```

### 10.2 Dashboard integration

Thêm quick action "Ask AI" vào Dashboard:

```
┌──────────────────────────┐
│  QUICK ACTIONS           │
│  [Transfer Money]        │
│  [Deposit]               │
│  [Ask AI Assistant ✦]    │  ← Opens chat panel
└──────────────────────────┘
```

### 10.3 Transfer page integration

Sau khi transfer thành công, suggest "Bạn cũng có thể chuyển tiền qua AI Chat":
```
✅ Transfer successful!
💡 Tip: Bạn cũng có thể yêu cầu AI chuyển tiền bằng ngôn ngữ tự nhiên. [Thử ngay →]
```

### 10.4 Balance refresh after chat transfer

Khi agent thực hiện `transfer_money` thành công (nhận `tool_result` với `status: success`), emit event để Dashboard/AccountCard refresh balance:

```typescript
// Trong useChat, khi nhận tool_result cho transfer_money
if (event.data.name === 'transfer_money' && event.data.output?.status === 'success') {
  window.dispatchEvent(new CustomEvent('balance-updated'));
}

// Trong useAccount hook
useEffect(() => {
  const handler = () => refetchBalance();
  window.addEventListener('balance-updated', handler);
  return () => window.removeEventListener('balance-updated', handler);
}, []);
```

---

## 11. API Reference (Chat endpoints)

### 11.1 Send message (SSE)

```
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversation_id": "uuid" | null,
  "message": "string"
}

Response: text/event-stream
```

### 11.2 List conversations

```
GET /api/chat/conversations
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "uuid",
    "title": "Hỏi về số dư",
    "created_at": "2026-03-13T10:30:00Z",
    "updated_at": "2026-03-13T10:31:00Z"
  }
]
```

### 11.3 Get conversation messages

```
GET /api/chat/conversations/{conversation_id}/messages
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "uuid",
    "role": "user",
    "type": "message",
    "content": "Số dư?",
    "function_name": null,
    "function_arguments": null,
    "function_output": null,
    "created_at": "2026-03-13T10:30:00Z"
  },
  {
    "id": "uuid",
    "role": "assistant",
    "type": "function_call",
    "content": null,
    "function_name": "get_account_balance",
    "function_arguments": "{}",
    "function_output": null,
    "created_at": "2026-03-13T10:30:01Z"
  },
  {
    "id": "uuid",
    "role": "tool",
    "type": "function_call_output",
    "content": null,
    "function_name": "get_account_balance",
    "function_arguments": null,
    "function_output": "{\"balance\": 50000000}",
    "created_at": "2026-03-13T10:30:02Z"
  },
  {
    "id": "uuid",
    "role": "assistant",
    "type": "message",
    "content": "Số dư hiện tại là 50.000.000 VND",
    "function_name": null,
    "function_arguments": null,
    "function_output": null,
    "created_at": "2026-03-13T10:30:03Z"
  }
]
```

---

## 12. Dependencies Phase 2

```bash
npm install react-markdown    # Markdown rendering cho assistant responses
```

Không cần thêm dependency cho SSE – dùng native `fetch` + `ReadableStream`.

---

## 13. Checklist Phase 2

- [ ] ChatContext (open/close state)
- [ ] ChatPanel sliding container
- [ ] ChatToggleButton trong Sidebar
- [ ] ConversationList component
- [ ] ConversationItem component
- [ ] useConversations hook (GET /api/chat/conversations)
- [ ] ChatWindow component
- [ ] ChatHeader component
- [ ] useSSE hook (SSE parser)
- [ ] useChat hook (state management)
- [ ] MessageList component (auto-scroll)
- [ ] ChatMessage component (user/assistant bubbles)
- [ ] ToolCallCard component
- [ ] ToolResultCard component
- [ ] ThinkingIndicator component (animated dots)
- [ ] ChatInput component (auto-resize textarea)
- [ ] Welcome message + quick action chips
- [ ] Markdown rendering cho assistant messages
- [ ] Error handling + retry
- [ ] Balance refresh sau chat transfer
- [ ] Dashboard "Ask AI" quick action
- [ ] Responsive: mobile full-screen overlay
- [ ] Loading history khi click conversation cũ
