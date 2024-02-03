import React from "react";

export function initializePersistentState<T>(key: string, initialState: T) {
  const stringValue = JSON.stringify(initialState);
  localStorage.setItem(key, stringValue);
}

export interface Serializable {
  fixUpDates: () => void;
}

function usePersistentState<T extends Serializable>(key: string, initialValue: T):[T, (value: T) => void] {
    const storedValue = localStorage.getItem(key)
  
    console.log(`localStore - getItem(${key}) -> ${storedValue}`)

    let storedObject: T = (storedValue === null ? initialValue : JSON.parse(storedValue));
    storedObject.fixUpDates();
  
    const [value, setValue] = React.useState(storedObject)
  
    function setAndPersistValue(value: T) {
      const stringValue = JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      console.log(`localStore - setItem(${key}, ${value})`)
      setValue(value);
    }
  
    return [value, setAndPersistValue];
  
  }

  export default usePersistentState;