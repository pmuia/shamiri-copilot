import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AnalyzeButton from "@/components/AnalyzeButton";

/**
 * Define the exact shape we use.
 * This removes ALL Prisma inference issues.
 */
type SessionWithRelations = {
  id: string;
  groupId: string;
  date: Date;
  fellow: {
    name: string;
  };
  analysis: {
    riskFlag: boolean | null;
  } | null;
  review: {
    finalStatus: string | null;
  } | null;
};

export default async function DashboardPage() {
  const sessions = (await prisma.session.findMany({
    include: {
      fellow: true,
      analysis: true,
      review: true,
    },
    orderBy: {
      date: "desc",
    },
  })) as SessionWithRelations[];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <Header sessions={sessions} />

        <div className="mt-8 space-y-4">
          {sessions.map((session: SessionWithRelations) => {
            const status =
              session.review?.finalStatus ||
              (session.analysis?.riskFlag
                ? "FLAGGED"
                : session.analysis
                  ? "PROCESSED"
                  : "PENDING");

            return (
              <Link
                key={session.id}
                href={`/session/${session.id}`}
                className="block"
              >
                <SessionCard
                  id={session.id}
                  fellow={session.fellow.name}
                  group={session.groupId}
                  date={session.date}
                  status={status}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Header({ sessions }: { sessions: SessionWithRelations[] }) {
  const total = sessions.length;

  const flagged = sessions.filter(
    (s: SessionWithRelations) => s.analysis?.riskFlag,
  ).length;

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Shamiri Supervisor Copilot
        </h1>
        <p className="text-gray-500 mt-1">Tier 2 Session Oversight Dashboard</p>
      </div>

      <div className="flex gap-6 text-sm">
        <Stat label="Total Sessions" value={total} />
        <Stat label="Flagged" value={flagged} highlight />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="text-right">
      <p className="text-gray-500">{label}</p>
      <p
        className={`text-lg font-semibold ${
          highlight ? "text-red-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SessionCard({
  id,
  fellow,
  group,
  date,
  status,
}: {
  id: string;
  fellow: string;
  group: string;
  date: Date;
  status: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition p-6 flex justify-between items-center">
      <div>
        <p className="text-lg font-semibold text-gray-900">{fellow}</p>
        <p className="text-sm text-gray-500 mt-1">Group: {group}</p>
        <p className="text-sm text-gray-400">
          {new Date(date).toLocaleDateString()}
        </p>

        <div className="mt-2">
          <AnalyzeButton id={id} />
        </div>
      </div>

      <StatusBadge status={status} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-gray-100 text-gray-600",
    PROCESSED: "bg-yellow-100 text-yellow-700",
    FLAGGED: "bg-red-100 text-red-700 border border-red-300",
    SAFE: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-4 py-1.5 rounded-full text-sm font-medium ${
        styles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
