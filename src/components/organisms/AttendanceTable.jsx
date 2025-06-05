import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

export const AttendanceTable = ({ students, attendance, currentMonth, setCurrentMonth, handleAttendanceToggle }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAttendanceForDate = (studentId, date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return attendance.find(a => a.studentId === studentId && a.date === dateStr);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            className="p-2 hover:bg-surface-100 rounded-lg"
          >
            <ApperIcon name="ChevronLeft" className="h-5 w-5" />
          </Button>
          <Heading level={3} className="text-lg">
            {format(currentMonth, 'MMMM yyyy')}
          </Heading>
          <Button
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
            className="p-2 hover:bg-surface-100 rounded-lg"
          >
            <ApperIcon name="ChevronRight" className="h-5 w-5" />
          </Button>
        </div>
        <Text className="text-sm text-surface-600">
          Click on dates to mark attendance
        </Text>
      </div>

      <Card hoverEffect={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-surface-700 sticky left-0 bg-surface-50 z-10 min-w-[160px]">
                  Student
                </th>
                {daysInMonth.slice(0, 15).map(day => (
                  <th key={day.toString()} className="px-2 py-3 text-center text-sm font-medium text-surface-700 min-w-[40px]">
                    <div className={`${isToday(day) ? 'bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}>
                      {format(day, 'd')}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {students.map(student => (
                <tr key={student.id} className="hover:bg-surface-50">
                  <td className="px-4 py-3 sticky left-0 bg-white z-10 border-r border-surface-200">
                    <div className="flex items-center space-x-3">
                      <img
                        src={student.photo || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face`}
                        alt={student.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <Text className="text-sm font-medium text-surface-900">{student.name}</Text>
                    </div>
                  </td>
                  {daysInMonth.slice(0, 15).map(day => {
                    const attendanceRecord = getAttendanceForDate(student.id, day);
                    const status = attendanceRecord?.status || 'unmarked';
                    
                    return (
                      <td key={day.toString()} className="px-2 py-3 text-center">
                        <Button
                          onClick={() => handleAttendanceToggle(student.id, day, status)}
                          className={`w-6 h-6 rounded-full border-2 ${
                            status === 'present'
                              ? 'bg-secondary border-secondary'
                              : status === 'absent'
                              ? 'bg-red-500 border-red-500'
                              : 'border-surface-300 hover:border-surface-400'
                          }`}
                        >
                          {status === 'present' && (
                            <ApperIcon name="Check" className="h-3 w-3 text-white mx-auto" />
                          )}
                          {status === 'absent' && (
                            <ApperIcon name="X" className="h-3 w-3 text-white mx-auto" />
                          )}
                        </Button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};