import Layout from "./Layout.jsx";

import TileConfigurator from "./TileConfigurator";

import Admin from "./Admin";

import AdminProfiles from "./AdminProfiles";

import AdminColors from "./AdminColors";

import AdminTextures from "./AdminTextures";

import AdminHouses from "./AdminHouses";

import AdminQuotes from "./AdminQuotes";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    TileConfigurator: TileConfigurator,
    
    Admin: Admin,
    
    AdminProfiles: AdminProfiles,
    
    AdminColors: AdminColors,
    
    AdminTextures: AdminTextures,
    
    AdminHouses: AdminHouses,
    
    AdminQuotes: AdminQuotes,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<TileConfigurator />} />
                
                
                <Route path="/TileConfigurator" element={<TileConfigurator />} />
                
                <Route path="/Admin" element={<Admin />} />
                
                <Route path="/AdminProfiles" element={<AdminProfiles />} />
                
                <Route path="/AdminColors" element={<AdminColors />} />
                
                <Route path="/AdminTextures" element={<AdminTextures />} />
                
                <Route path="/AdminHouses" element={<AdminHouses />} />
                
                <Route path="/AdminQuotes" element={<AdminQuotes />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}