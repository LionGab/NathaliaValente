import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { usePosts } from "../src/hooks/useQueries"

// Mock Supabase
vi.mock("../src/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [
            {
              id: "1",
              content: "Test post",
              created_at: "2024-01-01T00:00:00Z",
              profiles: { full_name: "Test User", avatar_url: "test.jpg" }
            }
          ],
          error: null
        }))
      }))
    }))
  }
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe("usePosts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("fetches posts successfully", async () => {
    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(result.current.data).toBeDefined()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it("handles loading state", () => {
    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
  })
})
