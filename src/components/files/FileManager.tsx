
import { Icons } from '../icons';

const FileManager = ({ user }) => {
  return (
    <div className="card p-6">
      <h2 className="font-bold text-lg mb-4 flex items-center">
        <Icons.Folder />
        <span className="ml-2">File Manager for {user.email}</span>
      </h2>
      <div className="h-64 border-t border-border flex items-center justify-center text-slate-400">
        <p>File management interface will be here.</p>
      </div>
    </div>
  );
};

export default FileManager;
