
import { Icons } from '../components/icons';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <div className="card p-6 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    <div className="p-3 bg-primary-color/10 text-primary-color rounded-lg">
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's a summary of your projects.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Projects" value="12" icon={<Icons.Projects />} />
        <StatCard title="Active Users" value="1,204" icon={<Icons.Users />} />
        <StatCard title="Server Load" value="34%" icon={<Icons.Server />} />
        <StatCard title="API Calls" value="2.1M" icon={<Icons.API />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-bold text-lg mb-4">Recent Activity</h2>
          {/* Placeholder for activity feed */}
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm"> 
              <span className="text-green-500">●</span> Deployed 'WebApp' to production.
              <span className="ml-auto text-slate-400">2m ago</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <span className="text-yellow-500">●</span> New issue reported on 'MobileApp'.
              <span className="ml-auto text-slate-400">1h ago</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <span className="text-blue-500">●</span> User 'Alex' signed up.
              <span className="ml-auto text-slate-400">3h ago</span>
            </li>
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="font-bold text-lg mb-4">Resource Usage</h2>
          {/* Placeholder for resource chart */}
          <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
            Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
