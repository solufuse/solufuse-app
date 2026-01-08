
import { User } from 'firebase/auth';

interface DiagramEditorProps {
  user: User;
}

const DiagramEditor = ({ user }: DiagramEditorProps) => {
  return (
    <div className="flex flex-col h-full p-4">
      <header className="mb-4">
        <h1 className="text-3xl font-bold">Diagram Editor</h1>
        <p className="text-slate-500 dark:text-slate-400">Visualize and build your application architecture, {user.email}.</p>
      </header>

      <div className="card p-6 flex-grow flex items-center justify-center">
          <p className="text-slate-400">The diagram editor will be available here.</p>
      </div>
    </div>
  );
};

export default DiagramEditor;
