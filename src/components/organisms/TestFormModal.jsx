import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Label } from '@/components/atoms/Label';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Heading } from '@/components/atoms/Heading';

export const TestFormModal = ({ isOpen, onClose, onSubmit, formState, setFormState }) => {
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
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Heading level={3} className="text-lg mb-4">Create New Test</Heading>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="testName">Test Name *</Label>
                <Input
                  id="testName"
                  name="name"
                  type="text"
                  value={formState.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formState.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formState.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="totalMarks">Total Marks *</Label>
                <Input
                  id="totalMarks"
                  name="totalMarks"
                  type="number"
                  min="1"
                  value={formState.totalMarks}
                  onChange={handleChange}
                  required
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
                  Create Test
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};