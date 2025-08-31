import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-3 items-center px-4">
        {/* Left: Brand */}
        <div className="flex items-center">
          <Link
            to="/"
            className="font-sans text-xl font-semibold tracking-tight text-foreground"
            aria-label="RateMate Home"
          >
            RateMate
          </Link>
        </div>

        {/* Middle: Nav items */}
        <nav aria-label="Main navigation" className="flex items-center justify-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/stores" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Stores
          </Link>
          <Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            About
          </Link>
          <Link to="/contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Contact 
          </Link>
        </nav>

        {/* Right: Auth buttons */}
        <div className="flex items-center justify-end gap-2">
          <Link to="/login" aria-label="Log in">
            <Button variant="ghost" className="px-4">
              Log in
            </Button>
          </Link>
          <Link to="/signup" aria-label="Sign up">
            <Button className="bg-black text-white hover:bg-zinc-900">Sign up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
