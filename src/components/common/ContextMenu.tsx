
import React, { useEffect, useRef } from 'react';

export interface MenuItem {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
  danger?: boolean; // For destructive actions like 'delete'
  separator?: boolean; // To draw a line before this item
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    // Add event listener on mount
    document.addEventListener('mousedown', handleClickOutside);
    // Clean up event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Adjust position if menu goes off-screen
  useEffect(() => {
    if (menuRef.current) {
      const { innerWidth, innerHeight } = window;
      const { offsetWidth, offsetHeight } = menuRef.current;
      let newX = x;
      let newY = y;
      if (x + offsetWidth > innerWidth) {
        newX = innerWidth - offsetWidth - 5;
      }
      if (y + offsetHeight > innerHeight) {
        newY = innerHeight - offsetHeight - 5;
      }
      menuRef.current.style.top = `${newY}px`;
      menuRef.current.style.left = `${newX}px`;
    }
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-card border border-border rounded-md shadow-lg p-1 min-w-[200px] animate-in fade-in-5"
      style={{ top: y, left: x }}
      onContextMenu={(e) => e.preventDefault()} // Prevent another context menu on the menu itself
    >
      <ul className="flex flex-col">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.separator && <div className="h-px bg-border my-1" />}
            <li>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  item.action();
                  onClose();
                }}
                className={`w-full text-left px-2.5 py-1.5 text-sm flex items-center gap-2.5 rounded-sm outline-none transition-colors hover:bg-primary/10 focus:bg-primary/10 ${
                  item.danger ? 'text-red-500 hover:text-red-600 focus:text-red-600' : 'text-foreground'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};
