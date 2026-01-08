
import { User } from 'firebase/auth';

interface ProfileProps {
  user: User | null;
}

const Profile = ({ user }: ProfileProps) => {
  return (
    <div className="space-y-8">
        <header>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your personal information.</p>
        </header>
        <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">Your Details</h2>
            <p><strong>Name:</strong> {user?.displayName || "Not set"}</p>
            <p><strong>Email:</strong> {user?.email || "Not set"}</p>
        </div>
    </div>
  );
};

export default Profile;
