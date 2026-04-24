import React from 'react';

// بيانات الباقات (يمكننا نقلها لاحقاً لـ Firebase)
const packages = [
  {
    id: 1,
    name: "باقة 6 أشهر",
    price: "2500 DA",
    features: ["+12,000 قناة", "مكتبة أفلام ومسلسلات", "جودة 4K/FHD", "دعم فني سريع"],
    recommended: false
  },
  {
    id: 2,
    name: "باقة 12 شهر (سنة)",
    price: "4500 DA",
    features: ["كل مميزات الباقة الأساسية", "تحديثات يومية", "ثبات عالي جداً", "تعمل على جهازين"],
    recommended: true
  }
];

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans text-right" dir="rtl">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-black text-yellow-500 tracking-tighter">DZ-IPTV</div>
        <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition-all">دخول الإدارة</button>
      </nav>

      {/* Hero Section */}
      <header className="py-20 px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-l from-yellow-200 to-yellow-600 bg-clip-text text-transparent">
          شاهد أقوى القنوات العالمية في منزلك
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          استمتع بأفضل اشتراكات IPTV في الجزائر، جودة عالية، ثبات بدون تقطيع، ودعم فني متواصل.
        </p>
      </header>

      {/* Packages Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`relative p-8 rounded-3xl border ${pkg.recommended ? 'border-yellow-500 bg-slate-900 shadow-2xl shadow-yellow-500/10' : 'border-slate-800 bg-slate-900/50'} transition-transform hover:scale-105`}>
              {pkg.recommended && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-4 py-1 rounded-full">الأكثر طلباً</span>
              )}
              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
              <div className="text-4xl font-black text-yellow-500 mb-6">{pkg.price}</div>
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-300">
                    <span className="text-green-500 font-bold text-xl">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${pkg.recommended ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'bg-white text-black hover:bg-slate-200'}`}>
                اطلب عبر واتساب أو الهاتف
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-900 text-center text-slate-500 text-sm">
        جميع الحقوق محفوظة لمتجر DZ-IPTV &copy; 2026
      </footer>
    </div>
  );
}

export default App;