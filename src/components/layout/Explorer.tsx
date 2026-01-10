
import React, { useState, useEffect, useCallback } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { listFiles, renameItem, deleteItems, downloadItems, createFile, createFolder, uploadFiles } from '../../api/files';
import { FileInfo } from '../../types';
import { Icons } from '../icons';
import { ContextMenu, MenuItem } from '../common/ContextMenu';

// 1. --- DATA STRUCTURE & UTILITY ---

interface FileTreeNode extends FileInfo {
  children: FileTreeNode[];
  type: 'directory' | 'file';
}

function buildFileTree(files: FileInfo[]): FileTreeNode[] {
    const root = { children: [] };
    const nodeMap: { [path: string]: any } = { '': root };

    files.forEach(file => {
        const parts = file.path.split('/');
        let currentPath = '';
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            const parentPath = currentPath;
            currentPath = currentPath ? `${currentPath}/${part}` : part;

            if (!nodeMap[currentPath]) {
                const parentNode = nodeMap[parentPath];
                const newNode: FileTreeNode = {
                    filename: part,
                    path: currentPath,
                    type: 'directory',
                    children: [],
                    size: 0,
                    uploaded_at: '',
                    content_type: 'directory',
                };
                nodeMap[currentPath] = newNode;
                parentNode.children.push(newNode);
            }
        }
    });

    files.forEach(file => {
        const parentPath = file.path.substring(0, file.path.lastIndexOf('/'));
        const parentNode = nodeMap[parentPath] || root;
        const fileNode: FileTreeNode = {
            ...file,
            children: [], 
            type: 'file',
        };
        nodeMap[file.path] = fileNode;
        parentNode.children.push(fileNode);
    });

    const sortNodes = (nodes: FileTreeNode[]) => {
        nodes.sort((a, b) => {
            if (a.type === b.type) return a.filename.localeCompare(b.filename);
            return a.type === 'directory' ? -1 : 1;
        });
        nodes.forEach(node => sortNodes(node.children));
    };

    sortNodes(root.children);
    return root.children;
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
    // Check if the dragged item is internal (our JSON format)
    if (e.dataTransfer.types.includes('application/json') && isFolder) {
        setIsBeingDraggedOver(true);
    }
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

    // Check if the dropped item is internal
    if (e.dataTransfer.types.includes('application/json')) {
        const draggedNode = JSON.parse(e.dataTransfer.getData('application/json')) as FileInfo;
        if(draggedNode.path !== node.path) {
            onDrop(node, draggedNode);
        }
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
          <Icons.ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
        ) : (
          <div className="w-4 flex-shrink-0"></div>
        )}
        {isFolder ? (
          <Icons.Folder className={`w-4 h-4 flex-shrink-0 ${isRoot ? 'text-primary': ''}`} />
        ) : (
          <Icons.File className="w-4 h-4 flex-shrink-0" />
        )}
        <span className="truncate">{node.filename}</span>
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
  const [treeKey, setTreeKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; file: FileInfo } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

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

  // --- Action Handlers ---
  const handleRefresh = () => fetchFiles();
  const handleCollapseAll = () => setTreeKey(prev => prev + 1);

  const handleNewFile = async () => {
    if (!currentProject) return;
    const fileName = prompt('Enter new file name:');
    if (fileName) {
      try {
        await createFile(fileName, currentProject.id);
        fetchFiles();
      } catch (error) {
        console.error('Create file failed:', error);
        alert('Failed to create file.');
      }
    }
  };

  const handleNewFolder = async () => {
    if (!currentProject) return;
    const folderName = prompt('Enter new folder name:');
    if (folderName) {
      try {
        await createFolder(folderName, currentProject.id);
        fetchFiles();
      } catch (error) {
        console.error('Create folder failed:', error);
        alert('Failed to create folder.');
      }
    }
  };

  // --- Context Menu Handlers ---
  const handleContextMenu = (e: React.MouseEvent, file: FileInfo) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, file });
  };
  const closeContextMenu = () => setContextMenu(null);

  // --- Drag and Drop Handlers ---
  const handleInternalMove = async (targetFolder: FileInfo, draggedItem: FileInfo) => {
    if (!currentProject) return;
    const isTargetRoot = targetFolder.path === '/';
    const newPath = isTargetRoot ? draggedItem.filename : `${targetFolder.path}/${draggedItem.filename}`;
    if (newPath === draggedItem.path) return;
    try {
      await renameItem(draggedItem.path, newPath, currentProject.id);
      fetchFiles();
    } catch (error) {
      console.error('Move failed:', error);
      alert('Failed to move item.');
    }
  };

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    if (!currentProject) return;
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      try {
        setLoading(true);
        await uploadFiles(files, currentProject.id);
        fetchFiles(); 
      } catch (error) {
        console.error('File upload failed:', error);
        alert('Failed to upload files.');
        setLoading(false);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
        setIsDraggingFile(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  // --- Menu Item Definitions ---
  const getContextMenuItems = (file: FileInfo): MenuItem[] => {
    // ... (rest of the function is unchanged) ...
  }

  return (
    <div 
        className={`p-4 bg-card h-full flex flex-col group transition-all duration-200 ${isDraggingFile ? 'border-2 border-dashed border-primary/50' : 'border-2 border-transparent'}`}
        onClick={closeContextMenu} 
        onContextMenu={(e) => { e.preventDefault(); handleContextMenu(e, projectTree!); }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleFileDrop}
    >
        <div className="flex justify-between items-center gap-4 mb-4">
            <h2 className="font-bold text-lg truncate">Explorer</h2>
            <div className={`flex items-center gap-2 text-muted-foreground flex-shrink-0 transition-opacity ${isHovered || isDraggingFile ? 'opacity-100' : 'opacity-0'}`}>
                <button onClick={handleNewFile} title="New File" className="hover:text-primary"><Icons.FilePlus className="w-4 h-4 flex-shrink-0" /></button>
                <button onClick={handleNewFolder} title="New Folder" className="hover:text-primary"><Icons.FolderPlus className="w-4 h-4 flex-shrink-0" /></button>
                <button onClick={handleCollapseAll} title="Collapse All" className="hover:text-primary"><Icons.Collapse className="w-4 h-4 flex-shrink-0" /></button>
                <button onClick={handleRefresh} title="Refresh Explorer" className="hover:text-primary"><Icons.Refresh className="w-4 h-4 flex-shrink-0" /></button>
            </div>
        </div>
      
      <div className="flex-grow overflow-y-auto relative">
        {isDraggingFile && (
            <div className="absolute inset-0 bg-primary/10 flex flex-col justify-center items-center pointer-events-none z-10">
                <Icons.Download className="w-10 h-10 text-primary mb-4"/>
                <p className="text-primary font-semibold">Drop files to upload</p>
            </div>
        )}

        {loading && <div className="flex items-center gap-2 text-muted-foreground"><Icons.Loader className="w-4 h-4 animate-spin" /><span>Loading...</span></div>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && projectTree && (
          <FileItem 
              key={treeKey}
              node={projectTree} 
              onContextMenu={handleContextMenu} 
              onDrop={handleInternalMove}
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
