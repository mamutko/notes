import React, { useState } from 'react';
import Editor from 'react-simple-code-editor'
import './WickedNote.css';
import Highlight, { GetLabels } from './Highlight';
import usePersistentState, { initializePersistentState } from './PersistentState';
import WickedNote from './WickedNote';

export interface Props {
    storageKey : string;
    onAddLabel: (noteKey: string, label: string) => void;
    onRemoveLabel: (noteKey: string, label: string) => void;
}

export class State {
    constructor(text: string)
    {
        this.text = text;
        this.labels = new Array<string>()
        this.created = new Date();
        this.modified = new Date();
    }

    text: string;
    labels: string[];
    created: Date;
    modified: Date;

}

export function createPersistentNote(onAddLabel: (noteKey: string, label: string) => void, initialState: State = new State(""))
{
    // We will identify each note by it's creation time.
    const key = `note_v1_${initialState.created.getTime().toString()}`;
    initialState.labels = GetLabels(initialState.text, initialState.created, initialState.modified);

    initializePersistentState(key, initialState);

    for (const label of initialState.labels)
    {
        onAddLabel(key, label);
    }

    return key;
}

function cloneState(current: State, newText: string) : State
{
    let newState = new State(newText);
    newState.created = current.created;
    newState.labels = [...current.labels];

    return newState;
}

function PersistentNote(props : Props) {
    
    const [state, setState] = usePersistentState(props.storageKey, new State(""));

    function onSetText(text: string)
    {
        let newState = cloneState(state, text);
        newState.labels = GetLabels(newState.text, newState.created, newState.modified);

        let newLabels = newState.labels.filter(label => !state.labels.includes(label));
        let removedLabels = state.labels.filter(label => !newState.labels.includes(label));

        setState(newState);

        for (let label of newLabels)
        {
            props.onAddLabel(props.storageKey, label);
        }

        for (let label of removedLabels)
        {
            props.onRemoveLabel(props.storageKey, label);
        }
    }
    
    // TODO: Consider removing timestamp-container?
    return <>
        <div className='wicked-note-timestamp-container'>
            <div>Created: {state.created.toString()}</div>
            <div>Modified: {state.modified.toString()}</div>
        </div>
        <WickedNote text={state.text} setText={onSetText}/>
        </>;
}

export default PersistentNote;