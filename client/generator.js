import { PwdComponents } from "./pwdComponents.js";

const DEFAULT_LENGTH = 6;
const COMPONENTS = ["numbers", "lowercases", "uppercases", "symbols"];
const FILTERS = ["similar", "ambiguous"];

// shuffle the input array
function shuffle(array) {
  let m = array.length;

  while (m) {
    let i = Math.floor(Math.random() * m--);
    let t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

class PasswordGenerator {
  constructor() {
    // generator default settings:
    this.length = DEFAULT_LENGTH;
    // password components
    this.includeNumber = true;
    this.includeLowercase = true;
    this.includeUppercase = true;
    this.includeSymbol = true;
    // generator filters
    this.excludeSimilar = false;
    this.excludeAmbiguous = false;
  }

  setLength(length) {
    this.length = length;
  }

  setIncludedComponent(component, setting) {
    if (component === "numbers") {
      this.includeNumber = setting;
    } else if (component === "lowercases") {
      this.includeLowercase = setting;
    } else if (component === "uppercases") {
      this.includeUppercase = setting;
    } else if (component === "symbols") {
      this.includeSymbol = setting;
    } else {
      return -1;
    }
  }

  setFilter(filter, setting) {
    if (filter === "similar") {
      this.excludeSimilar = setting;
    } else if (filter === "ambiguous") {
      this.excludeAmbiguous = setting;
    } else {
      return -1;
    }
  }

  generate() {
    // return -1 if none of the password components are included (unable to generate any passwords)
    if (this._getSettings().every(isSettingOn => !isSettingOn)) {
      return -1;
    }

    let newPwd = []; // store the generated password
    let length = this.length; // final length of the generated password
    const filter = []; // store the filters
  
    // store the password components after the filters are applied to them
    const filteredResults = { numbers: [], lowercases: [], uppercases: [], symbols: [] }; 

    // add filters that are on to the generator
    this._getFilters().forEach((filterSetting, index) => {
      if (filterSetting) {
        filter.push(PwdComponents.getFilter(FILTERS[index]));
      } else {
        filter.push([]);
      }
    });

    // apply the filters that the user chose to the password components such that the generated password will not 
    // include any characters that are in the filters
    const filtering = (characters) => {
      if (this.excludeSimilar && this.excludeAmbiguous) {
        return characters.filter((ch) => !(filter[0].includes(ch) || filter[1].includes(ch)));
      } else if (this.excludeSimilar) {
        return characters.filter((ch) => !filter[0].includes(ch));
      } else if (this.excludeAmbiguous) {
        return characters.filter((ch) => !filter[1].includes(ch));
      } else {
        return characters;
      }
    };

    // starts generating the first part of the password where it includes one character from each of the password 
    // component that the user choose to include. Total (length - # of included components) characters will be added
    // in this process
    this._getSettings().forEach((setting, index) => {
      if (setting) {
        const componentName = COMPONENTS[index];
        filteredResults[componentName] = filtering(PwdComponents.getComponent(componentName));

        const randomIdx = Math.floor(Math.random() * filteredResults[componentName].length);
        newPwd.push(filteredResults[componentName][randomIdx]);
        length--;
      }
    });

    // generate the remaining part of the password. Each of the remaining characters will be randomly selected from the
    // password component that the user choose to include
    while (length > 0) {
      const randomIdx = Math.floor(Math.random() * COMPONENTS.length);
      if (!this._getSettings()[randomIdx]) {
        continue;
      }

      const randomComponent = filteredResults[COMPONENTS[randomIdx]];
      const randomComponentIdx = Math.floor(Math.random() * randomComponent.length);
      newPwd.push(randomComponent[randomComponentIdx]);
      length--;
    }

    // shuffle the generated password to make it more randomized, then return the result as a string                                                                                                                      m                 
    return shuffle(newPwd).join("");
  }

  _getSettings() {
    return [this.includeNumber, this.includeLowercase, this.includeUppercase, this.includeSymbol];
  }

  _getFilters() {
    return [this.excludeSimilar, this.excludeAmbiguous];
  }
}

const pwdGenerator = new PasswordGenerator();

export { pwdGenerator, COMPONENTS, FILTERS };
