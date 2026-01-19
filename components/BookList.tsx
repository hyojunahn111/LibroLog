
import React, { useState } from 'react';
import { Book, ListFilter } from '../types';

interface BookListProps {
  books: Book[];
  activeFilter: ListFilter;
  onFilterChange: (filter: ListFilter) => void;
  onBookClick: (book: Book) => void;
  onDeleteMultiple: (ids: Set<string>) => void;
  onBack: () => void;
}

const BookList: React.FC<BookListProps> = ({ books, activeFilter, onFilterChange, onBookClick, onDeleteMultiple, onBack }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books.filter(book => {
    // 1. 상태 필터링
    const matchesFilter = 
      activeFilter === 'all' || 
      (activeFilter === 'finished' && !!book.endDate) || 
      (activeFilter === 'reading' && !book.endDate);
    
    // 2. 검색어 필터링 (제목 또는 리뷰)
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.review?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    return matchesFilter && matchesSearch;
  });

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredBooks.length && filteredBooks.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredBooks.map(b => b.id)));
    }
  };

  const handleDeleteSelected = () => {
    onDeleteMultiple(selectedIds);
    setSelectedIds(new Set());
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      <div className="px-8 py-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h2 className="text-2xl font-serif text-slate-800">My Library</h2>
          </div>
          
          <div className="flex bg-slate-50 p-1 rounded-xl">
            {(['all', 'finished', 'reading'] as ListFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => onFilterChange(f)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeFilter === f 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f === 'all' ? '전체' : f === 'finished' ? '완독' : '읽는 중'}
              </button>
            ))}
          </div>
        </div>

        {/* 검색창 추가 */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="제목이나 리뷰 내용으로 검색하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-slate-500"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest px-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleAll}
              className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
                selectedIds.size > 0 && selectedIds.size === filteredBooks.length
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              {selectedIds.size > 0 && (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span>책 상세 정보</span>
          </div>
          <span>기간 / 평점</span>
        </div>
      </div>

      <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto no-scrollbar">
        {filteredBooks.length === 0 ? (
          <div className="py-20 text-center text-slate-400 italic">
            {searchQuery ? '검색 결과가 없습니다.' : '기록이 없습니다.'}
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div 
              key={book.id}
              onClick={() => onBookClick(book)}
              className={`flex items-center justify-between px-8 py-4 hover:bg-slate-50 cursor-pointer transition-colors group ${
                selectedIds.has(book.id) ? 'bg-indigo-50/30' : ''
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <button 
                  onClick={(e) => toggleSelect(book.id, e)}
                  className={`w-5 h-5 rounded border-2 shrink-0 transition-colors flex items-center justify-center ${
                    selectedIds.has(book.id)
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-200 group-hover:border-indigo-300'
                  }`}
                >
                  {selectedIds.has(book.id) && (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                
                {book.imageUrl ? (
                  <img src={book.imageUrl} alt="" className="w-10 h-14 object-cover rounded shadow-sm shrink-0" />
                ) : (
                  <div className="w-10 h-14 bg-slate-100 rounded border border-slate-200 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                )}
                
                <div className="min-w-0">
                  <h4 className="font-semibold text-slate-800 truncate">{book.title}</h4>
                  <p className="text-[10px] text-slate-400">
                    {book.startDate} ~ {book.endDate || '현재'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 gap-1">
                <div className="flex items-center gap-1">
                  {book.rating ? (
                    [...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-3 h-3 ${i < book.rating! ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-300">평점 없음</span>
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  book.endDate ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {book.endDate ? '완독' : '읽는 중'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center h-16">
        <span className="text-xs font-medium text-slate-500">
          {selectedIds.size}개 항목 선택됨
        </span>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <button 
              className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100"
              onClick={handleDeleteSelected}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              선택 삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookList;
