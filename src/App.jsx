import { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

// بيانات الباقات - يمكنك تعديل الأسعار والمميزات من هنا بسهولة
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
  const [showModal, setShowModal] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("");
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);

  // دالة إرسال الطلب إلى Firebase
  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "orders"), {
        customerName: formData.name,
        customerPhone: formData.phone,
        packageName: selectedPkg,
        status: "جديد",
        createdAt: new Date()
      });
      alert("✅ تم إرسال طلبك بنجاح! سنتصل بك لتفعيل الاشتراك.");
      setShowModal(false);
      setFormData({ name: '', phone: '' });
    } catch (error) {
      console.error("خطأ في الإرسال: ", error);
      alert("❌ عذراً، حدث خطأ أثناء إرسال الطلب.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-yellow-500/30" dir="rtl">
      
      {/* الشريط العلوي */}
      <nav className="p-6 flex justify-between items-center border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-black text-yellow-500 tracking-tighter italic">DZ-IPTV</div>
        <div className="flex gap-4">
            <span className="hidden md:inline text-slate-400 text-sm mt-2">خدمة متوفرة 24/7 في الجزائر</span>
            <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition-all border border-slate-700">دخول الإدارة</button>
        </div>
      </nav>

      {/* واجهة الترحيب */}
      <header className="py-20 px-4 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-yellow-500 uppercase bg-yellow-500/10 border border-yellow-500/20 rounded-full">
            أفضل خدمة IPTV في الجزائر 🇩🇿
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-l from-yellow-100 via-yellow-500 to-yellow-700 bg-clip-text text-transparent">
          شاهد أقوى القنوات العالمية
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          استمتع بمشاهدة مبارياتك المفضلة وأحدث الأفلام بدون تقطيع. نوفر لك سيرفرات قوية وثابتة تناسب سرعات الإنترنت في الجزائر.
        </p>
      </header>

      {/* قسم الباقات */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`relative p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.02] ${pkg.recommended ? 'border-yellow-500 bg-slate-900 shadow-2xl shadow-yellow-500/10' : 'border-slate-800 bg-slate-900/40'}`}>
              {pkg.recommended && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-black px-6 py-1.5 rounded-full shadow-lg">الأكثر طلباً</span>
              )}
              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black text-yellow-500">{pkg.price}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-300">
                    <div className="bg-green-500/20 p-1 rounded-full text-green-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => { setSelectedPkg(pkg.name); setShowModal(true); }}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 ${pkg.recommended ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-white text-black hover:bg-slate-200'}`}
              >
                اطلب الآن
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* نافذة الطلب (Modal) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
            <h2 className="text-3xl font-bold mb-2 text-yellow-500">تأكيد الطلب</h2>
            <p className="text-slate-400 mb-6">أدخل معلوماتك وسنتصل بك لتفعيل {selectedPkg}</p>
            
            <form onSubmit={handleOrder} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2 mr-1">الاسم الكامل</label>
                <input 
                  type="text" required
                  className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                  placeholder="مثال: محمد الجزائري"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2 mr-1">رقم الهاتف</label>
                <input 
                  type="tel" required
                  className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                  placeholder="06 -- -- -- --"
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-bold text-lg hover:bg-yellow-400 transition-all disabled:opacity-50"
              >
                {loading ? "جاري الإرسال..." : "تأكيد الطلب"}
              </button>
              <button 
                onClick={() => setShowModal(false)}
                type="button" 
                className="w-full text-slate-500 text-sm font-medium hover:text-white transition-colors"
              >
                إلغاء
              </button>
            </form>
          </div>
        </div>
      )}

      {/* التذييل */}
      <footer className="py-12 border-t border-slate-900 text-center">
        <p className="text-slate-500 text-sm">
          جميع الحقوق محفوظة لمتجر DZ-IPTV &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default App;