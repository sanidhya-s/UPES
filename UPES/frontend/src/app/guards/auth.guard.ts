import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  if (sessionStorage.getItem('token')) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
