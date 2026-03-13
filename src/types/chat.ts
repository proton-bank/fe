export type MessageRole = 'user' | 'assistant' | 'tool'

export type MessageType = 'message' | 'function_call' | 'function_call_output'

export interface ChatMessage {
  id: string
  role: MessageRole
  type: MessageType
  content?: string
  function_name?: string
  function_arguments?: string
  function_output?: string
  created_at: string
}

export interface Conversation {
  id: string
  title: string | null
  created_at: string
  updated_at: string
}

export type SSEEventType =
  | 'conversation_created'
  | 'title_generated'
  | 'status'
  | 'tool_call'
  | 'tool_result'
  | 'message'
  | 'done'
  | 'error'

export interface SSEEvent {
  event: SSEEventType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
}

export type UIMessageType =
  | 'user'
  | 'assistant'
  | 'tool_call'
  | 'tool_result'
  | 'thinking'
  | 'error'

export interface UIMessageBase {
  id: string
  type: UIMessageType
  timestamp: Date
}

export interface UIContentMessage extends UIMessageBase {
  type: 'user' | 'assistant' | 'error'
  content: string
}

export interface UIToolCallMessage extends UIMessageBase {
  type: 'tool_call'
  toolName: string
  toolCallId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolArguments?: Record<string, any>
}

export interface UIToolResultMessage extends UIMessageBase {
  type: 'tool_result'
  toolName: string
  toolCallId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolOutput?: Record<string, any>
}

export interface UIThinkingMessage extends UIMessageBase {
  type: 'thinking'
}

export type UIMessage =
  | UIContentMessage
  | UIToolCallMessage
  | UIToolResultMessage
  | UIThinkingMessage

export type ChatPanelView = 'conversation_list' | 'active_chat'

export type ChatStatus = 'idle' | 'sending' | 'thinking' | 'streaming' | 'error'

