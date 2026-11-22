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
   * Health check probe to determine if backend is online
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/health`, {
        method: "GET",
        signal: AbortSignal.timeout(3000),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Fetch available models from backend
   */
  async getModels(): Promise<ModelListResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/models`, {
      signal: AbortSignal.timeout(5000),
    });
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
        let errorDetail = response.statusText;
        try {
          const errJson = await response.json();
          errorDetail = errJson.detail || errJson.message || errorDetail;
        } catch {
          const errText = await response.text();
          if (errText) errorDetail = errText;
        }
        throw new Error(`Server error (${response.status}): ${errorDetail}`);
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
        onDone();
        return;
      }
      if (err.message?.includes("Failed to fetch")) {
        onError(
          new Error(
            "Cannot connect to SrajanGPT backend. Please make sure the FastAPI server is running on http://localhost:8000."
          )
        );
        return;
      }
      onError(err instanceof Error ? err : new Error(String(err)));
    }
  },
};
