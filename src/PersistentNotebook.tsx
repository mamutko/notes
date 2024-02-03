import { Key } from "react";
import PersistentNote, { createPersistentNote } from "./PersistentNote";
import usePersistentState, { Serializable } from "./PersistentState";
//import PersistentNoteGroup, { createNoteGroup } from "./PersistentNoteGroup";
import './PersistentNotebook.css';
import NoteGroup from "./NoteGroup";


export interface Props {
  storageKey : string;
}

export class State implements Serializable {
  fixUpDates() {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!")
    this.labelToNotes = new Map<string, string[]>(Object.entries(this.labelToNotes));
  }
  labelToNotes = new Map<string,string[]>();
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

    function addLabel(noteKey: string, label: string)
    {
      let newState = new State();
      // TODO: deep copy?
      newState.labelToNotes = state.labelToNotes;
      newState.labelToNotes.set(label, [...newState.labelToNotes.get(label) ?? [], noteKey]);

      console.log(newState);

      console.log("SET STATE");
      console.log(newState);

      setState(newState);
    }

    function removeLabel(noteKey: string, label: string,)
    {
      let newState = new State();
      // TODO: deep copy?
      newState.labelToNotes = state.labelToNotes;
      newState.labelToNotes.set(label, (newState.labelToNotes.get(label) ?? []).filter(x => x != noteKey));

      setState(newState);
    }

    function addNote()
    {
      createPersistentNote(addLabel);
    }

    console.log("INITIAL STATEL");
    console.log(state);

    return (<div className={'note-book'}>
      {Array.from(state.labelToNotes).map(([label, notes]) => (
        <NoteGroup description={label} noteKeyList={notes} collapsed={false} setCollapsed={() => {}} onAddLabel={addLabel} onRemoveLabel={removeLabel}/>
      ))}

      <button onClick={addNote}>Add Note</button>

    </div>);
  


    return <></>;

    // TODO: remove
    // function addNoteGroup() {
    //   const noteGroupStorageKey = `${props.storageKey}-notegroup-v0-element${state.nextNoteGroupId}`;
    //   const newState = {
    //     nextNoteGroupId: state.nextNoteGroupId + 1,
    //     noteGroupList: [...state.noteGroupList, noteGroupStorageKey],
    //     lastNoteGroupCreationTime: new Date(),
    //   }

    //   let monday = thisMonday();
    //   let nextMonday = new Date(monday);
    //   nextMonday.setDate(monday.getDate() + 7);

    //   createNoteGroup(noteGroupStorageKey, "", monday, nextMonday);
  
    //   setState(newState);
    // }

    // if (!state.lastNoteGroupCreationTime || state.lastNoteGroupCreationTime < thisMonday())
    // {
    //   console.log("Creating new note-group for this week!")
    //   addNoteGroup();
    //   return <></>;
    // }

    // const lastIndex = state.noteGroupList.length - 1;

    // [...state.labelToNotes: any.entries()].map((x: any) => x);

    // return (<div className={'note-book'}>
    // {[...state.labelToNotes.entries()].map(([label: string, notes: string[]]) => (
    //     <NoteGroup description="" }/>
    // ))}
    // {
    //   // <button onClick={onAddNoteGroup}>Add NoteGroup</button>
    // }
    // </div>
    // );
    
  }

  export default PersistentNotebook;
  