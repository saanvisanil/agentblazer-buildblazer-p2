import Link from "next/link";

const styles = {
  base: "inline-flex items-center justify-center gap-2 rounded-card px-5 py-2.5 text-sm font-medium transition-colors",
  primary: "text-accent-ink",
  secondary: "border border-line bg-surface text-ink hover:bg-surface-2",
};

export default function Button({ href, variant = "primary", children, ...props }) {
  const className = `${styles.base} ${styles[variant]}`;
  const style = variant === "primary" ? { background: "var(--gradient)" } : undefined;

  if (href) {
    return (
      <Link href={href} className={className} style={style} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={className} style={style} {...props}>
      {children}
    </button>
  );
}
