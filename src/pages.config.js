import Admin from './views/Admin';
import AdminColors from './views/AdminColors';
import AdminHouses from './views/AdminHouses';
import AdminProfiles from './views/AdminProfiles';
import AdminQuotes from './views/AdminQuotes';
import AdminTextures from './views/AdminTextures';
import TileConfigurator from './views/TileConfigurator';


export const PAGES = {
    "Admin": Admin,
    "AdminColors": AdminColors,
    "AdminHouses": AdminHouses,
    "AdminProfiles": AdminProfiles,
    "AdminQuotes": AdminQuotes,
    "AdminTextures": AdminTextures,
    "TileConfigurator": TileConfigurator,
}

export const pagesConfig = {
    mainPage: "TileConfigurator",
    Pages: PAGES,
};