document.addEventListener('DOMContentLoaded', async () => {
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'login.html';
        return;
    }

    await loadTransactions();
});

async function loadTransactions() {
    try {
        const response = await fetch('/api/transactions', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load transactions');
        
        const transactions = await response.json();
        renderTransactions(transactions);
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}

function renderTransactions(transactions) {
    const container = document.getElementById('transactionsList');
    container.innerHTML = '';
    
    transactions.forEach(transaction => {
        const tr = document.createElement('div');
        tr.className = 'transaction';
        tr.innerHTML = `
            <div>${new Date(transaction.created_at).toLocaleString()}</div>
            <div>${transaction.account_name}</div>
            <div class="${transaction.type}">${transaction.type === 'income' ? '+' : '-'}${transaction.amount} ₽</div>
            <div>${transaction.description || ''}</div>
        `;
        container.appendChild(tr);
    });
}