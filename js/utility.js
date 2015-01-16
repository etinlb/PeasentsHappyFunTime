function applyToNestedObject(nestedObj, func) {
  for (type in nestedObj) {
    for (var i = nestedObj[type].length - 1; i >= 0; i--) {
      func(nestedObj[type][i]);
    };
  }
}

function callToNestedObject(nestedObj, func, args) {
  for (type in nestedObj) {
    for (var i = nestedObj[type].length - 1; i >= 0; i--) {
      nestedObj[type][i][func].call(nestedObj[type][i], args); // I think there could be a better way to do this 
    };
  }
}

function createEntity(properties, components) {
  var prop;
  var entity = {
    properties: {},
    components: []
  }
  return createEntityFromTemplate(entity);
}

function createEntityFromTemplate(templateObj) {
  var prop;
  console.log(templateObj);
  for (prop in templateObj.properties) {
    templateObj[prop] = templateObj.properties[prop];
  }

  templateObj.components.forEach(function(component) {
    for (prop in component) {
      if (templateObj.hasOwnProperty(prop)) {
        // continue
        if(templateObj.overLoadedPrecedence !== undefined && templateObj.overLoadedPrecedence[prop] === component.type ){
          console.log("setting precedenc" + prop)
          templateObj[prop] = component[prop];          
        }
          // throw "Entity property conflict! " + prop;
      }else{
        templateObj[prop] = component[prop];
      }
    }
  });
  return templateObj;
}