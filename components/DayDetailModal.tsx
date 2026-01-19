
import React, { useEffect } from 'react';
import { Book } from '../types';
import { format, isSameDay } from 'date-fns';

interface DayDetailModalProps {
  isOpen: boolean;
  date: Date | null;
  books: Book[];
  onClose: () => void;
  onBookClick: (book: Book) => void;
  onAddNew: (date: Date) => void;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({ 
  isOpen, 
  date, 
  books, 
  onClose, 
  onBookClick, 
  onAddNew
}) => {
  // 모달 오픈 시 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !date) return null;

  const dayBooks = books.filter(b => isSameDay(new Date(b.logDate), date));

  return (
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{format(date, 'yyyy년 M월 d일')}</h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{dayBooks.length}개의 기록</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6 max-h-[50vh] overflow-y-auto no-scrollbar space-y-3">
          {dayBooks.length === 0 ? (
            <div className="text-center py-8 text-slate-400 italic text-sm">
              이 날의 기록이 없습니다.
            </div>
          ) : (
            dayBooks.map((book) => (
              <div key={book.id} className="relative group">
                <button
                  onClick={() => onBookClick(book)}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-2xl transition-all text-left"
                >
                  {book.imageUrl ? (
                    <img src={book.imageUrl} alt="" className="w-10 h-14 object-cover rounded shadow-sm group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-10 h-14 bg-white rounded border border-slate-200 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{book.title}</h4>
                    
                    <div className="flex flex-col mt-1">
                       <span className="text-[10px] text-slate-500">
                         {book.startDate} ~ {book.endDate || '진행 중'}
                       </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        {book.rating !== null ? (
                          [...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-2 h-2 ${i < (book.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))
                        ) : (
                          <span className="text-[9px] text-indigo-500 font-bold uppercase tracking-tighter">읽는 중</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={() => onAddNew(date)}
            className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            새 기록 추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayDetailModal;
