import { useState, useEffect } from 'react'
import { Popup, Picker, Button, Toast } from 'antd-mobile'
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

    const [pickerVisible, setPickerVisible] = useState({
        baris: false,
        rak: false,
        tingkat: false,
        petak: false
    })

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

    const openPicker = (category) => {
        setPickerVisible({ ...pickerVisible, [category]: true })
    }

    const handlePickerConfirm = (category, value) => {
        setSelectedLocation({ ...selectedLocation, [category]: value[0] })
        setPickerVisible({ ...pickerVisible, [category]: false })
    }

    if (!medicine) return null

    const getDisplayValue = (category) => {
        return selectedLocation[category] || 'Select'
    }

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
                        {/* Baris Selector */}
                        <div className="selector-item">
                            <label>Baris (Row)</label>
                            <div
                                className="selector-button"
                                onClick={() => openPicker('baris')}
                            >
                                <span className={selectedLocation.baris ? 'selected' : 'placeholder'}>
                                    {getDisplayValue('baris')}
                                </span>
                                <span className="arrow">›</span>
                            </div>
                        </div>

                        {/* Rak Selector */}
                        <div className="selector-item">
                            <label>Rak (Shelf)</label>
                            <div
                                className="selector-button"
                                onClick={() => openPicker('rak')}
                            >
                                <span className={selectedLocation.rak ? 'selected' : 'placeholder'}>
                                    {getDisplayValue('rak')}
                                </span>
                                <span className="arrow">›</span>
                            </div>
                        </div>

                        {/* Tingkat Selector */}
                        <div className="selector-item">
                            <label>Tingkat (Level)</label>
                            <div
                                className="selector-button"
                                onClick={() => openPicker('tingkat')}
                            >
                                <span className={selectedLocation.tingkat ? 'selected' : 'placeholder'}>
                                    {getDisplayValue('tingkat')}
                                </span>
                                <span className="arrow">›</span>
                            </div>
                        </div>

                        {/* Petak Selector */}
                        <div className="selector-item">
                            <label>Petak (Compartment)</label>
                            <div
                                className="selector-button"
                                onClick={() => openPicker('petak')}
                            >
                                <span className={selectedLocation.petak ? 'selected' : 'placeholder'}>
                                    {getDisplayValue('petak')}
                                </span>
                                <span className="arrow">›</span>
                            </div>
                        </div>
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

            {/* Pickers for each category */}
            {Object.keys(locationOptions).map(category => (
                <Picker
                    key={category}
                    columns={[locationOptions[category]]}
                    visible={pickerVisible[category]}
                    onClose={() => setPickerVisible({ ...pickerVisible, [category]: false })}
                    onConfirm={(value) => handlePickerConfirm(category, value)}
                    value={selectedLocation[category] ? [selectedLocation[category]] : []}
                />
            ))}
        </>
    )
}

export default QuickUpdateModal
