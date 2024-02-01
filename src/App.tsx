import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import WickedNote from './WickedNote';
import InputToggle from './InputToggle';
import PersistentNote, { State as NoteState } from './PersistentNote';
import PersistentNoteGroup, { State as NoteGroupState } from './PersistentNoteGroup';
import PersistentNotebook, { State as NotebookState} from './PersistentNotebook';
import PageOpener from './PageOpener';


const NOTEBOOK_KEY:string = "pnbv1"

function downloadObject<T>(fileName: string, object: T)
{
  // Based on: https://stackoverflow.com/questions/66078335/how-do-i-save-a-file-on-my-desktop-using-reactjs
  const a = document.createElement('a');
  a.download = fileName;
  const blob = new Blob([JSON.stringify(object, null, 2)], {type : 'application/json'});
  a.href = URL.createObjectURL(blob)
  a.addEventListener('click', (e) => {setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000)});
  a.click();
}

function App() {  

  // TODO: move this out of App.tsx into it's own component.
  function writeFile() {

    let data: any = {};

    const notebook: NotebookState = JSON.parse(localStorage.getItem(NOTEBOOK_KEY) || "");

    data[NOTEBOOK_KEY] = notebook;

    notebook.noteGroupList.forEach((key) => {
      const notegroup: NoteGroupState = JSON.parse(localStorage.getItem(key) || "");   
      data[key] = notegroup;

      notegroup.noteKeyList.forEach((key) => {
        console.info(`key: ${key}, value: ${localStorage.getItem(key)}`);
        const keyValue = localStorage.getItem(key);

        if (keyValue)
        {
          const note: NoteState = JSON.parse(keyValue);   
          data[key] = note;
        }
      });
    });

    downloadObject('data.json', data);
  }

  function loadFile(file: File)
  {
    // Backup current data first.
    writeFile();

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target)
      {
        var contentString = e.target.result as string;
        let content = JSON.parse(contentString);
        loadContent(content);
      }
    };

    reader.readAsText(file);
  }

  function loadContent(content: any)
  {
    for (let [key, value] of Object.entries(content))
    {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  return (
    <div className="App">
      <button onClick={writeFile}>Write File</button>
      <button onClick={() => document.getElementById("loadFileInput")?.click()}>Load File</button>
      <input id="loadFileInput" type="file" style={{"visibility": "hidden"}} onChange={(e) => { if (e.target.files) loadFile(e.target.files[0]);}}/>
      <InputToggle>
        <PersistentNotebook storageKey={NOTEBOOK_KEY} />
      </InputToggle>
    </div>
  );
}

export default App;
