interface IStringIndex {
    [key: string]: any;
}

export type Sorting = "none"|"asc"|"desc"

export function getNextSorting(currentSorting: Sorting) {
    switch (currentSorting) {
        case "none": return "asc"
        case "asc": return "desc"
        case "desc": return "asc"
    }
}

export function sortBy(arr: any[], field: string, sorting: Sorting): any[] {
    if(sorting === "none") return arr;
    const asc = sorting === "asc";
    let sortedCountries = [...arr];

    sortedCountries.sort((a, b) => {
        if ((a as IStringIndex)[field] < (b as IStringIndex)[field]) {
            return asc ? -1 : 1;
        }

        if ((a as IStringIndex)[field] > (b as IStringIndex)[field]) {
            return asc ? 1 : -1;
        }

        return 0;
    });

    return sortedCountries;
}

