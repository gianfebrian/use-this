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

module.exports = UseThis;