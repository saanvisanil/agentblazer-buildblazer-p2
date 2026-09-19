// Runs before paint (via next/script beforeInteractive would still flash);
// instead we inline it in <head> so the saved theme applies with zero flash.
export default function ThemeScript() {
  const code = `
    try {
      var t = localStorage.getItem('agentblazer-theme');
      if (t) document.documentElement.setAttribute('data-theme', t);
    } catch (e) {}
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
