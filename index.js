var _ = require('underscore');

var UseThis = function (obj) {
	if (!(this instanceof UseThis))
		return new UseThis(obj);
	this._wrapped = obj;
};

UseThis.prototype.checkIsNested = function (value) {
	return value.indexOf('.') > -1 ? true : false;
};

UseThis.prototype.getThis = function (property, root) {
	var self = this,
		root = _.isObject(root) ? root : self._wrapped[root];
	if (!(self.checkIsNested(property))) return root[property];

	var nests = property.split('.'), depth = nests.length, i = 0;
	return (function next(result, i) {
		if (i === depth) return result;
		result = result[nests[i]];
		return next(result, i + 1);
	})(root, i);
};

UseThis.prototype.pluckThis = function (property) {
	var self = this, result = [], obj = self._wrapped;
	if (!(_.isArray(obj))) {
		result.push(self.getThis(property, root));
	} else {
		_.each(obj, function (o, i) {
			result.push(self.getThis(property, o));
		});
	}
	return result;
};

UseThis.prototype.pairThese = function (keyProperty, valueProperty) {
	var self = this, obj = self._wrapped,
	keys = !(self.checkIsNested(keyProperty)) ? _.pluck(obj, keyProperty) : [],
	values = !(self.checkIsNested(valueProperty)) ? _.pluck(obj, valueProperty) : [];

	if (_.isEmpty(keys))
		keys = self.pluckThis(keyProperty);
	if (_.isEmpty(values))
		values = self.pluckThis(valueProperty);

	if (keys.length !== values.length)
		return null;

	return _.object(keys, values);
};

UseThis.prototype.fillThisTemplate = function(template, pattern) {
	var self = this, obj = self._wrapped;
	var templateKeys = function(tmpl) {
		var keys = _.keys(tmpl); result = [];
		
		_.each(keys, function(k, i) {
			if (tmpl[k].indexOf('{') > -1) result.push(k);
		});
		
		return result;
	}

	var applyPattern = function(key, tmpl, pattern, propertyValue, index) {
		tmpl = tmpl.replace('{' + key + '}', 
			pattern.value === 'propertyValue' ? propertyValue : index);
		
		return tmpl;
	}

	var applyRepeat = function(tmplKey, propertyKey, tmpl, pattern, propertyValue) {
		var repeat = 0, result = [], appliedTemplate = {};
		
		if (_.isNumber(pattern.repeat))
			repeat = pattern.repeat
		else if (pattern.repeat === 'propertyValue') 
			repeat = propertyValue
		else if (pattern.repeat === 'propertyValueLength')
			repeat = propertyValue.length
		
		for (var i = 0; i < repeat; i++) {
			appliedTemplate = _.clone(tmpl);
			appliedTemplate[tmplKey] = applyPattern(propertyKey, appliedTemplate[tmplKey], pattern, propertyValue, i);
			result.push(appliedTemplate);
		}
		
		return result;
	}

	var objectTemplate = function(tmpl, pattern) {
		var propertyValue = '', keys = templateKeys(tmpl), 
			appliedTemplate = {},	repeat = [], result = [];
		
		_.each(obj, function(o, oIndex) {
			appliedTemplate = _.clone(tmpl);
			_.each(keys, function(k, kIndex) {
				_.each(appliedTemplate[k].match(/\{(.*?)\}/g), function(m, mIndex) {
					m = m.replace(/[{}]/g, '');
					propertyValue = self.checkIsNested(m) ? self.getThis(m, o) : o[m];
					if (_.property('repeat')(pattern[m])) {
						repeat = applyRepeat(k, m, appliedTemplate, pattern[m], propertyValue);
					} else {
						appliedTemplate[k] = applyPattern(m, appliedTemplate[k], pattern[m], propertyValue, oIndex)
					}
				});
			});
			if (_.isEmpty(repeat)) result.push(appliedTemplate);
			else result.push(repeat);
		});
		result = _.flatten(result);
		return result;
	};
	
	if (_.isObject(template)) return objectTemplate(template, pattern);
	return null;
}

module.exports = UseThis;