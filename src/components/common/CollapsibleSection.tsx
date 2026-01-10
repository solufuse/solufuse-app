
import { useState, ReactNode } from 'react';
import { Icons } from '../icons';

interface CollapsibleSectionProps {
    title: string;
    icon: ReactNode;
    defaultOpen?: boolean;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}

export const CollapsibleSection = ({ title, icon, defaultOpen = false, action, children, className }: CollapsibleSectionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`py-2 ${className}`}>
            <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center cursor-pointer group px-1">
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="font-bold text-sm text-foreground/80 group-hover:text-foreground select-none">{title}</h3>
                </div>
                <div className="flex items-center">
                    {action}
                    <Icons.ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isOpen && <div className="mt-1">{children}</div>}
        </div>
    );
};
