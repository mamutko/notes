import { getWeekDescription } from "./DateUtils";

function Highlight(text : string) : string
{

    // const matches = [...text.matchAll(activeTags)];
    // let matchRanges = new Array<[number, number]>();

    // for (const match of matches)
    // {
    //     if (match.index !== undefined)
    //         matchRanges.push([match.index, match.length]);
    // }

    // Hash Tag
    // text = text.replaceAll(activeTags, '<span class="wicked-note-tag wicked-note-active-content" istart="" ilength="">$1</span>');

    let headingEndPosition = text.search("\n");

    if (headingEndPosition == -1)
    {
        headingEndPosition = text.length;
    }

    let hasTodoInBody = false;

    const activeTags = /(?<=^|\s|\n)(#\w+)/g;
    text = text.replaceAll(activeTags, (match, p1, offset, text, groups) => {
        let actionTag: string | undefined;
        let actionClass: string | undefined;

        let tag = p1.slice(1).toLowerCase();
        let tagClass = `wicked-note-tag-${tag}`

        if (tag === "todo")
        {
            // TODO: Case preservation for #DONE below and #TODO further down.
            if (offset < headingEndPosition)
            {
                actionTag = "#WAIT";
            }
            else
            {
                actionTag = "#DONE";
                hasTodoInBody = true;
            }
        }
        if (tag === "done")
        {
            actionTag = "#TODO";
        }
        if (tag === "wait")
        {
            actionTag = "#TODO";
        }

        if (actionTag)
        {
            return `<span class="wicked-note-tag wicked-note-active-content ${tagClass}" istart=${offset} ilength=${p1.length} iActionTag="${actionTag}">${p1}</span>`;
        }
        else
        {
            return `<span class="wicked-note-tag ${tagClass}">${p1}</span>`;
        }
    });

    if (!hasTodoInBody)
    {
        text = text.replaceAll('iActionTag="#WAIT"','iActionTag="#DONE"');
    }

    // Heading
    //text = text.replaceAll(/((^.*)\n|(^[^\n]*)$)/g, '<span class="wicked-note-heading">$2$3</span>\n');
    text = text.replaceAll(/^([^\n]*)\n/g, '<span class="wicked-note-heading">$1</span>\n');
    text = text.replaceAll(/^([^\n]*)$/g, '<span class="wicked-note-heading">$1</span>');

 
    // At-mention
    text = text.replaceAll(/(?<=^|\s|\n)(@\w+)/g, '<span class="wicked-note-mention">$1</span>');

    // Http link.
    // TODO: Remove hardcoded server address - the path depends on how the app is setup on GitHub pages.
    // TODO: encode URL as Base64.
    // let urlRegex = /((http:\/\/|https:\/\/)[^\s]+)/g;

    // Match strings stargint with http:// or https:// and terminated by space/end-of-line/end-of-string/</span>. The </span> is needed because
    // some of the above replacements (heading replacement) can add a </span> to the end of the URL. TODO: refactor this, so that the different
    // algos for replacements do not influence each other.
    let urlRegex = /((http:\/\/|https:\/\/).+?)(?=\s|\n|$|<\/span>)/g;
    text = text.replaceAll(urlRegex, (match, p1, offset, text, groups) => {
        return `<a class="wicked-note-link wicked-note-active-content" href="/notes/#/open?url=${btoa(p1)}" target="PageOpener">${p1}</a>`
    });
    
    // '<a class="wicked-note-link wicked-note-active-content" href="#" onclick="window.open(\'https://mamutko.github.io/notes/?url=$1\',\'PageOpener\'); return false;">$1</a>');

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

export function HighlightFavourites(text : string) : string
{
    const favRegex = /^(?<indent>\s*).*#FAV\W+-?\s*(?<label>.*?)\s*-?\s*((?<url>https?:\/\/.+?(?=\s|\n|$))|$)/gmi
    
    const favLines = [...text.matchAll(favRegex)].map(match => {
        console.log('match!!!')
        if (!match.groups)
            return '';

        if (match.groups['url'])
        {
            // TODO: code repetition - this formulation of the PageOpener URL is in two places (Hightlight and here)
            // TODO: provide an option to not use PageOpener
            return `${match.groups['indent']}<a href="/notes/#/open?url=${btoa(match.groups['url'])}" target="PageOpener">${match.groups['label']}`;
        }

        return `${match.groups['indent']}${match.groups['label']}`;
    })

    return favLines.join('<BR>');
}

export function GetLabels(text: string, created: Date, referenced: Date, modified: Date): string[]
{
    let labels = new Array<string>();

    if (text.indexOf("#DELETED") >= 0)
    {
        labels.push('#DELETED');
        // No other labels on deleted notes.
        return labels;
    }

    labels.push(getWeekDescription(referenced))
    console.log(referenced);

    // TODO: remove duplication of regexes across Hightlight() and GetLabels().

    [...text.matchAll(/(?<=^|\s|\n)(#\w+)/g)].map(match => {
        labels.push(match[0].toLocaleUpperCase());
    });

    [...text.matchAll(/(?<=^|\s|\n)(@\w+)/g)].map(match => {
        labels.push(match[0].toLocaleUpperCase());
    });

    labels = [... new Set(labels)];
    console.log(`Labels: ${labels} for date ${created}.`);
    return labels;
}

export default Highlight;