import { Key } from "react";
import PersistentNote from "./PersistentNote";
import usePersistentState from "./PersistentState";
import PersistentNoteGroup, { createNoteGroup } from "./PersistentNoteGroup";
import './PersistentNotebook.css';


export interface Props {
  storageKey : string;
}

export class State {
  nextNoteGroupId: number = 0;
  noteGroupList: string[] = [];
  lastNoteGroupCreationTime: Date = new Date();
}

function thisMonday()
{
  let now = new Date();
  now.setHours(0,0,0,0);

  let offset = now.getDay();
  if (offset == 0)
  {
    offset = 6;
  }
  else
  {
    offset = offset - 1;
  }

  return new Date(now.setDate(now.getDate() - offset));
}

function PersistentNotebook(props: Props) {
    const [state, setState] = usePersistentState(props.storageKey, new State())

    function addNoteGroup() {
      const noteGroupStorageKey = `${props.storageKey}-notegroup-v0-element${state.nextNoteGroupId}`;
      const newState = {
        nextNoteGroupId: state.nextNoteGroupId + 1,
        noteGroupList: [...state.noteGroupList, noteGroupStorageKey],
        lastNoteGroupCreationTime: new Date(),
      }

      let monday = thisMonday();
      let nextMonday = new Date(monday);
      nextMonday.setDate(monday.getDate() + 7);

      createNoteGroup(noteGroupStorageKey, "", monday, nextMonday);
  
      setState(newState);
    }

    if (!state.lastNoteGroupCreationTime || state.lastNoteGroupCreationTime < thisMonday())
    {
      console.log("Creating new note-group for this week!")
      addNoteGroup();
      return <></>;
    }

    const lastIndex = state.noteGroupList.length - 1;

    return (<div className={'note-book'}>
    {state.noteGroupList.map((noteKey: string, index: number) => (
        <PersistentNoteGroup key={noteKey} storageKey={noteKey} allowAddNote={index == lastIndex}/>
    ))}
    {
      // <button onClick={onAddNoteGroup}>Add NoteGroup</button>
    }
    </div>
    );
    
  }

  export default PersistentNotebook;
  