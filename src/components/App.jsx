import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Home, Library, Disc, User, Menu, X, Play, Heart, MoreHorizontal, ExternalLink, Calendar, Star, ArrowLeft, ChevronDown, ChevronUp, Info } from 'lucide-react';

// Headerコンポーネント
const Header = ({ setView, activeView, onSearch, searchQuery, isVisible }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { id: 'search-trigger', label: '検索', icon: Search },
    { id: 'library', label: 'アーティスト一覧', icon: Library },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (item) => {
    if (item.id === 'search-trigger') {
      setIsSearchOpen(true);
    } else {
      setView(item.id);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            onClick={() => { setView('home'); setIsSearchOpen(false); }}
            className="flex items-center gap-2 text-white cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Disc size={24} className="text-green-500" />
            <span className="text-lg font-bold tracking-tight">Pseudology</span>
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
          <div className="max-w-2xl mx-auto relative flex items-center gap-4">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  type="text"
                  placeholder="アーティスト、曲名、レビュー内容で検索..."
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-[#242424] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:bg-[#2a2a2a] transition-all border border-gray-800"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  autoFocus={isSearchOpen}
                />
             </div>
             <button 
               onClick={() => setIsSearchOpen(false)}
               className="p-2 rounded-full hover:bg-[#282828] text-gray-400 hover:text-white transition-colors"
             >
               <X size={24} />
             </button>
          </div>
        </div>
      </header>
    </>
  );
};

// ReviewCardコンポーネント
const ReviewCard = ({ review, onClick, variant = "standard" }) => {
  const commonContainerStyle = `
    cursor-pointer group bg-[#1a1a1a] hover:bg-[#222] transition-all duration-300 
    border-l-4 border-transparent hover:border-green-500 rounded-r-lg relative overflow-hidden
  `;

  const dateDisplay = review.date ? review.date : "No Date";

  const CardImage = ({ sizeClass, iconSize }) => (
    <div 
      className={`${sizeClass} relative flex items-center justify-center overflow-hidden flex-shrink-0 bg-[#333]`}
      style={{ backgroundColor: review.image ? '#000' : review.color }}
    >
      {review.image ? (
        <img src={review.image} alt={review.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      ) : (
        <Disc size={iconSize} className="text-white opacity-60 group-hover:scale-110 transition-transform duration-700" />
      )}
    </div>
  );

  if (variant === "featured") return null;

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

// HomeViewコンポーネント
const HomeView = ({ reviews, onSelectReview }) => {
  const [pickupCount, setPickupCount] = useState(6);

  const recentReviews = useMemo(() => reviews.slice(0, 6), [reviews]);
  const pickupCandidates = useMemo(() => {
    const candidates = reviews.slice(6);
    return [...candidates].sort(() => 0.5 - Math.random());
  }, [reviews]);

  const visiblePickups = pickupCandidates.slice(0, pickupCount);

  return (
    <div className="space-y-12 pb-24">
      <section className="mt-8"> 
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
          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => setPickupCount(prev => prev + 6)}
              className="px-8 py-3 bg-[#1a1a1a] hover:bg-[#282828] text-white text-xs font-bold tracking-widest rounded-full border border-gray-700 hover:border-green-500 transition-all shadow-lg hover:shadow-green-500/20"
            >
              LOAD MORE
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

// DetailViewコンポーネント
const DetailView = ({ review, onBack }) => {
  if (!review) return null;
  const dateDisplay = review.date ? review.date : "No Date";

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
        
        <div className="flex justify-end text-sm text-gray-500 mb-12 border-t border-gray-800 pt-4">
            <span>
                {dateDisplay}
            </span>
        </div>

        <button 
          onClick={onBack} 
          className="text-sm font-bold text-gray-400 hover:text-white border border-gray-600 px-8 py-3 rounded-full hover:border-white transition-all uppercase tracking-widest flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          BACK
        </button>
      </div>
    </div>
  );
};

// AboutViewコンポーネント
const AboutView = () => {
  return (
    <div className="animate-fade-in pb-20 pt-8 px-4 max-w-2xl mx-auto">
      <div className="mb-12 text-center">
        <Disc size={64} className="text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">About Pseudology</h1>
        <p className="text-gray-400 text-lg">A personal archive of music reviews and thoughts.</p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">このサイトについて</h2>
          <div className="text-gray-300 leading-relaxed space-y-4">
            <p>
              Pseudologyは、管理人が日々の生活の中で触れた音楽作品についてのレビューや感想を記録するアーカイブサイトです。
              主にX（旧Twitter）に投稿した短文のレビューを蓄積し、検索・閲覧しやすい形で整理することを目的としています。
            </p>
            <p>
              新旧問わず、ジャンルも多岐にわたる音楽を紹介しています。
              8,000件を超える膨大なデータベースの中から、あなたの琴線に触れる一枚が見つかれば幸いです。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">著者について</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center">
               <User size={40} className="text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Yas No</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                音楽愛好家 / Webデベロッパー。
                UKロック、エレクトロニカ、アンビエントなどを好んで聴きます。
                日々の発見を記録として残すことに喜びを感じています。
              </p>
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

// ArtistListViewコンポーネント
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
      // アーティスト名が大文字統一されている前提
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
                      {/* 画像なし、テキストのみのコンパクトなリスト表示 */}
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

const SearchView = ({ reviews, onSelectReview, query = "" }) => {
  const filtered = useMemo(() => {
    if (!query) return [];
    const lower = query.toLowerCase();
    return reviews.filter(r => r.artist.toLowerCase().includes(lower) || r.title.toLowerCase().includes(lower) || r.body.toLowerCase().includes(lower));
  }, [query, reviews]);

  return (
    <div className="min-h-screen">
      <div className="pt-8">
        {query ? (
          <div className="mb-8 text-gray-400 text-sm">"{query}" の検索結果: {filtered.length} 件</div>
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

// メインAppコンポーネント
export default function App({ initialReviews }) {
  const [view, setView] = useState("home");
  const [selectedReview, setSelectedReview] = useState(null);
  
  // データを読み込む際に、アーティスト名をすべて大文字に変換して統一する
  const [reviews, setReviews] = useState(
    (initialReviews || []).map(review => ({
      ...review,
      artist: review.artist ? review.artist.toUpperCase() : "" 
    }))
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [previousView, setPreviousView] = useState("home");
  
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const [expandedArtistName, setExpandedArtistName] = useState(null);
  const [libraryScrollPos, setLibraryScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) < 10) return;
      
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSelectReview = (review) => { 
    if (view === "library") {
      setLibraryScrollPos(window.scrollY);
    }
    setPreviousView(view);
    setSelectedReview(review); 
    setView("detail"); 
    window.scrollTo(0, 0); 
  };
  
  const handleBack = () => { 
    setSelectedReview(null); 
    setView(previousView || "home");
  };
  
  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q) {
      if (view !== "search") setPreviousView(view);
      setView("search");
      setSelectedReview(null);
    } else if (!q && view === 'search') {
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
      />

      <main 
         className="pt-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen"
         style={{ background: bgGradient }}
      >
        {view === "home" && <HomeView reviews={reviews} onSelectReview={handleSelectReview} />}
        {view === "search" && <SearchView reviews={reviews} onSelectReview={handleSelectReview} query={searchQuery} />}
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
        {view === "about" && <AboutView />}
        {view === "detail" && selectedReview && <DetailView review={selectedReview} onBack={handleBack} />}
      </main>
    </div>
  );
}