import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from './wallet/WalletProvider';
import { ThemeProvider } from './components/ThemeProvider';
import { RootLayout } from './shell/RootLayout';
import { Landing } from './pages/Landing';
import { Jobs } from './pages/Jobs';
import { JobDetail } from './pages/JobDetail';
import { PostJob } from './pages/PostJob';
import { Applications } from './pages/Applications';
import { Receipt } from './pages/Receipt';
import './styles/globals.css';
import './styles/design-system.css';

function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            {/* Skip to main content link for accessibility */}
            <a 
              href="#main-content" 
              className="skip-link"
              aria-label="Skip to main content"
            >
              Skip to main content
            </a>
            
            <RootLayout>
              <main 
                id="main-content"
                className="flex-1"
                role="main"
                aria-label="Main content"
              >
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/jobs/:id" element={<JobDetail />} />
                  <Route path="/post" element={<PostJob />} />
                  <Route path="/applications" element={<Applications />} />
                  <Route path="/receipt/:transactionHash" element={<Receipt />} />
                </Routes>
              </main>
            </RootLayout>
            
            {/* Toast notifications */}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--color-success)',
                    secondary: 'var(--color-white)',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'var(--color-danger)',
                    secondary: 'var(--color-white)',
                  },
                },
              }}
            />
          </div>
        </Router>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;