import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// Normalize a value string for use in URL. This is very specific logic for specifically formatted data.
//   - trim all spaces
//   - treat new-lines or commas as list separators
//   - format the list using commas
//   - if the first entry is a text but rest is numbers, assume it's a column header and remove.
function normalizeValue(value: string): string
{
    value = value.trim();
    value = value.replaceAll('\n',',');

    let values = value.split(',').map(x => x.trim()).filter(x => x.length > 0);

    if (values.length > 1)
    {
        // If the first value is tring, but others are number - assume that the first value is a column
        // header and remove it.
        if (Number.isNaN(Number(values[0])) && values.slice(1).every(x => !Number.isNaN(Number(x))))
        {
            values = values.slice(1);
        }
    }

    value = values.join(',');

    return value;
}

export interface Props {
    // url: string;
}

function PageOpener(props: Props)
{
    let [searchParams, setSearchParams] = useSearchParams();

    const encodedUrl = searchParams.get('url') || "";
    const url = atob(encodedUrl);

    useEffect(() => {

        if (!url)
            return;

     if (url.match('{cb}') || url.match('{cbf}'))
        {
            navigator.clipboard.readText().then((cb) => {
                let urlNew = url.replace('{cb}',cb);
                let cbf = normalizeValue(cb);
                urlNew = urlNew.replace('{cbf}',cbf);

                window.open(urlNew, '_blank');
            })
        }
        else
        {
            window.open(url, '_blank');
        }
    }, [searchParams]);

    // TODO: Add a message about popup blocker. Add manual link to open page. Maybe even list history.

    return (<>
        <p>Page opened: <a href={url}>{url}</a>.</p>
        <p>If the page didn't open, check browser to enable pop-ups.</p>
        <h1>Anchor Page</h1>
        <p>The purpose of this page is to "anchor" where links from the notes page should be opened. You can
            move this page to your preffered window and leave it open there. All subsequent clicks on links
            will open in the same window.
        </p>
    </>);
}

export default PageOpener;