import { useState, useEffect } from 'react'
import { NavBar, Button, List, Input, Dialog, Toast, Card } from 'antd-mobile'
import { LeftOutline, DeleteOutline, DownlandOutline } from 'antd-mobile-icons'
import { supabase } from '../supabaseClient'
import * as XLSX from 'xlsx'
import './Settings.css'

const Settings = ({ onNavigateBack }) => {
    const [locationOptions, setLocationOptions] = useState({
        baris: [],
        rak: [],
        tingkat: [],
        petak: []
    })
    const [newValues, setNewValues] = useState({
        baris: '',
        rak: '',
        tingkat: '',
        petak: ''
    })
    const [exporting, setExporting] = useState(false)

    // Fetch location options
    const fetchLocationOptions = async () => {
        try {
            const { data, error } = await supabase
                .from('location_options')
                .select('*')
                .order('value', { ascending: true })

            if (error) throw error

            // Group by category
            const grouped = {
                baris: [],
                rak: [],
                tingkat: [],
                petak: []
            }

            data.forEach(item => {
                if (grouped[item.category]) {
                    grouped[item.category].push(item)
                }
            })

            setLocationOptions(grouped)
        } catch (error) {
            console.error('Error fetching location options:', error)
            Toast.show({
                icon: 'fail',
                content: 'Failed to load location options'
            })
        }
    }

    useEffect(() => {
        fetchLocationOptions()
    }, [])

    // Add new location option
    const handleAdd = async (category) => {
        const value = newValues[category].trim()

        if (!value) {
            Toast.show({
                icon: 'fail',
                content: 'Please enter a value'
            })
            return
        }

        try {
            const { error } = await supabase
                .from('location_options')
                .insert([{ category, value }])

            if (error) {
                if (error.code === '23505') { // Unique constraint violation
                    Toast.show({
                        icon: 'fail',
                        content: 'This value already exists'
                    })
                } else {
                    throw error
                }
                return
            }

            Toast.show({
                icon: 'success',
                content: 'Added successfully'
            })

            setNewValues({ ...newValues, [category]: '' })
            fetchLocationOptions()
        } catch (error) {
            console.error('Error adding location option:', error)
            Toast.show({
                icon: 'fail',
                content: 'Failed to add option'
            })
        }
    }

    // Delete location option
    const handleDelete = async (id, category, value) => {
        const result = await Dialog.confirm({
            content: `Delete "${value}" from ${category}?`,
            confirmText: 'Delete',
            cancelText: 'Cancel'
        })

        if (!result) return

        try {
            const { error } = await supabase
                .from('location_options')
                .delete()
                .eq('id', id)

            if (error) throw error

            Toast.show({
                icon: 'success',
                content: 'Deleted successfully'
            })

            fetchLocationOptions()
        } catch (error) {
            console.error('Error deleting location option:', error)
            Toast.show({
                icon: 'fail',
                content: 'Failed to delete option'
            })
        }
    }

    // Export to Excel
    const handleExport = async () => {
        setExporting(true)

        try {
            const { data, error } = await supabase
                .from('medicines')
                .select('*')
                .order('name', { ascending: true })

            if (error) throw error

            // Format data for Excel
            const excelData = data.map(med => ({
                'Medicine Name': med.name,
                'Baris': med.baris || '',
                'Rak': med.rak || '',
                'Tingkat': med.tingkat || '',
                'Petak': med.petak || '',
                'Location Code': med.baris && med.rak && med.tingkat && med.petak
                    ? `${med.baris}.${med.rak}.${med.tingkat}.${med.petak}`
                    : 'Not Set',
                'Last Updated': med.last_updated
                    ? new Date(med.last_updated).toLocaleString()
                    : ''
            }))

            // Create workbook and worksheet
            const wb = XLSX.utils.book_new()
            const ws = XLSX.utils.json_to_sheet(excelData)

            // Set column widths
            ws['!cols'] = [
                { wch: 30 }, // Medicine Name
                { wch: 10 }, // Baris
                { wch: 10 }, // Rak
                { wch: 10 }, // Tingkat
                { wch: 10 }, // Petak
                { wch: 15 }, // Location Code
                { wch: 20 }  // Last Updated
            ]

            XLSX.utils.book_append_sheet(wb, ws, 'OPMC Inventory')

            // Generate filename with current date
            const today = new Date()
            const dateStr = today.toISOString().split('T')[0]
            const filename = `OPMC_Master_List_${dateStr}.xlsx`

            // Download file
            XLSX.writeFile(wb, filename)

            Toast.show({
                icon: 'success',
                content: 'Excel file downloaded successfully!'
            })
        } catch (error) {
            console.error('Error exporting to Excel:', error)
            Toast.show({
                icon: 'fail',
                content: 'Failed to export data'
            })
        } finally {
            setExporting(false)
        }
    }

    const categoryLabels = {
        baris: 'Baris (Row)',
        rak: 'Rak (Shelf)',
        tingkat: 'Tingkat (Level)',
        petak: 'Petak (Compartment)'
    }

    return (
        <div className="settings-page">
            <NavBar
                className="settings-navbar"
                onBack={onNavigateBack}
            >
                Settings
            </NavBar>

            <div className="settings-content">
                {/* Section A: Export Data */}
                <Card className="settings-section">
                    <div className="section-header">
                        <h3>Export Data</h3>
                        <p className="section-description">
                            Download all medicine inventory data as an Excel file
                        </p>
                    </div>

                    <Button
                        block
                        color="primary"
                        size="large"
                        onClick={handleExport}
                        loading={exporting}
                        className="export-button"
                    >
                        <DownlandOutline fontSize={20} />
                        <span style={{ marginLeft: '8px' }}>Export to Excel</span>
                    </Button>
                </Card>

                {/* Section B: Location Configuration */}
                <Card className="settings-section">
                    <div className="section-header">
                        <h3>Location Configuration</h3>
                        <p className="section-description">
                            Manage valid values for location coordinates
                        </p>
                    </div>

                    {Object.keys(locationOptions).map(category => (
                        <div key={category} className="location-category">
                            <h4 className="category-title">{categoryLabels[category]}</h4>

                            {/* Add new value */}
                            <div className="add-value-container">
                                <Input
                                    placeholder={`Add new ${category} value`}
                                    value={newValues[category]}
                                    onChange={(val) => setNewValues({ ...newValues, [category]: val })}
                                    onEnterPress={() => handleAdd(category)}
                                />
                                <Button
                                    color="primary"
                                    onClick={() => handleAdd(category)}
                                    style={{ marginLeft: '8px' }}
                                >
                                    Add
                                </Button>
                            </div>

                            {/* List existing values */}
                            <List className="values-list">
                                {locationOptions[category].length === 0 ? (
                                    <div className="empty-values">No values configured</div>
                                ) : (
                                    locationOptions[category].map(option => (
                                        <List.Item
                                            key={option.id}
                                            extra={
                                                <DeleteOutline
                                                    fontSize={20}
                                                    color="#ff4d4f"
                                                    onClick={() => handleDelete(option.id, category, option.value)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            }
                                        >
                                            <span className="option-value">{option.value}</span>
                                        </List.Item>
                                    ))
                                )}
                            </List>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    )
}

export default Settings
