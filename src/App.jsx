import { useState } from 'react'
import MainInventory from './pages/MainInventory'
import Settings from './pages/Settings'
import './App.css'

function App() {
    const [currentPage, setCurrentPage] = useState('inventory')

    return (
        <div className="app">
            {currentPage === 'inventory' ? (
                <MainInventory onNavigateToSettings={() => setCurrentPage('settings')} />
            ) : (
                <Settings onNavigateBack={() => setCurrentPage('inventory')} />
            )}
        </div>
    )
}

export default App
