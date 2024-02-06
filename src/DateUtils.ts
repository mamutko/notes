// Returns the midnight of the Monday of the week in which 'date' is.
export function getMonday(date: Date): Date
{
    // is this needed?
    date = new Date(date);

    date.setHours(0,0,0,0);

    let offset = date.getDay();
    if (offset == 0)
    {
        offset = 6;
    }
    else
    {
        offset = offset - 1;
    }

    return new Date(date.setDate(date.getDate() - offset));
}

export function getNextMonday(date: Date): Date
{
    let nextMonday = getMonday(date);
    nextMonday.setDate(nextMonday.getDate() + 7);

    return nextMonday;
}

export function getWeekDescription(date: Date): string
{
    return `Week of ${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    // return `${getMonday(date).toDateString()} - ${getNextMonday(date).toDateString()}`;
}

export function thisMonday()
{
  let now = new Date();
  return getMonday(now);
}