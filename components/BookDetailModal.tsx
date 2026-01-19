
import React, { useEffect } from 'react';
import { Book } from '../types';

interface BookDetailModalProps {
  isOpen: boolean;
  book: Book | null;
  onClose: () => void;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ isOpen, book, onClose, onEdit, onDelete }) => {
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

  if (!isOpen || !book) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold text-slate-800">책 상세 정보</h3>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto no-scrollbar">
          <div className="flex flex-col md:flex-row gap-8">
            {/* 왼쪽: 커버 이미지 및 주요 상태 */}
            <div className="w-full md:w-48 shrink-0 space-y-4">
              {book.imageUrl ? (
                <img src={book.imageUrl} alt={book.title} className="w-full aspect-[2/3] object-cover rounded-2xl shadow-xl shadow-slate-200" />
              ) : (
                <div className="w-full aspect-[2/3] bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                  <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest">No Cover</span>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <span className={`w-full py-2 rounded-xl text-center text-xs font-bold uppercase tracking-wider ${
                  book.endDate ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {book.endDate ? '완독함' : '읽는 중'}
                </span>
                
                {book.rating !== null && (
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`w-4 h-4 ${star <= (book.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 오른쪽: 상세 정보 */}
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 leading-tight">{book.title}</h2>
                <div className="flex items-center gap-3 mt-4 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {book.startDate}
                  </div>
                  <span>~</span>
                  <div className="flex items-center gap-1">
                    {book.endDate ? book.endDate : '읽는 중'}
                  </div>
                </div>
              </div>

              {book.category && (
                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {book.category}
                </div>
              )}

              <div className="space-y-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">리뷰 / 메모</h4>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap italic">
                    {book.review || "작성된 리뷰가 없습니다."}
                  </p>
                </div>

                {/* 인상 깊었던 구절 표시 */}
                {book.quotes && book.quotes.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">인상 깊었던 구절</h4>
                    <div className="space-y-3">
                      {book.quotes.map((quote, i) => (
                        <div key={i} className="relative p-4 bg-indigo-50/50 rounded-2xl border-l-4 border-indigo-400">
                          <svg className="absolute top-2 right-4 w-6 h-6 text-indigo-100 fill-indigo-100" viewBox="0 0 24 24">
                            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H12.017C11.4647 13 11.017 12.5523 11.017 12V6C11.017 5.44772 11.4647 5 12.017 5H19.017C20.6739 5 22.017 6.34315 22.017 8V15C22.017 16.6569 20.6739 18 19.017 18H17.017L17.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H4.017C3.46472 8 3.017 8.44772 3.017 9V12C3.017 12.5523 2.56928 13 2.017 13H1.017C0.464722 13 0.017 12.5523 0.017 12V6C0.017 5.44772 0.464722 5 1.017 5H8.017C9.67386 5 11.017 6.34315 11.017 8V15C11.017 16.6569 9.67386 18 8.017 18H6.017L6.017 21H3.017Z" />
                          </svg>
                          <p className="text-slate-600 text-sm leading-relaxed italic pr-8 whitespace-pre-wrap">
                            {quote}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {book.description && (
                  <div className="space-y-2 px-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">책 소개 (AI)</h4>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-4">
                      {book.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
          <button 
            onClick={() => onDelete(book.id)}
            className="px-6 py-3.5 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            삭제
          </button>
          <div className="flex-1" />
          <button 
            onClick={() => onEdit(book)}
            className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
