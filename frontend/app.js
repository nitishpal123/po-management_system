// Mock Database for UI interaction until integrated fully with the backend GET requests
const mockProducts = [
    { id: 1, name: "Dell Inspiron 15", price: 55000 },
    { id: 2, name: "Lenovo ThinkPad X1", price: 125000 },
    { id: 3, name: "Apple MacBook Pro M3", price: 169000 },
    { id: 4, name: "Logitech MX Master 3S", price: 8999 },
    { id: 5, name: "Samsung 27 inch 4K Monitor", price: 28000 }
];

const mockVendors = [
    { id: 1, name: "TechNova Distributors" },
    { id: 2, name: "Global Electronics Ltd." },
    { id: 3, name: "Apex Supply Co." }
];

document.addEventListener("DOMContentLoaded", () => {
    populateVendors();
    setupEventListeners();
    
    // Add an initial empty row
    addRow();
});

function populateVendors() {
    const vendorSelect = document.getElementById("vendor");
    mockVendors.forEach(v => {
        const option = document.createElement("option");
        option.value = v.id;
        option.textContent = v.name;
        vendorSelect.appendChild(option);
    });
}

function setupEventListeners() {
    // Navigation handling
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.page-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = e.currentTarget.getAttribute('data-target');
            if (!targetId) {
                // For settings or others without a section yet
                alert("This feature will be available in the next update!");
                return;
            }
            
            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            // Show target section, hide others
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });

    document.getElementById("addRowBtn").addEventListener("click", addRow);
    
    // Event delegation for table inputs
    document.getElementById("productTable").addEventListener("input", (e) => {
        if (e.target.classList.contains("product-select") || 
            e.target.classList.contains("qty-input") || 
            e.target.classList.contains("price-input")) {
            
            const row = e.target.closest("tr");
            
            // Auto-fill price when product is selected
            if (e.target.classList.contains("product-select")) {
                const selectedProductId = parseInt(e.target.value);
                const product = mockProducts.find(p => p.id === selectedProductId);
                if (product) {
                    row.querySelector(".price-input").value = product.price;
                }
            }
            
            updateRowTotal(row);
            updateGrandTotal();
        }
    });

    document.getElementById("productTable").addEventListener("click", (e) => {
        if (e.target.closest(".btn-danger")) {
            const tbody = document.querySelector("#productTable tbody");
            if (tbody.children.length > 1) {
                const row = e.target.closest("tr");
                row.style.opacity = '0';
                row.style.transform = 'translateY(-10px)';
                row.style.transition = 'all 0.3s ease';
                setTimeout(() => {
                    row.remove();
                    updateGrandTotal();
                }, 300);
            } else {
                alert("You need at least one product in the purchase order.");
            }
        }
    });

    document.getElementById("poForm").addEventListener("submit", handleSubmit);
}

function addRow() {
    const tbody = document.querySelector("#productTable tbody");
    const row = document.createElement("tr");
    row.classList.add("fade-enter");
    
    const productOptions = mockProducts.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
    
    row.innerHTML = `
        <td>
            <select class="product-select" required>
                <option value="" disabled selected>Choose a Product...</option>
                ${productOptions}
            </select>
        </td>
        <td>
            <input type="number" class="price-input" min="0" step="0.01" required placeholder="0.00">
        </td>
        <td>
            <input type="number" class="qty-input" min="1" value="1" required>
        </td>
        <td class="row-total">
            ₹ 0.00
        </td>
        <td>
            <button type="button" class="btn btn-danger" title="Remove Product">✕</button>
        </td>
    `;
    
    tbody.appendChild(row);
}

function updateRowTotal(row) {
    const price = parseFloat(row.querySelector(".price-input").value) || 0;
    const qty = parseInt(row.querySelector(".qty-input").value) || 0;
    const total = price * qty;
    
    row.querySelector(".row-total").textContent = `₹ ${total.toFixed(2)}`;
    row.dataset.total = total;
}

function updateGrandTotal() {
    const rows = document.querySelectorAll("#productTable tbody tr");
    let grandTotal = 0;
    
    rows.forEach(row => {
        grandTotal += parseFloat(row.dataset.total) || 0;
    });
    
    document.getElementById("grandTotal").textContent = grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '⚙️ Processing...';
    submitBtn.disabled = true;

    try {
        const reference_no = document.getElementById("refNo").value;
        const vendor_id = parseInt(document.getElementById("vendor").value);
        
        const items = [];
        const rows = document.querySelectorAll("#productTable tbody tr");
        
        rows.forEach(row => {
            const product_id = parseInt(row.querySelector(".product-select").value);
            const price = parseFloat(row.querySelector(".price-input").value);
            const quantity = parseInt(row.querySelector(".qty-input").value);
            
            if (product_id && price && quantity) {
                items.push({ product_id, price, quantity });
            }
        });

        const payload = {
            reference_no,
            vendor_id,
            items
        };

        console.log("Submitting PO payload to FastApi Backend:", payload);

        // Make the actual call to the FastAPI Backend
        const API_BASE = "http://localhost:8000"; // Assuming default uvicorn port
        
        const response = await fetch(`${API_BASE}/purchase-orders/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            alert(`✅ Success: ${data.message || 'Purchase Order Created!'}\nPO ID: ${data.po_id}`);
            
            // Format reset with animation
            e.target.reset();
            const tbody = document.querySelector("#productTable tbody");
            tbody.innerHTML = "";
            addRow();
            updateGrandTotal();
        } else {
            console.error("Backend returned an error. Make sure CORS is configured in FastAPI.", await response.text());
            alert("⚠️ Error: Backend API request failed. Make sure FastAPI server is running on http://localhost:8000 and CORS is allowed.");
        }
    } catch (error) {
        console.error("Network Exception:", error);
        alert("🔌 Network Error: Could not connect to the backend API. Please make sure the FastAPI server is running at http://localhost:8000.");
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}
