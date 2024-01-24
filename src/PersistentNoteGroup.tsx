import { Key } from "react";
import PersistentNote from "./PersistentNote";
import usePersistentState from "./PersistentState";

export interface Props {
  storageKey : string;
}

export class State {
  collapsed: boolean = false;
  nextNoteId: number = 0;
  noteKeyList: string[] = [];
}

function PersistentNoteGroup(props: Props) {
    const [state, setState] = usePersistentState(props.storageKey, new State())
  
    function onAddNote() {
      let newState = new State()
      newState.collapsed = state.collapsed;
      newState.nextNoteId = state.nextNoteId + 1;
      newState.noteKeyList = [...state.noteKeyList, `${props.storageKey}-note-v0-element${state.nextNoteId}`]

      setState(newState);
    }
  
    function onToggleCollapse() {
      let newState = new State()
      newState.collapsed = !state.collapsed;
      newState.nextNoteId = state.nextNoteId;
      newState.noteKeyList = state.noteKeyList;

      setState(newState);
    }
  
    if (state.collapsed) {
      return (<>
        <button onClick={onToggleCollapse}>Expand</button>
      </>
      );
    }
    else {
      return (<div className={'note-group'} style={{borderBottom: '2px solid green', padding:'4px'}}>
        <button onClick={onToggleCollapse}>Collapse</button>
        {state.noteKeyList.map((noteKey: string) => (
          <PersistentNote key={noteKey} storageKey={noteKey} />
        ))}
        <button onClick={onAddNote}>Add Note</button>
      </div>
      );
    }
  }

  export default PersistentNoteGroup;
  