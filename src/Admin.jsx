import  { useEffect, useState } from 'react';
import { db, auth, storage } from './firebase';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SidebarContent = ({ setView, setIsSidebarOpen, handleLogout, view }) => (
  <div className="flex flex-col h-full bg-slate-900">
    <div className="p-6 flex justify-between items-center border-b border-slate-800 mb-4">
      <div className="text-2xl font-black text-yellow-500 italic tracking-tighter">DZ-ADMIN</div>
      <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 p-2 hover:bg-slate-800 rounded-lg">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <nav className="flex-1 px-4 space-y-2">
      {[
        { id: 'orders', label: '📦 قائمة الطلبات' },
        { id: 'products', label: '🛒 إدارة المنتجات' },
        { id: 'customers', label: '👥 قائمة الزبائن' },
        { id: 'settings', label: '⚙️ الإعدادات' }
      ].map((item) => (
        <button key={item.id} onClick={() => { setView(item.id); setIsSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${view === item.id ? 'bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          {item.label}
        </button>
      ))}
    </nav>
    <div className="p-4 border-t border-slate-800">
      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all font-medium">🚪 تسجيل الخروج</button>
    </div>
  </div>
);

function Admin() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('orders');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [productData, setProductData] = useState({ name: '', price: '', desc: '', imageUrl: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const authUnsub = onAuthStateChanged(auth, (user) => { if (!user) navigate('/login'); });
    const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => setOrders(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))));
    const qProds = query(collection(db, "products"));
    const unsubProds = onSnapshot(qProds, (snapshot) => setProducts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))));

    return () => { authUnsub(); unsubOrders(); unsubProds(); };
  }, [navigate]);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status !== "مكتمل").length,
    completed: orders.filter(o => o.status === "مكتمل").length
  };

  const handleLogout = () => signOut(auth).then(() => navigate('/login'));

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    let finalImageUrl = productData.imageUrl || "";

    try {
      if (imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const finalData = { ...productData, imageUrl: finalImageUrl };

      if (editingId) {
        await updateDoc(doc(db, "products", editingId), finalData);
      } else {
        await addDoc(collection(db, "products"), finalData);
      }

      setShowProductModal(false);
      setProductData({ name: '', price: '', desc: '', imageUrl: '' });
      setImageFile(null);
      setEditingId(null);
    } catch (error) {
      alert("خطأ: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans" dir="rtl">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-slate-900 border-l border-slate-800 flex-col sticky top-0 h-screen z-50">
        <SidebarContent setView={setView} setIsSidebarOpen={setIsSidebarOpen} handleLogout={handleLogout} view={view} />
      </aside>

      {/* Sidebar - Mobile */}
      <div className="lg:hidden">
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
        <aside className={`fixed top-0 right-0 bottom-0 w-72 bg-slate-900 z-[200] transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <SidebarContent setView={setView} setIsSidebarOpen={setIsSidebarOpen} handleLogout={handleLogout} view={view} />
        </aside>
      </div>

      <main className="flex-1 min-w-0">
        <header className="bg-slate-900/80 backdrop-blur-md p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 z-[100]">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden bg-slate-800 p-2 rounded-lg"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg></button>
            <div className="font-bold text-yellow-500 lg:hidden italic">DZ-ADMIN</div>
          </div>
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-black">A</div>
        </header>

        <div className="p-4 md:p-10 max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {[
              { label: 'إجمالي الطلبيات', val: stats.total, color: 'border-slate-700', icon: '📊' },
              { label: 'تحت المعالجة', val: stats.pending, color: 'border-blue-500', icon: '⏳' },
              { label: 'الطلبات المكتملة', val: stats.completed, color: 'border-green-500', icon: '✅' }
            ].map((s, i) => (
              <div key={i} className={`bg-slate-900 p-6 rounded-3xl border border-slate-800 border-r-4 ${s.color}`}>
                <div className="flex justify-between items-center mb-1"><p className="text-slate-500 text-xs">{s.label}</p><span>{s.icon}</span></div>
                <h3 className="text-3xl font-black text-white">{s.val}</h3>
              </div>
            ))}
          </div>

          {/* Products View */}
          {view === 'products' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
                <button onClick={() => { setEditingId(null); setProductData({name:'', price:'', desc:'', imageUrl:''}); setShowProductModal(true); }} className="bg-yellow-500 text-black px-6 py-3 rounded-2xl font-bold hover:bg-yellow-400 transition-all">
                  + إضافة منتج
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-right">
                  <thead className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                    <tr><th className="p-5 font-bold">المنتج</th><th className="p-5 font-bold">السعر</th><th className="p-5 text-center font-bold">الإجراءات</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-5 flex items-center gap-4">
                          {prod.imageUrl ? (
                            <img src={prod.imageUrl} className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700 shadow-md" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 shadow-md">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                          )}
                          <div><div className="font-bold text-white">{prod.name}</div><div className="text-xs text-slate-500 truncate max-w-[200px]">{prod.desc}</div></div>
                        </td>
                        <td className="p-5 font-mono text-yellow-500 font-bold">{prod.price} DA</td>
                        <td className="p-5 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => { setEditingId(prod.id); setProductData(prod); setShowProductModal(true); }} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all">تعديل</button>
                            <button onClick={async () => { if(window.confirm("حذف؟")) await deleteDoc(doc(db, "products", prod.id)) }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">حذف</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders View */}
          {view === 'orders' && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-2xl font-bold mb-6">إدارة الطلبيات</h2>
              {orders.map(order => (
                <div key={order.id} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] flex justify-between items-center group hover:border-slate-700 transition-all">
                  <div>
                    <h3 className="font-bold text-white group-hover:text-yellow-500 transition-colors">{order.customerName}</h3>
                    <p className="text-slate-400 font-mono text-sm">{order.customerPhone}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${order.status === 'مكتمل' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>{order.status || 'جديد'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal - Add/Edit Product */}
      {showProductModal && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSaveProduct} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-yellow-500 mb-8">{editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 mr-2 mb-1 block">اسم المنتج (إجباري)</label>
                <input required value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 outline-none focus:border-yellow-500 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 mr-2 mb-1 block">السعر (DA)</label>
                  <input required value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 outline-none focus:border-yellow-500 text-white font-mono" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mr-2 mb-1 block">صورة المنتج</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 outline-none text-[10px] text-slate-400 file:hidden" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mr-2 mb-1 block">وصف المنتج</label>
                <textarea value={productData.desc} onChange={e => setProductData({...productData, desc: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 outline-none focus:border-yellow-500 h-28 text-white resize-none" />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button disabled={loading} type="submit" className="flex-1 bg-yellow-500 text-black py-4 rounded-2xl font-bold hover:bg-yellow-400 transition-all disabled:opacity-50">
                {loading ? 'جاري الرفع...' : 'حفظ'}
              </button>
              <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-700 transition-all">إلغاء</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Admin;