import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';

function Admin() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // جلب البيانات لحظياً من Firebase
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ ...doc.data(), id: doc.id });
      });
      setOrders(ordersData);
    });
    return () => unsubscribe();
  }, []);

  const deleteOrder = async (id) => {
    if(window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      await deleteDoc(doc(db, "orders", id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-500 mb-8 border-b border-slate-800 pb-4">
          لوحة إدارة طلبات IPTV 📦
        </h1>

        <div className="grid gap-4">
          {orders.length === 0 ? (
            <p className="text-slate-500 text-center py-20">لا توجد طلبات جديدة حالياً.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-bold">{order.customerName}</span>
                    <span className="bg-yellow-500/10 text-yellow-500 text-xs px-2 py-1 rounded border border-yellow-500/20">{order.packageName}</span>
                  </div>
                  <p className="text-slate-400 font-mono text-lg">{order.customerPhone}</p>
                  <p className="text-slate-600 text-xs mt-1 italic">{order.createdAt?.toDate().toLocaleString()}</p>
                </div>
                
                <div className="flex gap-3">
                  <a href={`tel:${order.customerPhone}`} className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl font-bold transition-all">اتصال</a>
                  <button onClick={() => deleteOrder(order.id)} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl transition-all">حذف</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;