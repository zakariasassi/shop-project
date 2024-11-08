// atoms.js
import { atom } from 'jotai';

// Atom for storing user data
export const userAtom = atom(JSON.parse(window.localStorage.getItem('user')) || null);

// Writable atom for storing roles
export const rolesAtom = atom(JSON.parse(window.localStorage.getItem('roles')) || []);

// Derived atom for permissions (read-only)
export const permissionsAtom = atom((get) => {
    const roles = get(rolesAtom);
    return roles.flatMap(role => role.permissions || []);
});
