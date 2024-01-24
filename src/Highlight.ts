function Highlight(text : string) : string
{
    const activeTags = /(#\w+)/g;

    // const matches = [...text.matchAll(activeTags)];
    // let matchRanges = new Array<[number, number]>();

    // for (const match of matches)
    // {
    //     if (match.index !== undefined)
    //         matchRanges.push([match.index, match.length]);
    // }

    // Hash Tag
    // text = text.replaceAll(activeTags, '<span class="wicked-note-tag wicked-note-active-content" istart="" ilength="">$1</span>');

    text = text.replaceAll(activeTags, (match, p1, offset, text, groups) => {
        let actionTag: string | undefined;
        let actionClass: string | undefined;

        if (p1 === "#TODO")
        {
            actionTag = "#DONE";
            actionClass = "wicked-note-tag-todo";
        }
        if (p1 === "#DONE")
        {
            actionTag = "#TODO";
            actionClass = "wicked-note-tag-done";
        }

        if (actionTag)
        {
            return `<span class="wicked-note-tag wicked-note-active-content ${actionClass}" istart=${offset} ilength=${p1.length} iActionTag="${actionTag}">${p1}</span>`;
        }
        else
        {
            return `<span class="wicked-note-tag">${p1}</span>`;
        }
    });

    // Heading
    text = text.replaceAll(/((^.*)\n|(^[^\n]*)$)/g, '<span class="wicked-note-heading">$2$3</span>\n');

 
    // At-mention
    text = text.replaceAll(/(@\w+)/g, '<span class="wicked-note-mention">$1</span>');

    // Http link.
    // TODO: Remove hardcoded server address - the path depends on how the app is setup on GitHub pages.
    // TODO: encode URL as Base64.
    text = text.replaceAll(/((http:\/\/|https:\/\/)[^\s]+)/g, '<a class="wicked-note-link wicked-note-active-content" href="#" onclick="window.open(\'https://mamutko.github.io/notes/?url=$1\',\'PageOpener\'); return false;">$1</a>');

    // Badge
    // text = text.replaceAll(/((http:\/\/|https:\/\/)[^\s]+)/g, '<span class="wicked-note-link" style="position:relative;"><div class="wicked-note-badge">&plus;</div>$1</a>');


    text = text.replaceAll(/(\*\*[^\*]+\*\*)/g, '<b>$1</b>');
    text = text.replaceAll(/(\s\*[^\*]+\*\s)/g, '<i>$1</i>');

    //text = text.replaceAll(/((http:\/\/|https:\/\/)[^\s]+)/g, '<a style="pointer-events: auto;" href="$1">$1</a>');

    //text = text.replaceAll(/(^.*\n|^[^\n]*$)/g, '<b>$1</b>'); 
    //text = '<div style="pointer-events: auto;">' + text + '</div>';
    return text;
    // return text.replace("this", "<B>this</B>")
    // .replace("TODO","<font color='blue'>todo</font>")
    // .replaceAll("done","<font color='green'>DONE</font>")
    // .replace("http://google.com","<A href='http://google.com'>http://google.com</A>");

    return text;
}

export default Highlight;