import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
    isCollapsed = false;

  menuItems = [
    { label: 'Dashboard', icon: 'pi-home', route: '/dashboard' },
    { label: 'User Management', icon: 'pi-users', route: '/users' },
    { label: 'Vendor Management', icon: 'pi-briefcase', route: '/vendors' },
    { label: 'Settings', icon: 'pi-cog', route: '/settings' }
  ];

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
