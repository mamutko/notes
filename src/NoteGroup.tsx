import { Key } from "react";
import PersistentNote from "./PersistentNote";
import usePersistentState, { initializePersistentState } from "./PersistentState";
import "./PersistentNoteGroup.css"

export interface Props {
  description: string;
  dateStart?: Date | undefined;
  dateEnd?: Date | undefined;
  noteKeyList: string[];
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onAddLabel: (noteKey: string, label: string) => void;
  onRemoveLabel: (noteKey: string, label: string) => void;
}

function NoteGroup(props: Props) {

    function getDescription()
    {
      let description = "Note Group";

      if (props.dateStart)
      {
        description = description + " " + props.dateStart.toDateString() + " - " + props.dateEnd?.toDateString();
      }

      if (props.description)
      {
        description = description + " " + props.description;
      }

      if (!description)
      {
        description = `${props.noteKeyList.length} notes`
      }

      return description;
    }
  
    return (
    <div className='note-group'>
      <div className='note-group-header'>
        <div className='note-group-description'>
        <div className='note-group-description-text'>{getDescription()}</div>
        </div>
        <button className='note-group-collapse-button' onClick={() => props.setCollapsed(!props.collapsed)}>{props.collapsed ? "Expand" : "Collapse"}</button>
      </div>
      {!props.collapsed && (<>
        {props.noteKeyList.map((noteKey: string) => (
          <PersistentNote key={noteKey} storageKey={noteKey} onAddLabel={props.onAddLabel} onRemoveLabel={props.onRemoveLabel}/>
        ))}

      </>)}
      {props.collapsed && (
            <div className="note-group-collapsed-body">... {props.noteKeyList.length} notes. <button onClick={() => props.setCollapsed(!props.collapsed)}>Expand</button></div>
        )}
    </div>
    );
  }

  // TODO: remove -- former Add Note footer and button.
  // <div className='note-group-footer'>
  // <div className='note-group-footer-content'></div>
  // {props.allowAddNote && <button className='note-group-add-note-button' onClick={onAddNote}>Add Note</button>}
  // </div>

  export default NoteGroup;
  