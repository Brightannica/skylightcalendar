import React, { useState } from 'react';
import { ShoppingCart, Plus, Check, Trash2, Tag } from 'lucide-react';

interface GroceryItem {
  id: number;
  item: string;
  checked: boolean;
}

export default function GroceryList({ initialGroceries }: { initialGroceries: GroceryItem[] }) {
  const [items, setItems] = useState<GroceryItem[]>(initialGroceries);
  const [newItem, setNewItem] = useState('');

  const toggleItem = (id: number) => {
    setItems(items.map(i =>
      i.id === id ? { ...i, checked: !i.checked } : i
    ));
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    const newItemObj: GroceryItem = {
      id: Date.now(),
      item: newItem,
      checked: false
    };
    setItems([...items, newItemObj]);
    setNewItem('');
  };

  const deleteItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  const completedCount = items.filter(i => i.checked).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm h-full p-8 border border-slate-200 overflow-hidden flex flex-col relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <ShoppingCart className="text-green-500" size={32} />
          Grocery List
        </h2>

        <div className="flex gap-2">
           <input
              type="text"
              placeholder="Add item..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-green-500 transition font-medium text-slate-700"
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <button onClick={addItem} className="bg-green-600 text-white p-2 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200">
              <Plus size={24} />
            </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 px-2">
         <div className="flex justify-between text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">
            <span>Shopping Progress</span>
            <span>{completedCount} / {items.length} items</span>
         </div>
         <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
         </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
              item.checked
                ? 'bg-green-50 border-green-100 opacity-70'
                : 'bg-white border-slate-200 hover:border-green-200 hover:shadow-md'
            }`}
          >
             <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleItem(item.id)}>
                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-colors ${
                  item.checked ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-transparent bg-slate-50'
                }`}>
                   <Check size={20} strokeWidth={4} />
                </div>
                <span className={`text-xl font-bold transition-all ${item.checked ? 'text-green-800 line-through' : 'text-slate-700'}`}>
                  {item.item}
                </span>
             </div>

             <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition duration-200">
                <Tag size={18} className="text-slate-300" />
                <button onClick={() => deleteItem(item.id)} className="text-slate-300 hover:text-red-500 transition p-2 rounded-lg hover:bg-red-50">
                  <Trash2 size={20} />
                </button>
             </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-300">
            <ShoppingCart size={64} className="mb-4 opacity-50" />
            <p className="font-bold text-lg">Your list is empty!</p>
          </div>
        )}
      </div>
    </div>
  );
}
