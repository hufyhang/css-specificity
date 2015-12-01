### CSS Specificity Calculator in JavaScript

#### What?

A JavaScript library for calculating CSS specificity.

#### How?

This module only exposes a `calc` method.

##### calc(_cssSelector_)
+ __[Returns]__: A array of numbers representing CSS specificity.
+ __cssSelector__: A CSS selector string to be calculated.

#### Example

In Node.JS:

~~~js
var calc = require('./path/to/this/module/index.js').calc;
calc('#id #another-id #and_another-id'); // returns [0, 3, 0, 0]
~~~

In HTML + JavaScript:

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body>
    <script src="./path/to/this/module/index.js"></script>    
    <script type="text/javascript">
        window.cssSpecificity.calc('#id #another-id #and_another');
        // returns [0, 3, 0, 0]
    </script>
</body>
</html>
~~~
