
import React, { useState, useEffect } from 'react';
import { Book, ViewType, ListFilter } from './types';
import Calendar from './components/Calendar';
import BookModal from './components/BookModal';
import BookList from './components/BookList';
import DayDetailModal from './components/DayDetailModal';
import BookDetailModal from './components/BookDetailModal';
import { getDailyRecommendation } from './services/geminiService';

interface Recommendation {
  title: string;
  author: string;
  description: string;
  category: string;
}

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [view, setView] = useState<ViewType>('calendar');
  const [listFilter, setListFilter] = useState<ListFilter>('all');
  
  // Modals status
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDayDetailOpen, setIsDayDetailOpen] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loadingRec, setLoadingRec] = useState(false);

  // 로컬 스토리지에서 데이터 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('librolog_books');
    if (saved) {
      try {
        setBooks(JSON.parse(saved));
      } catch (e) {
        console.error("데이터를 불러오는데 실패했습니다.");
      }
    }
  }, []);

  // AI 추천 가져오기
  useEffect(() => {
    const fetchRecommendation = async () => {
      setLoadingRec(true);
      const currentBookTitles = books.filter(b => !b.endDate).map(b => b.title);
      const rec = await getDailyRecommendation(currentBookTitles);
      if (rec) setRecommendation(rec);
      setLoadingRec(false);
    };

    fetchRecommendation();
  }, [books.length === 0]); 

  // 로컬 스토리지에 데이터 저장
  useEffect(() => {
    localStorage.setItem('librolog_books', JSON.stringify(books));
  }, [books]);

  const handleAddClick = () => {
    setEditingBook(null);
    setSelectedDate(new Date());
    setIsModalOpen(true);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsDayDetailOpen(true);
  };

  // 책을 클릭했을 때 바로 상세 정보를 보여줌
  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsDetailOpen(true);
  };

  // 상세 보기에서 편집 버튼을 눌렀을 때
  const handleEditFromDetail = (book: Book) => {
    setIsDetailOpen(false);
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDayDetailAddNew = (date: Date) => {
    setIsDayDetailOpen(false);
    setEditingBook(null);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleSaveBook = (newBook: Book) => {
    if (editingBook) {
      setBooks(prev => prev.map(b => b.id === newBook.id ? newBook : b));
    } else {
      setBooks(prev => [...prev, newBook]);
    }
    // 저장이 완료되면 선택된 책 정보도 업데이트 (상세 보기 반영 위함)
    if (selectedBook?.id === newBook.id) {
      setSelectedBook(newBook);
    }
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm('이 책의 기록을 정말 삭제하시겠습니까?')) {
      setBooks(prev => prev.filter(b => b.id !== id));
      setIsModalOpen(false);
      setIsDayDetailOpen(false);
      setIsDetailOpen(false);
    }
  };

  const handleDeleteMultiple = (ids: Set<string>) => {
    if (window.confirm(`${ids.size}개의 기록을 정말 삭제하시겠습니까?`)) {
      setBooks(prev => prev.filter(b => !ids.has(b.id)));
    }
  };

  const showListView = (filter: ListFilter) => {
    setListFilter(filter);
    setView('list');
  };

  const stats = {
    total: books.length,
    completed: books.filter(b => b.endDate).length,
    inProgress: books.filter(b => !b.endDate).length,
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('calendar')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">LibroLog</h1>
          </div>
          
          <div className="flex gap-4 sm:gap-6 items-center">
            <button 
              onClick={() => showListView('all')}
              className={`flex flex-col items-center px-3 py-1 rounded-xl transition-all ${view === 'list' && listFilter === 'all' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-500'}`}
            >
              <span className="text-slate-900 font-bold leading-none">{stats.total}</span>
              <span className="text-[10px] uppercase font-semibold mt-1">전체</span>
            </button>
            <button 
              onClick={() => showListView('finished')}
              className={`flex flex-col items-center px-3 py-1 rounded-xl transition-all ${view === 'list' && listFilter === 'finished' ? 'bg-green-50 text-green-600' : 'hover:bg-slate-50 text-slate-500'}`}
            >
              <span className="text-green-600 font-bold leading-none">{stats.completed}</span>
              <span className="text-[10px] uppercase font-semibold mt-1">완독</span>
            </button>
            <button 
              onClick={() => showListView('reading')}
              className={`flex flex-col items-center px-3 py-1 rounded-xl transition-all ${view === 'list' && listFilter === 'reading' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-500'}`}
            >
              <span className="text-indigo-600 font-bold leading-none">{stats.inProgress}</span>
              <span className="text-[10px] uppercase font-semibold mt-1">읽는 중</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-grow">
            {view === 'calendar' ? (
              <Calendar 
                books={books} 
                onSelectDate={handleDateSelect} 
                onBookClick={handleBookClick} 
              />
            ) : (
              <BookList 
                books={books}
                activeFilter={listFilter}
                onFilterChange={setListFilter}
                onBookClick={handleBookClick}
                onDeleteMultiple={handleDeleteMultiple}
                onBack={() => setView('calendar')}
              />
            )}
          </div>

          <div className="w-full md:w-80 shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                현재 읽고 있는 책
              </h3>
              <div className="space-y-4">
                {books.filter(b => !b.endDate).length === 0 ? (
                  <p className="text-sm text-slate-400 italic">현재 읽고 있는 책이 없습니다.</p>
                ) : (
                  books.filter(b => !b.endDate).slice(0, 3).map(book => (
                    <div key={book.id} className="group cursor-pointer p-2 -mx-2 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => handleBookClick(book)}>
                      <div className="flex gap-3">
                        {book.imageUrl ? (
                          <img src={book.imageUrl} alt={book.title} className="w-12 h-16 object-cover rounded-md shadow-sm group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-12 h-16 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                            <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                          </div>
                        )}
                        <div className="flex flex-col justify-center overflow-hidden">
                          <span className="text-sm font-semibold text-slate-800 line-clamp-1">{book.title}</span>
                          <span className="text-[10px] text-slate-400">시작일: {book.startDate}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg text-white">
              <h3 className="font-bold mb-2">오늘의 문장</h3>
              <p className="text-sm opacity-90 leading-relaxed italic">
                "독서하는 사람은 죽기 전에 천 번의 삶을 살지만, 책을 읽지 않는 사람은 오직 한 번의 삶만 살 뿐이다."
              </p>
              <p className="text-xs mt-4 opacity-75">— 조지 R.R. 마틴</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-colors"></div>
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                오늘의 AI 책 추천
              </h3>
              
              {loadingRec ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  <div className="space-y-1 pt-2">
                    <div className="h-2 bg-slate-50 rounded"></div>
                    <div className="h-2 bg-slate-50 rounded w-5/6"></div>
                  </div>
                </div>
              ) : recommendation ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-900 leading-tight">{recommendation.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{recommendation.author} 저</p>
                  </div>
                  <div className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold uppercase">
                    {recommendation.category}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 italic">
                    "{recommendation.description}"
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400">추천 정보를 불러올 수 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <button 
        onClick={handleAddClick}
        className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <svg className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
      </button>

      <DayDetailModal
        isOpen={isDayDetailOpen}
        date={selectedDate}
        books={books}
        onClose={() => setIsDayDetailOpen(false)}
        onBookClick={handleBookClick}
        onAddNew={handleDayDetailAddNew}
      />

      <BookDetailModal
        isOpen={isDetailOpen}
        book={selectedBook}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteBook}
      />

      {/* FIX: Removed non-existent onDelete prop to resolve TypeScript error */}
      <BookModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBook}
        initialDate={selectedDate || undefined}
        initialBook={editingBook}
      />
    </div>
  );
};

export default App;
