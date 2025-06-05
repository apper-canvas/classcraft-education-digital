import React from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/atoms/Card';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

export const TestScoresList = ({ tests, students, handleScoreUpdate, onCreateTest }) => {
  const getGrade = (marks, totalMarks) => {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-500' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-500' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-400' };
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-500' };
    return { grade: 'F', color: 'text-red-500' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Heading level={3} className="text-lg">Tests & Scores</Heading>
        <Button
          onClick={onCreateTest}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          Create Test
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tests.map(test => (
          <Card key={test.id}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Heading level={4} className="font-semibold">{test.name}</Heading>
                <Text className="text-sm text-surface-600">{test.subject} • {format(new Date(test.date), 'MMM d, yyyy')}</Text>
              </div>
              <div className="text-right">
                <Text className="text-sm text-surface-600">Total Marks</Text>
                <Text className="font-semibold text-surface-900">{test.totalMarks}</Text>
              </div>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {students.map(student => {
                const score = test.scores?.find(s => s.studentId === student.id);
                const gradeInfo = score ? getGrade(score.marksObtained, test.totalMarks) : null;

                return (
                  <div key={student.id} className="flex items-center justify-between p-2 hover:bg-surface-50 rounded">
                    <div className="flex items-center space-x-3">
                      <img
                        src={student.photo || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face`}
                        alt={student.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <Text className="text-sm font-medium text-surface-900">{student.name}</Text>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="number"
                        min="0"
                        max={test.totalMarks}
                        value={score?.marksObtained || ''}
                        onChange={(e) => handleScoreUpdate(test.id, student.id, e.target.value)}
                        className="w-16 px-2 py-1 text-sm rounded focus:ring-1"
                        placeholder="0"
                      />
                      <Text className="text-sm text-surface-600">/ {test.totalMarks}</Text>
                      {gradeInfo && (
                        <Text className={`text-sm font-medium ${gradeInfo.color}`}>
                          {gradeInfo.grade}
                        </Text>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};