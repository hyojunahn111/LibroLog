
import React, { useState, useEffect, useRef } from 'react';
import { Book } from '../types';
import { getBookDetails } from '../services/geminiService';
import { format } from 'date-fns';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Book) => void;
  initialDate?: Date;
  initialBook?: Book | null;
}

const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose, onSave, initialDate, initialBook }) => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [logDate, setLogDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState('');
  const [review, setReview] = useState('');
  const [quotes, setQuotes] = useState<string[]>(['']);
  const [loadingAI, setLoadingAI] = useState(false);
  
  const logDateRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialBook) {
      setTitle(initialBook.title);
      setImageUrl(initialBook.imageUrl || '');
      setRating(initialBook.rating);
      setLogDate(initialBook.logDate);
      setStartDate(initialBook.startDate);
      setEndDate(initialBook.endDate || '');
      setReview(initialBook.review || '');
      setQuotes(initialBook.quotes?.length ? initialBook.quotes : ['']);
    } else if (initialDate) {
      const d = format(initialDate, 'yyyy-MM-dd');
      setLogDate(d);
      setStartDate(d);
      setTitle('');
      setImageUrl('');
      setRating(null);
      setEndDate('');
      setReview('');
      setQuotes(['']);
    }
  }, [initialBook, initialDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialBook?.id || Math.random().toString(36).substr(2, 9),
      title, 
      imageUrl, 
      rating: endDate ? rating : null, 
      logDate, 
      startDate,
      endDate: endDate || null,
      review, 
      quotes: quotes.filter(q => q.trim())
    });
    onClose();
  };

  const handleAddQuote = () => {
    setQuotes([...quotes, '']);
  };

  const handleRemoveQuote = (index: number) => {
    if (quotes.length > 1) {
      setQuotes(quotes.filter((_, i) => i !== index));
    } else {
      setQuotes(['']);
    }
  };

  const handleQuoteChange = (index: number, value: string) => {
    const newQuotes = [...quotes];
    newQuotes[index] = value;
    setQuotes(newQuotes);
  };

  if (!isOpen) return null;

  const inputBaseClass = "w-full px-4 py-2.5 border border-slate-200 bg-white text-black rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400";
  const dateInputClass = `${inputBaseClass} cursor-pointer [&-::-webkit-calendar-picker-indicator]:opacity-0 [&-::-webkit-calendar-picker-indicator]:absolute [&-::-webkit-calendar-picker-indicator]:inset-0 [&-::-webkit-calendar-picker-indicator]:w-full [&-::-webkit-calendar-picker-indicator]:h-full [&-::-webkit-calendar-picker-indicator]:cursor-pointer`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold text-slate-800">{initialBook ? '기록 수정' : '책 기록하기'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto no-scrollbar flex-1">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">책 제목</label>
            <div className="flex gap-2">
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className={inputBaseClass} placeholder="제목을 입력하세요"/>
              <button type="button" onClick={async () => {
                  setLoadingAI(true);
                  const d = await getBookDetails(title);
                  if(d?.imageUrl) setImageUrl(d.imageUrl);
                  setLoadingAI(false);
                }} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors shrink-0">
                {loadingAI ? '...' : 'AI 정보'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">이미지 URL</label>
            <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className={inputBaseClass} placeholder="표지 이미지 주소"/>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">기록 날짜 (달력 표시일)</label>
            <div className="relative group">
              <input ref={logDateRef} type="date" value={logDate} onChange={e => setLogDate(e.target.value)} className={dateInputClass} onClick={() => logDateRef.current?.showPicker()}/>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">시작일</label>
              <div className="relative group">
                <input ref={startDateRef} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={dateInputClass} onClick={() => startDateRef.current?.showPicker()}/>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">종료일</label>
              <div className="relative group">
                <input ref={endDateRef} type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={dateInputClass} onClick={() => endDateRef.current?.showPicker()}/>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {endDate && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-sm font-semibold text-slate-700">평점 (별점)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} className="p-1 transition-transform active:scale-125 focus:outline-none">
                    <svg className={`w-8 h-8 ${rating && star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">리뷰 / 메모</label>
            <textarea value={review} onChange={e => setReview(e.target.value)} className={`${inputBaseClass} min-h-[120px] resize-none`} placeholder="책에 대한 소감을 남겨보세요"/>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">인상 깊었던 구절</label>
              <button type="button" onClick={handleAddQuote} className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                구절 추가
              </button>
            </div>
            <div className="space-y-3">
              {quotes.map((quote, index) => (
                <div key={index} className="flex gap-2 group animate-in slide-in-from-left-2 duration-200">
                  <textarea value={quote} onChange={e => handleQuoteChange(index, e.target.value)} className={`${inputBaseClass} min-h-[60px] text-sm resize-none`} placeholder={`구절 ${index + 1}을 입력하세요...`}/>
                  {quotes.length > 1 && (
                    <button type="button" onClick={() => handleRemoveQuote(index)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all h-fit">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 flex gap-4 shrink-0 mt-auto">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors">취소</button>
            <button type="submit" className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95">
              {initialBook ? '수정 완료' : '기록 저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
