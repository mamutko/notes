import React, { useState } from 'react';
import Editor from 'react-simple-code-editor'
import './WickedNote.css';
import Highlight from './Highlight';
import usePersistentState from './PersistentState';
import WickedNote from './WickedNote';

export interface Props {
    storageKey : string;
}

export class State {
    constructor(text: string)
    {
        this.text = text;
        this.created = new Date();
        this.modified = new Date();
    }

    text: string;
    created: Date;
    modified: Date;

}

function cloneState(current: State, newText: string) : State
{
    let newState = new State(newText);
    newState.created = current.created;

    return newState;
}

function PersistentNote(props : Props) {
    
    const [state, setState] = usePersistentState(props.storageKey, new State(""));

    // TODO: Consider removing timestamp-container?
    return <>
        <div className='wicked-note-timestamp-container'>
            <div>Created: {state.created.toString()}</div>
            <div>Modified: {state.modified.toString()}</div>
        </div>
        <WickedNote text={state.text} setText={text => setState(cloneState(state, text))}/>
        </>;
}

export default PersistentNote;