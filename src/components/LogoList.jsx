import React, { useState } from 'react';

// --- Font Loading & Styles ---
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&family=Karla:wght@700&family=Libre+Franklin:wght@700&display=swap');
  `}</style>
);

// --- Logo 1: Libre Franklin (Loop-tail g default) ---
const LogoLibreFranklin = () => (
  <svg viewBox="0 0 200 40" className="h-16 w-auto fill-current">
    <text x="0" y="30" fontSize="28" fontWeight="bold" fontFamily="'Libre Franklin', sans-serif" letterSpacing="-1">pseudology</text>
  </svg>
);

// --- Logo 2: Karla (Quirky sans-serif) ---
const LogoKarla = () => (
  <svg viewBox="0 0 200 40" className="h-16 w-auto fill-current">
    <text x="0" y="30" fontSize="28" fontWeight="bold" fontFamily="'Karla', sans-serif" letterSpacing="-1.5">pseudology</text>
  </svg>
);

// --- Logo 3: Inter (With Settings) ---
// Interは標準ではシングルストーリーgですが、font-feature-settingsで変形を試みます。
// ※Interにループテイルgの機能が含まれていない場合は標準のまま表示されます。
const LogoInter = () => (
  <svg viewBox="0 0 200 40" className="h-16 w-auto fill-current">
    <text 
      x="0" y="30" 
      fontSize="28" 
      fontWeight="bold" 
      fontFamily="'Inter', sans-serif" 
      letterSpacing="-1"
      // ここでOpenType機能を有効化（cv05など）。
      // Interに眼鏡型gのオプションがあればここで反映されますが、
      // 多くのバージョンでは提供されていません。
      style={{ fontFeatureSettings: '"cv05" 1, "calt" 1' }} 
    >
      pseudology
    </text>
  </svg>
);

export default function LogoList() {
  const [selected, setSelected] = useState(null);

  const logoOptions = [
    { 
      id: 1, 
      Component: LogoLibreFranklin, 
      title: "Libre Franklin", 
      desc: "【推奨】標準で美しいループテイル（眼鏡型）の 'g' を持つ、伝統的かつモダンなサンセリフ体。" 
    },
    { 
      id: 2, 
      Component: LogoKarla, 
      title: "Karla", 
      desc: "少し人間味のあるグロテスク・サンセリフ。'g' はループなしですが個性的で人気があります。" 
    },
    { 
      id: 3, 
      Component: LogoInter, 
      title: "Inter (Custom)", 
      desc: "UIフォントの定番。標準はループなしの 'g' です。（設定変更を適用中）" 
    },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8 font-sans">
      <FontStyles />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-white">Logo Font Comparison</h1>
        <p className="text-gray-500 text-center mb-12">小文字 'g' の形状に注目して選んでください</p>
        
        <div className="space-y-6">
          {logoOptions.map(({ id, Component, title, desc }) => (
            <div 
              key={id} 
              onClick={() => setSelected(id)}
              className={`flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl border transition-all cursor-pointer
                ${selected === id 
                  ? 'bg-[#222] border-green-500 shadow-lg shadow-green-900/20' 
                  : 'bg-[#1a1a1a] border-gray-800 hover:border-gray-600 hover:shadow-lg'
                }`}
            >
              <div className="flex-1 text-center md:text-left">
                <span className={`text-xs font-bold tracking-widest uppercase transition-colors ${selected === id ? 'text-green-400' : 'text-gray-600'}`}>
                  Option 0{id}
                </span>
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
              <div className="flex-[1.5] flex justify-center p-8 bg-[#121212] rounded-lg border border-gray-800">
                <div className={`${selected === id ? 'text-green-400' : 'text-white'}`}>
                  <Component />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>気に入ったフォントがあれば、その番号（1〜3）をお知らせください。<br/>本番サイトに適用します。</p>
        </div>
      </div>
    </div>
  );
}