
exa.provide('exa.util');

exa.util.templateRegExp = /{{(.*?)}}/g;

exa.util.renderTemplate = function(template, data) {
    return template.replace(exa.util.templateRegExp, function (match, name) {
        return data[name];
    });
};
        
