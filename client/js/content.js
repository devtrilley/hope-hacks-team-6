fetch('js/alice.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('content');
        data.paragraphs.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            container.appendChild(p);
        });
    })
    .catch(error => console.error('Error loading content:', error));

fetch('js/sam.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('fill');
        data.paragraphs.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            container.appendChild(p);
        });
    })
    .catch(error => console.error('Error loading fill:', error));