export function Footer() {
  return (
    <footer className="py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Diego Valenzuela</p>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/data-diego"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <span className="text-border">|</span>
            <a
              href="https://x.com/datadiego_"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              X
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
