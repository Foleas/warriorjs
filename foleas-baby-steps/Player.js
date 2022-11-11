class Player {
  /**
   * Plays a warrior turn.
   *
   * @param {Warrior} warrior The warrior.
   */
  constructor() {
    this.health = 20;
    this.isReatreating = false;
    this.walkThreshold = 13;
    this.attackThreshold = 5;
  }

  playTurn(warrior) {
    // Cool code goes here

    if (!this.looking(warrior)) {
      this.feeling(warrior);
    }
    this.health = warrior.health();
  }

  hadDamage(warrior) {
    return warrior.health() < this.health ? true : false;
  }

  isFullHealth(warrior) {
    return warrior.health() === warrior.maxHealth() ? true : false;
  }

  retreat(warrior) {
    this.isReatreating = true;
    if (!this.isFullHealth(warrior)) {
      if (this.hadDamage(warrior)) {
        warrior.think("retreat");
        // = 'backward';
        warrior.walk("backward");
      } else {
        warrior.rest();
      }
    } else {
      // = 'forward';
      warrior.pivot();
    }
  }

  feeling(warrior) {
    warrior.think("FEELING");
    const warriorFeel = warrior.feel();
    // warrior.think(warriorFeel);

    if (warriorFeel.isEmpty()) {
      warrior.think("isEmpty");

      if (!this.hadDamage(warrior)) {
        if (!this.isReatreating) {
          warrior.think("NO DAMAGE");
          warrior.walk();
        } else {
          if (!this.isFullHealth(warrior)) {
            warrior.rest();
          } else {
            this.isReatreating = false;
            warrior.walk();
          }
        }
      } else {
        //warrior.pivot();
        //warrior.walk('backward');
        if (warrior.health() < this.walkThreshold) {
          this.retreat(warrior);
        } else {
          warrior.walk();
        }
      }
    } else if (warriorFeel.isWall()) {
      warrior.think("isWall");
      if (this.isFullHealth(warrior)) {
        warrior.pivot();
      } else {
        warrior.rest();
      }

      //    }else if(warriorFeel.isStairs()){
      //      warrior.think("isStairs");
    } else if (warriorFeel.isUnit()) {
      warrior.think("isUnit");
      const unit = warriorFeel.getUnit();
      //warrior.think(unit);
      if (unit.isEnemy()) {
        if (warrior.health() >= this.attackThreshold) {
          warrior.think("attackin");
          warrior.attack();
        } else {
          warrior.walk("backward");
          //this.retreat(warrior);
        }
      } else if (unit.isBound()) {
        warrior.rescue();
      }
    }
  }

  looking(warrior) {
    warrior.think("LOOKING");
    const warriorLook = warrior.look();

    let isUnitLook = false;
    let unitLookIndex = -1;

    for (let i = 0; i < warriorLook.length; i++) {
      if (warriorLook[i].isEmpty()) {
        warrior.think("isEmpty");
      } else if (warriorLook[i].isWall()) {
        warrior.think("isWall");
      } else if (warriorLook[i].isUnit()) {
        warrior.think("isUnit");
        const unitLook = warriorLook[i].getUnit();
        //warrior.think(unit);
        if (unitLook.isBound()) {
          isUnitLook = false;
          break;
        } else if (unitLook.isEnemy()) {
          isUnitLook = true;
          unitLookIndex = i;
          //break;
        }
      }
    }

    if (isUnitLook && !this.hadDamage(warrior)) {
      warrior.shoot();
      return true;
    } else {
      return false;
    }
  }

  isEnemyInSight(warrior) {
    const spaceWithUnit = warrior.look().find((space) => space.isUnit());
    return spaceWithUnit && spaceWithUnit.getUnit().isEnemy();
  }
}
