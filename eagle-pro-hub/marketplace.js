// 🦅 EAGLE PRO HUB - Professional & Homeowner Marketplace
// 7 Income Streams Integrated System

class EagleProfessionalHub {
    constructor() {
        this.userType = 'homeowner'; // 'professional' or 'homeowner'
        this.userCredits = 0;
        this.listings = [];
        this.earnings = {
            services: 0,
            materials: 0,
            referrals: 0,
            affiliates: 0,
            premiumPlan: 0,
            courses: 0,
            badge: 0
        };
        this.saved = [];
        this.orders = [];
        
        this.storageKey = 'eagle-pro-hub';
        this.init();
    }

    init() {
        this.loadData();
        this.attachEventListeners();
        this.displayMarketplace();
        this.updateUI();
        console.log('🦅 Eagle Pro Hub Initialized');
    }

    attachEventListeners() {
        // User type toggle
        document.getElementById('userTypeBtn').addEventListener('click', () => this.toggleUserType());
        
        // Dashboard button
        document.getElementById('dashboardBtn').addEventListener('click', () => this.openDashboard());
        
        // Become Pro button
        document.getElementById('becomeProBtn').addEventListener('click', () => this.becomeProHandler());
        
        // Find Services button
        document.getElementById('findServicesBtn').addEventListener('click', () => this.findServices());
        
        // Pricing plans
        document.querySelectorAll('.btn-plan').forEach(btn => {
            btn.addEventListener('click', (e) => this.purchasePlan(e.target.dataset.credits, e.target.dataset.price));
        });
        
        // Search and filter
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterMarketplace(e.target.value));
        document.getElementById('categoryFilter').addEventListener('change', (e) => this.filterByCategory(e.target.value));
        
        // Modal close buttons
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', (e) => e.target.closest('.modal').classList.remove('active'));
        });
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target));
        });
        
        // Create listing form
        const form = document.getElementById('createListingForm');
        if (form) {
            form.addEventListener('submit', (e) => this.createListing(e));
        }
    }

    toggleUserType() {
        this.userType = this.userType === 'professional' ? 'homeowner' : 'professional';
        document.getElementById('userTypeBtn').textContent = this.userType === 'professional' ? "I'm a Homeowner" : "I'm a Pro";
        this.saveData();
        this.showNotification(`Switched to ${this.userType} mode`);
    }

    becomeProHandler() {
        if (this.userType === 'professional') {
            this.openDashboard();
        } else {
            this.userType = 'professional';
            document.getElementById('userTypeBtn').textContent = "I'm a Homeowner";
            this.showNotification('Welcome to Professional Mode! Get credits to start earning.');
            document.querySelector('.pricing').scrollIntoView({ behavior: 'smooth' });
        }
    }

    purchasePlan(credits, price) {
        const creditAmount = parseInt(credits);
        const priceAmount = parseFloat(price);
        
        this.userCredits += creditAmount;
        this.earnings.premiumPlan += priceAmount;
        
        this.saveData();
        this.updateUI();
        this.showNotification(`✅ Successfully purchased ${creditAmount} credits! Total: ${this.userCredits}`);
    }

    createListing(e) {
        e.preventDefault();
        
        if (this.userType !== 'professional') {
            this.showNotification('You must be a professional to create listings');
            return;
        }
        
        if (this.userCredits < 1) {
            this.showNotification('You need credits to create listings. Purchase a plan first.');
            return;
        }

        const listing = {
            id: Date.now(),
            type: document.getElementById('listingType').value,
            category: document.getElementById('listingCategory').value,
            title: document.getElementById('listingTitle').value,
            description: document.getElementById('listingDescription').value,
            price: parseFloat(document.getElementById('listingPrice').value),
            creator: 'You',
            rating: 4.8,
            reviews: Math.floor(Math.random() * 50) + 10,
            createdAt: new Date().toISOString()
        };
        
        this.listings.push(listing);
        this.userCredits -= 1; // Cost 1 credit to post
        
        this.saveData();
        this.updateUI();
        document.getElementById('createListingForm').reset();
        this.showNotification(`✅ Listing created! Available on marketplace.`);
        
        // Close modal
        document.getElementById('proModal').classList.remove('active');
        this.displayMarketplace();
    }

    displayMarketplace() {
        const container = document.getElementById('marketplaceItems');
        if (!container) return;
        
        // Sample listings
        const sampleListings = [
            {
                id: 1,
                type: 'service',
                category: 'plumbing',
                title: 'Professional Plumbing Services',
                description: '15 years experience. Emergency available 24/7',
                price: 150,
                creator: 'John Plumbing',
                rating: 4.9,
                reviews: 127,
                icon: '🔧'
            },
            {
                id: 2,
                type: 'material',
                category: 'electrical',
                title: 'Premium Electrical Supplies',
                description: 'High-quality materials for all projects',
                price: 85,
                creator: 'Electric Pro',
                rating: 4.8,
                reviews: 89,
                icon: '⚡'
            },
            {
                id: 3,
                type: 'service',
                category: 'carpentry',
                title: 'Custom Carpentry & Woodwork',
                description: 'Beautiful custom furniture and repairs',
                price: 200,
                creator: 'Master Carpenter',
                rating: 5.0,
                reviews: 156,
                icon: '🪵'
            },
            ...this.listings
        ];
        
        container.innerHTML = '';
        sampleListings.forEach(listing => {
            const card = this.createListingCard(listing);
            container.appendChild(card);
        });
    }

    createListingCard(listing) {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const stars = '⭐'.repeat(Math.floor(listing.rating)) + (listing.rating % 1 ? '½' : '');
        
        card.innerHTML = `
            <div class="item-image">${listing.icon || '🏢'}</div>
            <div class="item-body">
                <h3>${listing.title}</h3>
                <div class="item-rating">${stars} (${listing.reviews} reviews)</div>
                <div class="item-price">$${listing.price.toFixed(2)}</div>
                <p class="item-description">${listing.description}</p>
                <span class="item-badge">${listing.type.toUpperCase()}</span>
                <div class="item-actions">
                    <button class="btn-secondary" onclick="hub.saveItem(${listing.id})">Save</button>
                    <button class="btn-secondary" onclick="hub.bookService(${listing.id})">Book</button>
                </div>
            </div>
        `;
        
        return card;
    }

    saveItem(id) {
        if (!this.saved.includes(id)) {
            this.saved.push(id);
            this.saveData();
            this.showNotification('✅ Saved to your collection');
        }
    }

    bookService(id) {
        const listing = this.listings.find(l => l.id === id);
        
        const order = {
            id: Date.now(),
            listingId: id,
            title: listing?.title || 'Service',
            price: listing?.price || 100,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        this.orders.push(order);
        this.saveData();
        this.showNotification('✅ Service booked! Check your dashboard for details.');
    }

    filterMarketplace(query) {
        const items = document.querySelectorAll('.item-card');
        items.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            item.style.display = title.includes(query.toLowerCase()) ? 'block' : 'none';
        });
    }

    filterByCategory(category) {
        // Filter logic
        this.displayMarketplace();
    }

    findServices() {
        document.querySelector('.marketplace').scrollIntoView({ behavior: 'smooth' });
    }

    openDashboard() {
        if (this.userType === 'professional') {
            document.getElementById('proModal').classList.add('active');
            this.updateProfessionalDashboard();
        } else {
            document.getElementById('homeownerModal').classList.add('active');
            this.updateHomeownerDashboard();
        }
    }

    updateProfessionalDashboard() {
        // Update earnings
        document.getElementById('totalEarnings').textContent = '$' + (Object.values(this.earnings).reduce((a, b) => a + b, 0)).toFixed(2);
        document.getElementById('referralBonus').textContent = '$' + this.earnings.referrals.toFixed(2);
        document.getElementById('affiliateEarnings').textContent = '$' + this.earnings.affiliates.toFixed(2);
        
        // Update services list
        const servicesList = document.getElementById('servicesList');
        servicesList.innerHTML = this.listings.filter(l => l.type === 'service').map(l => `
            <div style="padding: 12px; background: #F9F9F9; border-radius: 6px; margin-bottom: 12px;">
                <strong>${l.title}</strong> - $${l.price}
                <br><small>${l.description}</small>
            </div>
        `).join('');
        
        // Update materials list
        const materialsList = document.getElementById('materialsList');
        materialsList.innerHTML = this.listings.filter(l => l.type === 'material').map(l => `
            <div style="padding: 12px; background: #F9F9F9; border-radius: 6px; margin-bottom: 12px;">
                <strong>${l.title}</strong> - $${l.price}
                <br><small>${l.description}</small>
            </div>
        `).join('');
    }

    updateHomeownerDashboard() {
        // Update saved items
        document.getElementById('savedList').innerHTML = this.saved.length > 0 ? 
            `<p>You have ${this.saved.length} saved items</p>` : 
            '<p>No saved items yet</p>';
        
        // Update orders
        document.getElementById('ordersList').innerHTML = this.orders.map(o => `
            <div style="padding: 12px; background: #F9F9F9; border-radius: 6px; margin-bottom: 12px;">
                <strong>${o.title}</strong> - $${o.price}
                <br><small>Status: ${o.status}</small>
            </div>
        `).join('');
    }

    switchTab(btn) {
        const tabs = btn.parentElement.querySelectorAll('.tab-btn');
        const contents = btn.parentElement.parentElement.querySelectorAll('.tab-content');
        
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        const tabName = btn.dataset.tab;
        document.getElementById(tabName).classList.add('active');
    }

    updateUI() {
        document.getElementById('userCredits').textContent = this.userCredits;
    }

    showNotification(message) {
        const toast = document.getElementById('notificationToast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    saveData() {
        const data = {
            userType: this.userType,
            userCredits: this.userCredits,
            listings: this.listings,
            earnings: this.earnings,
            saved: this.saved,
            orders: this.orders
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    loadData() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            const parsed = JSON.parse(data);
            this.userType = parsed.userType || 'homeowner';
            this.userCredits = parsed.userCredits || 0;
            this.listings = parsed.listings || [];
            this.earnings = parsed.earnings || this.earnings;
            this.saved = parsed.saved || [];
            this.orders = parsed.orders || [];
        }
    }
}

// Initialize
const hub = new EagleProfessionalHub();

console.log('🦅 Eagle Pro Hub - 7 Income Streams Platform Ready');
console.log('Income Streams: Services, Materials, Premium Plans, Referrals, Affiliates, Courses, Premium Badge');
