import React from "react";

export function initializePersistentState<T>(key: string, initialState: T) {
  const stringValue = JSON.stringify(initialState);
  localStorage.setItem(key, stringValue);
}

// replacer/reviver from source:
//  - for Map: https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
//  - for Date: https://stackoverflow.com/questions/24660720/whats-the-best-way-to-revive-json-dates-in-javascript

function replacer(key: string, value: any) {
  if(value instanceof Map) {
    return {
      wnDataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key: string, value: any) {
  if (typeof value === "string" && /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/.test(value)) {
    return new Date(value);
  }
  if(typeof value === 'object' && value !== null) {
    if (value.wnDataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

function usePersistentState<T>(key: string, initialValue: T):[T, (value: T) => void] {
    const storedValue = localStorage.getItem(key)
  
    console.log(`localStore - getItem(${key}) -> ${storedValue}`)

    let storedObject: T = (storedValue === null ? initialValue : JSON.parse(storedValue, reviver));
  
    const [value, setValue] = React.useState(storedObject)
  
    function setAndPersistValue(value: T) {
      const stringValue = JSON.stringify(value, replacer);
      localStorage.setItem(key, stringValue);
      console.log(`localStore - setItem(${key}, ${stringValue})`)
      setValue(value);
    }
  
    return [value, setAndPersistValue];
  
  }

  export default usePersistentState;