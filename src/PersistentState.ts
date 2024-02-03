import React from "react";

export function initializePersistentState<T>(key: string, initialState: T) {
  const stringValue = JSON.stringify(initialState);
  localStorage.setItem(key, stringValue);
}

export interface Serializable {
  fixUpDates: () => void;
}

// replacer/reviver from: https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map

function replacer(key: string, value: any) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key: string, value: any) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

function usePersistentState<T extends Serializable>(key: string, initialValue: T):[T, (value: T) => void] {
    const storedValue = localStorage.getItem(key)
  
    console.log(`localStore - getItem(${key}) -> ${storedValue}`)

    let storedObject: T = (storedValue === null ? initialValue : JSON.parse(storedValue, reviver));

    storedObject.fixUpDates = initialValue.fixUpDates;
    storedObject.fixUpDates();
  
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