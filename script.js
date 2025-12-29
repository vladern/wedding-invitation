document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const MAX_CHILDREN = 5;
    const MIN_CHILDREN = 0;

    // Elements
    const decreaseBtn = document.getElementById('decreaseChildren');
    const increaseBtn = document.getElementById('increaseChildren');
    const childrenCountSpan = document.getElementById('childrenCount');
    const childrenInput = document.getElementById('childrenInput');
    const form = document.getElementById('rsvpForm');

    // Pre-fill Name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestNameParam = urlParams.get('nombre') || urlParams.get('name');
    // If name is found, save it localhost storage
    if (guestNameParam) {
        localStorage.setItem('guestName', guestNameParam);
    }

    // State
    let childrenCount = 0;

    // Modal Elements
    const modal = document.getElementById('emailModal');
    const emailForm = document.getElementById('emailForm');
    const guestEmailInput = document.getElementById('guestEmail');
    const closeModalBtn = document.getElementById('closeModal');
    let pendingFormData = null;

    // Google Script URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7zlPQJrtvANe7o1iBVStPJJ-yepT4dQVKKLH4yaWUonZQH5WFnhtWkzcNjmEBtrxE/exec';

    // Functions
    function updateChildrenDisplay() {
        childrenCountSpan.textContent = childrenCount;
        childrenInput.value = childrenCount;
    }

    function sendDataToGoogleSheet(data) {
        // Prepare payload matching the requested structure for the server script
        // Note: The server script likely expects a JSON string or parameters. 
        // We'll try sending a JSON payload which is common for these integrations.
        // The user prompted: var nuevaFila = [new Date(), data.nombre, data.email, data.asiste, data.pareja, data.ninos, data.comentarios];
        // We will send the object 'data' with these keys so the server can construct the row.

        const payload = {
            nombre: localStorage.getItem('guestName'),
            correo: data.email || '',
            asiste: data.attendance, // 'accept' or 'decline'
            pareja: data.plusOne ? 'Sí' : 'No', // Format as needed by sheet
            ninos: data.children,
            comentarios: data.comments
        };

        // Use no-cors mode for Google Scripts to avoid CORS errors on simple triggers
        // Note: With no-cors, we get an opaque response, so we can't check ok/status.
        // We assume success for the UX.
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
        }).then(() => {
            console.log('Data sent to Google Sheet');
        }).catch(error => {
            console.error('Error sending data:', error);
        });

        showConfirmation(payload);
    }

    function showConfirmation(data) {
        const button = form.querySelector('.cta-button');
        const originalText = button.textContent;

        button.textContent = '¡CONFIRMADO!';
        button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)'; // Green gradient

        setTimeout(() => {
            let message = `¡Gracias por confirmar, ${data.nombre}!\n\nAsistencia: ${data.asiste === 'accept' ? 'Sí' : 'No'}`;
            if (data.asiste === 'accept') {
                message += `\nAcompañante: ${data.pareja}\nNiños: ${data.ninos}\nEmail: ${data.email}`;
            }

            // Reset button
            button.textContent = originalText;
            button.style.background = '';

            // Optional: Reset form
            if (data.asiste === 'accept') {
                form.reset();
                childrenCount = 0;
                updateChildrenDisplay();
            }
        }, 500);
    }

    // Event Listeners
    decreaseBtn.addEventListener('click', () => {
        if (childrenCount > MIN_CHILDREN) {
            childrenCount--;
            updateChildrenDisplay();
        }
    });

    increaseBtn.addEventListener('click', () => {
        if (childrenCount < MAX_CHILDREN) {
            childrenCount++;
            updateChildrenDisplay();
        }
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        // If they close without email, maybe just submit without email?
        // Or do nothing? Let's assume they want to cancel or go back. 
        // If we want to force submit even if closed:
        if (pendingFormData) {
            sendDataToGoogleSheet(pendingFormData);
            pendingFormData = null;
        }
    });

    // Close modal if clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            if (pendingFormData) {
                sendDataToGoogleSheet(pendingFormData);
                pendingFormData = null;
            }
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Gather data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            attendance: formData.get('attendance'),
            plusOne: formData.get('plusOne') === 'on',
            children: parseInt(formData.get('children')),
            comments: formData.get('comments')
        };

        if (data.attendance === 'accept') {
            // Show modal to get email
            pendingFormData = data;
            modal.classList.remove('hidden');
            guestEmailInput.focus();
        } else {
            // Decline logic
            sendDataToGoogleSheet(data);
        }
    });

    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (pendingFormData) {
            pendingFormData.email = guestEmailInput.value;
            modal.classList.add('hidden');
            sendDataToGoogleSheet(pendingFormData);
            pendingFormData = null; // Reset
            guestEmailInput.value = ''; // Clear input
        }
    });
});
