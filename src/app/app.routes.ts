import { Routes } from '@angular/router';
import { OrdenComponent } from './orden/orden.component';

export const routes: Routes = [
  { path: '', redirectTo: 'orden', pathMatch: 'full' },
  { path: 'orden', component: OrdenComponent }
];
