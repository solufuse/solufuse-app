
import { useState, useEffect } from 'react';
import { Icons } from '../icons';
import { inviteMember, removeMember, getProjectMembers } from '../../api/projects'; // Import API functions
import { Member } from '../../types'; // Import types

interface MembersModalProps {
    projectId: string;
    onClose: () => void;
}

export function MembersModal({ projectId, onClose }: MembersModalProps) {
    const [members, setMembers] = useState<Member[]>([]);

    useEffect(() => {
        const fetchMembers = async () => {
            if (projectId) {
                try {
                    const memberList = await getProjectMembers(projectId);
                    setMembers(memberList);
                } catch (error) {
                    console.error('Error fetching members:', error);
                }
            }
        };
        fetchMembers();
    }, [projectId]);

    const handleInviteMember = async (email: string) => {
        if (projectId) {
            try {
                const newMember = await inviteMember(projectId, email, 'viewer');
                setMembers([...members, newMember]);
            } catch (error) {
                console.error('Error inviting member:', error);
            }
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (projectId) {
            try {
                await removeMember(projectId, userId);
                setMembers(members.filter((m) => m.uid !== userId));
            } catch (error) {
                console.error('Error removing member:', error);
            }
        }
    };

    return (
        <div className="absolute top-full mt-2 w-72 bg-card border rounded-lg shadow-lg z-10">
            <div className="p-2 flex justify-between items-center">
                <h3 className="font-bold">Project Members</h3>
                <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-500"><Icons.X className="w-4 h-4"/></button>
            </div>
            <div className="border-t">
                <ul>
                    {members.map(m => (
                        <li key={m.uid} className="px-3 py-2 flex justify-between items-center">
                            <span>{m.email} ({m.role})</span>
                            <button onClick={() => handleRemoveMember(m.uid)} className="text-red-500">
                                <Icons.X size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border-t p-2">
                <input
                    type="text"
                    placeholder="Invite member by email..."
                    className="w-full px-2 py-1 border rounded-md mb-2"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleInviteMember(e.currentTarget.value);
                            e.currentTarget.value = '';
                        }
                    }}
                />
            </div>
        </div>
    );
}
