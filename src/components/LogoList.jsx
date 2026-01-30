import React from 'react';

// --- Logo 1: Standard ---
const Logo1 = () => (
  <svg viewBox="0 0 200 40" className="h-16 w-auto fill-current">
    <text x="0" y="30" fontSize="28" fontWeight="bold" fontFamily="sans-serif" letterSpacing="-1">pseudology</text>
  </svg>
);

// --- Logo 2: Modern ---
const Logo2 = () => (
  <svg viewBox="0 0 200 40" className="h-16 w-auto fill-current">
    <circle cx="15" cy="20" r="10" />
    <rect x="22" y="10" width="4" height="20" />
    <text x="35" y="30" fontSize="28" fontWeight="bold" fontFamily="sans-serif" letterSpacing="-1">seudology</text>
  </svg>
);

// --- Logo 3: Digital ---
const Logo3 = () => (
  <svg viewBox="0 0 200 40" className="h-16 w-auto fill-current">
    <text x="0" y="30" fontSize="26" fontWeight="bold" fontFamily="monospace" letterSpacing="-2">pseudology_</text>
  </svg>
);

// --- Logo 4: Flow ---
const Logo4 = () => (
  <svg viewBox="0 0 200 40" className="h-16 w-auto fill-current">
    <path d="M0 25 Q 10 10, 20 25 T 40 25" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <text x="50" y="30" fontSize="26" fontWeight="bold" fontFamily="sans-serif">pseudology</text>
  </svg>
);

// --- Logo 5: Bold ---
const Logo5 = () => (
  <svg viewBox="0 0 240 40" className="h-16 w-auto fill-current">
    <rect x="0" y="5" width="24" height="24" rx="4" fill="currentColor"/>
    <path d="M12 10 L12 24 M7 12 L17 12" stroke="#121212" strokeWidth="2" />
    <text x="32" y="30" fontSize="24" fontWeight="900" fontFamily="sans-serif" letterSpacing="2" style={{textTransform: 'uppercase'}}>PSEUDOLOGY</text>
  </svg>
);

export default function LogoList() {
  const logos = [
    { id: 1, Component: Logo1, title: "Standard Minimal", desc: "最もシンプルで可読性が高い" },
    { id: 2, Component: Logo2, title: "Modern Geometric", desc: "幾何学的なアイコン付き" },
    { id: 3, Component: Logo3, title: "Digital Monospace", desc: "テック・デジタルな雰囲気" },
    { id: 4, Component: Logo4, title: "Sound Wave", desc: "音の波形をイメージ" },
    { id: 5, Component: Logo5, title: "Bold Box", desc: "力強いボックスロゴ" },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Logo Concepts</h1>
        <p className="text-gray-500 text-center mb-12">気に入ったデザインの番号（1〜5）を選んでください</p>
        
        <div className="space-y-6">
          {logos.map(({ id, Component, title, desc }) => (
            <div key={id} className="flex flex-col md:flex-row items-center gap-6 p-6 bg-[#1a1a1a] rounded-xl border border-gray-800 hover:border-gray-600 transition-colors">
              <div className="flex-1 text-center md:text-left">
                <span className="text-green-500 text-xs font-bold tracking-widest uppercase">Option {id}</span>
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
              <div className="flex-1 flex justify-center p-4 bg-black/50 rounded-lg">
                <Component />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}