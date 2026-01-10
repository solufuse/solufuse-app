
import React, { useState, useEffect, useCallback } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { listFiles, renameItem, deleteItems, downloadItems } from '../../api/files';
import { FileInfo } from '../../types';
import { Icons } from '../icons';
import { ContextMenu, MenuItem } from '../common/ContextMenu';

// 1. --- DATA STRUCTURE & UTILITY ---

interface FileTreeNode extends FileInfo {
  children: FileTreeNode[];
  type: 'directory' | 'file';
}

function buildFileTree(files: FileInfo[]): FileTreeNode[] {
  const fileMap: { [path: string]: FileTreeNode } = {};

  files.forEach(file => {
    fileMap[file.path] = { ...file, children: [], type: 'file' };
  });

  const rootNodes: FileTreeNode[] = [];

  Object.values(fileMap).forEach(node => {
    const parentPath = node.path.substring(0, node.path.lastIndexOf('/'));
    
    if (parentPath && fileMap[parentPath]) {
      const parent = fileMap[parentPath];
      parent.type = 'directory'; 
      parent.children.push(node);
    } else {
      rootNodes.push(node);
    }
  });

  const sortNodes = (nodes: FileTreeNode[]) => {
    nodes.sort((a, b) => {
        if (a.type === b.type) return a.filename.localeCompare(b.filename);
        return a.type === 'directory' ? -1 : 1;
    });
    nodes.forEach(node => sortNodes(node.children));
  };

  sortNodes(rootNodes);
  return rootNodes;
}

// 2. --- RECURSIVE FILE ITEM COMPONENT ---

interface FileItemProps {
  node: FileTreeNode;
  onContextMenu: (e: React.MouseEvent, file: FileInfo) => void;
  onDrop: (target: FileInfo, dragged: FileInfo) => void;
  defaultOpen?: boolean;
  isRoot?: boolean;
}

const FileItem: React.FC<FileItemProps> = ({ node, onContextMenu, onDrop, defaultOpen = false, isRoot = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isBeingDraggedOver, setIsBeingDraggedOver] = useState(false);
  const isFolder = node.type === 'directory';

  const handleToggle = () => {
    if (isFolder) setIsOpen(!isOpen);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('application/json', JSON.stringify(node));
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFolder) setIsBeingDraggedOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsBeingDraggedOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBeingDraggedOver(false);
    if (!isFolder) return;

    const draggedNode = JSON.parse(e.dataTransfer.getData('application/json')) as FileInfo;
    if(draggedNode.path !== node.path) {
        onDrop(node, draggedNode);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-sm ${isBeingDraggedOver ? 'bg-primary/20' : ''}`}
    >
      <div
        className={`flex items-center gap-1.5 text-xs py-1 px-2 rounded hover:bg-primary/10 cursor-pointer ${isRoot ? 'font-bold' : ''}`}
        onClick={handleToggle}
        onContextMenu={(e) => onContextMenu(e, node)}
        draggable
        onDragStart={handleDragStart}
      >
        {isFolder ? (
          <Icons.ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
        ) : (
          <div className="w-4"></div>
        )}
        {isFolder ? <Icons.Folder className={`w-4 h-4 ${isRoot ? 'text-primary': ''}`} /> : <Icons.File className="w-4 h-4" />}
        <span>{node.filename}</span>
      </div>

      {isFolder && isOpen && (
        <div className="pl-4 border-l border-gray-700 ml-3">
          {node.children.length > 0 ? (
            node.children.map(child => <FileItem key={child.path} node={child} onContextMenu={onContextMenu} onDrop={onDrop} />)
          ) : (
            <p className="text-xs text-muted-foreground py-1 px-2">Folder is empty.</p>
          )}
        </div>
      )}
    </div>
  );
};

// 3. --- MAIN EXPLORER COMPONENT ---

const Explorer = () => {
  const { currentProject } = useProjectContext();
  const [projectTree, setProjectTree] = useState<FileTreeNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; file: FileInfo } | null>(null);

  const fetchFiles = useCallback(async () => {
    if (!currentProject) {
      setProjectTree(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fileList = await listFiles(currentProject.id);
      const childrenTree = buildFileTree(fileList);
      
      const rootNode: FileTreeNode = {
        path: '/', 
        filename: currentProject.name,
        type: 'directory',
        children: childrenTree,
        size: 0,
        uploaded_at: '',
        content_type: 'directory',
      };

      setProjectTree(rootNode);

    } catch (err) {
      setError('Failed to fetch files.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleContextMenu = (e: React.MouseEvent, file: FileInfo) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, file });
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleMove = async (targetFolder: FileInfo, draggedItem: FileInfo) => {
    if (!currentProject) return;

    const isTargetRoot = targetFolder.path === '/';
    const newPath = isTargetRoot 
        ? draggedItem.filename 
        : `${targetFolder.path}/${draggedItem.filename}`;

    const originalParentPath = draggedItem.path.substring(0, draggedItem.path.lastIndexOf('/'));
    const targetParentPath = isTargetRoot ? '' : targetFolder.path;

    if (originalParentPath === targetParentPath || newPath === draggedItem.path) return;

    try {
      await renameItem(draggedItem.path, newPath, currentProject.id);
      fetchFiles();
    } catch (error) {
      console.error('Move failed:', error);
      alert('Failed to move item.');
    }
  };

  const handleRename = async (file: FileInfo) => {
    const newName = prompt('Enter new name:', file.filename);
    if (newName && newName !== file.filename && currentProject) {
      const newPath = file.path.substring(0, file.path.lastIndexOf('/') + 1) + newName;
      try {
        await renameItem(file.path, newPath, currentProject.id);
        fetchFiles();
      } catch (error) {
        console.error('Rename failed:', error);
        alert('Failed to rename file.');
      }
    }
  };

  const handleDelete = async (file: FileInfo) => {
    if (window.confirm(`Are you sure you want to delete ${file.filename}?`) && currentProject) {
      try {
        await deleteItems([file.path], currentProject.id);
        fetchFiles();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete item.');
      }
    }
  };

  const handleDownload = async (file: FileInfo) => {
    if (!currentProject) return;
    try {
        await downloadItems([file.path], currentProject.id);
    } catch (error) {
        console.error('Download failed:', error);
        alert('Failed to download item.');
    }
};

  const getContextMenuItems = (file: FileInfo): MenuItem[] => {
    if (file.path === '/') { // Project Root
        return [
            { label: 'Copy Project Name', action: () => navigator.clipboard.writeText(file.filename), icon: <Icons.Copy /> },
            { label: 'Copy Project ID', action: () => {if(currentProject) navigator.clipboard.writeText(currentProject.id)}, icon: <Icons.Copy /> },
        ];
    }
    return [
        { label: 'Copy Filename', action: () => navigator.clipboard.writeText(file.filename), icon: <Icons.Copy /> },
        { label: 'Copy Path', action: () => navigator.clipboard.writeText(file.path), icon: <Icons.Copy /> },
        { label: '', action: () => {}, separator: true },
        { label: 'Rename', action: () => handleRename(file), icon: <Icons.Edit /> },
        { label: 'Download', action: () => handleDownload(file), icon: <Icons.Download /> },
        { label: '', action: () => {}, separator: true },
        { label: 'Delete', action: () => handleDelete(file), icon: <Icons.Trash />, danger: true },
  ];
}

  return (
    <div className="p-4 bg-card h-full flex flex-col" onClick={closeContextMenu} onContextMenu={closeContextMenu}>
      <h2 className="font-bold text-lg mb-4 flex-shrink-0">Explorer</h2>
      
      <div className="flex-grow overflow-y-auto">
        {loading && <div className="flex items-center gap-2 text-muted-foreground"><Icons.Loader className="w-4 h-4 animate-spin" /><span>Loading...</span></div>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && projectTree && (
          <FileItem 
              node={projectTree} 
              onContextMenu={handleContextMenu} 
              onDrop={handleMove}
              defaultOpen={true}
              isRoot={true}
          />
        )}
        
        {!loading && !error && !projectTree && <p className="text-sm text-muted-foreground">No project selected.</p>}
      </div>

      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x}
          y={contextMenu.y}
          items={getContextMenuItems(contextMenu.file)}
          onClose={closeContextMenu} 
        />
      )}
    </div>
  );
};

export default Explorer;
