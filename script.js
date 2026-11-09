// ===================== PENGATURAN TOKO =====================
// Ganti nomor WhatsApp dengan nomor toko yang aktif.
// Gunakan format kode negara tanpa tanda +, contoh 6281234567890.
const STORE = {
  whatsapp: "6283193887212",
  phoneDisplay: "0831-9388-7212",
  address: "Alamat Toko Kue Naila, JL. Panorama Raya, Blok A No 4, Kaliwadas, Sumber, Cirebon"
};

// Data produk contoh. Silakan ganti nama, harga, deskripsi, dan foto sesuai produk asli.
const products = [
  {id:1,name:"Classic Chocolate Cake",category:"Cake",price:85000,description:"Cake cokelat lembut dengan rasa cokelat yang kaya.",tag:"BEST SELLER",image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"},
  {id:2,name:"Strawberry Shortcake",category:"Cake",price:95000,description:"Perpaduan cake lembut, krim, dan stroberi.",tag:"FRESH",image:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80"},
  {id:3,name:"Croissant Butter",category:"Roti",price:18000,description:"Pastry berlapis dengan aroma butter yang harum.",tag:"FAVORITE",image:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80"},
  {id:4,name:"Chocolate Cookies",category:"Cookies",price:25000,description:"Cookies renyah dengan potongan cokelat.",tag:"HOMEMADE",image:"https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80"},
  {id:5,name:"Cupcake Vanilla",category:"Dessert",price:15000,description:"Cupcake vanilla dengan topping krim manis.",tag:"SWEET",image:"https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=800&q=80"},
  {id:6,name:"Cheesecake Slice",category:"Dessert",price:30000,description:"Cheesecake creamy dengan tekstur lembut.",tag:"NEW",image:"https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=800&q=80"}
];

const rupiah = value => new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(value);
let activeCategory = "Semua";
let cart = JSON.parse(localStorage.getItem("nailaCart") || "[]");
let authMode = "login";
let currentUser = JSON.parse(localStorage.getItem("nailaCurrentUser") || "null");

const productGrid = document.getElementById("productGrid");
const cartOverlay = document.getElementById("cartOverlay");
const authOverlay = document.getElementById("authOverlay");
const toast = document.getElementById("toast");

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(()=>toast.classList.remove("show"),2500);
}
function saveCart(){ localStorage.setItem("nailaCart",JSON.stringify(cart)); renderCart(); }
function renderProducts(){
  const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
  const filtered = products.filter(p => (activeCategory === "Semua" || p.category === activeCategory) && (p.name.toLowerCase().includes(keyword) || p.description.toLowerCase().includes(keyword)));
  productGrid.innerHTML = filtered.map(p=>`
    <article class="product-card">
      <div class="product-photo"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span><button class="add-button" data-add="${p.id}" aria-label="Tambah ${p.name} ke keranjang">+</button></div>
      <div class="product-info"><div class="product-info-top"><div><h3>${p.name}</h3><p>${p.description}</p></div><span class="product-price">${rupiah(p.price)}</span></div></div>
    </article>`).join("");
  document.getElementById("emptyState").classList.toggle("hidden",filtered.length>0);
}
function addToCart(id){
  const item = cart.find(x=>x.id===id);
  if(item) item.qty += 1; else cart.push({id,qty:1});
  saveCart(); showToast("Produk ditambahkan ke keranjang.");
}
function renderCart(){
  const count = cart.reduce((sum,item)=>sum+item.qty,0);
  document.getElementById("cartCount").textContent = count;
  const container = document.getElementById("cartItems");
  if(!cart.length){container.innerHTML='<p class="empty-state">Keranjangmu masih kosong. Yuk, pilih kue favoritmu!</p>';}
  else container.innerHTML = cart.map(item=>{
    const p=products.find(product=>product.id===item.id); if(!p) return "";
    return `<div class="cart-row"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><small>${rupiah(p.price)}</small><div class="quantity"><button data-qty="${p.id}" data-change="-1">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-change="1">+</button></div></div><button class="remove-item" data-remove="${p.id}">Hapus</button></div>`;
  }).join("");
  const total=cart.reduce((sum,item)=>{const p=products.find(x=>x.id===item.id);return sum+(p?p.price*item.qty:0)},0);
  document.getElementById("cartTotal").textContent=rupiah(total);
  document.getElementById("checkoutButton").disabled=cart.length===0;
}
function updateQuantity(id,change){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty+=change; if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  saveCart();
}
function checkout(){
  if(!cart.length){showToast("Keranjang masih kosong.");return;}
  if(!currentUser){showToast("Silakan masuk atau daftar sebelum checkout.");openAuth("login");return;}
  const lines=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `- ${p.name} (${item.qty} x ${rupiah(p.price)}) = ${rupiah(p.price*item.qty)}`;});
  const total=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);
  const message=`Halo Toko Kue Naila, saya ingin memesan:\n\nNama: ${currentUser.name}\nEmail: ${currentUser.email}\n${lines.join("\n")}\n\nTotal: ${rupiah(total)}\n\nMohon info ketersediaan dan cara pembayarannya. Terima kasih.`;
  window.open(`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`,"_blank");
}
function openAuth(mode="login"){
  authMode=mode; updateAuthForm(); authOverlay.classList.remove("hidden");
}
function updateAuthForm(){
  const register=authMode==="register";
  document.getElementById("authTitle").textContent=register?"Buat akun baru":"Selamat datang!";
  document.getElementById("authIntro").textContent=register?"Daftar untuk mulai memilih kue favoritmu.":"Masuk untuk melanjutkan pengalaman belanjamu.";
  document.getElementById("nameField").classList.toggle("hidden",!register);
  document.getElementById("authName").required=register;
  document.getElementById("authSubmit").textContent=register?"Daftar sekarang":"Masuk";
  document.querySelectorAll(".auth-tab").forEach(tab=>tab.classList.toggle("active",tab.dataset.mode===authMode));
  document.getElementById("authMessage").textContent="";
}
document.getElementById("authForm").addEventListener("submit",event=>{
  event.preventDefault();
  const name=document.getElementById("authName").value.trim();
  const email=document.getElementById("authEmail").value.trim().toLowerCase();
  const password=document.getElementById("authPassword").value;
  const users=JSON.parse(localStorage.getItem("nailaUsers")||"[]");
  const message=document.getElementById("authMessage");
  if(authMode==="register"){
    if(users.some(user=>user.email===email)){message.textContent="Email sudah terdaftar. Silakan masuk.";return;}
    users.push({name,email,password});localStorage.setItem("nailaUsers",JSON.stringify(users));
    currentUser={name,email};localStorage.setItem("nailaCurrentUser",JSON.stringify(currentUser));
    authOverlay.classList.add("hidden");updateAccountButton();showToast("Akun berhasil dibuat. Selamat datang!");
  }else{
    const user=users.find(item=>item.email===email&&item.password===password);
    if(!user){message.textContent="Email atau password tidak sesuai.";return;}
    currentUser={name:user.name,email:user.email};localStorage.setItem("nailaCurrentUser",JSON.stringify(currentUser));
    authOverlay.classList.add("hidden");updateAccountButton();showToast(`Selamat datang, ${user.name}!`);
  }
});
function updateAccountButton(){
  const button=document.getElementById("accountButton");
  button.textContent=currentUser?"Keluar":"Masuk";
  button.title=currentUser?`Masuk sebagai ${currentUser.name}`:"Masuk atau daftar";
}

document.getElementById("categoryFilters").addEventListener("click",event=>{
  const button=event.target.closest("[data-category]");if(!button)return;
  activeCategory=button.dataset.category;
  document.querySelectorAll(".filter").forEach(el=>el.classList.toggle("active",el===button));renderProducts();
});
document.getElementById("searchInput").addEventListener("input",renderProducts);
productGrid.addEventListener("click",event=>{const button=event.target.closest("[data-add]");if(button)addToCart(Number(button.dataset.add));});
document.getElementById("cartButton").addEventListener("click",()=>cartOverlay.classList.remove("hidden"));
document.getElementById("checkoutButton").addEventListener("click",checkout);
document.getElementById("cartItems").addEventListener("click",event=>{
  const qty=event.target.closest("[data-qty]");const remove=event.target.closest("[data-remove]");
  if(qty)updateQuantity(Number(qty.dataset.qty),Number(qty.dataset.change));
  if(remove){cart=cart.filter(item=>item.id!==Number(remove.dataset.remove));saveCart();}
});
document.getElementById("accountButton").addEventListener("click",()=>{
  if(currentUser){if(confirm("Keluar dari akun?")){currentUser=null;localStorage.removeItem("nailaCurrentUser");updateAccountButton();showToast("Kamu sudah keluar.");}}
  else openAuth("login");
});
document.querySelectorAll(".auth-tab").forEach(tab=>tab.addEventListener("click",()=>{authMode=tab.dataset.mode;updateAuthForm();}));
document.querySelectorAll("[data-close]").forEach(button=>button.addEventListener("click",()=>document.getElementById(button.dataset.close).classList.add("hidden")));
[cartOverlay,authOverlay].forEach(overlay=>overlay.addEventListener("click",event=>{if(event.target===overlay)overlay.classList.add("hidden");}));
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
document.querySelectorAll(".main-nav a").forEach(link=>link.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));

document.getElementById("contactPhone").textContent=STORE.phoneDisplay;
document.getElementById("contactAddress").textContent=STORE.address;
document.getElementById("contactWhatsapp").href=`https://wa.me/${STORE.whatsapp}`;
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();updateAccountButton();
