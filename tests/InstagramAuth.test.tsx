import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { InstagramAuth } from "../src/components/InstagramAuth"

// Mock Supabase
vi.mock("../src/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
  },
}))

describe("InstagramAuth", () => {
  const mockOnSuccess = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders login form correctly", () => {
    render(<InstagramAuth onSuccess={mockOnSuccess} />)
    
    expect(screen.getByText("ClubNath")).toBeInTheDocument()
    expect(screen.getByText("Sua comunidade exclusiva")).toBeInTheDocument()
    expect(screen.getByText("Continuar com Google")).toBeInTheDocument()
    expect(screen.getByText("Continuar com Apple")).toBeInTheDocument()
    expect(screen.getByText("Continuar com Instagram")).toBeInTheDocument()
  })

  it("calls demo login when demo button is clicked", async () => {
    render(<InstagramAuth onSuccess={mockOnSuccess} />)
    
    const demoButton = screen.getByText("🚀 Entrar como Demo")
    await user.click(demoButton)
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "demo-user-123",
          username: "nathalia_arcuri",
          full_name: "Nathalia Arcuri",
        })
      )
    })
  })
})
