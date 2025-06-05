import React from 'react';
import { StudentCard } from '@/components/organisms/StudentCard';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

export const StudentList = ({ students, searchTerm, setSearchTerm, onAddStudent }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
            <Input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>
        <Button
          onClick={onAddStudent}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          <ApperIcon name="UserPlus" className="h-5 w-5 mr-2" />
          Add Student
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student, index) => (
          <StudentCard key={student.id} student={student} index={index} />
        ))}
      </div>
    </div>
  );
};