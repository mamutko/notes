import { Key } from "react";
import PersistentNote from "./PersistentNote";
import usePersistentState from "./PersistentState";
import PersistentNoteGroup from "./PersistentNoteGroup";
import './PersistentNotebook.css';


export interface Props {
  storageKey : string;
}

export class State {
  nextNoteGroupId: number = 0;
  noteGroupList: string[] = [];  
}

function PersistentNotebook(props: Props) {
    const [state, setState] = usePersistentState(props.storageKey, new State())
  
    function onAddNoteGroup() {
      const newState = {
        nextNoteGroupId: state.nextNoteGroupId + 1,
        noteGroupList: [...state.noteGroupList, `${props.storageKey}-notegroup-v0-element${state.noteGroupList}`]
      }
  
      setState(newState);
    }

    return (<div className={'note-book'}>
    {state.noteGroupList.map((noteKey: string) => (
        <PersistentNoteGroup key={noteKey} storageKey={noteKey} />
    ))}
    <button onClick={onAddNoteGroup}>Add NoteGroup</button>
    </div>
    );
    
  }

  export default PersistentNotebook;
  