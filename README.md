# include.js
Loader JavaScript and CSS files

## Example

```js
include.css('/css/style.css');

include.css([
    '/css/first_style.css',
    '/css/second_style.css'
]);

include.js('/js/script.js');

include.js([
    '/js/first_script.js',
    '/js/second_script.js'
], function() {
    // do something after load all files
}, false);
```
