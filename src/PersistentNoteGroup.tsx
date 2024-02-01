import { Key } from "react";
import PersistentNote from "./PersistentNote";
import usePersistentState, { initializePersistentState } from "./PersistentState";

export interface Props {
  storageKey : string;
  allowAddNote : boolean;
}

export class State {
  description: string = "";
  dateStart: Date | undefined;
  dateEnd: Date | undefined;
  collapsed: boolean = false;
  nextNoteId: number = 0;
  noteKeyList: string[] = [];
}

export function createNoteGroup(storagKey: string, description: string, dateStart: Date | undefined = undefined, dateEnd: Date | undefined = undefined)
{
  let initialState = new State()
  initialState.description = description;
  initialState.dateStart = dateStart;
  initialState.dateEnd = dateEnd;
  initializePersistentState(storagKey, initialState);
}

function PersistentNoteGroup(props: Props) {
    const [state, setState] = usePersistentState(props.storageKey, new State())
  
    // TODO: HACK - dates don't deserialize as dates, fix
    if (state.dateStart)
      state.dateStart = new Date(state.dateStart);
    if (state.dateEnd)
      state.dateEnd = new Date(state.dateEnd);
  

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

    function getDescription()
    {
      let description = "";

      if (state.dateStart)
      {
        description = description + state.dateStart.toDateString() + " - " + state.dateEnd?.toDateString();
      }

      if (state.description)
      {
        description = description + " " + state.description;
      }

      return description;
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
        <div>{getDescription()}</div>
        {state.noteKeyList.map((noteKey: string) => (
          <PersistentNote key={noteKey} storageKey={noteKey} />
        ))}
        {props.allowAddNote && <button onClick={onAddNote}>Add Note</button>}
      </div>
      );
    }
  }

  export default PersistentNoteGroup;
  