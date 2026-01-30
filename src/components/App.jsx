import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Library, Info, X, ExternalLink, ArrowLeft, ChevronDown, ChevronUp, ArrowUp, Trophy, Crown, Disc } from 'lucide-react';

// --- Logo Component (Option 1: Standard Minimal) ---
const Logo = ({ className = "h-6 w-auto fill-current" }) => (
  <svg viewBox="0 0 200 40" className={className}>
    <text x="0" y="30" fontSize="28" fontWeight="bold" fontFamily="sans-serif" letterSpacing="-1">pseudology</text>
  </svg>
);

// --- 1. Header Component ---
const Header = ({ setView, activeView, onSearch, searchQuery, isVisible, searchMode, setSearchMode, onResetHistory, onLogoClick }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 修正: メニューの並び順を変更 (BestをAboutの前に移動)
  const navItems = [
    { id: 'search-trigger', label: '検索', icon: Search },
    { id: 'library', label: 'アーティスト一覧', icon: Library },
    { id: 'best', label: '年間BEST', icon: Crown },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (item) => {
    if (item.id === 'search-trigger') {
      setIsSearchOpen(true);
    } else {
      onResetHistory();
      setView(item.id);
      setIsSearchOpen(false);
    }
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      onResetHistory();
      setView('home');
    }
    setIsSearchOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity group text-white"
          >
            {/* Logo Option 1 を適用 (サイズを h-6 から h-8 に拡大) */}
            <Logo className="h-8 w-auto fill-current" />
          </div>

          <nav className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold transition-all
                  ${activeView === item.id || (item.id === 'search-trigger' && isSearchOpen) ? 'bg-[#282828] text-white' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'}
                `}
              >
                <item.icon size={18} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className={`
          absolute top-16 left-0 right-0 bg-[#121212] border-b border-white/10 p-4 transition-all duration-300 overflow-hidden
          ${isSearchOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="max-w-2xl mx-auto relative flex items-center gap-2">
             <div className="relative flex-1 flex items-center bg-[#242424] rounded-full border border-gray-800 focus-within:ring-2 focus-within:ring-green-500/50 focus-within:border-transparent transition-all overflow-hidden">
                <div className="pl-4 pr-2 text-gray-500">
                   <Search size={20} />
                </div>
                
                <select 
                  value={searchMode}
                  onChange={(e) => setSearchMode(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer py-3 pr-2"
                >
                  <option value="all" className="bg-[#242424] text-white">全文</option>
                  <option value="artist" className="bg-[#242424] text-white">アーティスト</option>
                  <option value="title" className="bg-[#242424] text-white">作品名</option>
                </select>

                <div className="h-5 w-px bg-gray-700 mx-1"></div>

                <input 
                  type="text"
                  placeholder="キーワードを入力..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none py-3 px-2 w-full"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  autoFocus={isSearchOpen}
                />
             </div>

             <button 
               onClick={() => setIsSearchOpen(false)}
               className="p-2 rounded-full hover:bg-[#282828] text-gray-400 hover:text-white transition-colors flex-shrink-0"
             >
               <X size={24} />
             </button>
          </div>
        </div>
      </header>
    </>
  );
};

// --- 2. ReviewCard Component ---
const ReviewCard = ({ review, onClick, variant = "standard", rank = null }) => {
  const commonContainerStyle = `
    cursor-pointer group bg-[#1a1a1a] hover:bg-[#222] transition-all duration-300 
    border-l-4 border-transparent hover:border-green-500 rounded-r-lg relative overflow-hidden
  `;

  const dateDisplay = review.date ? review.date : "No Date";

  // ランキング表示用のバッジ
  // 修正: サイズを小さく、目立たないように調整
  const RankBadge = () => {
    if (!rank) return null;
    const isTop3 = rank <= 3;
    const badgeColors = {
        1: "text-yellow-400",
        2: "text-gray-300",
        3: "text-amber-600",
        default: "text-gray-600" // 目立たない色に変更
    };
    const colorClass = isTop3 ? badgeColors[rank] : badgeColors.default;

    return (
        <div className="absolute top-3 right-3 flex items-center justify-center pointer-events-none z-10 opacity-50 group-hover:opacity-100 transition-opacity">
            {rank === 1 && <Crown size={14} className="text-yellow-500 mr-1" fill="currentColor" />}
            <span className={`text-xl font-black italic tracking-tighter ${colorClass}`}>
                {rank}
            </span>
        </div>
    );
  };

  if (variant === "featured") return null;

  // Best View (ランキング) 用のカードスタイル
  if (variant === "best") {
      const hasImage = !!review.image;
      
      // 該当レビューがない場合のフォールバック表示
      if (review.isFallback) {
        return (
            <div className={`${commonContainerStyle} flex flex-col h-full opacity-60`}>
                <RankBadge />
                {/* 修正: justify-center を justify-start に変更して上揃えにする */}
                <div className="p-5 flex-grow flex flex-col justify-start">
                    <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">{review.artist}</p>
                    <h3 className="text-lg font-bold text-white mb-2">{review.title}</h3>
                    <p className="text-xs text-red-400 font-mono">※レビュー記事はまだありません</p>
                </div>
            </div>
        );
      }

      // 修正: 通常のレビューカード(standard)と同じデザイン・サイズ感にする
      // 画像がない場合は画像枠を削除する
      return (
        <div 
          onClick={() => onClick(review)}
          className={`${commonContainerStyle} flex flex-col h-full`}
        >
          <RankBadge />
          {hasImage ? (
            <>
              <div className="flex items-start p-4 pb-2 gap-4">
                <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden shadow-lg group-hover:scale-105 transition-transform bg-black">
                  <img src={review.image} alt={review.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex flex-col justify-center h-12">
                  <p className="text-xs text-gray-500 truncate font-bold uppercase tracking-wider mb-0.5">{review.artist}</p>
                  <h3 className="text-lg text-white font-bold truncate leading-tight group-hover:text-green-400 transition-colors">{review.title}</h3>
                </div>
              </div>
              <div className="p-4 pt-2 flex-grow">
                <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap line-clamp-4 opacity-90 group-hover:opacity-100">
                  {review.body}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-5 pb-2 flex-grow">
                <div className="mb-3">
                  <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider truncate">{review.artist}</p>
                  <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors leading-snug line-clamp-1">
                    {review.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity line-clamp-4">
                  {review.body}
                </p>
              </div>
            </>
          )}

          <div className={`flex justify-between items-center mt-auto ${hasImage ? 'px-4 pb-3' : 'px-5 pb-3'}`}>
            <span className="text-[10px] text-gray-600 ml-auto">{dateDisplay}</span>
          </div>
        </div>
      );
  }

  // --- 既存の表示ロジック ---
  if (variant === "text-only" || variant === "standard") {
    const hasImage = !!review.image;
    return (
      <div 
        onClick={() => onClick(review)}
        className={`${commonContainerStyle} flex flex-col h-full`}
      >
        {hasImage ? (
          <>
            <div className="flex items-start p-4 pb-2 gap-4">
              <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden shadow-lg group-hover:scale-105 transition-transform bg-black">
                <img src={review.image} alt={review.title} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex flex-col justify-center h-12">
                <p className="text-xs text-gray-500 truncate font-bold uppercase tracking-wider mb-0.5">{review.artist}</p>
                <h3 className="text-lg text-white font-bold truncate leading-tight group-hover:text-green-400 transition-colors">{review.title}</h3>
              </div>
            </div>
            <div className="p-4 pt-2 flex-grow">
              <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap line-clamp-4 opacity-90 group-hover:opacity-100">
                {review.body}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="p-5 pb-2 flex-grow">
              <div className="mb-3">
                <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider truncate">{review.artist}</p>
                <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors leading-snug line-clamp-1">
                  {review.title}
                </h3>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity line-clamp-4">
                {review.body}
              </p>
            </div>
          </>
        )}

        <div className={`flex justify-between items-center mt-auto ${hasImage ? 'px-4 pb-3' : 'px-5 pb-3'}`}>
          <span className="text-[10px] text-gray-600 ml-auto">{dateDisplay}</span>
        </div>
      </div>
    );
  }
  return null;
};

// --- 3. HomeView Component ---
const HomeView = ({ reviews, onSelectReview, pickupCandidates, pickupCount, onMorePickup, initialScrollY, totalReviews, lastUpdate }) => {
  const recentReviews = useMemo(() => reviews.slice(0, 6), [reviews]);
  const visiblePickups = useMemo(() => pickupCandidates.slice(0, pickupCount), [pickupCandidates, pickupCount]);
  
  useEffect(() => {
    if (initialScrollY > 0) {
      window.scrollTo({ top: initialScrollY, behavior: 'instant' });
    }
  }, [initialScrollY]);

  const observerTarget = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
            if (visiblePickups.length < pickupCandidates.length) {
                onMorePickup();
            }
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [visiblePickups, pickupCandidates, onMorePickup]);

  return (
    <div className="space-y-12 pb-24">
      <div className="mt-6 flex items-center justify-between border-b border-gray-800 pb-2 mb-8">
         <span className="text-xs font-mono tracking-widest text-green-500 font-bold">
            {totalReviews.toLocaleString()} REVIEWS
         </span>
         <span className="text-[10px] font-mono tracking-widest text-gray-500">
            UPDATE : {lastUpdate}
         </span>
      </div>

      <section> 
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {recentReviews.map(review => (
            <ReviewCard key={review.id} review={review} onClick={onSelectReview} variant="standard" />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a 
            href="https://x.com/yas_no" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-3 bg-[#1a1a1a] hover:bg-[#282828] text-white text-xs font-bold tracking-widest rounded-full border border-gray-700 hover:border-green-500 transition-all shadow-lg hover:shadow-green-500/20 flex items-center gap-2 group"
          >
            READ MORE 
            <ExternalLink size={14} className="text-gray-400 group-hover:text-green-500 transition-colors" />
          </a>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-2">
          <h2 className="text-xl font-bold text-white tracking-wider">PICK UP</h2>
          <span className="text-xs text-gray-500">ARCHIVES</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visiblePickups.map(review => (
            <ReviewCard key={review.id} review={review} onClick={onSelectReview} variant="text-only" />
          ))}
        </div>

        {visiblePickups.length < pickupCandidates.length && (
          <div ref={observerTarget} className="h-10 w-full flex justify-center items-center mt-8">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </section>
    </div>
  );
};

// --- 4. DetailView Component ---
const DetailView = ({ review, onBack, reviews, onSelectReview }) => {
  if (!review) return null;
  const dateDisplay = review.date ? review.date : "No Date";
  
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    setVisibleCount(6);
  }, [review]);

  const relatedReviews = useMemo(() => {
    if (!review || !reviews) return [];
    
    const artistName = review.artist.toLowerCase();
    
    // 1. アーティスト名一致 (自分自身は除く)
    const byArtist = reviews.filter(r => 
      r.id !== review.id && r.artist.toLowerCase() === artistName
    );
  
    // 2. 全文検索
    const byContent = reviews.filter(r => 
      r.id !== review.id && 
      !byArtist.some(a => a.id === r.id) && 
      (r.title.toLowerCase().includes(artistName) || r.body.toLowerCase().includes(artistName))
    );
  
    return [...byArtist, ...byContent];
  }, [review, reviews]);

  const visibleRelatedReviews = useMemo(() => {
    return relatedReviews.slice(0, visibleCount);
  }, [relatedReviews, visibleCount]);

  const observerTarget = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
            if (visibleCount < relatedReviews.length) {
                setVisibleCount(prev => prev + 6);
            }
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [visibleCount, relatedReviews.length]);

  return (
    <div className="animate-fade-in pb-20">
      <div 
        className={`
          relative flex flex-col items-start gap-6 p-8 rounded-2xl bg-gradient-to-b from-gray-800 via-[#181818] to-[#121212] mb-8
          ${review.image ? 'md:flex-row' : 'pt-10'} 
        `}
        style={{ '--tw-gradient-from': review.color }}
      >
        {review.image && (
          <div className="w-52 h-52 shadow-2xl shadow-black/50 rounded-md overflow-hidden flex-shrink-0 bg-black">
             <img src={review.image} alt={review.title} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="flex flex-col gap-2 w-full pt-1">
          <div className="text-green-400 font-bold uppercase tracking-wider text-lg md:text-xl leading-tight">
            {review.artist}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight">
            {review.title}
          </h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap mb-6">
          {review.body}
        </div>
        
        <div className="flex justify-between items-center border-t border-gray-800 pt-4 mb-16">
          <button 
            onClick={onBack} 
            className="text-sm font-bold text-gray-400 hover:text-white border border-gray-600 px-6 py-2 rounded-full hover:border-white transition-all uppercase tracking-widest flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            BACK
          </button>

          <span className="text-sm text-gray-500">
             {dateDisplay}
          </span>
        </div>

        {visibleRelatedReviews.length > 0 && (
            <div className="mb-20">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-2">Related Reviews</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {visibleRelatedReviews.map(r => (
                        <ReviewCard key={r.id} review={r} onClick={onSelectReview} variant="text-only" /> 
                    ))}
                </div>

                {visibleCount < relatedReviews.length && (
                  <div ref={observerTarget} className="h-10 w-full flex justify-center items-center mt-8">
                    <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

// --- 5. AboutView Component ---
const AboutView = ({ siteDescription, profileDescription }) => {
  return (
    <div className="animate-fade-in pb-20 pt-8 px-4 max-w-2xl mx-auto">
      <div className="mb-12 text-center">
        {/* Logo Option 1 を適用 (修正: Aboutテキストを追加し、サイズ調整) */}
        <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-2xl font-normal text-white opacity-70">About</span>
            <Logo className="h-8 w-auto fill-current text-white" />
        </div>
        
        <div className="border border-gray-800 bg-[#181818] p-4 rounded text-[10px] text-gray-500 font-serif text-left inline-block max-w-full">
           <p className="mb-2 border-b border-gray-800 pb-2">
             <span className="font-bold text-gray-400">pseudology n.</span> The study of lying; the art or science of lying. <span className="opacity-50">/ From: A Dictionary of Psychology | Date: 2001 | Author: ANDREW M. COLMAN</span>
           </p>
           <p>
             <span className="font-bold text-gray-400">pseudology n.</span> Falsehood of speech. <span className="opacity-50">/ Source: Webster's Revised Unabridged Dictionary (1913)</span>
           </p>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">このサイトについて</h2>
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {siteDescription}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">プロフィール</h2>
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">yas-no</h3>
              <div className="text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                {profileDescription}
              </div>
              <a 
                href="https://x.com/yas_no" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors font-bold text-sm uppercase tracking-wider"
              >
                Follow on X <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// --- 6. ArtistListView Component ---
const ArtistListView = ({ reviews, onSelectReview, isHeaderVisible, expandedArtist, onToggleArtist, initialScrollY }) => {
  useEffect(() => {
    if (initialScrollY > 0) {
      window.scrollTo({
        top: initialScrollY,
        behavior: 'instant' 
      });
    }
  }, [initialScrollY]);

  const getSortName = (name) => {
    return name.replace(/^(a|the)\s+/i, '').trim();
  };

  const grouped = useMemo(() => {
    const groups = {}; 
    
    reviews.forEach(r => { 
      const sortName = getSortName(r.artist);
      let initial = sortName.charAt(0).toUpperCase();
      if (!/[A-Z]/.test(initial)) {
        initial = '#';
      }
      
      if (!groups[initial]) groups[initial] = {};
      if (!groups[initial][r.artist]) groups[initial][r.artist] = [];
      groups[initial][r.artist].push(r);
    });

    const sortedInitials = Object.keys(groups).sort((a, b) => {
      if (a === '#') return 1;
      if (b === '#') return -1;
      return a.localeCompare(b);
    });

    return sortedInitials.map(initial => {
      const artistsObj = groups[initial];
      const sortedArtists = Object.keys(artistsObj).sort((a, b) => 
        getSortName(a).localeCompare(getSortName(b))
      );
      
      return {
        initial,
        artists: sortedArtists.map(artistName => ({
          name: artistName,
          reviews: artistsObj[artistName].sort((a, b) => a.title.localeCompare(b.title))
        }))
      };
    });
  }, [reviews]);

  const scrollToSection = (initial) => {
    const element = document.getElementById(`section-${initial}`);
    if (element) {
      const offset = 120; 
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="pb-24">
      <div className={`sticky ${isHeaderVisible ? 'top-16' : 'top-0'} transition-[top] duration-300 bg-[#121212]/95 backdrop-blur z-20 py-3 border-b border-gray-800 overflow-x-auto scrollbar-hide`}>
        <div className="flex px-2 space-x-1 min-w-max">
          {grouped.map((group) => (
            <button
              key={group.initial}
              onClick={() => scrollToSection(group.initial)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold text-gray-400 hover:text-green-500 hover:bg-[#333] transition-colors"
            >
              {group.initial}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-12">
        {grouped.map((group) => (
          <div key={group.initial} id={`section-${group.initial}`} className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-4 px-2">
               <div className="w-12 h-12 rounded-full bg-[#222] border border-gray-700 flex items-center justify-center text-xl font-bold text-green-500">
                  {group.initial}
               </div>
               <div className="h-px flex-grow bg-gray-800"></div>
            </div>
            
            <div className="flex flex-col gap-2">
              {group.artists.map((artist) => (
                <div key={artist.name} className="group bg-[#181818] rounded-lg overflow-hidden border-l-4 border-transparent hover:border-l-green-500 transition-all">
                  <button 
                    onClick={() => onToggleArtist(artist.name)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#282828] transition-colors text-left"
                  >
                    <span className="text-white font-bold text-lg md:text-xl tracking-tight group-hover:text-green-500 transition-colors">{artist.name}</span>
                    <div className="text-gray-500">
                      {expandedArtist === artist.name ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                  </button>
                  
                  {expandedArtist === artist.name && (
                    <div className="bg-[#222] border-t border-gray-800 p-2 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                        {artist.reviews.map((review) => (
                          <div 
                            key={review.id}
                            onClick={() => onSelectReview(review)}
                            className="px-3 py-2 rounded-md hover:bg-[#333] cursor-pointer transition-colors group/item border border-transparent hover:border-gray-600 flex items-center"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover/item:bg-green-500 mr-3 transition-colors flex-shrink-0"></div>
                            <span className="text-sm font-medium text-gray-300 group-hover/item:text-green-400 transition-colors line-clamp-1">
                              {review.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 7. SearchView Component ---
const SearchView = ({ reviews, onSelectReview, query = "", searchMode = "all" }) => {
  const filtered = useMemo(() => {
    if (!query) return [];
    const lower = query.toLowerCase();
    
    return reviews.filter(r => {
      if (searchMode === 'artist') {
        return r.artist.toLowerCase().includes(lower);
      } else if (searchMode === 'title') {
        return r.title.toLowerCase().includes(lower);
      } else {
        return r.artist.toLowerCase().includes(lower) || 
               r.title.toLowerCase().includes(lower) || 
               r.body.toLowerCase().includes(lower);
      }
    });
  }, [query, reviews, searchMode]);

  return (
    <div className="min-h-screen">
      <div className="pt-8">
        {query ? (
          <div className="mb-8 text-gray-400 text-sm">
            <span className="mr-2 text-green-500 font-bold">[{searchMode === 'all' ? '全文' : searchMode === 'artist' ? 'アーティスト' : '作品名'}]</span>
            "{query}" の検索結果: {filtered.length} 件
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">
             <Search size={48} className="mx-auto mb-4 opacity-50"/>
             <p>上の検索ボタンからキーワードを入力してください</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(review => (
              <div key={review.id} onClick={() => onSelectReview(review)} className="group cursor-pointer bg-[#181818] hover:bg-[#282828] p-4 rounded-md flex flex-col h-full border-l-4 border-transparent hover:border-green-500 transition-all">
                  <div className="flex-grow">
                    <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider truncate">{review.artist}</p>
                    <h4 className="text-white font-bold text-sm line-clamp-2 group-hover:text-green-400 transition-colors">{review.title}</h4>
                  </div>
              </div>
            ))}
            {query && filtered.length === 0 && <div className="col-span-full text-center py-20 text-gray-500">見つかりませんでした。</div>}
        </div>
      </div>
    </div>
  );
};

// --- 【新規追加】 8. BestView Component ---
// 修正: isHeaderVisible プロップを受け取る
const BestView = ({ bestData, reviews, onSelectReview, isHeaderVisible }) => {
  // 存在する年度のリストを作成し、降順（新しい順）にソート
  const availableYears = useMemo(() => {
    if (!bestData || bestData.length === 0) return [];
    const years = [...new Set(bestData.map(d => d.year))];
    // 最新の年度を左にするため、降順ソート
    return years.sort((a, b) => parseInt(b) - parseInt(a));
  }, [bestData]);

  // デフォルトで最新の年度を選択
  const [selectedYear, setSelectedYear] = useState(availableYears[0]);

  useEffect(() => {
    if (availableYears.length > 0 && !selectedYear) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // 選択された年度のデータを抽出
  const currentYearData = useMemo(() => {
    if (!selectedYear) return { comment: "", items: [] };
    
    // rank=0 は総評コメント
    const commentData = bestData.find(d => d.year == selectedYear && d.rank === 0);
    // rank=1〜10 はランキング
    const rankingData = bestData.filter(d => d.year == selectedYear && d.rank > 0).sort((a, b) => a.rank - b.rank);

    return {
      comment: commentData ? commentData.comment : "",
      items: rankingData
    };
  }, [bestData, selectedYear]);

  // ランキングアイテムと実際のレビューデータを結合する
  const matchedRanking = useMemo(() => {
    return currentYearData.items.map(item => {
      // マッチングロジック
      // 1. アーティスト名と作品名で検索（大文字小文字無視）
      const candidates = reviews.filter(r => 
        r.artist.toLowerCase() === item.artist.toLowerCase() &&
        r.title.toLowerCase() === item.title.toLowerCase()
      );

      // 2. 候補の中からベストな1つを選ぶ
      let matchedReview = null;
      if (candidates.length > 0) {
        // ソート順: 日付あり > 日付が新しい > 本文が長い
        candidates.sort((a, b) => {
          // 日付の有無
          if (a.date && !b.date) return -1;
          if (!a.date && b.date) return 1;
          // 日付の比較（新しい順）
          if (a.date && b.date) {
             const dateA = new Date(a.date);
             const dateB = new Date(b.date);
             if (dateA > dateB) return -1;
             if (dateA < dateB) return 1;
          }
          // 本文の長さ（長い順）
          return b.body.length - a.body.length;
        });
        matchedReview = candidates[0];
      }

      // レビューが見つかった場合はそのデータを、見つからない場合はフォールバックデータを作成
      if (matchedReview) {
        return { ...matchedReview, rank: item.rank, isFallback: false };
      } else {
        return {
          id: `best-${selectedYear}-${item.rank}`, // ダミーID
          artist: item.artist,
          title: item.title,
          body: "レビュー記事はまだありません",
          image: null, // 画像なし
          date: null,
          color: "#333", // ダミーカラー
          rank: item.rank,
          isFallback: true
        };
      }
    });
  }, [currentYearData, reviews, selectedYear]);

  if (availableYears.length === 0) {
      return (
          <div className="py-20 text-center text-gray-500 animate-fade-in">
              {/* 修正: アイコンをCrownに変更 */}
              <Crown size={48} className="mx-auto mb-4 opacity-50"/>
              <p>ランキングデータがまだありません。</p>
          </div>
      );
  }

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex flex-col items-center mt-10 mb-6"> {/* マージン調整 */}
        {/* 修正: アイコンをCrownに変更し、見出しを「年間BEST」に変更。上にスペースを空ける。 */}
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Crown className="text-yellow-500" size={32} />
          <span className="text-2xl">年間BEST</span>
        </h1>
      </div>

      {/* 修正: 年選択メニューを横スクロールスライダーに変更 */}
      <div className={`sticky ${isHeaderVisible ? 'top-16' : 'top-0'} transition-[top] duration-300 z-20 bg-[#121212]/95 backdrop-blur border-b border-gray-800 py-3 mb-8 overflow-x-auto scrollbar-hide w-full`}>
        <div className="flex px-4 space-x-2 min-w-max sm:justify-center">
            {availableYears.map(year => (
                <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`
                        px-4 py-1.5 rounded-full text-sm font-bold transition-all border whitespace-nowrap
                        ${selectedYear === year 
                            ? 'bg-white text-black border-white' 
                            : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'}
                    `}
                >
                    {year}
                </button>
            ))}
        </div>
      </div>

      {/* ランキングリスト: グリッドレイアウトに変更 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-12">
          {matchedRanking.map(item => (
              <ReviewCard 
                key={`${selectedYear}-${item.rank}`} 
                review={item} 
                onClick={item.isFallback ? () => {} : onSelectReview} 
                variant="best"
                rank={item.rank}
              />
          ))}
      </div>

      {/* 総評コメント: 幅を合わせ、左揃えに変更 */}
      {currentYearData.comment && (
          <div className="w-full p-6 bg-[#181818] rounded-xl border border-gray-800 text-left">
              <h2 className="text-sm font-bold text-green-500 mb-3 tracking-widest uppercase">OVERVIEW of {selectedYear}</h2>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {currentYearData.comment}
              </p>
          </div>
      )}
    </div>
  );
};

// --- 9. Main App Component ---
export default function App({ initialReviews, aboutData, annualRanks }) {
  const [view, setView] = useState("home");
  const [selectedReview, setSelectedReview] = useState(null);
  
  // 履歴スタック: 画面遷移の履歴を保持する
  const [historyStack, setHistoryStack] = useState([]);

  const [reviews, setReviews] = useState(
    (initialReviews || []).map(review => ({
      ...review,
      artist: review.artist ? review.artist.toUpperCase() : "" 
    }))
  );
  
  // 年間ベストデータのState
  const [bestData, setBestData] = useState(annualRanks || []);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState("all");

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const [expandedArtistName, setExpandedArtistName] = useState(null);
  const [libraryScrollPos, setLibraryScrollPos] = useState(0);
  const [homeScrollPos, setHomeScrollPos] = useState(0);
  const [pickupCount, setPickupCount] = useState(6);
  
  const pickupCandidates = useMemo(() => {
    const candidates = reviews.slice(6);
    return [...candidates].sort(() => 0.5 - Math.random());
  }, [reviews]);
  
  const [showScrollTop, setShowScrollTop] = useState(false);

  const lastUpdate = useMemo(() => {
    if (reviews.length > 0 && reviews[0].date) {
      return reviews[0].date;
    }
    return "No Data";
  }, [reviews]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) < 10) return;
      
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      
      if (currentScrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * ロゴクリック時の処理（強制的にトップへ戻る）
   */
  const handleHeaderLogoClick = () => {
    setHistoryStack([]);
    setSelectedReview(null);
    setHomeScrollPos(0); // スクロール位置をリセット
    setView("home");
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  /**
   * レビュー選択時の処理（履歴スタックへの追加）
   */
  const handleSelectReview = (review) => { 
    // 現在の画面の状態を履歴スタックに保存
    const currentHistoryState = {
      view,
      selectedReview,
      // 各画面のスクロール位置なども必要であればここで保存
    };

    // ホームやライブラリの場合はスクロール位置を別途保存（元のロジック維持）
    if (view === "library") {
      setLibraryScrollPos(window.scrollY);
    } else if (view === "home") {
      setHomeScrollPos(window.scrollY);
    }

    setHistoryStack(prev => [...prev, currentHistoryState]);

    setSelectedReview(review); 
    setView("detail"); 
    window.scrollTo(0, 0); 
  };
  
  /**
   * BACKボタン押下時の処理（履歴スタックからの復元）
   */
  const handleBack = () => { 
    if (historyStack.length === 0) {
      // 履歴がない場合は安全策としてホームに戻る
      setView("home");
      setSelectedReview(null);
      return;
    }

    // 最新の履歴を取り出す
    const prevNav = historyStack[historyStack.length - 1];
    const newStack = historyStack.slice(0, -1);
    
    setHistoryStack(newStack);
    setView(prevNav.view);
    setSelectedReview(prevNav.selectedReview);
    
    // スクロール位置の復元などの処理が必要ならここに追加
  };

  /**
   * メニュークリック時などの履歴リセット用
   */
  const handleResetHistory = () => {
    setHistoryStack([]);
    setSelectedReview(null);
  };
  
  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q) {
      if (view !== "search") {
         // 検索画面に行くときも、現在の画面を履歴に残す
      }
      setView("search");
      setSelectedReview(null);
    }
  };

  const bgGradient = view === 'detail' && selectedReview ? `linear-gradient(to bottom, ${selectedReview.color}11, #121212 600px)` : 'none';

  return (
    <div className="min-h-screen bg-[#121212] font-sans text-gray-300">
      <Header 
        setView={(v) => { setView(v); setSelectedReview(null); }} 
        activeView={view} 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        isVisible={isHeaderVisible}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        onResetHistory={handleResetHistory}
        onLogoClick={handleHeaderLogoClick}
      />

      <main 
          className="pt-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen"
          style={{ background: bgGradient }}
      >
        {view === "home" && (
          <HomeView 
            reviews={reviews} 
            onSelectReview={handleSelectReview} 
            pickupCandidates={pickupCandidates}
            pickupCount={pickupCount}
            onMorePickup={() => setPickupCount(prev => prev + 6)}
            initialScrollY={homeScrollPos}
            totalReviews={reviews.length}
            lastUpdate={lastUpdate}
          />
        )}
        {view === "search" && (
          <SearchView 
            reviews={reviews} 
            onSelectReview={handleSelectReview} 
            query={searchQuery}
            searchMode={searchMode}
          />
        )}
        {view === "library" && (
          <ArtistListView 
            reviews={reviews} 
            onSelectReview={handleSelectReview} 
            isHeaderVisible={isHeaderVisible} 
            expandedArtist={expandedArtistName}
            onToggleArtist={(name) => setExpandedArtistName(prev => prev === name ? null : name)}
            initialScrollY={libraryScrollPos}
          />
        )}
        {view === "about" && (
          <AboutView 
            siteDescription={aboutData ? aboutData.siteDescription : "Loading..."}
            profileDescription={aboutData ? aboutData.profileDescription : "Loading..."}
          />
        )}
        {view === "best" && (
          <BestView 
            bestData={bestData}
            reviews={reviews}
            onSelectReview={handleSelectReview}
            isHeaderVisible={isHeaderVisible}
          />
        )}
        {view === "detail" && selectedReview && (
            <DetailView 
                review={selectedReview} 
                onBack={handleBack} 
                reviews={reviews} 
                onSelectReview={handleSelectReview}
            />
        )}
      </main>
      
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-green-500 text-black p-3 rounded-full shadow-lg hover:bg-green-400 transition-all duration-300 z-50 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
}