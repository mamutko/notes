import { useEffect } from "react";

export interface Props {
    url: string;
}

function PageOpener(props: Props)
{
    useEffect(() => {
        let url = props.url;

        if (url.match('{clip}'))
        {
            navigator.clipboard.readText().then((clip) => {
                url = url.replace('{clip}',clip);
                window.open(url, '_blank');
            })
        }
        else
        {
            window.open(url, '_blank');
        }
    }, []);

    // TODO: Add a message about popup blocker. Add manual link to open page. Maybe even list history.

    return (<p>Page opened.</p>);
}

export default PageOpener;