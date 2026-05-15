import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Roles } from './pages/roles/roles';
import { Dashboard } from './pages/dashboard/dashboard';
import { Employees } from './pages/employees/employees';
import { Attendance } from './pages/attendance/attendance';
import { Leaves } from './pages/leaves/leaves';
import { PayrollComponent as Payroll } from './pages/payroll/payroll';
import { Calendar } from './pages/calendar/calendar';
import { TeamMembers } from './pages/team-members/team-members';
import { SalaryRecords } from './pages/salary-records/salary-records';
import { PayslipComponent } from './pages/payslip/payslip';
import { AttendanceSalary } from './pages/attendance-salary/attendance-salary';
import { FinancialReports } from './pages/financial-reports/financial-reports';
import { ReimbursementsComponent } from './pages/reimbursements/reimbursements';
import { HrOnboarding } from './pages/hr-onboarding/hr-onboarding';
import { HrRecruitment } from './pages/hr-recruitment/hr-recruitment';
import { HrDocuments } from './pages/hr-documents/hr-documents';
import { HrReports } from './pages/hr-reports/hr-reports';
import { HrDepartments } from './pages/hr-departments/hr-departments';
import { UserManagement } from './pages/user-management/user-management';
import { SystemSettings } from './pages/system-settings/system-settings';
import { Announcements } from './pages/announcements/announcements';
import { AuditLogs } from './pages/audit-logs/audit-logs';
import { BackupRecovery } from './pages/backup-recovery/backup-recovery';
import { AdminReports } from './pages/admin-reports/admin-reports';
import { BranchManagement } from './pages/branch-management/branch-management';
import { MyDocuments } from './pages/my-documents/my-documents';
import { MyComplaints } from './pages/my-complaints/my-complaints';
import { ManageComplaints } from './pages/manage-complaints/manage-complaints';
import { SendMessage } from './pages/send-message/send-message';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'employees', component: Employees, canActivate: [authGuard] },
  { path: 'attendance', component: Attendance, canActivate: [authGuard] },
  { path: 'leaves', component: Leaves, canActivate: [authGuard] },
  { path: 'payroll', component: Payroll, canActivate: [authGuard] },
  { path: 'roles', component: Roles, canActivate: [authGuard] },
  { path: 'calendar', component: Calendar, canActivate: [authGuard] },
  { path: 'team-members', component: TeamMembers, canActivate: [authGuard] },
  { path: 'salary-records', component: SalaryRecords, canActivate: [authGuard] },
  { path: 'payslip', component: PayslipComponent, canActivate: [authGuard] },
  { path: 'attendance-salary', component: AttendanceSalary, canActivate: [authGuard] },
  { path: 'financial-reports', component: FinancialReports, canActivate: [authGuard] },
  { path: 'reimbursements', component: ReimbursementsComponent, canActivate: [authGuard] },
  { path: 'hr-onboarding', component: HrOnboarding, canActivate: [authGuard] },
  { path: 'hr-recruitment', component: HrRecruitment, canActivate: [authGuard] },
  { path: 'hr-documents', component: HrDocuments, canActivate: [authGuard] },
  { path: 'hr-reports', component: HrReports, canActivate: [authGuard] },
  { path: 'hr-departments', component: HrDepartments, canActivate: [authGuard] },
  { path: 'user-management', component: UserManagement, canActivate: [authGuard] },
  { path: 'system-settings', component: SystemSettings, canActivate: [authGuard] },
  { path: 'announcements', component: Announcements, canActivate: [authGuard] },
  { path: 'audit-logs', component: AuditLogs, canActivate: [authGuard] },
  { path: 'backup-recovery', component: BackupRecovery, canActivate: [authGuard] },
  { path: 'admin-reports', component: AdminReports, canActivate: [authGuard] },
  { path: 'branch-management', component: BranchManagement, canActivate: [authGuard] },
  { path: 'my-documents', component: MyDocuments, canActivate: [authGuard] },
  { path: 'my-complaints', component: MyComplaints, canActivate: [authGuard] },
  { path: 'manage-complaints', component: ManageComplaints, canActivate: [authGuard] },
  { path: 'send-message', component: SendMessage, canActivate: [authGuard] },
];