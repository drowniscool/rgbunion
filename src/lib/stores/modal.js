import { writable } from 'svelte/store';

// Store for account modal state
export const showAccountModal = writable(false);

// Helper functions
export function openAccountModal() {
  showAccountModal.set(true);
}

export function closeAccountModal() {
  showAccountModal.set(false);
}