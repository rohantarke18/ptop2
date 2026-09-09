import React, { useState, useEffect } from 'react';
import { complaintService } from '../../services/complaintService';
import { Problem } from '../../types';
import { PriorityBadge, StatusBadge } from '../../components/common/StatusBadge';
import { useNotifications } from '../../context/NotificationContext';
import { UserCheck, Building2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminAssignmentsPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const { showToast } = useNotifications();

  useEffect(() => {
    complaintService.getComplaints().then(setProblems);
  }, []);

  const officers = [
    { name: 'Er. Rajesh Salvi', title: 'Executive Engineer (Roads)' },
    { name: 'Er. Suresh Patil', title: 'Assistant Engineer (Water Works)' },
    { name: 'Er. Priya Jadhav', title: 'Sanitation Officer (Solid Waste)' },
    { name: 'Er. Vikas Kulkarni', title: 'Junior Engineer (Civil Infrastructure)' },
  ];

  const handleAssign = (problemId: string, officerName: string) => {
    showToast('success', 'Assignment Dispatched', `Case ${problemId} assigned to ${officerName}. SLA timer initialized.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Field Officer Workload & Dispatch
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Assign field engineers to incoming triaged complaints and enforce statutory SLA commitments.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Docket ID</th>
                <th className="p-3">Title & Ward</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Department</th>
                <th className="p-3">Current Assignment</th>
                <th className="p-3 text-right">Dispatch Officer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {problems.map((prob) => (
                <tr key={prob.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-blue-700">{prob.id}</td>
                  <td className="p-3">
                    <p className="font-semibold text-slate-900">{prob.title}</p>
                    <p className="text-[11px] text-slate-400">{prob.location.ward}</p>
                  </td>
                  <td className="p-3">
                    <PriorityBadge priority={prob.priority} size="sm" />
                  </td>
                  <td className="p-3 text-slate-700">{prob.department}</td>
                  <td className="p-3 text-slate-800 font-medium">
                    {prob.assignedOfficer?.name || <span className="text-amber-600 italic">Unassigned</span>}
                  </td>
                  <td className="p-3 text-right">
                    <select
                      onChange={(e) => handleAssign(prob.id, e.target.value)}
                      defaultValue={prob.assignedOfficer?.name || ''}
                      className="p-1.5 border border-slate-300 rounded text-xs bg-white font-medium cursor-pointer"
                    >
                      <option value="" disabled>Select Field Officer</option>
                      {officers.map((o) => (
                        <option key={o.name} value={o.name}>{o.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
