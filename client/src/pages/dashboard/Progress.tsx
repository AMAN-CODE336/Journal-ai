import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { StatSkeleton } from "@/components/skeletons";
import Empty from "@/components/Empty";
import { useNavigate } from "react-router-dom";
import { TooltipProps } from '@/types'

interface Entry {
  _id: string;
  createdAt: string;
  meta: { wordCount: number };
  ai: {
    topics: string[];
    mood: {
      label: string;
      emoji: string;
      score: number;
    };
  };
}

const Progress = () => {
  const navigate = useNavigate();

  const { data: entries, isLoading } = useQuery<Entry[]>({
    queryKey: ["progress-entries"], // ← unique key, no conflict
    queryFn: async () => {
      const res = await api.get<{ entries: Entry[] }>("/entries", {
        params: { page: 1, limit: 100 }
      });
      return res.data.entries; // ← correctly extract array
    },
  });

  if (isLoading) return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <StatSkeleton count={4} />
    </div>
  )

  if (!entries?.length) return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl text-text mb-2">Progress</h1>
      <Empty
        title="No data yet"
        description="Write at least one entry to see your progress!"
        action="+ New Entry"
        onAction={() => navigate("/entries/new")}
      />
    </div>
  );

  // Mood data — [...entries] spread to avoid mutating original array
  const moodData = [...entries]
    .reverse()
    .filter((e) => e.ai?.mood?.score)
    .slice(-7)
    .map((e) => ({
      label: new Date(e.createdAt).toLocaleDateString("en-US", { weekday: "short" }),
      score: e.ai.mood.score,
      emoji: e.ai.mood.emoji,
      mood: e.ai.mood.label,
    }));

  // Writing streak
  const sortedDates = [
    ...new Set(entries.map((e) => new Date(e.createdAt).toDateString())),
  ].sort();
  let streak = 1;
  for (let i = sortedDates.length - 1; i > 0; i--) {
    const diff =
      (new Date(sortedDates[i]).getTime() - new Date(sortedDates[i - 1]).getTime()) /
      (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }

  // Entries per day (last 7 days)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    const count = entries.filter(
      (e) => new Date(e.createdAt).toDateString() === d.toDateString()
    ).length;
    const words = entries
      .filter((e) => new Date(e.createdAt).toDateString() === d.toDateString())
      .reduce((acc, e) => acc + (e.meta?.wordCount || 0), 0);
    return { label, count, words };
  });

  // Top topics
  const topicCount: Record<string, number> = {};
  entries.forEach((e) =>
    e.ai?.topics?.forEach((t) => {
      topicCount[t] = (topicCount[t] || 0) + 1;
    })
  );
  const topTopics = Object.entries(topicCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Total stats
  const totalWords = entries.reduce((acc, e) => acc + (e.meta?.wordCount || 0), 0);
  const avgWords = Math.round(totalWords / entries.length);

  const customTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload?.length) {
      return (
        <div className="bg-surface border border-border rounded-lg px-3 py-2 text-xs text-text">
          <p className="text-muted mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl text-text mb-1">Progress</h1>
      <p className="text-sm text-muted mb-6 md:mb-8">
        Track your learning journey over time
      </p>

      {/* Stats — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {[
          { label: "Total Entries", value: entries.length },
          { label: "Total Words", value: totalWords.toLocaleString() },
          { label: "Avg Words/Entry", value: avgWords },
          { label: "Day Streak 🔥", value: streak },
        ].map((stat, i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-4 md:p-5">
            <p className="text-xs text-muted uppercase tracking-widest mb-2 md:mb-3">
              {stat.label}
            </p>
            <p className="text-2xl md:text-3xl text-text">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Entries per day */}
      <div className="bg-surface border border-border rounded-xl p-4 md:p-5 mb-6">
        <p className="text-xs text-muted uppercase tracking-widest mb-4 md:mb-6">
          📊 Entries — Last 7 Days
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={last7}>
            <XAxis dataKey="label" stroke="#8a8070" tick={{ fontSize: 11 }} />
            <YAxis stroke="#8a8070" tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip content={customTooltip} />
            <Bar dataKey="count" name="Entries" fill="#e8b86d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Words per day */}
      <div className="bg-surface border border-border rounded-xl p-4 md:p-5 mb-6">
        <p className="text-xs text-muted uppercase tracking-widest mb-4 md:mb-6">
          ✍️ Words Written — Last 7 Days
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={last7}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2825" />
            <XAxis dataKey="label" stroke="#8a8070" tick={{ fontSize: 11 }} />
            <YAxis stroke="#8a8070" tick={{ fontSize: 11 }} />
            <Tooltip content={customTooltip} />
            <Line
              type="monotone"
              dataKey="words"
              name="Words"
              stroke="#e8b86d"
              strokeWidth={2}
              dot={{ fill: "#e8b86d", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Mood Trend */}
      {moodData.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-4 md:p-5 mb-6">
          <p className="text-xs text-muted uppercase tracking-widest mb-4 md:mb-6">
            😊 Mood Trend — Last 7 Entries
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2825" />
              <XAxis dataKey="label" stroke="#8a8070" tick={{ fontSize: 11 }} />
              <YAxis domain={[1, 10]} stroke="#8a8070" tick={{ fontSize: 11 }} />
              <Tooltip content={customTooltip} />
              <Line
                type="monotone"
                dataKey="score"
                name="Mood"
                stroke="#e8b86d"
                strokeWidth={2}
                dot={{ fill: "#e8b86d", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-3 mt-4 flex-wrap">
            {moodData.map((m, i) => (
              <div key={i} className="flex items-center gap-1 text-xs text-muted">
                <span>{m.emoji}</span>
                <span>{m.mood}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Topics */}
      {topTopics.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-4 md:p-5">
          <p className="text-xs text-muted uppercase tracking-widest mb-4 md:mb-6">
            🏷️ Top Topics
          </p>
          <div className="flex flex-col gap-3">
            {topTopics.map(([topic, count], i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-text w-24 md:w-40 truncate">{topic}</span>
                <div className="flex-1 bg-surface2 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all"
                    style={{ width: `${(count / topTopics[0][1]) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted w-8 text-right">{count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;