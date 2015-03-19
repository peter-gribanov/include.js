/**
 * Loader JavaScript and CSS files
 *
 * @author    Peter Gribanov <info@peter-gribanov.ru>
 * @copyright Copyright (c) 2015, Peter Gribanov
 * @license   http://opensource.org/licenses/MIT MIT
 * @since     19.03.15
 * @version   2.3
 */
var include = {

	/**
	 * Collection  of loaded URLs
	 *
	 * <code>
	 * {
	 *     <url>: true
	 * }
	 * </code>
	 *
	 * @var array
	 */
	_collection: null,

	/**
	 * Get collection
	 *
	 * @return array
	 */
	getCollection: function() {
		// fill collection
		if (include._collection == null) {
			include._collection = [];
			var url = '';
			// load js links
			var el = document.getElementsByTagName('script');
			for (var i = 0; i < el.length; i++) {
				if (url = el[i].getAttribute('src')) {
					if (url[0] == '/') {
						url = location.protocol + '//' + location.host + url;
					}
					include.getCollection()[url] = true;
				}
			}
			// load css links
			var el = document.getElementsByTagName('link');
			for (var i = 0; i < el.length; i++) {
				if (url = el[i].getAttribute('href')) {
					if (url[0] == '/') {
						url = location.protocol + '//' + location.host + url;
					}
					include.getCollection()[url] = true;
				}
			}
		}
		return include._collection;
	},

	/**
	 * Include JavaScript file
	 *
	 * @param array|string
	 * @param function
	 * @param boolen
	 *
	 * @return void
	 */
	js: function(urls, callback, async) {
		urls = typeof urls == 'string' ? [ urls ] : urls;
		callback = typeof callback == 'function' ? callback : function(){};
		async = typeof(async) !== 'undefined' ? async : true

		// количество загруженных библиотек
		var loaded = 0;
		// увеличивает счетчик и выполняет обработчик при необходимости
		function increment() {
			if (++loaded == urls.length) {
				callback();
			}
		};

		for (key in urls) {
			if (urls[key][0] == '/') {
				urls[key] = location.protocol + '//' + location.host + urls[key];
			}
			// already loaded
			if (urls[key] in include.getCollection()) {
				increment();
				continue;
			}

			// загрузка
			var tag = document.createElement('script');
			tag.type = 'text/javascript';
			tag.async = async;
			tag.src = urls[key];
			tag.onload = tag.onreadystatechange = function() {
				// add to collection
				include.getCollection()[this.getAttribute('src')] = true;
				increment();
			};
			document.getElementsByTagName('head')[0].appendChild(tag);
		}
	},

	/**
	 * Include CSS file
	 *
	 * @param array|string
	 *
	 * @return void
	 */
	css: function(urls) {
		urls = typeof urls == 'string' ? [ urls ] : urls;

		for (key in urls) {
			if (urls[key][0] == '/') {
				urls[key] = location.protocol + '//' + location.host + urls[key];
			}
			// already loaded
			if (urls[key] in include.getCollection()) {
				continue;
			}

			var tag = document.createElement('link');
			tag.rel = 'stylesheet';
			tag.type = 'text/css';
			tag.media = 'screen';
			tag.href = urls[key];
			document.getElementsByTagName('head')[0].appendChild(tag);

			// add to collection
			include.getCollection()[urls[key]] = true;
		}
	}
};
