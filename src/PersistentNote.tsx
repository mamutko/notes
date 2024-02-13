import React, { useEffect, useState } from 'react';
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
        this.referenced = new Date();
        this.modified = new Date();
    }

    text: string;
    labels: string[];
    created: Date;
    referenced: Date;
    modified: Date;

}

export function createPersistentNote(onAddLabel: (noteKey: string, label: string) => void, initialState: State = new State(""))
{
    // We will identify each note by it's creation time.
    const key = `note_v1_${initialState.created.getTime().toString()}`;
    initialState.labels = GetLabels(initialState.text, initialState.created, initialState.referenced, initialState.modified);

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
    newState.referenced = current.referenced;
    newState.labels = [...current.labels];

    return newState;
}

function PersistentNote(props : Props) {
    
    const [state, setState] = usePersistentState(props.storageKey, new State(""));

    // TODO: create universal way to update objects on schema changes
    // here, we added "referenced" and we need to backfill it.
    if (!state.referenced)
    {
        console.log("!!!!!!! FIX UP note state.")
        state.referenced = state.created;
    }

    function onSetText(text: string)
    {
        let newState = cloneState(state, text);
        newState.labels = GetLabels(newState.text, newState.created, newState.referenced, newState.modified);

        let newLabels = newState.labels.filter(label => !state.labels.includes(label));
        let removedLabels = state.labels.filter(label => !newState.labels.includes(label));

        if (state.text == newState.text && !newLabels && !removedLabels)
        {
            return;
        }

        if (newLabels.find((label) => label.toUpperCase() == "#BUMP"))
        {
            newState.referenced = newState.modified;
        }

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

    // TODO: not necessary to do this on each render. The labels should be up to date unless
    // we changed how labels are parsed out of the text.
    useEffect(() => onSetText(state.text), []);
    
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