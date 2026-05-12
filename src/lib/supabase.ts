// Simple Offline Database Client (replaces Supabase)
// This file provides a compatible interface for the offline database
import * as offlineDb from './offline-db';

// Simple mock Supabase client
export const supabase = {
  from: (table: string) => {
    return {
      select: (columns: string = '*') => {
        return {
          eq: (column: string, value: any) => {
            return {
              single: async () => {
                if (table === 'students') {
                  const student = await offlineDb.getStudentById(value);
                  return { data: student, error: student ? null : { code: 'PGRST116', message: 'No rows returned' } };
                }
                return { data: null, error: { code: 'PGRST116', message: 'No rows returned' } };
              },
            };
          },
          order: async (column: string, options?: { ascending?: boolean }) => {
            if (table === 'students') {
              const students = await offlineDb.getAllStudents();
              const sorted = [...students].sort((a: any, b: any) => {
                const aVal = a[column];
                const bVal = b[column];
                if (options?.ascending === false) {
                  return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
                }
                return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
              });
              return { data: sorted, error: null };
            }
            return { data: [], error: null };
          },
        };
      },
      insert: (data: any) => {
        return {
          select: () => {
            return {
              single: async () => {
                if (table === 'students') {
                  const student = await offlineDb.createStudent(data);
                  return { data: student, error: null };
                } else if (table === 'payment_receipts') {
                  const receipt = await offlineDb.createPaymentReceipt(data);
                  return { data: receipt, error: null };
                }
                return { data: null, error: { message: 'Table not found' } };
              }
            };
          },
        };
      },
      update: (data: any) => {
        return {
          eq: async (column: string, value: any) => {
            if (table === 'students') {
              const success = await offlineDb.updateStudent(value, data);
              return { data: success ? data : null, error: success ? null : { message: 'Update failed' } };
            } else if (table === 'payment_receipts') {
              const success = await offlineDb.updatePaymentReceipt(value, data);
              return { data: success ? data : null, error: success ? null : { message: 'Update failed' } };
            }
            return { data: null, error: null };
          }
        };
      },
      delete: () => {
        return {
          eq: async (column: string, value: any) => {
            if (table === 'students') {
              const success = await offlineDb.deleteStudent(value);
              return { data: null, error: success ? null : { message: 'Delete failed' } };
            }
            return { data: null, error: null };
          }
        };
      }
    };
  },
  // Add auth property for compatibility
  auth: {
    getUser: async () => {
      return { 
        data: { user: { id: 'offline-user-1', email: 'offline@localhost' } }, 
        error: null 
      };
    }
  }
};
