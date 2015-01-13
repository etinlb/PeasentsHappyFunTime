function applyToNestedObject(nestedObj, func){
  for( type in nestedObj){
    for (var i = nestedObj[type].length - 1; i >= 0; i--) {
      func(nestedObj[type][i]);
    };
  }
}

function callToNestedObject(nestedObj, func, args){
  for( type in nestedObj){
    for (var i = nestedObj[type].length - 1; i >= 0; i--) {
      // console.log(nestedObj);
      // console.log(nestedObj[type]);
      // console.log(nestedObj[type][i]);
      // console.log(nestedObj[type][i][func]);
      nestedObj[type][i][func].call(nestedObj[type][i], args);  // I think there could be a better way to do this 
    };
  }
}