export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <p className="text-zinc-300">
        Have questions? Email{" "}
        <a href="mailto:hello@godcandle.com" className="underline">
          hello@godcandle.com
        </a>
        .
      </p>
    </main>
  );
}