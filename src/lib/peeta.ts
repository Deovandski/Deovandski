import { loadGallery, type GalleryPhoto } from './gallery';

export type CatPhoto = GalleryPhoto;

/** Photos in content/peeta/, newest filename last (so number them 01-, 02-, ...). */
export const loadPeeta = () => loadGallery('content/peeta', 'Peeta');
