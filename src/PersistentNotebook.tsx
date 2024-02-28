import { Key, useEffect, useRef } from "react";
import PersistentNote, { createPersistentNote } from "./PersistentNote";
import usePersistentState from "./PersistentState";
//import PersistentNoteGroup, { createNoteGroup } from "./PersistentNoteGroup";
import './PersistentNotebook.css';
import NoteGroup from "./NoteGroup";


export interface Props {
  storageKey : string;
  filter: string;
}

export class State {
  labelToNotes = new Map<string,string[]>();
}

export class NoteGroupViewState {
  label: string = "";
  collapsed: boolean = false;
}

export class NotebookState {
  noteGroups : NoteGroupViewState[] = new Array<NoteGroupViewState>();
}

function PersistentNotebook(props: Props) {
    const [state, setState] = usePersistentState(props.storageKey, new State())
    const [viewState, setViewState] = usePersistentState(props.storageKey + "_view", new NotebookState())

    console.log(`Notebook filter: ${props.filter}.`)

    let rerender = false;

    for (const label of state.labelToNotes.keys())
    {
      if (!viewState.noteGroups.find((noteGroup) => noteGroup.label == label))
      {
        let newNoteGroup = new NoteGroupViewState();
        newNoteGroup.label = label;
        viewState.noteGroups.push(newNoteGroup);

        rerender = true;
      }
    }

    if (rerender)
    {
      // TODO: Do not mutate viewState.
      setViewState(viewState);
      return <></>;
    }

    function addLabel(noteKey: string, label: string)
    {
      //console.log(`addLabel - key:${noteKey}, label:${label}`)

      if ((state.labelToNotes.get(label) ?? []).includes(noteKey))
      {
        // Note already present in label, nothing to do.
        return;
      }

      let newState = new State();
      // TODO: deep copy?
      newState.labelToNotes = state.labelToNotes;
      newState.labelToNotes.set(label, [...newState.labelToNotes.get(label) ?? [], noteKey]);

      //console.log(newState);

      //console.log("SET STATE");
      //console.log(newState);

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

    function setCollapsed(noteGroupIndex: number)
    {
      console.log("setCollapsed:" + noteGroupIndex);
      viewState.noteGroups[noteGroupIndex].collapsed = !viewState.noteGroups[noteGroupIndex].collapsed;
      // TODO: do note mutate state.
      let newViewState = new NotebookState();
      newViewState.noteGroups = viewState.noteGroups;
      setViewState(newViewState);
    }

    //console.log("INITIAL STATEL");
    //console.log(state);
    // return (<div className={'note-book'}>
    //   {Array.from(state.labelToNotes).map(([label, notes]) => (
    //     <NoteGroup key={label} description={label} noteKeyList={notes} collapsed={false} setCollapsed={() => {}} onAddLabel={addLabel} onRemoveLabel={removeLabel}/>
    //   ))}

    function indexMapFunc(noteGroup: NoteGroupViewState, index: number): [NoteGroupViewState, number]
    {
      return [noteGroup, index]
    }

    function filterFunc(noteGroupPair: [NoteGroupViewState, number]): boolean
    {
      const [noteGroup, index] = noteGroupPair;

      if (!new RegExp(props.filter).test(noteGroup.label))
      {
        // TODO: Performance, we prepare state for all noteGroups - but then drop those that don't fit filter - only prepare the ones we need?
        // TODO: NoteGroupViewState should be per NotebookView - so independent of this component.
        return false;
      }

      return (state.labelToNotes.get(noteGroup.label) ?? []).length > 0;
    }

    function sortFunc(a: [NoteGroupViewState, number], b: [NoteGroupViewState, number]): number
    {
      const [noteGroupA, indexA] = a;
      const [noteGroupB, indexB] = b;

      return noteGroupA.label.localeCompare(noteGroupB.label);
    }


    return (<div className={'note-book'}>
      {Array.from(viewState.noteGroups).map(indexMapFunc).filter(filterFunc).sort(sortFunc).map(([noteGroup, i]) => (
        <NoteGroup key={noteGroup.label} description={noteGroup.label} noteKeyList={state.labelToNotes.get(noteGroup.label) || []} collapsed={noteGroup.collapsed} setCollapsed={() => {setCollapsed(i);}} onAddLabel={addLabel} onRemoveLabel={removeLabel}/>
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
  