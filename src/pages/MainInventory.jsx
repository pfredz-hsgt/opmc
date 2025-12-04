import { useState, useEffect } from 'react'
import { SearchBar, Tabs, List, Tag, NavBar, Toast } from 'antd-mobile'
import { SetOutline } from 'antd-mobile-icons'
import { supabase } from '../supabaseClient'
import QuickUpdateModal from '../components/QuickUpdateModal'
import './MainInventory.css'

const MainInventory = ({ onNavigateToSettings }) => {
    const [medicines, setMedicines] = useState([])
    const [filteredMedicines, setFilteredMedicines] = useState([])
    const [searchText, setSearchText] = useState('')
    const [activeTab, setActiveTab] = useState('all')
    const [selectedMedicine, setSelectedMedicine] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(true)

    // Fetch medicines from Supabase
    const fetchMedicines = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('medicines')
                .select('*')
                .order('name', { ascending: true })

            if (error) throw error

            setMedicines(data || [])
            setFilteredMedicines(data || [])
        } catch (error) {
            console.error('Error fetching medicines:', error)
            Toast.show({
                icon: 'fail',
                content: 'Failed to load medicines'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMedicines()
    }, [])

    // Filter medicines based on search and tab
    useEffect(() => {
        let filtered = medicines

        // Apply search filter
        if (searchText) {
            filtered = filtered.filter(med =>
                med.name.toLowerCase().includes(searchText.toLowerCase())
            )
        }

        // Apply tab filter
        if (activeTab === 'with-location') {
            filtered = filtered.filter(med =>
                med.baris && med.rak && med.tingkat && med.petak
            )
        } else if (activeTab === 'missing-location') {
            filtered = filtered.filter(med =>
                !med.baris || !med.rak || !med.tingkat || !med.petak
            )
        }

        setFilteredMedicines(filtered)
    }, [searchText, activeTab, medicines])

    const handleMedicineClick = (medicine) => {
        setSelectedMedicine(medicine)
        setModalVisible(true)
    }

    const handleModalClose = () => {
        setModalVisible(false)
        setSelectedMedicine(null)
    }

    const handleUpdate = () => {
        fetchMedicines()
    }

    const getLocationCode = (medicine) => {
        if (medicine.baris && medicine.rak && medicine.tingkat && medicine.petak) {
            return `${medicine.baris}.${medicine.rak}.${medicine.tingkat}.${medicine.petak}`
        }
        return null
    }

    const tabs = [
        { key: 'all', title: 'All' },
        { key: 'with-location', title: 'With Location' },
        { key: 'missing-location', title: 'Missing Location' }
    ]

    return (
        <div className="main-inventory">
            <NavBar
                className="inventory-navbar"
                right={
                    <SetOutline
                        fontSize={24}
                        onClick={onNavigateToSettings}
                        style={{ cursor: 'pointer' }}
                    />
                }
            >
                OPMC Inventory
            </NavBar>

            <div className="search-container">
                <SearchBar
                    placeholder="Search medicines..."
                    value={searchText}
                    onChange={setSearchText}
                    showCancelButton
                    onClear={() => setSearchText('')}
                />
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className="filter-tabs"
            >
                {tabs.map(tab => (
                    <Tabs.Tab key={tab.key} title={tab.title} />
                ))}
            </Tabs>

            <div className="medicine-list-container">
                {loading ? (
                    <div className="loading-state">
                        <p>Loading medicines...</p>
                    </div>
                ) : filteredMedicines.length === 0 ? (
                    <div className="empty-state">
                        <p>No medicines found</p>
                    </div>
                ) : (
                    <List>
                        {filteredMedicines.map(medicine => {
                            const locationCode = getLocationCode(medicine)

                            return (
                                <List.Item
                                    key={medicine.id}
                                    onClick={() => handleMedicineClick(medicine)}
                                    arrow={false}
                                    className="medicine-item"
                                >
                                    <div className="medicine-content">
                                        <div className="medicine-name">{medicine.name}</div>
                                        <div className="medicine-location">
                                            {locationCode ? (
                                                <span className="location-code">{locationCode}</span>
                                            ) : (
                                                <Tag color="warning" fill="outline">
                                                    Set Location
                                                </Tag>
                                            )}
                                        </div>
                                    </div>
                                </List.Item>
                            )
                        })}
                    </List>
                )}
            </div>

            <QuickUpdateModal
                visible={modalVisible}
                medicine={selectedMedicine}
                onClose={handleModalClose}
                onUpdate={handleUpdate}
            />
        </div>
    )
}

export default MainInventory
