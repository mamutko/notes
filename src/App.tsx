import React, { useState } from 'react';
import './App.css';
import WickedNote from './WickedNote';
import InputToggle from './InputToggle';
import PersistentNote, { State as NoteState, createPersistentNote } from './PersistentNote';
//import PersistentNoteGroup, { State as NoteGroupState } from './PersistentNoteGroup';
import PersistentNotebook, { State as NotebookState} from './PersistentNotebook';
import PageOpener from './PageOpener';
import { wnParse, wnStringify } from './PersistentState';


const NOTEBOOK_KEY:string = "notebook_v5"

function downloadObject<T>(fileName: string, object: T)
{
  // Based on: https://stackoverflow.com/questions/66078335/how-do-i-save-a-file-on-my-desktop-using-reactjs
  const a = document.createElement('a');
  a.download = fileName;
  const blob = new Blob([wnStringify(object)], {type : 'application/json'});
  a.href = URL.createObjectURL(blob)
  a.addEventListener('click', (e) => {setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000)});
  a.click();
}

function App() {  

  // TODO: move this out of App.tsx into it's own component.
  function writeFile() {

    let data: any = {};

    console.log("WRITE FILE");
    const notebookJson = localStorage.getItem(NOTEBOOK_KEY) || "";
    console.log(notebookJson);
    const notebook: NotebookState = wnParse(notebookJson);
    console.log(notebook);

    data[NOTEBOOK_KEY] = notebook;

    let noteKeyList = new Set<string>();

    for (const [label, notes] of notebook.labelToNotes)
    {
      console.log('Notes')
      console.log(...notes);
      console.log("List")
      console.log(noteKeyList);
      noteKeyList = new Set([...noteKeyList, ...notes]);
    }

    console.log(noteKeyList);

    for (const noteKey of noteKeyList)
    {
      const note: NoteState = wnParse(localStorage.getItem(noteKey) || "");
      data[noteKey] = note;
    }

    downloadObject('notes.json', data); 

    // notebook.noteGroupList.forEach((key) => {
    //   const notegroup: NoteGroupState = JSON.parse(localStorage.getItem(key) || "");   
    //   data[key] = notegroup;

    //   notegroup.noteKeyList.forEach((key) => {
    //     console.info(`key: ${key}, value: ${localStorage.getItem(key)}`);
    //     const keyValue = localStorage.getItem(key);

    //     if (keyValue)
    //     {
    //       const note: NoteState = JSON.parse(keyValue);   
    //       data[key] = note;
    //     }
    //   });
    // });

    // downloadObject('data.json', data);


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
        let content = wnParse(contentString);
        if (/data/.test(file.name))
        {
          // TODO: remove
          loadContentLegacy(content);
        }
        else
        {
          loadContent(content);
        }
      }
    };

    reader.readAsText(file);
  }

  function loadContent(content: any)
  {
    for (let [key, value] of Object.entries(content))
    {
      localStorage.setItem(key, wnStringify(value));
    }


  }

  function loadContentLegacy(content: any)
  {
    console.log('LOAD CONTENT LEGACY')
    // Import legacy JSON
    const notebook: NotebookState = new NotebookState();

    function addLabel(noteKey: string, label: string)
    {
      console.log(`addLabel - key:${noteKey}, label:${label}`)

      if ((notebook.labelToNotes.get(label) ?? []).includes(label))
      {
        // Note already present in label, nothing to do.
        return;
      }

      notebook.labelToNotes.set(label, [...notebook.labelToNotes.get(label) ?? [], noteKey]);
    }

    for (let [key, value] of Object.entries(content))
    {
      if (/-element-note-/.test(key))
      {
        console.log("NOTE");
        console.log(key);
        console.log(value);
        const o = value as {text:string, created:Date, modified:Date};
        let state = new NoteState("");
        state.text = o.text;
        state.created = o.created;
        state.modified = o.modified;
        createPersistentNote(addLabel, state)
      }
      localStorage.setItem(key, wnStringify(value));
    }

    localStorage.setItem(NOTEBOOK_KEY, wnStringify(notebook));
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
