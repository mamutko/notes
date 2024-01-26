import React, { useState } from 'react';
import Editor from 'react-simple-code-editor'
import './WickedNote.css';
import Highlight from './Highlight';


export interface Props {
    text : string;
    setText : (text : string) => void
}

// Processes the note text to display an alternate text and returns the new note text and
// a function to "unprocess" the text for storage in state.
function Process(text: string): [string, ((text : string) => string), number]
{
    let lines = text.split('\n');
    let addendum = "";

    if (lines[0].match(/(#DONE)/gi))
    {
        text = lines[0];
        addendum = lines.slice(1).join('\n');
    }

    function Unprocess(text: string)
    {
        if (addendum)
        {
            text = text.replace('\n','')
            return text + '\n' + addendum;
        }

        return text;
    }

    let followUpCount = [...addendum.matchAll(/#TODO/gi)].length;

    return [text, Unprocess, followUpCount];
}


function WickedNote(props : Props) {
    
    const [text, Unprocess, followUpCount] = Process(props.text);

    function onEditorClick(e : any)
    {
        // TODO: process clicks on active tags
        console.info(`Clicked on element: ${e.target.outerHTML}`)
        console.log(e);

        if (!e.target.attributes['iActionTag'])
            return;
    
        let offset = e.target.attributes['istart'].value;
        let length = e.target.attributes['ilength'].value;
        let actionTag = e.target.attributes['iActionTag'].value;

        console.log(offset);
        console.log(length);
        console.log(offset + length);
        
        props.setText(Unprocess(text.slice(0, offset) + actionTag + text.slice(Number(offset) + Number(length))));
    }

    return (
        <div className="wicked-note">
        <div className="wicked-note-editor" onClick={onEditorClick}>
            <Editor value={text} highlight = {Highlight} preClassName={'wicked-note-enclosing-pre'}
        onValueChange={text => props.setText(Unprocess(text))} />
        </div>
        {followUpCount > 0 && (
            <div className="wicked-note-follow-up">... {followUpCount} follow-up <span className='wicked-note-tag-todo'>#TODOs</span>.</div>
        )}
        </div>
    );
}

export default WickedNote;