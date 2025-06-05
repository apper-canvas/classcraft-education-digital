import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Label } from '@/components/atoms/Label';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Heading } from '@/components/atoms/Heading';

export const StudentFormModal = ({ isOpen, onClose, onSubmit, formState, setFormState }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Heading level={3} className="text-lg mb-4">Add New Student</Heading>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formState.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formState.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="parentPhone">Parent Phone</Label>
                <Input
                  id="parentPhone"
                  name="parentPhone"
                  type="tel"
                  value={formState.parentPhone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="batch">Batch</Label>
                <Input
                  id="batch"
                  name="batch"
                  type="text"
                  value={formState.batch}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-surface-600 hover:bg-surface-100 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Add Student
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};