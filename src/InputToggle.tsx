import React from "react";

function InputToggle(props: any) {

    const [isInputActive, setIsInputActive] = React.useState(true);

    function updateIsInputActive(newIsInputActive : boolean)
    {
      if (newIsInputActive === isInputActive)
      {
        return;
      }

      if (newIsInputActive)
      {
        document.documentElement.style.setProperty('--texarea-pointer-events', 'auto');
        document.documentElement.style.setProperty('--pre-pointer-events', 'none');
        console.log('input >>> textarea')
        setIsInputActive(true);
      }
      else
      {
        document.documentElement.style.setProperty('--texarea-pointer-events', 'none');
        document.documentElement.style.setProperty('--pre-pointer-events', 'auto');
        console.log('input >>> pre')
        setIsInputActive(false);
      }
    }
  
    function keyDown(e: any) {
      if (e.keyCode === 17 /*ctrl*/ ) {
        updateIsInputActive(false);
      }
  
    }
  
    function keyUp(e: any) {
      if (e.keyCode === 17 /*ctrl*/ ) {
        updateIsInputActive(true);
      }
    }

    // TODO: make this work with crtl/meta on both OSes
    function mouseEvent(e: any)
    {
      updateIsInputActive(!e.metaKey)
    }
  
    // TODO: Remove?
    function blur(e: any) {
  
      if (!isInputActive) {
        document.documentElement.style.setProperty('--texarea-pointer-events', 'auto');
        document.documentElement.style.setProperty('--pre-pointer-events', 'none');
        console.log('input >>> textarea (blur)')
        setIsInputActive(true);
      }
    }
  
    return (
      <div onKeyDown={keyDown} onKeyUp={keyUp} onMouseMove={mouseEvent}>
        {props.children}
      </div>
    );
  }
  
  export default InputToggle;