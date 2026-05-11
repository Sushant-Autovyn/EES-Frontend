import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';
import { SettingsService } from '../../services/settings.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './system-settings.html',
  styleUrl: './system-settings.css'
})
export class SystemSettings implements OnInit {
  settings: any[] = [];
  activeCategory = 'all';
  categories = ['general', 'working_hours', 'leave_rules', 'salary_rules', 'policy'];
  showAddForm = false;
  newSetting = { setting_key: '', setting_value: '', category: 'general' };
  editingId: number | null = null;
  editValue = '';

  constructor(private settingsService: SettingsService, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() {
    this.settingsService.getAll().subscribe((res: any) => { this.settings = res; this.cdr.detectChanges(); });
  }

  get filteredSettings() {
    if (this.activeCategory === 'all') return this.settings;
    return this.settings.filter(s => s.category === this.activeCategory);
  }

  startEdit(s: any) { this.editingId = s.id; this.editValue = s.setting_value; }

  saveEdit(s: any) {
    this.settingsService.update(s.id, this.editValue).subscribe((res: any) => {
      this.toast.success(res.message);
      s.setting_value = this.editValue;
      this.editingId = null;
    });
  }

  cancelEdit() { this.editingId = null; }

  addSetting() {
    if (!this.newSetting.setting_key || !this.newSetting.setting_value) return;
    this.settingsService.add(this.newSetting).subscribe((res: any) => {
      this.toast.success(res.message);
      this.showAddForm = false;
      this.newSetting = { setting_key: '', setting_value: '', category: 'general' };
      this.load();
    }, (err) => this.toast.error(err.error?.message || 'Error'));
  }

  deleteSetting(id: number) {
    this.toast.confirm('Delete this setting?', () => {
      this.settingsService.delete(id).subscribe((res: any) => {
        this.toast.success(res.message); this.load();
      });
    });
  }

  formatKey(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getCategoryIcon(cat: string): string {
    const icons: any = { general: 'fa-cog', working_hours: 'fa-clock', leave_rules: 'fa-calendar-alt', salary_rules: 'fa-money-bill', policy: 'fa-shield-alt' };
    return icons[cat] || 'fa-cog';
  }
}
