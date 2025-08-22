import { Routes, Route } from 'react-router-dom'
import { useWallet } from './wallet/WalletProvider'

import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { CreateJobPage } from './pages/CreateJobPage'
import { JobListPage } from './pages/JobListPage'
import { ApplyPage } from './pages/ApplyPage'
import { JobDetailsPage } from './pages/JobDetailsPage'
import { ProfilePage } from './pages/ProfilePage'
import { ConnectWalletPage } from './pages/ConnectWalletPage'

function App() {
  const { isConnected } = useWallet()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/connect" element={<ConnectWalletPage />} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
          <Route 
            path="/jobs/:jobId/apply" 
            element={isConnected ? <ApplyPage /> : <ConnectWalletPage />} 
          />
          <Route 
            path="/create-job" 
            element={isConnected ? <CreateJobPage /> : <ConnectWalletPage />} 
          />
          <Route 
            path="/profile" 
            element={isConnected ? <ProfilePage /> : <ConnectWalletPage />} 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
