import { Link } from "react-router-dom";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="font-sans text-lg font-semibold tracking-tight text-foreground">
              RateMate
            </Link>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Discover stores, share experiences, and make better shopping decisions with transparent ratings.
            </p>
          </div>

          {/* Product */}
          <nav aria-label="Product" className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/stores" className="text-muted-foreground transition-colors hover:text-foreground">
                Stores
              </Link>
              <Link to="/stores" className="text-muted-foreground transition-colors hover:text-foreground">
                Rating
              </Link>
            </div>
          </nav>

          {/* Company */}
          <nav aria-label="Company" className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                About Us
              </Link>
              <Link to="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
                Contact
              </Link>
            </div>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal" className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="#" className="text-muted-foreground transition-colors hover:text-foreground">
                Terms
              </Link>
              <Link to="#" className="text-muted-foreground transition-colors hover:text-foreground">
                Privacy
              </Link>
            </div>
          </nav>
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row">
          <p>© {year} RateMate. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="transition-colors hover:text-foreground">
              About
            </Link>
            <Link to="/contact" className="transition-colors hover:text-foreground">
              Contact
            </Link>
            <Link to="/login" className="transition-colors hover:text-foreground">
              Log in
            </Link>
            <Link to="/signup" className="transition-colors hover:text-foreground">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
