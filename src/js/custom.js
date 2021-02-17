(function () {
	const $ = document.querySelector.bind(document);

	let init = function () {
		ymaps.ready(_mapInit);
	}

	let _mapInit = function () {

		const map = new ymaps.Map('map', {
			center: [59.923055, 30.385391],
			zoom: 12,
			controls: []
		});

		const myBalloonLayout = function (coords) {
			return '<div class="popup">' +
				'<h3 class="popup__title">Отзыв:</h3>' +
				'<form class="myForm">' +
				'<div class="myForm__item">' +
				'<input class="myForm__input" type="text" name="name" placeholder="Укажите ваше имя">' +
				'</div>' +
				'<div class="myForm__item">' +
				'<input class="myForm__input" type="text" name="place" placeholder="Укажите место">' +
				'</div>' +
				'<div class="myForm__item">' +
				'<textarea class= "myForm__input myForm__input--request" name = "request" placeholder = "Оставить отзыв" ></textarea>' +
				'</div>' +
				'<div class="myForm__item">' +
				`<button class="myForm__btn" data-coords="${coords.latitude}, ${coords.longitude}">Добавить</button>` +
				'</div>' +
				'</form>' +
				'</div>';
		}

		map.events.add('click', function (e) {

			if (!map.balloon.isOpen()) {
				let coords = e.get('coords');
				map.balloon.open(coords, {
					contentBody: myBalloonLayout({
						latitude: coords[0].toPrecision(6),
						longitude: coords[1].toPrecision(6)
					})
				});
			} else {
				map.balloon.close();
			}
		});
	}

	return init();
})();