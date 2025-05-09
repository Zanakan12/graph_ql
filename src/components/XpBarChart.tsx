import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function XpBarChart({ transactions }) {
  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={transactions} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="path" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" name="XP Gagnée" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
