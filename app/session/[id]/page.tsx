import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReviewPanel from "@/components/ReviewPanel";

export default async function SessionDetailPage(context: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await context.params;

  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      fellow: true,
      analysis: true,
      review: true,
    },
  });

  if (!session) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <Header session={session} />

        {!session.analysis ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-600">
              No AI analysis available yet. Please return to dashboard and run
              analysis.
            </p>
          </div>
        ) : (
          <>
            <RiskBanner analysis={session.analysis} />
            <SummaryCard analysis={session.analysis} />
            <ScoreCard analysis={session.analysis} />
            <Transcript transcript={session.transcript} />

            <ReviewPanel
              sessionId={session.id}
              currentStatus={session.review?.finalStatus || session.status}
            />
          </>
        )}
      </div>
    </div>
  );
}

function Header({ session }: any) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Session Review – {session.fellow.name}
      </h1>
      <p className="text-gray-500 mt-1">
        Group {session.groupId} • {new Date(session.date).toLocaleDateString()}
      </p>
    </div>
  );
}

function RiskBanner({ analysis }: any) {
  if (!analysis.riskFlag) return null;

  return (
    <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-xl">
      <p className="font-semibold">
        ⚠ Risk Detected – Immediate Supervisor Review Required
      </p>

      {analysis.riskQuote && (
        <p className="mt-3 italic bg-red-100 p-3 rounded">
          “{analysis.riskQuote}”
        </p>
      )}
    </div>
  );
}

function SummaryCard({ analysis }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="font-semibold mb-3 text-gray-900">AI Session Summary</h2>
      <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
    </div>
  );
}

function ScoreCard({ analysis }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
      <h2 className="font-semibold text-gray-900">Quality Evaluation</h2>

      <Metric
        title="Content Coverage"
        score={analysis.contentScore}
        justification={analysis.contentJustification}
      />

      <Metric
        title="Facilitation Quality"
        score={analysis.facilitationScore}
        justification={analysis.facilitationJustification}
      />

      <Metric
        title="Protocol Safety"
        score={analysis.safetyScore}
        justification={analysis.safetyJustification}
      />
    </div>
  );
}

function Metric({
  title,
  score,
  justification,
}: {
  title: string;
  score: number;
  justification: string;
}) {
  const scoreColor =
    score === 3
      ? "text-green-600"
      : score === 2
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div>
      <p className="font-medium text-gray-900">
        {title} – <span className={`${scoreColor}`}>{score}/3</span>
      </p>

      <p className="text-gray-600 text-sm mt-1 leading-relaxed">
        {justification}
      </p>
    </div>
  );
}

function Transcript({ transcript }: { transcript: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="font-semibold mb-3 text-gray-900">Full Transcript</h2>

      <div className="max-h-96 overflow-y-auto text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
        {transcript}
      </div>
    </div>
  );
}
