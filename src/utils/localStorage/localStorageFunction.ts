export const initialLocalStorage = () => {
    if (!localStorage.getItem('likedList')) {
        localStorage.setItem('likedList', '[]');
    }
};

export const getDataStorage = () => {
    const likedDataStorage = localStorage.getItem('likedList');
    let likedData: string[] | null = null;

    try {
        if (likedDataStorage) {
            likedData = JSON.parse(likedDataStorage) as string[];
        }
    } catch (err) {
        console.error('Failed to parse liked data', err);
    }

    return likedData;
};

export const setDataStorage = (flag: boolean, id: string) => {
    const likedData = getDataStorage();

    const likedGameList = flag
        ? [...(likedData ?? []), id]
        : [...(likedData?.filter((game) => game !== id) ?? [])];

    const dataForStorage = JSON.stringify(likedGameList);

    localStorage.setItem('likedList', dataForStorage);
};
