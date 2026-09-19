import Button from "@/components/Button";

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-xl px-5 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-muted">That link does not point anywhere on this site.</p>
      <div className="mt-6">
        <Button href="/">Back to home</Button>
      </div>
    </section>
  );
}
