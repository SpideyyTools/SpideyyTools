// Quick Invoice Generator JavaScript

document.addEventListener('DOMContentLoaded', () => {
  const itemsBody = document.getElementById('items-body');
  const addItemBtn = document.getElementById('add-item-btn');
  const invoiceForm = document.getElementById('invoice-form');
  const totalAmountSpan = document.getElementById('totalAmount');
  const invoiceDisplay = document.getElementById('invoice-display');
  const downloadPdfBtn = document.getElementById('download-pdf-btn');

  let items = [];

  function renderItems() {
    itemsBody.innerHTML = '';
    items.forEach((item, index) => {
      const tr = document.createElement('tr');

      const nameTd = document.createElement('td');
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.value = item.name;
      nameInput.placeholder = 'Item name';
      nameInput.addEventListener('input', (e) => {
        items[index].name = e.target.value;
      });
      nameTd.appendChild(nameInput);

      const qtyTd = document.createElement('td');
      const qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.min = '0';
      qtyInput.value = item.qty;
      qtyInput.addEventListener('input', (e) => {
        items[index].qty = parseInt(e.target.value) || 0;
        updateTotal();
      });
      qtyTd.appendChild(qtyInput);

      const priceTd = document.createElement('td');
      const priceInput = document.createElement('input');
      priceInput.type = 'number';
      priceInput.min = '0';
      priceInput.step = '0.01';
      priceInput.value = item.price;
      priceInput.addEventListener('input', (e) => {
        items[index].price = parseFloat(e.target.value) || 0;
        updateTotal();
      });
      priceTd.appendChild(priceInput);

      const actionsTd = document.createElement('td');
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'btn delete-btn';
      deleteBtn.addEventListener('click', () => {
        items.splice(index, 1);
        renderItems();
        updateTotal();
      });
      actionsTd.appendChild(deleteBtn);

      tr.appendChild(nameTd);
      tr.appendChild(qtyTd);
      tr.appendChild(priceTd);
      tr.appendChild(actionsTd);

      itemsBody.appendChild(tr);
    });
  }

  function updateTotal() {
    const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    totalAmountSpan.textContent = total.toFixed(2);
  }

  addItemBtn.addEventListener('click', () => {
    items.push({ name: '', qty: 0, price: 0 });
    renderItems();
  });

  invoiceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    generateInvoice();
  });

  function generateInvoice() {
    const businessName = document.getElementById('businessName').value.trim();
    const clientName = document.getElementById('clientName').value.trim();

    if (!businessName || !clientName || items.length === 0) {
      alert('Please fill in business, client, and at least one item.');
      return;
    }

    let invoiceHTML = `
      <h3>Invoice</h3>
      <p><strong>Business:</strong> ${businessName}</p>
      <p><strong>Client:</strong> ${clientName}</p>
      <table>
        <thead>
          <tr>
            <th>Item</th><th>Quantity</th><th>Price</th><th>Total</th>
          </tr>
        </thead>
        <tbody>
    `;

    let grandTotal = 0;
    items.forEach(item => {
      const itemTotal = item.qty * item.price;
      grandTotal += itemTotal;
      invoiceHTML += `
        <tr>
          <td>${item.name}</td>
          <td>${item.qty}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>$${itemTotal.toFixed(2)}</td>
        </tr>
      `;
    });

    invoiceHTML += `
        </tbody>
      </table>
      <h4>Total Amount: $${grandTotal.toFixed(2)}</h4>
    `;

    invoiceDisplay.innerHTML = invoiceHTML;
    invoiceDisplay.style.display = 'block';
    downloadPdfBtn.style.display = 'inline-block';
  }

  downloadPdfBtn.addEventListener('click', () => {
    window.print();
  });

  // Initialize with one empty item row
  addItemBtn.click();
});
