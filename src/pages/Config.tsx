
import { User } from 'firebase/auth';

interface ConfigProps {
  user: User;
}

const Config = ({ user }: ConfigProps) => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your application and project settings.</p>
      </header>

      <div className="card p-6">
        <h2 className="font-bold text-lg mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
            <p>Theme settings and customizations will be available here.</p>
            <button className="btn-secondary">Customize</button>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-bold text-lg mb-4">Project Details</h2>
        <p>Information about the current project for {user.email} will be displayed here.</p>
      </div>
    </div>
  );
};

export default Config;
