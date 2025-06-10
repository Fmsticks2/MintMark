import React from 'react'

// Simplified provider focused on Aptos ecosystem
// Removed Web3Modal and Ethereum dependencies to prevent TON wallet conflicts
// All wallet functionality is handled by WalletProvider (Martian & Petra)
export const MultiWalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  )
}