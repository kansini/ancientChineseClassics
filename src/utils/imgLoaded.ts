export const isImageLoaded = (imgUrl: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = imgUrl;
        if (img.complete) {
            resolve();
        }
    });
}

export const areImagesLoaded = (imgUrls: string[]): Promise<Awaited<void>[]> => {
    const promises = imgUrls.map((imgUrl) => isImageLoaded(imgUrl));
    return Promise.all(promises);
}
export const checkImagesLoaded = (images: string[]): Promise<boolean> => {
    const promises = images.map((url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => reject(false);
            img.src = url;
        });
    });

    return Promise.all(promises).then((results) => {
        return results.every((result) => result);
    });
}

