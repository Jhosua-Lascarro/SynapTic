import "./global.css";

// Mostrar mensaje de working progress en el div #app
//document.getElementById("app").innerHTML =
//	`<span style="font-weight:bold;color:#ffff;">Working in progress...</span>`;

const form = document.getElementById('register-form');
const messageElement = document.getElementById('message');

form.addEventListener('submit', async (e) => {
	e.preventDefault();

	const identification = document.getElementById('identification').value;
	const password = document.getElementById('password').value;

	try {
		const response = await fetch('http://localhost:3000/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				identification,
				password
			})
		});

		const data = await response.json();

		if (response.ok) {
			messageElement.textContent = `Éxito: ${data.message}`;
			form.reset();
		} else {
			messageElement.textContent = `Error: ${data.message}`;
		}

	} catch (error) {
		messageElement.textContent = 'Error de conexión. Asegúrate de que el servidor esté funcionando.';
		messageElement.style.color = 'red';
		console.error('Error:', error);
	}
});