import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Button } from "../src/components/ui/Button"
import { Loader2 } from "lucide-react"

describe("Button", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole("button", { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass("bg-gradient-to-r", "from-primary-500", "to-secondary-500")
  })

  it("renders different variants", () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-white", "dark:bg-neutral-800")

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole("button")).toHaveClass("text-neutral-700", "dark:text-neutral-300")

    rerender(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-gradient-to-r", "from-error-500", "to-error-600")
  })

  it("renders different sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-8", "px-3", "text-xs")

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-12", "px-6", "text-base")

    rerender(<Button size="xl">Extra Large</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-14", "px-8", "text-lg")
  })

  it("shows loading state", () => {
    render(<Button loading>Loading</Button>)
    
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
    expect(screen.getByText("Loading")).toBeInTheDocument()
  })

  it("handles click events", () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("renders with left and right icons", () => {
    render(
      <Button leftIcon={<span data-testid="left-icon">←</span>} rightIcon={<span data-testid="right-icon">→</span>}>
        With Icons
      </Button>
    )
    
    expect(screen.getByTestId("left-icon")).toBeInTheDocument()
    expect(screen.getByTestId("right-icon")).toBeInTheDocument()
  })

  it("renders full width when specified", () => {
    render(<Button fullWidth>Full Width</Button>)
    expect(screen.getByRole("button")).toHaveClass("w-full")
  })

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })
})
