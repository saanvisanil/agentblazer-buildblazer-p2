import Logo from "./Logo";

export default function Footer({ site }) {
  return (
    <footer className="starfield border-t border-line bg-bg-soft">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <span className="font-display font-semibold">{site.name}</span>
          </div>
          <p className="mt-3 text-sm text-muted">{site.department}</p>
          <p className="text-sm text-muted">
            {site.address.line2}, {site.address.line3}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Quick Links</p>
          <ul className="mt-3 grid gap-2">
            {site.quickLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-sm text-accent hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Affiliations</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {site.affiliations.map((a) => (
              <span
                key={a}
                className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted"
              >
                {a}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">
            Empowered by faculty guidance and student leadership.
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2025-2026 {site.name}, {site.college}. All rights reserved.</p>
          <p>Academic Year 2025-2026 &middot; Autonomous AI Initiative</p>
        </div>
      </div>
    </footer>
  );
}
