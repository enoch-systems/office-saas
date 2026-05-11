// Offline Database Client (replaces Supabase)
// This file provides a compatible interface for the offline database
import * as offlineDb from './offline-db';

// Mock Supabase client interface for compatibility
export const supabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          if (table === 'students') {
            const student = await offlineDb.getStudentById(value);
            return { data: student, error: student ? null : { code: 'PGRST116', message: 'No rows returned' } };
          }
          return { data: null, error: { code: 'PGRST116', message: 'No rows returned' } };
        },
        then: async (resolve: any) => {
          if (table === 'students') {
            const students = await offlineDb.getAllStudents();
            const filtered = students.filter((s: any) => (s as any)[column] === value);
            resolve({ data: filtered, error: null });
          }
          return { data: [], error: null };
        }
      }),
      order: (column: string, options?: { ascending?: boolean }) => ({
        then: async (resolve: any) => {
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
            resolve({ data: sorted, error: null });
          }
          return { data: [], error: null };
        }
      }),
      then: async (resolve: any) => {
        if (table === 'students') {
          const students = await offlineDb.getAllStudents();
          resolve({ data: students, error: null });
        } else if (table === 'payment_receipts') {
          const receipts = await offlineDb.getAllPaymentReceipts();
          resolve({ data: receipts, error: null });
        }
        return { data: [], error: null };
      }
    }),
    insert: (data: any) => ({
      select: () => ({
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
      }),
      then: async (resolve: any) => {
        if (table === 'students') {
          const student = await offlineDb.createStudent(data);
          resolve({ data: student, error: null });
        } else if (table === 'payment_receipts') {
          const receipt = await offlineDb.createPaymentReceipt(data);
          resolve({ data: receipt, error: null });
        }
        return { data: null, error: null };
      }
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        then: async (resolve: any) => {
          if (table === 'students') {
            const success = await offlineDb.updateStudent(value, data);
            resolve({ data: success ? data : null, error: success ? null : { message: 'Update failed' } });
          } else if (table === 'payment_receipts') {
            const success = await offlineDb.updatePaymentReceipt(value, data);
            resolve({ data: success ? data : null, error: success ? null : { message: 'Update failed' } });
          }
          return { data: null, error: null };
        }
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        then: async (resolve: any) => {
          if (table === 'students') {
            const success = await offlineDb.deleteStudent(value);
            resolve({ data: null, error: success ? null : { message: 'Delete failed' } });
          }
          return { data: null, error: null };
        }
      })
    })
  })
};
