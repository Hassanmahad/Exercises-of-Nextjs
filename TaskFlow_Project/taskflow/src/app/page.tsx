
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-5">
        <h1 className="text-2xl font-bold text-blue-600">
          TaskFlow
        </h1>

        <div className="flex gap-4">
          <a href="/login">Login</a>

          <a
            href="/register"
            className="rounded-lg bg-blue-600 px-5 py-2 text-white"
          >
            Get Started
          </a>
        </div>
      </nav>

      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <h2 className="max-w-3xl text-5xl font-bold text-gray-900">
          Manage Your Tasks.
          <span className="text-blue-600"> Achieve More.</span>
        </h2>

        <p className="mt-6 max-w-xl text-lg text-gray-600">
          Organize your work, track your progress,
          and stay productive with TaskFlow.
        </p>

        <a
          href="/register"
          className="mt-8 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Start Managing Tasks
        </a>
      </section>
    </main>
  );
}
