import { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { useWallet } from '../context/WalletContext';
import { useProducts, DAY_LABELS, ALL_DAY_IDS, type Product } from '../context/ProductsContext';
import { usePlans, type Plan } from '../context/PlansContext';
import {
  Package, Truck, Wallet, Plus, Edit2, Trash2, Check, X,
  Download, Search, CheckCircle, ChevronDown, ChevronUp, BookOpen, Sparkles, Settings,
  MessageCircle, Coffee, Power, Users, AlertCircle, Clock
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useDeliveries } from '../context/DeliveryContext';
import { useAuth, type Role } from '../context/AuthContext';

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = 'produtos' | 'entregas' | 'carteiras' | 'planos' | 'configuracoes' | 'utilizadores' | 'branding';

// ─── Static data ────────────────────────────────────────────────────────────

const WEEK_DAYS = [
  { id: 'seg', label: 'Segunda-feira' }, { id: 'ter', label: 'Terça-feira' },
  { id: 'qua', label: 'Quarta-feira' }, { id: 'qui', label: 'Quinta-feira' },
  { id: 'sex', label: 'Sexta-feira' }, { id: 'sab', label: 'Sábado' }, { id: 'dom', label: 'Domingo' },
];

// ─── Input helpers ───────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  border: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-cream)',
  fontSize: '0.95rem', color: 'var(--text-main)', outline: 'none', boxSizing: 'border-box'
};

// ─── Product Form ─────────────────────────────────────────────────────────────

const EMPTY_PRODUCT = { name: '', price: 0, description: '', photo: '🥐', availableDays: [...ALL_DAY_IDS] };

function ProductForm({ initial, onSave, onCancel }: {
  initial?: Omit<Product, 'id'>,
  onSave: (p: Omit<Product, 'id'>) => void,
  onCancel: () => void
}) {
  const [form, setForm] = useState(initial ?? EMPTY_PRODUCT);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleDay = (d: string) => setForm(f => ({
    ...f,
    availableDays: f.availableDays.includes(d)
      ? f.availableDays.filter(x => x !== d)
      : [...f.availableDays, d]
  }));

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, photo: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 items-center">
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            width: 56, height: 56, borderRadius: 12, cursor: 'pointer',
            backgroundColor: 'var(--primary-orange-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: form.photo.startsWith('data:') ? 0 : '2rem',
            overflow: 'hidden', flexShrink: 0, border: '2px dashed var(--border-color)'
          }}
        >
          {form.photo.startsWith('data:')
            ? <img src={form.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : form.photo}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
        <div style={{ flex: 1 }} className="flex flex-col gap-2">
          <input style={inputStyle} placeholder="Nome do produto" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <div className="flex gap-2 items-center">
            <input style={{ ...inputStyle, width: '120px' }} type="number" placeholder="Preço €" value={form.price || ''} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} />
          </div>
        </div>
      </div>
      <textarea
        style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }}
        placeholder="Descrição"
        value={form.description}
        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
      />
      <div>
        <p className="text-sm font-medium text-muted mb-2">Disponível nos dias:</p>
        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
          {ALL_DAY_IDS.map(d => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDay(d)}
              style={{
                padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                border: '1.5px solid ' + (form.availableDays.includes(d) ? 'var(--primary-orange)' : 'var(--border-color)'),
                backgroundColor: form.availableDays.includes(d) ? 'var(--primary-orange-light)' : 'transparent',
                color: form.availableDays.includes(d) ? 'var(--primary-orange-hover)' : 'var(--text-muted)'
              }}
            >
              {DAY_LABELS[d]}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { if (form.name) onSave(form); }}>
          <Check size={16} /> Guardar
        </button>
        <button className="btn btn-secondary" style={{ width: 'auto', padding: '10px 16px' }} onClick={onCancel}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Produtos ────────────────────────────────────────────────────────────

function ProdutosTab() {
  const { products, addProduct, updateProduct, deleteProduct, reorderProducts } = useProducts();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {!adding && (
        <button className="btn btn-primary" onClick={() => setAdding(true)}>
          <Plus size={18} /> Adicionar produto
        </button>
      )}
      {adding && (
        <Card className="mb-0">
          <h4 className="font-bold mb-3">Novo produto</h4>
          <ProductForm
            onSave={p => { addProduct(p); setAdding(false); }}
            onCancel={() => setAdding(false)}
          />
        </Card>
      )}
      {products.map((prod, index) => (
        <div 
          key={prod.id}
          draggable
          onDragStart={() => { setDragIndex(index); setDropIndex(index); }}
          onDragEnter={() => setDropIndex(index)}
          onDragOver={e => e.preventDefault()}
          onDrop={() => {
            if (dragIndex !== null && dragIndex !== index) reorderProducts(dragIndex, index);
            setDragIndex(null); setDropIndex(null);
          }}
          onDragEnd={() => { setDragIndex(null); setDropIndex(null); }}
          style={{
            opacity: dragIndex === index ? 0.4 : 1,
            outline: dropIndex === index && dragIndex !== index ? '2px dashed var(--primary-orange)' : 'none',
            outlineOffset: 2,
            borderRadius: 'var(--radius-lg)',
            transition: 'opacity 0.15s, outline 0.1s'
          }}
        >
          <Card className="mb-0" style={{ padding: '0', overflow: 'hidden' }}>
            {editingId === prod.id ? (
              <div style={{ padding: '1rem' }}>
                <h4 className="font-bold mb-3">Editar produto</h4>
                <ProductForm
                  initial={{ name: prod.name, price: prod.price, description: prod.description, photo: prod.photo, availableDays: prod.availableDays }}
                  onSave={p => { updateProduct(prod.id, p); setEditingId(null); }}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <>
                <div
                  className="flex justify-between items-center"
                  style={{ padding: '0.875rem 1rem', cursor: 'pointer' }}
                  onClick={() => setExpandedId(expandedId === prod.id ? null : prod.id)}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ cursor: 'grab', color: 'var(--text-muted)', userSelect: 'none' }}>⠿</span>
                    <div style={{
                      width: 40, height: 40, borderRadius: 8, backgroundColor: 'var(--primary-orange-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: prod.photo.startsWith('data:') ? 0 : '1.4rem', overflow: 'hidden', flexShrink: 0
                    }}>
                      {prod.photo.startsWith('data:')
                        ? <img src={prod.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : prod.photo}
                    </div>
                    <div>
                      <p className="font-bold m-0">{prod.name}</p>
                      <p className="text-sm text-muted m-0">{prod.price.toFixed(2)}€</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn-icon" style={{ width: 32, height: 32 }} onClick={e => { e.stopPropagation(); setEditingId(prod.id); }}>
                      <Edit2 size={15} />
                    </button>
                    <button className="btn-icon" style={{ width: 32, height: 32, color: '#e53e3e' }} onClick={e => { e.stopPropagation(); deleteProduct(prod.id); }}>
                      <Trash2 size={15} />
                    </button>
                    {expandedId === prod.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
                {expandedId === prod.id && (
                  <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid var(--border-color)' }}>
                    <p className="text-sm text-muted mt-3 mb-2">{prod.description}</p>
                    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                      {ALL_DAY_IDS.map(d => (
                        <span key={d} style={{
                          padding: '3px 8px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
                          backgroundColor: prod.availableDays.includes(d) ? 'var(--primary-orange-light)' : 'var(--bg-cream)',
                          color: prod.availableDays.includes(d) ? 'var(--primary-orange-hover)' : 'var(--text-muted)',
                          border: '1px solid ' + (prod.availableDays.includes(d) ? 'var(--primary-orange)' : 'var(--border-color)')
                        }}>
                          {DAY_LABELS[d]}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      ))}
    </div>
  );
}

// ─── Tab: Entregas ────────────────────────────────────────────────────────────

function EntregasTab() {
  const { deliveries } = useDeliveries();
  const [selectedDay, setSelectedDay] = useState('seg');
  const dayLabel = WEEK_DAYS.find(d => d.id === selectedDay)?.label ?? '';

  // Calculate Production Summary using deliveries from context
  const productionSummary = deliveries.reduce((acc, curr) => {
    curr.items.forEach(item => {
      acc[item.name] = (acc[item.name] || 0) + item.qty;
    });
    return acc;
  }, {} as Record<string, number>);

  const exportCSV = () => {
    let csv = 'Apartamento,Residente,Itens,Estado\n';
    deliveries.forEach(d => {
      const items = d.items.length ? d.items.map(i => `${i.qty}x ${i.name}`).join('; ') : 'Pausado';
      const status = d.status === 'delivered' ? `Entregue (${d.deliveredAt})` : 'Pendente';
      csv += `"${d.apartment}","${d.customerName}","${items}","${status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `entregas_${selectedDay}.csv`; a.click();
  };

  const exportPDF = () => {
    const printContent = `
      <html><head><title>Entregas – ${dayLabel}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #1a1a1a; }
        h1 { color: #e07b39; font-size: 1.4rem; margin-bottom: 1rem; }
        .delivery { border: 1px solid #e0d8d0; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
        .apt { font-weight: 700; font-size: 1.1rem; color: #e07b39; }
        .items { font-size: 0.95rem; color: #333; margin-top: 4px; }
        .status { font-size: 0.8rem; font-weight: bold; margin-top: 4px; color: #25D366; }
        .paused { color: #999; font-style: italic; }
      </style></head><body>
      <h1>🍞 Pão à Porta – ${dayLabel}</h1>
      ${deliveries.map(d => `
        <div class="delivery">
          <div class="apt">${d.apartment} – ${d.customerName}</div>
          <div class="items ${d.items.length ? '' : 'paused'}">
            ${d.items.length ? d.items.map(i => `${i.qty}× ${i.name}`).join(', ') : 'Pausado'}
          </div>
          ${d.status === 'delivered' ? `<div class="status">Entregue às ${d.deliveredAt}</div>` : ''}
        </div>
      `).join('')}
      </body></html>`;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(printContent);
    win.document.close();
    win.print();
  };

  return (
    <div>
      {/* Production Summary Card */}
      <Card className="mb-6" style={{ backgroundColor: 'var(--primary-orange-light)', border: 'none' }}>
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <Package size={18} /> Resumo de Produção – {dayLabel}
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(productionSummary).length > 0 ? (
            Object.entries(productionSummary).map(([name, qty]) => (
              <div key={name} className="flex flex-col">
                <span className="text-2xl font-bold" style={{ color: 'var(--primary-orange)' }}>{qty}</span>
                <span className="text-xs font-medium text-muted uppercase">{name}s</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted m-0 col-span-2">Sem encomendas para este dia.</p>
          )}
        </div>
      </Card>

      {/* Day selector */}
      <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
        <div className="flex gap-2" style={{ width: 'max-content' }}>
          {WEEK_DAYS.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDay(d.id)}
              style={{
                padding: '8px 14px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap', border: 'none',
                backgroundColor: selectedDay === d.id ? 'var(--primary-orange)' : 'var(--bg-cream)',
                color: selectedDay === d.id ? '#fff' : 'var(--text-main)'
              }}
            >
              {d.label.split('-')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button className="btn btn-secondary flex-1 text-sm" onClick={exportCSV}>
          <Download size={16} /> CSV
        </button>
        <button className="btn btn-secondary flex-1 text-sm" onClick={exportPDF}>
          <Download size={16} /> PDF
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {deliveries.length > 0 ? (
          deliveries.map(delivery => (
            <Card key={delivery.id} className="mb-0" style={{ padding: '0.75rem 1rem' }}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm" style={{ color: 'var(--primary-orange)' }}>
                      {delivery.apartment}
                    </span>
                    <span className="font-bold">{delivery.customerName}</span>
                  </div>
                  <p className="text-xs text-muted m-0">
                    {delivery.items.length > 0 
                      ? delivery.items.map(i => `${i.qty}x ${i.name}`).join(', ')
                      : 'Pausado'}
                  </p>
                </div>
                <div className="text-right">
                  {delivery.status === 'delivered' ? (
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1" style={{ backgroundColor: '#e6fcf0', color: '#25D366' }}>
                        <CheckCircle size={10} /> Entregue
                      </span>
                      <span className="text-[10px] text-muted mt-1">{delivery.deliveredAt}</span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-cream)', color: 'var(--text-muted)' }}>
                      Pendente
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted py-8">Nenhuma entrega registada.</p>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Carteiras ───────────────────────────────────────────────────────────

function CarteirasTab() {
  const { topUp } = useWallet();
  const { users } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const filtered = users.filter(u =>
    u.role === 'Customer' && (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.apt?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleAdd = () => {
    const val = parseFloat(amount.replace(',', '.'));
    if (!selectedUser || isNaN(val) || val <= 0) return;
    topUp(val, `Carregamento na padaria – ${selectedUser.name} (${selectedUser.apt ?? ''})`);
    setSuccess(true);
    setAmount('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          style={{ ...inputStyle, paddingLeft: 38 }}
          placeholder="Pesquisar por nome ou apartamento…"
          value={search}
          onChange={e => { setSearch(e.target.value); setSelectedUser(null); setSuccess(false); }}
        />
      </div>

      {/* User list */}
      {search && !selectedUser && (
        <div className="flex flex-col gap-2">
          {filtered.length === 0 && <p className="text-sm text-muted text-center">Nenhum resultado</p>}
          {filtered.map(u => (
            <div
              key={u.id}
              className="card mb-0 flex justify-between items-center"
              style={{ padding: '0.875rem', cursor: 'pointer' }}
              onClick={() => { setSelectedUser(u); setSearch(''); }}
            >
              <div>
                <p className="font-bold m-0">{u.name}</p>
                <p className="text-sm text-muted m-0">{u.apt}</p>
              </div>
              <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />
            </div>
          ))}
        </div>
      )}

      {/* Selected user + top-up form */}
      {selectedUser && (
        <Card className="mb-0">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-bold m-0 text-lg">{selectedUser.name}</p>
              <p className="text-sm text-muted m-0">{selectedUser.apt}</p>
            </div>
            <button className="btn-icon" style={{ width: 32, height: 32 }} onClick={() => { setSelectedUser(null); setSuccess(false); }}>
              <X size={16} />
            </button>
          </div>

          {success && (
            <div className="flex items-center gap-2 mb-4" style={{ backgroundColor: 'var(--primary-orange-light)', padding: '0.75rem', borderRadius: 8 }}>
              <CheckCircle size={18} color="var(--status-active)" />
              <span className="font-medium text-sm" style={{ color: 'var(--status-active)' }}>Saldo adicionado com sucesso!</span>
            </div>
          )}

          <div className="flex gap-2 mb-3">
            {[5, 10, 20].map(v => (
              <button key={v} className="btn btn-secondary" style={{ flex: 1, fontWeight: 700 }} onClick={() => setAmount(String(v))}>
                {v}€
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Outro valor (€)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button className="btn btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={handleAdd}>
              Adicionar saldo
            </button>
          </div>
        </Card>
      )}

      {!selectedUser && !search && (
        <p className="text-sm text-muted text-center" style={{ marginTop: '1rem' }}>
          Pesquise um cliente para adicionar saldo.
        </p>
      )}
    </div>
  );
}

// ─── Tab: Planos ─────────────────────────────────────────────────────────────

const EMPTY_PLAN: Omit<Plan, 'id'> = { title: '', price: '', badge: '', features: [''], template: null };

function PlanosTab() {
  const { plans, addPlan, updatePlan, deletePlan, reorderPlans } = usePlans();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const PlanForm = ({ initial, onSave, onCancel }: {
    initial: Omit<Plan, 'id'>;
    onSave: (p: Omit<Plan, 'id'>) => void;
    onCancel: () => void;
  }) => {
    const [form, setForm] = useState(initial);
    const setFeature = (i: number, val: string) =>
      setForm(f => { const ff = [...f.features]; ff[i] = val; return { ...f, features: ff }; });
    const addFeature = () => setForm(f => ({ ...f, features: [...f.features, ''] }));
    const removeFeature = (i: number) => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input style={inputStyle} placeholder="Nome do plano" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <input style={{ ...inputStyle, width: '110px' }} placeholder="Preço" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
        </div>
        <input style={inputStyle} placeholder="Badge (ex: Fim de semana)" value={form.badge ?? ''} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} />
        <div>
          <p className="text-sm font-medium text-muted mb-2">Características</p>
          <div className="flex flex-col gap-2">
            {form.features.map((feat, i) => (
              <div key={i} className="flex gap-2">
                <input style={{ ...inputStyle, flex: 1 }} placeholder={`Característica ${i + 1}`} value={feat} onChange={e => setFeature(i, e.target.value)} />
                {form.features.length > 1 && (
                  <button className="btn-icon" style={{ flexShrink: 0, color: '#e53e3e' }} onClick={() => removeFeature(i)}>
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button className="btn btn-secondary" style={{ padding: '8px', fontSize: '0.85rem' }} onClick={addFeature}>
              <Plus size={14} /> Adicionar característica
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { if (form.title && form.price) onSave({ ...form, badge: form.badge || undefined }); }}>
            <Check size={16} /> Guardar
          </button>
          <button className="btn btn-secondary" style={{ width: 'auto', padding: '10px 16px' }} onClick={onCancel}><X size={16} /></button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {!adding && (
        <button className="btn btn-primary" onClick={() => setAdding(true)}>
          <Plus size={18} /> Adicionar plano
        </button>
      )}
      {adding && (
        <Card className="mb-0">
          <h4 className="font-bold mb-3">Novo plano</h4>
          <PlanForm initial={EMPTY_PLAN} onSave={p => { addPlan(p); setAdding(false); }} onCancel={() => setAdding(false)} />
        </Card>
      )}
      {plans.map((plan, index) => (
        <div
          key={plan.id}
          draggable
          onDragStart={() => { setDragIndex(index); setDropIndex(index); }}
          onDragEnter={() => setDropIndex(index)}
          onDragOver={e => e.preventDefault()}
          onDrop={() => {
            if (dragIndex !== null && dragIndex !== index) reorderPlans(dragIndex, index);
            setDragIndex(null); setDropIndex(null);
          }}
          onDragEnd={() => { setDragIndex(null); setDropIndex(null); }}
          style={{
            opacity: dragIndex === index ? 0.4 : 1,
            outline: dropIndex === index && dragIndex !== index ? '2px dashed var(--primary-orange)' : 'none',
            outlineOffset: 2,
            borderRadius: 'var(--radius-lg)',
            transition: 'opacity 0.15s, outline 0.1s'
          }}
        >
          <Card className="mb-0">
            {editingId === plan.id ? (
              <>
                <h4 className="font-bold mb-3">Editar plano</h4>
                <PlanForm
                  initial={{ title: plan.title, price: plan.price, badge: plan.badge, features: [...plan.features], template: plan.template }}
                  onSave={p => { updatePlan(plan.id, p); setEditingId(null); }}
                  onCancel={() => setEditingId(null)}
                />
              </>
            ) : (
              <>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      title="Arrastar para reordenar"
                      style={{ cursor: 'grab', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1, userSelect: 'none' }}
                    >⠿</span>
                    <div>
                      <p className="font-bold m-0">{plan.title}</p>
                      {plan.badge && (
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange-hover)', padding: '2px 8px', borderRadius: 20, display: 'inline-block', marginTop: 4 }}>
                          {plan.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: 'var(--primary-orange)' }}>{plan.price}</span>
                    <button className="btn-icon" style={{ width: 32, height: 32 }} onClick={() => setEditingId(plan.id)}><Edit2 size={15} /></button>
                    <button className="btn-icon" style={{ width: 32, height: 32, color: '#e53e3e' }} onClick={() => deletePlan(plan.id)}><Trash2 size={15} /></button>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} className="flex flex-col gap-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check size={14} color="var(--status-active)" />{f}
                    </li>
                  ))}
                </ul>
                {plan.template && (
                  <p className="text-xs text-muted mt-2 m-0" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Sparkles size={12} /> Tem template pré-configurado
                  </p>
                )}
              </>
            )}
          </Card>
        </div>
      ))}
    </div>
  );
}

// ─── Tab: Configurações ───────────────────────────────────────────────────────

function ConfiguracoesTab() {
  const { 
    cutoffTime, updateCutoffTime, 
    whatsappTemplate, updateWhatsappTemplate,
    lowBalanceTemplate, updateLowBalanceTemplate,
    isBakeryClosed, toggleBakeryStatus 
  } = useSettings();
  
  const [tempTime, setTempTime] = useState(cutoffTime);
  const [tempWH, setTempWH] = useState(whatsappTemplate);
  const [tempLB, setTempLB] = useState(lowBalanceTemplate);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateCutoffTime(tempTime);
    updateWhatsappTemplate(tempWH);
    updateLowBalanceTemplate(tempLB);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <Clock size={18} /> Hora de Fecho (Cutoff)
        </h4>
        <p className="text-sm text-muted mb-4">
          Define a hora limite para os clientes alterarem as suas encomendas do dia seguinte.
        </p>
        
        <div className="flex gap-3 items-end">
          <div style={{ flex: 1 }}>
            <label className="text-xs font-bold text-muted mb-1 block uppercase">Hora Limite</label>
            <input 
              type="time" 
              style={inputStyle} 
              value={tempTime} 
              onChange={e => setTempTime(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card>
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <MessageCircle size={18} /> Mensagem WhatsApp
        </h4>
        <p className="text-sm text-muted mb-4">
          Personalize a mensagem automática enviada após a entrega. Use <code style={{ fontWeight: 'bold' }}>{"{time}"}</code> para o horário.
        </p>
        <textarea
          style={{ ...inputStyle, minHeight: '120px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem' }}
          value={tempWH}
          onChange={e => setTempWH(e.target.value)}
        />
      </Card>

      <Card>
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <AlertCircle size={18} /> Mensagem de Saldo Insuficiente
        </h4>
        <p className="text-sm text-muted mb-4">
          Personalize o lembrete enviado quando o saldo é insuficiente. Use <code style={{ fontWeight: 'bold' }}>{"{name}"}</code>, <code style={{ fontWeight: 'bold' }}>{"{date}"}</code> e <code style={{ fontWeight: 'bold' }}>{"{link}"}</code>.
        </p>
        <textarea
          style={{ ...inputStyle, minHeight: '120px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem' }}
          value={tempLB}
          onChange={e => setTempLB(e.target.value)}
        />
      </Card>

      <Card style={{ borderColor: isBakeryClosed ? '#e53e3e' : 'var(--border-color)' }}>
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold m-0 flex items-center gap-2">
            <Coffee size={18} /> Férias / Fecho
          </h4>
          <button 
            className={`btn ${isBakeryClosed ? 'btn-primary' : 'btn-secondary'}`}
            style={{ width: 'auto', padding: '6px 12px', backgroundColor: isBakeryClosed ? '#e53e3e' : '' }}
            onClick={toggleBakeryStatus}
          >
            <Power size={16} /> {isBakeryClosed ? 'Reabrir' : 'Fechar'}
          </button>
        </div>
        <p className="text-sm text-muted m-0">
          Quando ativa, os clientes verão um aviso no dashboard e não poderão agendar novas entregas.
        </p>
      </Card>

      <div className="sticky bottom-4">
        <button 
          className="btn btn-primary w-full shadow-lg" 
          onClick={handleSave}
          style={{ height: '50px' }}
        >
          {saved ? <CheckCircle size={20} /> : 'Guardar Alterações'}
        </button>
      </div>
    </div>
  );
}



// ─── Tab: Utilizadores ────────────────────────────────────────────────────────

// ─── Tab: Marca & Estilo ───────────────────────────────────────────────────

function BrandingTab() {
  const { 
    appName, logo, primaryColor, secondaryColor, backgroundColor, updateBranding 
  } = useSettings();

  const [form, setForm] = useState({ appName, logo, primaryColor, secondaryColor, backgroundColor });
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, logo: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateBranding(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Editor Form */}
        <div className="flex-1 flex flex-col gap-4">
          <Card>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Sparkles size={18} /> Nome & Logo
            </h4>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-muted mb-1 block uppercase">Nome da Aplicação</label>
                <input 
                  style={inputStyle} 
                  placeholder="Ex: Padaria Silva" 
                  value={form.appName}
                  onChange={e => setForm(f => ({ ...f, appName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted mb-1 block uppercase">Logótipo</label>
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => fileRef.current?.click()}
                    style={{
                      width: 64, height: 64, borderRadius: 12, border: '2px dashed var(--border-color)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      overflow: 'hidden', backgroundColor: 'var(--bg-white)'
                    }}
                  >
                    {form.logo ? (
                      <img src={form.logo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <Plus size={20} className="text-muted" />
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/png,image/svg+xml" style={{ display: 'none' }} onChange={handleLogoUpload} />
                  <div className="flex-1">
                    <p className="text-xs text-muted m-0">Recomendado: PNG ou SVG, 512x512px.</p>
                    {form.logo && (
                      <button 
                        className="text-xs font-bold mt-1" 
                        style={{ color: '#e53e3e', padding: 0 }}
                        onClick={() => setForm(f => ({ ...f, logo: null }))}
                      >
                        Remover logo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Sparkles size={18} /> Cores da Marca
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-muted mb-1 block uppercase">Primária</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={form.primaryColor} 
                    onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                    style={{ width: 40, height: 40, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <input 
                    style={{ ...inputStyle, padding: '8px 10px', fontSize: '0.8rem' }} 
                    value={form.primaryColor}
                    onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted mb-1 block uppercase">Secundária</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={form.secondaryColor} 
                    onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))}
                    style={{ width: 40, height: 40, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <input 
                    style={{ ...inputStyle, padding: '8px 10px', fontSize: '0.8rem' }} 
                    value={form.secondaryColor}
                    onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted mb-1 block uppercase">Fundo</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={form.backgroundColor} 
                    onChange={e => setForm(f => ({ ...f, backgroundColor: e.target.value }))}
                    style={{ width: 40, height: 40, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <input 
                    style={{ ...inputStyle, padding: '8px 10px', fontSize: '0.8rem' }} 
                    value={form.backgroundColor}
                    onChange={e => setForm(f => ({ ...f, backgroundColor: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="flex-1">
          <label className="text-xs font-bold text-muted mb-2 block uppercase">Pré-visualização em tempo real</label>
          <div 
            style={{ 
              borderRadius: 'var(--radius-lg)', 
              border: '2px solid var(--border-color)', 
              backgroundColor: form.backgroundColor,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            {/* Mock Header */}
            <div style={{ backgroundColor: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
              <div className="flex items-center gap-2">
                <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: form.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {form.logo ? <img src={form.logo} style={{ width: '80%', height: '80%' }} /> : <Coffee size={14} color="white" />}
                </div>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: form.secondaryColor }}>{form.appName}</span>
              </div>
              <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#eee' }}></div>
            </div>

            <div style={{ padding: '16px' }} className="flex flex-col gap-4">
              {/* Mock Content */}
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'white', border: '1px solid #eee' }}>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', color: form.secondaryColor, marginBottom: '8px' }}>Exemplo de Widget</p>
                <div style={{ height: 8, width: '60%', backgroundColor: form.primaryColor, borderRadius: 4, opacity: 0.2, marginBottom: '4px' }}></div>
                <div style={{ height: 8, width: '40%', backgroundColor: form.primaryColor, borderRadius: 4, opacity: 0.1 }}></div>
              </div>

              <button 
                style={{ 
                  backgroundColor: form.primaryColor, 
                  color: 'white', 
                  borderRadius: '20px', 
                  padding: '8px', 
                  fontSize: '0.8rem', 
                  fontWeight: 700 
                }}
              >
                Botão Exemplo
              </button>

              <div className="flex gap-2">
                <div style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: 'white', border: '1px solid #eee', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🥐</div>
                  <p style={{ fontWeight: 700, fontSize: '0.75rem', color: form.secondaryColor, margin: 0 }}>Produto</p>
                  <p style={{ fontSize: '0.7rem', color: form.primaryColor, fontWeight: 800, margin: 0 }}>1.20€</p>
                </div>
                <div style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: 'white', border: '1px solid #eee', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🥖</div>
                  <p style={{ fontWeight: 700, fontSize: '0.75rem', color: form.secondaryColor, margin: 0 }}>Produto</p>
                  <p style={{ fontSize: '0.7rem', color: form.primaryColor, fontWeight: 800, margin: 0 }}>0.25€</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-4">
        <button 
          className="btn btn-primary w-full shadow-lg" 
          onClick={handleSave}
          style={{ height: '50px' }}
        >
          {saved ? <CheckCircle size={20} /> : 'Guardar Alterações Visuais'}
        </button>
      </div>
    </div>
  );
}

function UtilizadoresTab() {
  const { users, updateUserRole } = useAuth();
  const [search, setSearch] = useState('');

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const ROLES: { id: Role; label: string; color: string }[] = [
    { id: 'Customer', label: 'Cliente', color: 'var(--text-muted)' },
    { id: 'Admin', label: 'Admin', color: 'var(--primary-orange)' },
    { id: 'Delivery', label: 'Entregador', color: '#3182ce' },
    { id: 'Baker', label: 'Padeiro', color: '#d69e2e' }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          style={{ ...inputStyle, paddingLeft: 38 }}
          placeholder="Pesquisar utilizadores..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(u => (
          <Card key={u.id} className="mb-0" style={{ padding: '1rem' }}>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <p className="font-bold m-0 text-lg">{u.name}</p>
                <p className="text-sm text-muted m-0">{u.email} {u.apt && `• ${u.apt}`}</p>
              </div>
              <div>
                <select
                  aria-label="Função"
                  style={{
                    padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--border-color)',
                    backgroundColor: 'var(--bg-cream)', outline: 'none', fontWeight: 600,
                    color: ROLES.find(r => r.id === u.role)?.color || 'var(--text-main)',
                    minWidth: '140px'
                  }}
                  value={u.role}
                  onChange={e => updateUserRole(u.id, e.target.value as Role)}
                >
                  {ROLES.map(r => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted">Nenhum utilizador encontrado.</p>}
      </div>
    </div>
  );
}

// ─── Main AdminPage ───────────────────────────────────────────────────────────

export const AdminPage = () => {
  const [tab, setTab] = useState<Tab>('produtos');

  const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'planos', label: 'Planos', icon: BookOpen },
    { id: 'entregas', label: 'Entregas', icon: Truck },
    { id: 'carteiras', label: 'Carteiras', icon: Wallet },
    { id: 'utilizadores', label: 'Utilizadores', icon: Users },
    { id: 'branding', label: 'Marca', icon: Sparkles },
    { id: 'configuracoes', label: 'Definições', icon: Settings },
  ];

  return (
    <Layout>
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">Painel da Padaria</h2>
        <p className="text-sm text-muted">Gestão de produtos, entregas e saldos.</p>
      </div>

      {/* Tab bar */}
      <div style={{ overflowX: 'auto', marginBottom: '1.25rem', marginLeft: '-4px', marginRight: '-4px' }}>
        <div className="flex gap-1" style={{ backgroundColor: 'var(--bg-cream)', padding: '4px', borderRadius: '14px', width: 'max-content', minWidth: '100%' }}>
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '9px 10px', borderRadius: '10px',
                  border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 600,
                  backgroundColor: tab === t.id ? 'var(--bg-white)' : 'transparent',
                  color: tab === t.id ? 'var(--primary-orange)' : 'var(--text-muted)',
                  boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  minWidth: '64px'
                }}
              >
                <Icon size={19} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {tab === 'produtos' && <ProdutosTab />}
      {tab === 'planos' && <PlanosTab />}
      {tab === 'entregas' && <EntregasTab />}
      {tab === 'carteiras' && <CarteirasTab />}
      {tab === 'utilizadores' && <UtilizadoresTab />}
      {tab === 'configuracoes' && <ConfiguracoesTab />}
      {tab === 'branding' && <BrandingTab />}
    </Layout>
  );
};
