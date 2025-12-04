import { useState, useEffect } from 'react'
import { Popup, Dropdown, Button, Toast } from 'antd-mobile'
import { supabase } from '../supabaseClient'
import './QuickUpdateModal.css'

const QuickUpdateModal = ({ visible, medicine, onClose, onUpdate }) => {
    const [locationOptions, setLocationOptions] = useState({
        baris: [],
        rak: [],
        tingkat: [],
        petak: []
    })

    const [selectedLocation, setSelectedLocation] = useState({
        baris: null,
        rak: null,
        tingkat: null,
        petak: null
    })

    const [activeKey, setActiveKey] = useState(null)

    // Fetch location options from Supabase
    useEffect(() => {
        const fetchLocationOptions = async () => {
            const { data, error } = await supabase
                .from('location_options')
                .select('*')
                .order('value', { ascending: true })

            if (error) {
                console.error('Error fetching location options:', error)
                Toast.show({
                    icon: 'fail',
                    content: 'Failed to load location options'
                })
                return
            }

            // Group by category
            const grouped = {
                baris: [],
                rak: [],
                tingkat: [],
                petak: []
            }

            data.forEach(item => {
                if (grouped[item.category]) {
                    grouped[item.category].push({
                        label: item.value,
                        value: item.value
                    })
                }
            })

            setLocationOptions(grouped)
        }

        setActiveKey(null)
        if (visible) {
            fetchLocationOptions()
        }
    }, [visible])

    // Set initial values when medicine changes
    useEffect(() => {
        if (medicine) {
            setSelectedLocation({
                baris: medicine.baris || null,
                rak: medicine.rak || null,
                tingkat: medicine.tingkat || null,
                petak: medicine.petak || null
            })
        }
    }, [medicine])

    const handleSave = async () => {
        if (!medicine) return

        try {
            const { error } = await supabase
                .from('medicines')
                .update({
                    baris: selectedLocation.baris,
                    rak: selectedLocation.rak,
                    tingkat: selectedLocation.tingkat,
                    petak: selectedLocation.petak,
                    last_updated: new Date().toISOString()
                })
                .eq('id', medicine.id)

            if (error) throw error

            Toast.show({
                icon: 'success',
                content: 'Location updated successfully!'
            })

            onUpdate()
            onClose()
        } catch (error) {
            console.error('Error updating medicine:', error)
            Toast.show({
                icon: 'fail',
                content: 'Failed to update location'
            })
        }
    }

    if (!medicine) return null

    const hasCompleteLocation =
        selectedLocation.baris &&
        selectedLocation.rak &&
        selectedLocation.tingkat &&
        selectedLocation.petak

    return (
        <>
            <Popup
                visible={visible}
                onMaskClick={onClose}
                bodyStyle={{
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    minHeight: '60vh',
                    padding: '24px'
                }}
            >
                <div className="quick-update-modal">
                    <div className="modal-header">
                        <h2>{medicine.name}</h2>
                        <p className="modal-subtitle">Update Location</p>
                    </div>

                    <div className="location-selectors">
                        <Dropdown activeKey={activeKey} onChange={setActiveKey}>
                            {['baris', 'rak', 'tingkat', 'petak'].map(category => (
                                <Dropdown.Item
                                    key={category}
                                    title={selectedLocation[category] || category.charAt(0).toUpperCase() + category.slice(1)}
                                >
                                    <div style={{ padding: 12, maxHeight: '40vh', overflowY: 'auto' }}>
                                        {locationOptions[category].map(option => (
                                            <div
                                                key={option.value}
                                                onClick={() => {
                                                    setSelectedLocation(prev => ({ ...prev, [category]: option.value }))
                                                    setActiveKey(null)
                                                }}
                                                style={{
                                                    padding: '12px',
                                                    borderBottom: '1px solid #f5f5f5',
                                                    color: selectedLocation[category] === option.value ? 'var(--adm-color-primary)' : 'inherit',
                                                    fontWeight: selectedLocation[category] === option.value ? 'bold' : 'normal',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {option.label}
                                            </div>
                                        ))}
                                        {locationOptions[category].length === 0 && (
                                            <div style={{ padding: '12px', textAlign: 'center', color: '#999' }}>
                                                No options available
                                            </div>
                                        )}
                                    </div>
                                </Dropdown.Item>
                            ))}
                        </Dropdown>
                    </div>

                    {hasCompleteLocation && (
                        <div className="location-preview">
                            <span className="preview-label">Complete Location:</span>
                            <span className="preview-code">
                                {selectedLocation.baris}.{selectedLocation.rak}.{selectedLocation.tingkat}.{selectedLocation.petak}
                            </span>
                        </div>
                    )}

                    <div className="modal-actions">
                        <Button
                            block
                            color="primary"
                            size="large"
                            onClick={handleSave}
                        >
                            Save Location
                        </Button>
                        <Button
                            block
                            fill="none"
                            size="large"
                            onClick={onClose}
                            style={{ marginTop: '12px' }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Popup>
        </>
    )
}

export default QuickUpdateModal
