import type { ChatMessage, ModelListResponse, StreamChunkPayload } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface StreamChatOptions {
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  system_prompt?: string;
  signal?: AbortSignal;
  onChunk: (chunk: StreamChunkPayload) => void;
  onDone: () => void;
  onError: (error: Error) => void;
}

export const chatService = {
  /**
   * Fetch available models from backend
   */
  async getModels(): Promise<ModelListResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/models`);
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Stream chat completion using Server-Sent Events (SSE) via native fetch
   */
  async streamChat({
    messages,
    model,
    temperature,
    max_tokens,
    system_prompt,
    signal,
    onChunk,
    onDone,
    onError,
  }: StreamChatOptions): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          messages,
          model: model || undefined,
          temperature,
          max_tokens,
          system_prompt,
        }),
        signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API error (${response.status}): ${errorText || response.statusText}`
        );
      }

      if (!response.body) {
        throw new Error("No response body received for streaming.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep the last partial line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          const rawData = trimmed.slice(6);
          try {
            const parsed: StreamChunkPayload = JSON.parse(rawData);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            onChunk(parsed);
            if (parsed.done) {
              onDone();
              return;
            }
          } catch (err: any) {
            if (err.message && !err.message.startsWith("Unexpected token")) {
              throw err;
            }
          }
        }
      }

      onDone();
    } catch (err: any) {
      if (err.name === "AbortError") {
        // Stream aborted by user, call onDone gracefully
        onDone();
        return;
      }
      onError(err instanceof Error ? err : new Error(String(err)));
    }
  },
};
