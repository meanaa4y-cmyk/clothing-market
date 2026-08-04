import { useEffect, useRef } from 'react';
import { loadFirebase } from '../loadFirebase';
import '../styles/admin.css';

// This page preserves the original admin.html markup, styling and logic 1:1,
// mounted as a React component so it lives inside the Vite/React project
// instead of a standalone HTML file. Firestore connection is shared via
// src/firebaseConfig.js + src/loadFirebase.js.

const BODY_HTML = `<div id="connBanner" class="hide">⚠️ Backend not configured &mdash; paste your Firebase config into admin.html and / to enable real, cross-device syncing.</div>
<div id="toastWrap"></div>

<div id="loginGate">
  <div class="login-card">
    <div class="eyebrow">Libas Clothing Store</div>
    <h2>Admin Login</h2>
    <div style="font-size:12.5px;color:var(--muted);">Enter your admin password to manage stock and orders.</div>
    <input type="password" id="passInput" placeholder="Admin password" autofocus>
    <div class="login-err" id="loginErr"></div>
    <button class="btn" onclick="tryLogin()">Login</button>
    <div style="font-size:11px;color:var(--muted);margin-top:12px;">Default password: <b>Naveed123</b> &mdash; change it anytime from the Settings tab inside the admin panel.</div>
  </div>
</div>

<div id="adminApp" style="display:none;">
<header>
  <div class="hdr-inner">
    <div class="brand">
      <svg class="brand-mark" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="var(--leaf)" stroke-width="2"/><path d="M20 30V16M20 16c0-5 4-9 9-9-1 6-4 9-9 9Zm0 0c0-5-4-9-9-9 1 6 4 9 9 9Z" stroke="var(--leaf)" stroke-width="2" stroke-linejoin="round"/></svg>
      Libas Admin
    </div>
    <div class="hdr-tabs">
      <button class="hdr-tab active" id="tabBtnOrders" onclick="switchTab('orders')">Orders <span class="bell-badge" id="ordersBadge">0</span></button>
      <button class="hdr-tab" id="tabBtnStock" onclick="switchTab('stock')">Products &amp; Stock</button>
      <button class="hdr-tab" id="tabBtnSettings" onclick="switchTab('settings')">Settings</button>
    </div>
    <button class="icon-btn" id="themeToggle" title="Toggle dark mode"></button>
    <button class="btn ghost small" onclick="logout()">Log out</button>
  </div>
</header>

<div class="container">

  <div class="stats" id="statsRow"></div>

  <!-- ORDERS TAB -->
  <div class="tab-panel active" id="panelOrders">
    <div class="toolbar">
      <select id="orderFilter" onchange="renderOrders()">
        <option value="all">All orders</option>
        <option value="new">New</option>
        <option value="confirmed">Confirmed</option>
        <option value="done">Completed</option>
      </select>
      <div class="spacer"></div>
      <a href="/" class="btn ghost small" target="_blank">View storefront &rarr;</a>
    </div>
    <div id="ordersList"></div>
  </div>

  <!-- STOCK TAB -->
  <div class="tab-panel" id="panelStock">
    <div class="toolbar">
      <input type="text" id="searchBox" placeholder="Search products..." oninput="renderProducts()">
      <select id="catFilter" onchange="renderProducts()"></select>
      <div class="spacer"></div>
      <button class="btn ghost small" onclick="resetDefaults()">Reset to defaults</button>
      <button class="btn small" onclick="openAddModal()">+ Add product</button>
    </div>
    <div class="p-grid" id="productsGrid"></div>
  </div>

  <!-- SETTINGS TAB -->
  <div class="tab-panel" id="panelSettings">
    <div style="max-width:420px;">
      <div class="login-card" style="width:auto;padding:24px;">
        <h3>Change admin password</h3>
        <div style="font-size:12.5px;color:var(--muted);">You'll need this password next time you log in to this admin panel.</div>
        <div class="field" style="margin-top:14px;"><label>Current password</label><input type="password" id="s-current"></div>
        <div class="field"><label>New password</label><input type="password" id="s-new"></div>
        <div class="field"><label>Confirm new password</label><input type="password" id="s-confirm"></div>
        <div class="login-err" id="settingsErr"></div>
        <div class="login-err" id="settingsOk" style="color:var(--leaf);"></div>
        <button class="btn" onclick="changePassword()">Save new password</button>
      </div>
    </div>
  </div>

</div>
</div>

<!-- Add/Edit product modal -->
<div id="modalOverlay">
  <div class="modal-card">
    <h3 id="modalTitle">Add product</h3>
    <div class="field"><label>Product name</label><input id="f-name" placeholder="e.g. Urea (46% N)"></div>
    <div class="field-row">
      <div class="field"><label>Category</label><select id="f-cat"></select></div>
      <div class="field"><label>Icon style</label>
        <select id="f-icon">
          <option value="bag">Fertilizer bag</option>
          <option value="sack">Feed sack</option>
          <option value="spray">Spray bottle</option>
          <option value="seed">Seed</option>
          <option value="tool">Tool</option>
        </select>
      </div>
    </div>
    <div class="field-row">
      <div class="field"><label>Price (Rs)</label><input id="f-price" type="number" min="0" placeholder="0"></div>
      <div class="field"><label>Compare-at price (optional)</label><input id="f-compare" type="number" min="0" placeholder="0"></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Unit</label><input id="f-unit" placeholder="e.g. 50kg bag"></div>
      <div class="field"><label>Stock quantity</label><input id="f-stock" type="number" min="0" placeholder="0"></div>
    </div>
    <div class="field"><label>Description</label><textarea id="f-desc" rows="2"></textarea></div>
    <div class="field"><label>Product photo (optional)</label><input id="f-img" type="file" accept="image/*" onchange="handleImgUpload(event)"><img id="f-img-preview" style="max-width:100%;margin-top:8px;border-radius:4px;display:none;"></div>
    <div style="display:flex;gap:10px;margin-top:16px;">
      <button class="btn" onclick="saveProductForm()">Save product</button>
      <button class="btn ghost" onclick="closeModal()">Cancel</button>
    </div>
  </div>
</div>`;

export default function Admin() {
  const containerRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    loadFirebase().then((db) => {
      window.db = db;
      const script = document.createElement('script');
      script.text = "/* ============ constants shared with / ============ */\nconst PRODUCTS_KEY = 'kisaan_products_v2';\nconst ORDERS_KEY = 'kisaan_orders_v1';\nconst THEME_KEY = 'kisaan_theme_v1';\nconst PASS_KEY = 'kisaan_admin_pass_v1';\nconst SESSION_KEY = 'kisaan_admin_session_v1';\n\nconst ICONS = {\n  bag: `<svg viewBox=\"0 0 64 64\"><path d=\"M14 22h36l4 34a4 4 0 0 1-4 4.4H14a4 4 0 0 1-4-4.4l4-34Z\" fill=\"var(--wheat)\" opacity=\".85\"/><path d=\"M22 22c0-8 4.5-13 10-13s10 5 10 13\" stroke=\"var(--soil)\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"/></svg>`,\n  sack: `<svg viewBox=\"0 0 64 64\"><path d=\"M16 24c0-6 7-11 16-11s16 5 16 11l3 28a4 4 0 0 1-4 4.5H17a4 4 0 0 1-4-4.5l3-28Z\" fill=\"var(--leaf)\" opacity=\".8\"/></svg>`,\n  spray: `<svg viewBox=\"0 0 64 64\"><rect x=\"24\" y=\"26\" width=\"16\" height=\"30\" rx=\"3\" fill=\"var(--clay)\" opacity=\".85\"/><rect x=\"27\" y=\"14\" width=\"10\" height=\"14\" rx=\"2\" fill=\"var(--soil)\" opacity=\".7\"/></svg>`,\n  seed: `<svg viewBox=\"0 0 64 64\"><path d=\"M32 12c10 4 18 14 18 26a18 18 0 1 1-36 0c0-12 8-22 18-26Z\" fill=\"var(--wheat)\" opacity=\".85\"/></svg>`,\n  tool: `<svg viewBox=\"0 0 64 64\"><rect x=\"29\" y=\"10\" width=\"6\" height=\"30\" rx=\"2\" fill=\"var(--soil)\" opacity=\".7\"/><path d=\"M18 40c0-8 6-14 14-14s14 6 14 14\" stroke=\"var(--leaf)\" stroke-width=\"5\" fill=\"none\" stroke-linecap=\"round\"/></svg>`,\n};\nconst CATEGORIES = [\n  {id:'men', name:'Men (Mardana)'},\n  {id:'women', name:'Women (Zanana)'},\n  {id:'kids', name:'Kids'},\n  {id:'footwear', name:'Footwear (Joote)'},\n  {id:'accessories', name:'Accessories'},\n];\n\n/* ============ product store (real Firestore backend, shared with /) ============ */\nlet PRODUCTS = [];\nlet ORDERS = [];\nlet db = null;\nlet firebaseReady = false;\nlet knownOrderIds = new Set();\nlet firstOrdersLoad = true;\n\nfunction money(n){ return 'Rs. ' + Number(n||0).toLocaleString('en-PK'); }\n\nfunction isFirebaseConfigured(){\n  const c = window.FIREBASE_CONFIG || {};\n  return c.apiKey && !String(c.apiKey).includes('PASTE');\n}\n\nfunction showToast(msg){\n  const wrap = document.getElementById('toastWrap');\n  const el = document.createElement('div');\n  el.className = 'toast';\n  el.textContent = msg;\n  wrap.appendChild(el);\n  requestAnimationFrame(()=> el.classList.add('show'));\n  setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>el.remove(), 350); }, 6000);\n}\n\nfunction initFirebase(){\n  if(!isFirebaseConfigured()){\n    document.getElementById('connBanner').classList.remove('hide');\n    return;\n  }\n  firebase.initializeApp(window.FIREBASE_CONFIG);\n  db = firebase.firestore();\n  firebaseReady = true;\n\n  // Live product sync\n  db.collection('products').onSnapshot((snap)=>{\n    PRODUCTS = snap.docs.map(d=>d.data());\n    renderStats(); renderProducts();\n  }, (err)=>{ console.error(err); document.getElementById('connBanner').classList.remove('hide'); });\n\n  // Live order sync + toast/badge on new orders\n  db.collection('orders').orderBy('date','desc').onSnapshot((snap)=>{\n    ORDERS = snap.docs.map(d=>d.data());\n    if(!firstOrdersLoad){\n      snap.docChanges().forEach(change=>{\n        if(change.type==='added' && !knownOrderIds.has(change.doc.id)){\n          const o = change.doc.data();\n          showToast(`New order received \u2014 ${o.name} \u00b7 ${money(o.total)}`);\n          if(document.getElementById('panelOrders') && !document.getElementById('panelOrders').classList.contains('active')){\n            const badge = document.getElementById('ordersBadge');\n            badge.textContent = String(Number(badge.textContent||'0')+1);\n            badge.classList.add('show');\n          }\n        }\n      });\n    }\n    knownOrderIds = new Set(snap.docs.map(d=>d.id));\n    firstOrdersLoad = false;\n    renderStats(); renderOrders();\n  }, (err)=>{ console.error(err); document.getElementById('connBanner').classList.remove('hide'); });\n}\n\nasync function saveProducts(){\n  if(!firebaseReady) return;\n  const batch = db.batch();\n  PRODUCTS.forEach(p=> batch.set(db.collection('products').doc(p.id), p));\n  await batch.commit();\n}\nasync function saveOrders(){\n  if(!firebaseReady) return;\n  const batch = db.batch();\n  ORDERS.forEach(o=> batch.set(db.collection('orders').doc(o.id), o));\n  await batch.commit();\n}\n\n/* ============ login (password stored in Firestore, shared across devices) ============ */\nasync function currentPass(){\n  if(!firebaseReady) return localStorage.getItem(PASS_KEY) || 'Naveed123';\n  try{\n    const doc = await db.collection('settings').doc('admin').get();\n    if(doc.exists && doc.data().password) return doc.data().password;\n    await db.collection('settings').doc('admin').set({ password: 'Naveed123' });\n    return 'Naveed123';\n  }catch(e){ return localStorage.getItem(PASS_KEY) || 'Naveed123'; }\n}\nasync function tryLogin(){\n  const val = document.getElementById('passInput').value;\n  const btn = event?.target;\n  if(btn) btn.disabled = true;\n  const pass = await currentPass();\n  if(btn) btn.disabled = false;\n  if(val === pass){\n    sessionStorage.setItem(SESSION_KEY, '1');\n    boot();\n  } else {\n    document.getElementById('loginErr').textContent = 'Incorrect password. Try again.';\n  }\n}\ndocument.getElementById('passInput').addEventListener('keydown', e=>{ if(e.key==='Enter') tryLogin(); });\nfunction logout(){ sessionStorage.removeItem(SESSION_KEY); location.reload(); }\nasync function changePassword(){\n  const cur = document.getElementById('s-current').value;\n  const next = document.getElementById('s-new').value;\n  const confirmVal = document.getElementById('s-confirm').value;\n  const errEl = document.getElementById('settingsErr');\n  const okEl = document.getElementById('settingsOk');\n  errEl.textContent = ''; okEl.textContent = '';\n  const pass = await currentPass();\n  if(cur !== pass){ errEl.textContent = 'Current password is incorrect.'; return; }\n  if(!next || next.length < 4){ errEl.textContent = 'New password must be at least 4 characters.'; return; }\n  if(next !== confirmVal){ errEl.textContent = 'New password and confirmation do not match.'; return; }\n  if(firebaseReady){ await db.collection('settings').doc('admin').set({ password: next }); }\n  else { localStorage.setItem(PASS_KEY, next); }\n  document.getElementById('s-current').value = '';\n  document.getElementById('s-new').value = '';\n  document.getElementById('s-confirm').value = '';\n  okEl.textContent = 'Password updated successfully \u2014 this now applies on every device.';\n}\n\n/* ============ tabs ============ */\nfunction switchTab(tab){\n  document.getElementById('panelOrders').classList.toggle('active', tab==='orders');\n  document.getElementById('panelStock').classList.toggle('active', tab==='stock');\n  document.getElementById('panelSettings').classList.toggle('active', tab==='settings');\n  document.getElementById('tabBtnOrders').classList.toggle('active', tab==='orders');\n  document.getElementById('tabBtnStock').classList.toggle('active', tab==='stock');\n  document.getElementById('tabBtnSettings').classList.toggle('active', tab==='settings');\n  if(tab==='orders'){\n    const badge = document.getElementById('ordersBadge');\n    badge.textContent = '0';\n    badge.classList.remove('show');\n  }\n}\n\n/* ============ stats ============ */\nfunction renderStats(){\n  const total = PRODUCTS.length;\n  const outOfStock = PRODUCTS.filter(p=>(p.stock??0)<=0).length;\n  const lowStock = PRODUCTS.filter(p=>(p.stock??0)>0 && (p.stock??0)<=5).length;\n  const newOrders = ORDERS.filter(o=>o.status==='new').length;\n  document.getElementById('statsRow').innerHTML = `\n    <div class=\"stat-card\"><div class=\"n\">${total}</div><div class=\"l\">Total products</div></div>\n    <div class=\"stat-card ${lowStock?'warn':''}\"><div class=\"n\">${lowStock}</div><div class=\"l\">Low stock (&le;5)</div></div>\n    <div class=\"stat-card ${outOfStock?'warn':''}\"><div class=\"n\">${outOfStock}</div><div class=\"l\">Out of stock</div></div>\n    <div class=\"stat-card ${newOrders?'warn':''}\"><div class=\"n\">${newOrders}</div><div class=\"l\">New orders</div></div>\n  `;\n}\n\n/* ============ ORDERS ============ */\nfunction renderOrders(){\n  const filter = document.getElementById('orderFilter').value;\n  const list = document.getElementById('ordersList');\n  let orders = ORDERS;\n  if(filter!=='all') orders = orders.filter(o=>o.status===filter);\n  if(!orders.length){\n    list.innerHTML = `<div class=\"empty-note\">No orders here yet. New orders placed on the storefront will show up automatically.</div>`;\n    return;\n  }\n  list.innerHTML = orders.map(o=>`\n    <div class=\"order-card\">\n      <div class=\"order-head\">\n        <div>\n          <div class=\"order-id\">${o.id} &middot; ${new Date(o.date).toLocaleString('en-PK')}</div>\n          <div class=\"order-cust\">${o.name}</div>\n          <div class=\"order-meta\">${o.phone} &middot; ${o.address}</div>\n          ${o.notes ? `<div class=\"order-meta\">Note: ${o.notes}</div>` : ''}\n        </div>\n        <div style=\"display:flex;gap:6px;flex-wrap:wrap;\">\n          <span class=\"badge ${o.status}\">${o.status}</span>\n          <span class=\"badge ${o.fulfillment}\">${o.fulfillment}</span>\n        </div>\n      </div>\n      <div class=\"order-items\">\n        ${o.items.map(it=>`<div><span>${it.name} &times; ${it.qty}</span><span>${money(it.price*it.qty)}</span></div>`).join('')}\n      </div>\n      <div class=\"order-total\">Total: ${money(o.total)}</div>\n      <div class=\"order-controls\">\n        <label style=\"font-size:11.5px;color:var(--muted);\">Fulfillment:</label>\n        <select class=\"status-select\" onchange=\"setFulfillment('${o.id}', this.value)\">\n          <option value=\"pending\" ${o.fulfillment==='pending'?'selected':''}>Pending</option>\n          <option value=\"pickup\" ${o.fulfillment==='pickup'?'selected':''}>Pickup</option>\n          <option value=\"delivery\" ${o.fulfillment==='delivery'?'selected':''}>Delivery</option>\n        </select>\n        <label style=\"font-size:11.5px;color:var(--muted);\">Status:</label>\n        <select class=\"status-select\" onchange=\"setOrderStatus('${o.id}', this.value)\">\n          <option value=\"new\" ${o.status==='new'?'selected':''}>New</option>\n          <option value=\"confirmed\" ${o.status==='confirmed'?'selected':''}>Confirmed</option>\n          <option value=\"done\" ${o.status==='done'?'selected':''}>Completed</option>\n        </select>\n        <button class=\"btn ghost small\" onclick=\"deleteOrder('${o.id}')\">Delete</button>\n      </div>\n    </div>\n  `).join('');\n}\nfunction setFulfillment(id, val){ const o=ORDERS.find(x=>x.id===id); if(o){ o.fulfillment=val; saveOrders(); renderOrders(); } }\nfunction setOrderStatus(id, val){ const o=ORDERS.find(x=>x.id===id); if(o){ o.status=val; saveOrders(); renderOrders(); renderStats(); } }\nasync function deleteOrder(id){\n  if(!confirm('Delete this order record?')) return;\n  ORDERS = ORDERS.filter(x=>x.id!==id);\n  if(firebaseReady) await db.collection('orders').doc(id).delete();\n  renderOrders(); renderStats();\n}\n\n/* ============ PRODUCTS / STOCK ============ */\nfunction populateCatFilter(){\n  const sel = document.getElementById('catFilter');\n  sel.innerHTML = `<option value=\"all\">All categories</option>` + CATEGORIES.map(c=>`<option value=\"${c.id}\">${c.name}</option>`).join('');\n}\nfunction stockPill(p){\n  const s = p.stock ?? 0;\n  if(s<=0) return `<span class=\"stock-pill out\">Out of stock</span>`;\n  if(s<=5) return `<span class=\"stock-pill low\">${s} left</span>`;\n  return `<span class=\"stock-pill ok\">${s} in stock</span>`;\n}\nfunction renderProducts(){\n  const q = (document.getElementById('searchBox').value||'').toLowerCase();\n  const cat = document.getElementById('catFilter').value;\n  let items = PRODUCTS.filter(p=>p.name.toLowerCase().includes(q));\n  if(cat!=='all') items = items.filter(p=>p.cat===cat);\n  const grid = document.getElementById('productsGrid');\n  if(!items.length){ grid.innerHTML = `<div class=\"empty-note\">No products match.</div>`; return; }\n  grid.innerHTML = items.map(p=>`\n    <div class=\"p-admin-card\">\n      <div class=\"p-admin-media\">\n        ${p.img ? `<img src=\"${p.img}\">` : ICONS[p.icon]}\n        <label class=\"imgbtn\">Change photo<input type=\"file\" accept=\"image/*\" style=\"display:none\" onchange=\"uploadStockImg(event,'${p.id}')\"></label>\n      </div>\n      <div class=\"p-admin-body\">\n        <div class=\"p-admin-cat\">${CATEGORIES.find(c=>c.id===p.cat)?.name||p.cat}</div>\n        <input class=\"p-admin-name\" value=\"${p.name.replace(/\"/g,'&quot;')}\" onchange=\"updateField('${p.id}','name',this.value)\">\n        <div class=\"p-admin-row\">\n          <div class=\"field\"><label>Price</label><input type=\"number\" value=\"${p.price}\" onchange=\"updateField('${p.id}','price',Number(this.value))\"></div>\n          <div class=\"field\"><label>Compare-at</label><input type=\"number\" value=\"${p.compareAt??''}\" onchange=\"updateField('${p.id}','compareAt',this.value===''?null:Number(this.value))\"></div>\n        </div>\n        <div class=\"p-admin-row\">\n          <div class=\"field\"><label>Unit</label><input value=\"${p.unit}\" onchange=\"updateField('${p.id}','unit',this.value)\"></div>\n          <div class=\"field\"><label>Stock qty</label><input type=\"number\" value=\"${p.stock??0}\" onchange=\"updateField('${p.id}','stock',Math.max(0,Number(this.value)))\"></div>\n        </div>\n        <div class=\"p-admin-foot\">\n          ${stockPill(p)}\n          <div style=\"display:flex;gap:6px;\">\n            <button class=\"btn ghost small\" onclick=\"adjustStock('${p.id}',-1)\">&minus;1</button>\n            <button class=\"btn ghost small\" onclick=\"adjustStock('${p.id}',1)\">+1</button>\n            <button class=\"btn danger small\" onclick=\"deleteProduct('${p.id}')\">Delete</button>\n          </div>\n        </div>\n      </div>\n    </div>\n  `).join('');\n}\nfunction updateField(id, field, value){\n  const p = PRODUCTS.find(x=>x.id===id);\n  if(!p) return;\n  p[field] = value;\n  saveProducts();\n  renderStats();\n  renderProducts();\n}\nfunction adjustStock(id, delta){\n  const p = PRODUCTS.find(x=>x.id===id);\n  if(!p) return;\n  p.stock = Math.max(0, (p.stock??0) + delta);\n  saveProducts();\n  renderStats();\n  renderProducts();\n}\nasync function deleteProduct(id){\n  if(!confirm('Remove this product from the store?')) return;\n  PRODUCTS = PRODUCTS.filter(x=>x.id!==id);\n  if(firebaseReady) await db.collection('products').doc(id).delete();\n  renderStats();\n  renderProducts();\n}\nfunction uploadStockImg(e, id){\n  const file = e.target.files[0];\n  if(!file) return;\n  const reader = new FileReader();\n  reader.onload = ()=>{\n    const p = PRODUCTS.find(x=>x.id===id);\n    if(p){ p.img = reader.result; saveProducts(); renderProducts(); }\n  };\n  reader.readAsDataURL(file);\n}\n\n/* ============ add product modal ============ */\nfunction openAddModal(){\n  document.getElementById('modalTitle').textContent = 'Add product';\n  ['f-name','f-price','f-compare','f-unit','f-stock','f-desc'].forEach(id=>document.getElementById(id).value='');\n  document.getElementById('f-img').value='';\n  document.getElementById('f-img-preview').style.display='none';\n  document.getElementById('f-img-preview').removeAttribute('data-url');\n  const catSel = document.getElementById('f-cat');\n  catSel.innerHTML = CATEGORIES.map(c=>`<option value=\"${c.id}\">${c.name}</option>`).join('');\n  document.getElementById('modalOverlay').classList.add('open');\n}\nfunction closeModal(){ document.getElementById('modalOverlay').classList.remove('open'); }\nfunction handleImgUpload(e){\n  const file = e.target.files[0];\n  if(!file) return;\n  const reader = new FileReader();\n  reader.onload = ()=>{\n    const prev = document.getElementById('f-img-preview');\n    prev.src = reader.result;\n    prev.style.display='block';\n    prev.setAttribute('data-url', reader.result);\n  };\n  reader.readAsDataURL(file);\n}\nfunction saveProductForm(){\n  const name = document.getElementById('f-name').value.trim();\n  const price = Number(document.getElementById('f-price').value)||0;\n  if(!name || price<=0){ alert('Please enter a product name and a valid price.'); return; }\n  const cat = document.getElementById('f-cat').value;\n  const compareRaw = document.getElementById('f-compare').value;\n  const unit = document.getElementById('f-unit').value.trim() || 'unit';\n  const stock = Math.max(0, Number(document.getElementById('f-stock').value)||0);\n  const desc = document.getElementById('f-desc').value.trim();\n  const icon = document.getElementById('f-icon').value;\n  const img = document.getElementById('f-img-preview').getAttribute('data-url') || null;\n  const id = name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') + '-' + Date.now().toString(36);\n  PRODUCTS.push({\n    id, cat, name, unit, price,\n    compareAt: compareRaw==='' ? null : Number(compareRaw),\n    icon, img, stock, desc\n  });\n  saveProducts();\n  closeModal();\n  renderStats();\n  renderProducts();\n}\nasync function resetDefaults(){\n  if(!confirm('This will delete all products from the live store. The storefront will reseed the original starter catalog next time it loads. Continue?')) return;\n  if(firebaseReady){\n    const batch = db.batch();\n    PRODUCTS.forEach(p=> batch.delete(db.collection('products').doc(p.id)));\n    await batch.commit();\n  }\n  alert('Products cleared. Open the storefront (/) once to reseed the starter catalog.');\n}\n\n/* ============ theme ============ */\nfunction sunIcon(){ return `<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4\"/></svg>`; }\nfunction moonIcon(){ return `<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z\"/></svg>`; }\nfunction applyTheme(t){\n  document.documentElement.setAttribute('data-theme', t);\n  const btn = document.getElementById('themeToggle');\n  if(btn) btn.innerHTML = t==='dark' ? sunIcon() : moonIcon();\n  localStorage.setItem(THEME_KEY, t);\n}\n\n/* ============ boot ============ */\nfunction boot(){\n  document.getElementById('loginGate').style.display = 'none';\n  document.getElementById('adminApp').style.display = 'block';\n  initFirebase(); // starts real-time listeners; renders will fire as data streams in\n  applyTheme(localStorage.getItem(THEME_KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'));\n  document.getElementById('themeToggle').addEventListener('click', ()=>{\n    const cur = document.documentElement.getAttribute('data-theme')==='dark' ? 'light':'dark';\n    applyTheme(cur);\n  });\n  populateCatFilter();\n  renderStats();\n  renderOrders();\n  renderProducts();\n}\n\nif(sessionStorage.getItem(SESSION_KEY)==='1'){\n  boot();\n} else {\n  document.getElementById('passInput').focus();\n}";
      document.body.appendChild(script);
    });
  }, []);

  return (
    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: BODY_HTML }} />
  );
}
