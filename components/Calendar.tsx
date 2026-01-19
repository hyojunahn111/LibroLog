
import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  endOfMonth, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  isToday
} from 'date-fns';
import { Book } from '../types';

// 커스텀 구현
const subMonths = (date: Date, amount: number) => addMonths(date, -amount);
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const startOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
};

interface CalendarProps {
  books: Book[];
  onSelectDate: (date: Date) => void;
  onBookClick: (book: Book) => void;
}

const Calendar: React.FC<CalendarProps> = ({ books, onSelectDate, onBookClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* 달력 헤더 - 영어 형식 (예: January 2024) */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
        <h2 className="text-2xl font-serif text-slate-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 요일 표시 - 영어 */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className={`py-3 text-center text-xs font-bold uppercase tracking-wider ${day === 'Sun' ? 'text-red-400' : day === 'Sat' ? 'text-blue-400' : 'text-slate-400'}`}>
            {day}
          </div>
        ))}
      </div>

      {/* 달력 그리드 */}
      <div className="grid grid-cols-7 h-[700px]">
        {days.map((day) => {
          const dayBooks = books.filter(book => isSameDay(new Date(book.logDate), day));
          const visibleBooks = dayBooks.slice(0, 3);
          const hiddenCount = dayBooks.length - 3;
          
          return (
            <div 
              key={day.toString()}
              onClick={() => onSelectDate(day)}
              className={`
                relative p-1 sm:p-2 border-r border-b border-slate-50 h-full overflow-hidden cursor-pointer hover:bg-slate-50 transition-colors group
                ${!isSameMonth(day, monthStart) ? 'bg-slate-50/50 text-slate-200' : 'text-slate-600'}
                ${isToday(day) ? 'bg-indigo-50/30' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`
                  text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                  ${isToday(day) ? 'bg-indigo-600 text-white' : ''}
                `}>
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className="flex flex-col gap-1 overflow-hidden">
                {visibleBooks.map(book => (
                  <div 
                    key={book.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookClick(book);
                    }}
                    className="truncate px-2 py-1 text-[10px] sm:text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md font-medium hover:bg-indigo-100 transition-colors flex items-center gap-1"
                    title={book.title}
                  >
                    <div className={`w-1 h-1 rounded-full flex-shrink-0 ${book.endDate ? 'bg-green-500' : 'bg-indigo-500'}`} />
                    {book.title}
                  </div>
                ))}
                {hiddenCount > 0 && (
                  <div className="px-2 text-[10px] font-bold text-slate-400">
                    + {hiddenCount} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
