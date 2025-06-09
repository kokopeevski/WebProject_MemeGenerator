function openModal(src) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    modal.style.display = "flex";
    modalImg.src = src;
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

function toggleFavorite(form, event) {
    event.preventDefault(); 
    const heartBtn = form.querySelector('.heart-btn i');
    const imagePath = form.querySelector('input[name="image"]').value;
    const isFavorite = heartBtn.classList.contains('fa-solid');

    fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (isFavorite) {
                heartBtn.classList.remove('fa-solid');
                heartBtn.classList.add('fa-regular');
            } else {
                heartBtn.classList.remove('fa-regular');
                heartBtn.classList.add('fa-solid');
            }
        } else {
            alert('Грешка при актуализация на любими.');
        }
    })
    .catch(error => {
        console.error('Грешка:', error);
        alert('Грешка при свързване със сървъра.');
    });

    return false; 
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('gallery.php')
        .then(response => response.text())
        .then(data => {
            document.getElementById('gallery').innerHTML = data;
            const forms = document.querySelectorAll('.heart-form');
            forms.forEach(form => {
                const imagePath = form.querySelector('input[name="image"]').value;
                fetch('check_favorite.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: 'image=' + encodeURIComponent(imagePath)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.isFavorite) {
                        const heartBtn = form.querySelector('.heart-btn i');
                        heartBtn.classList.remove('fa-regular');
                        heartBtn.classList.add('fa-solid');
                    }
                })
                .catch(error => console.error('Грешка при проверка на любими:', error));
            });
        })
        .catch(error => console.error('Грешка при зареждане на галерията:', error));
});