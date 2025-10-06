import React, { useState } from 'react';
import { User, Calendar, CreditCard, BookOpen, Mail, Phone, MapPin, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  enrollmentDate: string;
  course: {
    name: string;
    duration: string;
    progress: number;
  };
  attendance: {
    date: string;
    status: 'present' | 'absent' | 'late';
  }[];
  payments: {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    description: string;
  }[];
}

const StudentPersonalDetails: React.FC = () => {
  const [student] = useState<Student>({
    id: 'STU-2024-001',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Education St, Learning City, LC 12345',
    enrollmentDate: '2024-09-01',
    course: {
      name: 'Full Stack Web Development',
      duration: '6 months',
      progress: 68,
    },
    attendance: [
      { date: '2024-10-01', status: 'present' },
      { date: '2024-10-02', status: 'present' },
      { date: '2024-10-03', status: 'late' },
      { date: '2024-10-04', status: 'present' },
      { date: '2024-10-05', status: 'absent' },
      { date: '2024-10-06', status: 'present' },
      { date: '2024-10-07', status: 'present' },
      { date: '2024-10-08', status: 'present' },
      { date: '2024-10-09', status: 'late' },
      { date: '2024-10-10', status: 'present' },
      { date: '2024-10-11', status: 'present' },
      { date: '2024-10-12', status: 'present' },
      { date: '2024-10-13', status: 'present' },
      { date: '2024-10-14', status: 'absent' },
      { date: '2024-10-15', status: 'present' },
    ],
    payments: [
      { id: 'PAY-001', date: '2024-09-01', amount: 1500, status: 'paid', description: 'Course Fee - Month 1' },
      { id: 'PAY-002', date: '2024-10-01', amount: 1500, status: 'paid', description: 'Course Fee - Month 2' },
      { id: 'PAY-003', date: '2024-11-01', amount: 1500, status: 'pending', description: 'Course Fee - Month 3' },
      { id: 'PAY-004', date: '2024-12-01', amount: 1500, status: 'pending', description: 'Course Fee - Month 4' },
    ],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
      case 'paid':
        return 'bg-emerald-500';
      case 'absent':
      case 'overdue':
        return 'bg-rose-500';
      case 'late':
      case 'pending':
        return 'bg-amber-500';
      default:
        return 'bg-gray-400';
    }
  };

  const attendanceRate = (student.attendance.filter(a => a.status === 'present').length / student.attendance.length * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                  <User className="w-12 h-12" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
                  <p className="text-indigo-100 mb-1">Student ID: {student.id}</p>
                  <p className="text-indigo-100">Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                  <p className="text-sm text-indigo-100">Attendance Rate</p>
                  <p className="text-3xl font-bold">{attendanceRate}%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{student.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{student.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Current Course</h2>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{student.course.name}</h3>
                <p className="text-gray-600">Duration: {student.course.duration}</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Progress</p>
                <p className="text-2xl font-bold text-purple-600">{student.course.progress}%</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Course Completion</span>
                <span>{student.course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${student.course.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Grid */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Attendance</h2>
            </div>
            
            <div className="grid grid-cols-5 gap-3 mb-6">
              {student.attendance.map((record, idx) => (
                <div key={idx} className="group relative">
                  <div
                    className={`aspect-square rounded-lg ${getStatusColor(record.status)} transition-all duration-200 hover:scale-110 hover:shadow-lg cursor-pointer`}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {new Date(record.date).toLocaleDateString()} - {record.status}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-sm text-gray-600">Present</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-amber-500" />
                <span className="text-sm text-gray-600">Late</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-rose-500" />
                <span className="text-sm text-gray-600">Absent</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Payments</h2>
            </div>
            
            <div className="space-y-3">
              {student.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {payment.status === 'paid' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : payment.status === 'overdue' ? (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-500" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{payment.description}</p>
                        <p className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-800">${payment.amount}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          payment.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : payment.status === 'overdue'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {payment.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total Paid</span>
                <span className="text-2xl font-bold text-emerald-600">
                  ${student.payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600 font-medium">Pending</span>
                <span className="text-2xl font-bold text-amber-600">
                  ${student.payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPersonalDetails;