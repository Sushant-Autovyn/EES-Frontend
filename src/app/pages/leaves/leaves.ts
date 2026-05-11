import { Component, OnInit, ChangeDetectorRef }
from '@angular/core';

import { CommonModule }
from '@angular/common';

import { FormsModule }
from '@angular/forms';

import { Sidebar }
from '../../components/sidebar/sidebar';

import { Navbar }
from '../../components/navbar/navbar';

import { Leave }
from '../../services/leave';

import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Sidebar,
    Navbar
  ],
  templateUrl: './leaves.html',
  styleUrl: './leaves.css'
})

export class Leaves
implements OnInit {

  leaves:any[] = [];
  leaveBalance:any[] = [];
  userRole: string = '';
  activeTab: string = 'apply';
  currentYear: number = new Date().getFullYear();

  leaveData = {
    employee_id:'',
    leave_type:'',
    from_date:'',
    to_date:'',
    reason:''
  };

  constructor(
    private leaveService: Leave,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userRole = payload.role;
      this.leaveData.employee_id = payload.id;
    }
    this.getLeaves();
    if (this.userRole === 'employee') {
      this.loadBalance();
    }
  }

  getLeaves(){

    this.leaveService
    .getLeaves()
    .subscribe((res:any)=>{

      this.leaves = res;
      this.cdr.detectChanges();

    });

  }

  loadBalance(){
    this.leaveService.getBalance()
    .subscribe((res:any)=>{
      this.leaveBalance = res;
      this.cdr.detectChanges();
    });
  }

  applyLeave(){

    this.leaveService
    .applyLeave(this.leaveData)
    .subscribe({
      next: (res:any) => {

        this.toast.success('Leave Applied');

        this.getLeaves();

        this.leaveData = {
          employee_id:'',
          leave_type:'',
          from_date:'',
          to_date:'',
          reason:''
        };

      },
      error: (err:any) => {
        console.error('Apply leave error:', err);
        this.toast.error('Failed to apply leave: ' + (err.error?.message || err.message || 'Server error'));
      }
    });

  }

  approveLeave(id:any){

    this.leaveService
    .approveLeave(id)
    .subscribe((res:any)=>{

      this.toast.success('Leave Approved');

      this.getLeaves();

    });

  }

  rejectLeave(id:any){
    this.leaveService.rejectLeave(id)
    .subscribe((res:any)=>{
      this.toast.success('Leave Rejected');
      this.getLeaves();
    });
  }

  exportCSV(){
    const headers = ['ID','Employee','Type','From','To','Reason','Status'];
    const rows = this.leaves.map((l:any) =>
      [l.id, l.name, l.leave_type, l.from_date, l.to_date, l.reason, l.status].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leaves.csv';
    a.click();
  }

  getUsed(type: string): number {
    const item = this.leaveBalance.find((b:any) => b.type === type);
    return item ? item.used : 0;
  }

  getTotal(type: string): number {
    const item = this.leaveBalance.find((b:any) => b.type === type);
    return item ? item.total : 0;
  }

  getRemaining(type: string): number {
    const item = this.leaveBalance.find((b:any) => b.type === type);
    return item ? item.remaining : 0;
  }

  getPercent(type: string): number {
    const item = this.leaveBalance.find((b:any) => b.type === type);
    if (!item || item.total === 0) return 0;
    return (item.used / item.total) * 100;
  }

  getTotalAll(): number {
    return this.leaveBalance.reduce((sum:number, b:any) => sum + b.total, 0);
  }

  getUsedAll(): number {
    return this.leaveBalance.reduce((sum:number, b:any) => sum + b.used, 0);
  }

  getRemainingAll(): number {
    return this.leaveBalance.reduce((sum:number, b:any) => sum + b.remaining, 0);
  }

}
