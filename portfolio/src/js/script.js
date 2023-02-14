//hamburger
const hamburger = document.querySelector('.hamburger'),
	menu = document.querySelector('.menu'),
	close = document.querySelector('.menu_close');

hamburger.addEventListener('click', () => {
	menu.classList.add('active');
});

close.addEventListener('click', () => {
	menu.classList.remove('active');
});

//ratings
const counters = document.querySelectorAll('.skills_ratings-counter'),
	lines = document.querySelectorAll('.skills_ratings-line span');

counters.forEach((item, i) => {
	lines[i].style.width = item.innerHTML;
});

//modal
const modalTrigger = document.querySelectorAll('[data-modal]'),
	modal = document.querySelector('.modal');

modalTrigger.forEach(btn => {
	btn.addEventListener('click', openModal);
});

function closeModal() {
	modal.classList.add('hide');
	modal.classList.remove('show');
	document.body.style.overflow = '';
}

function openModal() {
	modal.classList.add('show');
	modal.classList.remove('hide');
	document.body.style.overflow = 'hidden';
	clearInterval(modalTimerId);
}

modal.addEventListener('click', (e) => {
	if (e.target === modal || e.target.getAttribute('data-close') == '') {
		closeModal();
	}
});

document.addEventListener('keydown', (e) => {
	if (e.code === "Escape" && modal.classList.contains('show')) {
		closeModal();
	}
});

const modalTimerId = setTimeout(openModal, 5000);

function showModalByScroll() {
	if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
		openModal();
		window.removeEventListener('scroll', showModalByScroll);
	}
}
window.addEventListener('scroll', showModalByScroll);

//forms
const forms = document.querySelectorAll('form');
const message = {
	loading: 'img/form/spinner.svg',
	success: 'Спасибо! Мы скоро с вами свяжемся',
	failure: 'Что-то пошло не так'
};
forms.forEach(item => {
	postData(item);
});
function postData(form) {
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		let statusMessage = document.createElement('img');
		statusMessage.src = message.loading;
		statusMessage.style.cssText = `
		display: block;
		margi: 0 auto;
		`;
		form.insertAdjacentElement('afterend', statusMessage);
		const request = new XMLHttpRequest();
		request.open('POST', 'server.php');
		request.setRequestHeader('Content-type', 'application/json');
		const formData = new FormData(form);

		const object = {};
		formData.forEach(function (value, key) {
			object[key] = value;
		});
		const json = JSON.stringify(object);

		request.send(json);
		request.addEventListener('load', () => {
			if (request.status === 200) {
				console.log(request.response);
				showThanksModal(message.success);
				statusMessage.remove();
				form.reset();
			} else {
				showThanksModal(message.failure);
			}
		});
	});
}
function showThanksModal(message) {
	const prevModalDialog = document.querySelector('.modal__dialog');
	prevModalDialog.classList.add('hide');
	openModal();
	const thanksModal = document.createElement('div');
	thanksModal.classList.add('modal__dialog');
	thanksModal.innerHTML = `
	<div class="modal__content">
	<div class="modal__close" data-close>&times;</div>
	<div class="modal__title">${message}</div>
	</div>
	`;
	document.querySelector('.modal').append(thanksModal);
	setTimeout(() => {
		thanksModal.remove();
		prevModalDialog.classList.remove('hide');
		closeModal();
	}, 4000);
}