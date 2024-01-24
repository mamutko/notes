import React from "react";

function usePersistentState<T>(key: string, initialValue: T):[T, (value: T) => void] {
    const storedValue = localStorage.getItem(key)
  
    console.log(`localStore - getItem(${key}) -> ${storedValue}`)
  
    const [value, setValue] = React.useState(storedValue === null ? initialValue : JSON.parse(storedValue))
  
    function setAndPersistValue(value: T) {
      const stringValue = JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      console.log(`localStore - setItem(${key}, ${value})`)
      setValue(value);
    }
  
    return [value, setAndPersistValue];
  
  }

  export default usePersistentState;