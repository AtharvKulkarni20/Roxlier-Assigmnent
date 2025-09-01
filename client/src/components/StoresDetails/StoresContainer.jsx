// src/components/StoresDetails/StoresContainer.jsx
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import StoresPage from './StoresPage'
import StoreDetails from './StoreDetails'

export default function StoresContainer() {
  const { storeId } = useParams() // Get storeId from URL
  const navigate = useNavigate()

  // Handle when user clicks on a store card
  const handleStoreClick = (clickedStoreId) => {
    // Navigate to the store details route
    navigate(`/stores/${clickedStoreId}`)
  }

  // Handle when user clicks back button
  const handleBackToStores = () => {
    // Navigate back to stores list
    navigate('/stores')
  }

  // If we have a storeId in the URL, show store details
  // Otherwise show the stores list
  return (
    <>
      {storeId ? (
        <StoreDetails 
          storeId={storeId} 
          onBack={handleBackToStores}
        />
      ) : (
        <StoresPage onStoreClick={handleStoreClick} />
      )}
    </>
  )
}