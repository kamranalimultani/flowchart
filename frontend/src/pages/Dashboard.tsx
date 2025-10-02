import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const dummyData = {
  users: 12345,
  flows: 5678,
  templates: 234,
  sharedFlows: 876,
  submissions: 4321,
  flowsCreated: 3456,
};

const barData = [
  { name: "Jan", flows: 400 },
  { name: "Feb", flows: 300 },
  { name: "Mar", flows: 500 },
  { name: "Apr", flows: 700 },
];

const lineData = [
  { name: "Week 1", users: 1000 },
  { name: "Week 2", users: 1200 },
  { name: "Week 3", users: 1500 },
  { name: "Week 4", users: 1700 },
];

const pieData = [
  { name: "Template A", value: 400 },
  { name: "Template B", value: 300 },
  { name: "Template C", value: 300 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export const Dashboard = () => {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* Metric Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {dummyData.users}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Flows</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {dummyData.flows}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Templates</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {dummyData.templates}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Shared Flows</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {dummyData.sharedFlows}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Submissions</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {dummyData.submissions}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Flows Created</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">
          {dummyData.flowsCreated}
        </CardContent>
      </Card>

      {/* Chart Cards */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Flows Created Over Months</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <Bar dataKey="flows" fill="#3b82f6" />
              <Tooltip />
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
                {pieData.map((entry, index) => (
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

      {/* More Cards for other metrics or charts, adding up to 20 */}
      {[...Array(10)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>Additional Metric {i + 1}</CardTitle>
          </CardHeader>
          <CardContent>Value {i * 100 + 50}</CardContent>
        </Card>
      ))}
    </div>
  );
};
