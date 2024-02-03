export {}

// import { Key } from "react";
// import PersistentNote from "./PersistentNote";
// import usePersistentState, { Serializable, initializePersistentState } from "./PersistentState";
// import "./PersistentNoteGroup.css"

// export interface Props {
//   storageKey : string;
//   allowAddNote : boolean;
// }

// export class State implements Serializable{

//   fixUpDates()
//   {
//     if (this.dateStart)
//       this.dateStart = new Date(this.dateStart);
//     if (this.dateEnd)
//       this.dateEnd = new Date(this.dateEnd);
//   }

//   description: string = "";
//   dateStart: Date | undefined;
//   dateEnd: Date | undefined;
//   noteKeyList: string[] = [];
// }

// export function createNoteGroup(storagKey: string, description: string, dateStart: Date | undefined = undefined, dateEnd: Date | undefined = undefined)
// {
//   let initialState = new State()
//   initialState.description = description;
//   initialState.dateStart = dateStart;
//   initialState.dateEnd = dateEnd;
//   initializePersistentState(storagKey, initialState);
// }

// function PersistentNoteGroup(props: Props) {
//     const [state, setState] = usePersistentState(props.storageKey, new State())
  
//     function onAddNote() {
//       let newState = new State()
//       newState.collapsed = state.collapsed;
//       newState.nextNoteId = state.nextNoteId + 1;
//       newState.noteKeyList = [...state.noteKeyList, `${props.storageKey}-note-v0-element${state.nextNoteId}`]
//       newState.description = state.description;
//       newState.dateStart = state.dateStart;
//       newState.dateEnd = state.dateEnd;

//       // TODO: use some kind of 'clone' on state so that we don't have to copy all fields manually.

//       setState(newState);
//     }
  
//     function onToggleCollapse() {
//       let newState = new State()
//       newState.collapsed = !state.collapsed;
//       newState.nextNoteId = state.nextNoteId;
//       newState.noteKeyList = state.noteKeyList;

//       setState(newState);
//     }

//     function getDescription()
//     {
//       let description = "Note Group";

//       if (state.dateStart)
//       {
//         description = description + " " + state.dateStart.toDateString() + " - " + state.dateEnd?.toDateString();
//       }

//       if (state.description)
//       {
//         description = description + " " + state.description;
//       }

//       if (!description)
//       {
//         description = `${state.noteKeyList.length} notes`
//       }

//       return description;
//     }
  
//     return (
//     <div className='note-group'>
//       <div className='note-group-header'>
//         <div className='note-group-description'>
//         <div className='note-group-description-text'>{getDescription()}</div>
//         </div>
//         <button className='note-group-collapse-button' onClick={onToggleCollapse}>{state.collapsed ? "Expand" : "Collapse"}</button>
//       </div>
//       {!state.collapsed && (<>
//         {state.noteKeyList.map((noteKey: string) => (
//           <PersistentNote key={noteKey} storageKey={noteKey} />
//         ))}
//         <div className='note-group-footer'>
//           <div className='note-group-footer-content'></div>
//           {props.allowAddNote && <button className='note-group-add-note-button' onClick={onAddNote}>Add Note</button>}
//         </div>
//       </>)}
//       {state.collapsed && (
//             <div className="note-group-collapsed-body">... {state.noteKeyList.length} notes. <button onClick={onToggleCollapse}>Expand</button></div>
//         )}
//     </div>
//     );
//   }

//   export default PersistentNoteGroup;
  