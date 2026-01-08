
const DiagramEditor = ({ user }) => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Diagram Editor</h1>
        <p className="text-slate-500 dark:text-slate-400">Visualize and build your application architecture, {user.email}.</p>
      </header>

      <div className="card p-6 h-96 flex items-center justify-center">
          <p className="text-slate-400">The diagram editor will be available here.</p>
      </div>
    </div>
  );
};

export default DiagramEditor;
