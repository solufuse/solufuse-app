
import { useAuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuthContext();

  if (!user) {
    return <div>You must be logged in to view this page.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-4">
        <img src={user.photoURL || ''} alt="User" className="w-24 h-24 rounded-full" />
        <h2 className="text-xl font-bold mt-4">{user.displayName}</h2>
        <p className="text-text-secondary">{user.email}</p>
      </div>
    </div>
  );
};

export default Profile;
