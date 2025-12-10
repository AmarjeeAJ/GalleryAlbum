exports.calculateLayout = (images, pageCount = 20) => {
    // Simple logic: distribute images evenly across pages (excluding covers)
    // pageCount includes cover? Let's assume pageCount is inner pages.
    // Requirement: "16 + 2 cover pages -> 50 images"
    // For now, simple distribution.

    const pages = [];
    const imagesPerPage = Math.ceil(images.length / pageCount);

    // Cover Page (Front) - First Image
    let frontCoverImage = [];
    if (images.length > 0) {
        frontCoverImage.push({
            imageId: images[0]._id || 'img_0',
            url: images[0].url || images[0],
            position: { x: 0, y: 0, w: 1, h: 1 },
            styles: { width: '100%', height: '100%', objectFit: 'cover' }
        });
    }
    pages.push({ pageNumber: 0, type: 'cover_front', images: frontCoverImage });

    // Inner Pages - Middle Images (Slice 1 to last-1)
    let innerImages = [];
    if (images.length > 2) {
        innerImages = images.slice(1, images.length - 1);
    } else if (images.length === 2) {
        // If only 2 images, none for inner? Or Front + Back?
        // Logic: 2 images -> Front + Back. 0 Inner.
        innerImages = [];
    }

    // Layout Strategy: Panoramic Spread for Inner Images
    let pageNumber = 1;
    for (let i = 0; i < innerImages.length; i++) {
        const img = innerImages[i];

        // Left Page
        pages.push({
            pageNumber: pageNumber++,
            type: 'inner',
            images: [{
                imageId: img._id || ('inner_' + i),
                url: img.url || img,
                position: { x: 0, y: 0, w: 1, h: 1 },
                styles: {
                    width: '200%',
                    height: '100%',
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    objectFit: 'cover'
                }
            }]
        });

        // Right Page
        pages.push({
            pageNumber: pageNumber++,
            type: 'inner',
            images: [{
                imageId: img._id || ('inner_' + i),
                url: img.url || img,
                position: { x: 0, y: 0, w: 1, h: 1 },
                styles: {
                    width: '200%',
                    height: '100%',
                    position: 'absolute',
                    left: '-100%',
                    top: '0',
                    objectFit: 'cover'
                }
            }]
        });
    }

    // Cover Page (Back) - Last Image
    let backCoverImage = [];
    if (images.length > 1) {
        const lastImg = images[images.length - 1];
        backCoverImage.push({
            imageId: lastImg._id || 'img_last',
            url: lastImg.url || lastImg,
            position: { x: 0, y: 0, w: 1, h: 1 },
            styles: { width: '100%', height: '100%', objectFit: 'cover' }
        });
    }
    pages.push({ pageNumber: pageNumber, type: 'cover_back', images: backCoverImage });

    // Cover Page (Back)
    pages.push({ pageNumber: pageCount + 1, type: 'cover_back', images: [] });

    return pages;
};
