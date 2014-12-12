use-this
========

Just some underscore implementations. 

Possible use:
---------

````javascript
var person = [
    {name: { first: 'Gian', last: 'Febrian' } },
    {name: { first: 'Suci', last: 'Alfia' } }
];
````

To get nested property value 
````javascript
useThis(person).getThis('name.first', 0); //Gian
useThis(person).getThis('name.first', 0); //Suci
````

To pluck nested property value 
````javascript
useThis(person).pluckThis('name.first'); 
//['Gian', 'Suci']
````

To pair property value
````javascript
useThis(person).pairThese('name.first', 'name.last'); 
//{Gian: 'Febrian', Suci: 'Alfia'}
````

To fill template object
````javascript
var template = { fullName: '{name.first} {name.last}' }
var pattern = { 
    'name.first': {value: 'propertyValue'}, 
    'name.last': {value: 'propertyValue'}}

useThis(person).fillThisTemplate(template, pattern); 
//[ { fullName: 'Gian Febrian' }, { fullName: 'Suci Alfia' } ]
````


