import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRequest } from "@/utils/apiUtils";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useTheme } from "@/components/theme-provider"; // ✅ import your custom hook

export const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  // Dynamic colors based on theme
  const COLORS =
    theme === "dark"
      ? ["#F1F5F9", "#E2E8F0", "#CBD5E1", "#94A3B8", "#64748B"] // light gray tones for dark mode
      : ["#1E293B", "#334155", "#475569", "#64748B", "#0F172A"]; // dark gray tones for light mode
  useEffect(() => {
    getRequest("/api/dashboard", true)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("Dashboard API Error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Safe fallbacks in case API returns empty
  const users = data?.users || 0;
  const flows = data?.flows || 0;
  const templates = data?.templates || 0;
  const sharedFlows = data?.sharedFlows || 0;
  const submissions = data?.submissions || 0;
  const flowsCreated = data?.flowsCreated || 0;

  const barData = data?.barData || [];
  const lineData = data?.lineData || [];
  const pieData = data?.pieData || [];

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* Metric Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">{users}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Flows</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">{flows}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Templates</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">{templates}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Shared Flows</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">{sharedFlows}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Submissions</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">{submissions}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Flows Created</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">{flowsCreated}</CardContent>
      </Card>

      {/* Chart Cards */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Flows Created Over Months</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <Bar
                dataKey="flows"
                fill={theme === "dark" ? "#E2E8F0" : "#334155"}
              />
              <Tooltip />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>User Growth This Month</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <Line type="monotone" dataKey="users" stroke="#10b981" />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Template Usage Distribution</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={60}
                fill="#fbbf24"
                label
              >
                {pieData.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
