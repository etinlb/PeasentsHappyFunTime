/**
 * Game object constructors. They are just a grouping of component objects
 * It
 */
function AttackUnit() {
  this.properties = {
    type: "AttackUnit",
    hp: 10
  }
  this.components = [
      new Damageable(),
      new Rect(20, 20, 20, 20),
      new Unit(),
      new Attacker()
    ]
    // If there is a naming conflict in properties, set which to use here
  this.overLoadedPrecedence = {
    "update": "Attacker"
  }
  createEntityFromTemplate(this); // utility.js
}

function Building() {
  this.properties = {
    type: "Building",
    hp: 10,
    color: "#0077ff"
  }
  this.components = [
    new Damageable(),
    new Rect(200, 200, 20, 20),
    new Unit()
  ]
  createEntityFromTemplate(this); // utility.js
}