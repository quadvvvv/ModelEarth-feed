document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('autocomplete-input');
    const resultsContainer = document.getElementById('autocomplete-results');
    const loading = document.getElementById('loading');

    let items = [];

    async function fetchLocations(inputValue) {
        if (!inputValue) return;
        loading.style.display = 'block';
        try {
            const response = await fetch(`https://autocomplete.search.hereapi.com/v1/autocomplete?apiKey=14B6Yr62CTa_mKKoYViJQClxjjA32S6pL4Ir2ehCMcY&q=${inputValue}&maxresults=5`);
            const data = await response.json();
            items = data.items.map(item => ({
                id: item.id,
                title: item.title,
                address: item.address.label
            }));
            loading.style.display = 'none';
            console.log("locationsearch " + items.address);
            renderResults();
        } catch (error) {
            console.error('Error fetching data:', error);
            loading.style.display = 'none';
            items = [];
            renderResults();
        }
    }

    function renderResults() {
        resultsContainer.innerHTML = '';
        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = item.title;
            li.className = 'autocomplete-item';
            li.addEventListener('click', () => {
                input.value = item.title;
                console.log('Selected item', item);
                displayRequests(1, 1, item.address);
                resultsContainer.innerHTML = '';
            });
            resultsContainer.appendChild(li);
        });
    }

    input.addEventListener('input', function () {
        const value = input.value;
        fetchLocations(value);
    });
});


