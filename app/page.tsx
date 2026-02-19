import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-4xl w-full bg-white shadow-sm rounded-2xl p-12 text-center space-y-8">
        {/* Logo / Title */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Shamiri Supervisor Copilot
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-assisted session review platform supporting fellows and
            supervisors in delivering safe, high-quality group sessions.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 text-left pt-6">
          <Feature
            title="AI Session Analysis"
            description="Automatically evaluates transcripts for content quality, facilitation effectiveness, and protocol safety."
          />
          <Feature
            title="Risk Detection"
            description="Flags potential safety concerns and highlights critical excerpts requiring supervisor attention."
          />
          <Feature
            title="Supervisor Validation"
            description="Allows human review, final status confirmation, and structured feedback logging."
          />
        </div>

        {/* CTA */}
        <div className="pt-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-50 border rounded-xl p-6 space-y-2">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
