async function getApiUrl() {
    return document.getElementById('apiUrl').value.replace(/\/$/, '');
}

async function loadItems() {
    const listDiv = document.getElementById('items-list');
    listDiv.innerHTML = '<p>Loading...</p>';
    const apiUrl = await getApiUrl();

    try {
        const response = await fetch(`${apiUrl}/items`);
        if (!response.ok) throw new Error('Failed to fetch items');
        
        const items = await response.json();
        listDiv.innerHTML = '';

        if (items.length === 0) {
            listDiv.innerHTML = '<p>No items found.</p>';
            return;
        }

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.innerHTML = `
                <img src="${item.blobUrl}" alt="${item.fileName}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                <div class="item-details">
                    <h3>${item.fileName}</h3>
                    <p><strong>Description:</strong> <span id="desc-${item.id}">${item.description}</span></p>
                    <p><small>Uploaded: ${new Date(item.uploadedAt).toLocaleString()}</small></p>
                    <button class="edit-btn" onclick="editItem('${item.id}')">Edit Description</button>
                    <button class="delete-btn" onclick="deleteItem('${item.id}')">Delete</button>
                </div>
            `;
            listDiv.appendChild(itemDiv);
        });

    } catch (error) {
        listDiv.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
    }
}

async function uploadItem() {
    const fileInput = document.getElementById('uploadFile');
    const descInput = document.getElementById('uploadDesc');
    const apiUrl = await getApiUrl();

    if (!fileInput.files[0]) {
        alert('Please select a file');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('description', descInput.value);

    try {
        const response = await fetch(`${apiUrl}/items`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err);
        }

        alert('Upload successful!');
        fileInput.value = '';
        descInput.value = '';
        loadItems();
    } catch (error) {
        alert(`Upload failed: ${error.message}`);
    }
}

async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const apiUrl = await getApiUrl();

    try {
        const response = await fetch(`${apiUrl}/items/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Delete failed');

        loadItems();
    } catch (error) {
        alert(error.message);
    }
}

async function editItem(id) {
    const currentDesc = document.getElementById(`desc-${id}`).innerText;
    const newDesc = prompt("Enter new description:", currentDesc);
    if (newDesc === null || newDesc === currentDesc) return;
    
    const apiUrl = await getApiUrl();

    try {
        const response = await fetch(`${apiUrl}/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: newDesc })
        });

        if (!response.ok) throw new Error('Update failed');

        loadItems();
    } catch (error) {
        alert(error.message);
    }
}

// Load on start
window.onload = loadItems;
