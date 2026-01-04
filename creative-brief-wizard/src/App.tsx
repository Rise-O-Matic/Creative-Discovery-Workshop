import './App.css';
import { SessionProvider } from './contexts/SessionContext';
import { ToastProvider } from './contexts/ToastContext';
import { MeetingTimerProvider } from './contexts/MeetingTimerContext';
import { useSession } from './hooks/useSession';
import { WelcomePage } from './features/welcome/WelcomePage';
import { CustomerDiscoveryPage } from './features/discovery/CustomerDiscoveryPage';
import { DivergePage } from './features/diverge/DivergePage';
import { ConvergePage } from './features/converge/ConvergePage';
import { SpotExercisesPage } from './features/spot-exercises/SpotExercisesPage';
import PrioritizationPage from './features/prioritization/PrioritizationPage';
import { SynthesisReviewPage } from './features/review/SynthesisReviewPage';
import { BriefCompletePage } from './features/brief/BriefCompletePage';
import { GlobalTimeline } from './components/GlobalTimeline';
import { ToastContainer } from './components/Toast';
import { DevTools } from './components/DevTools';

function PhaseRouter() {
  const { state } = useSession();

  switch (state.currentPhase) {
    case 'project-context':
      return <WelcomePage />;
    case 'customer-discovery':
      return <CustomerDiscoveryPage />;
    case 'sticky-notes-diverge':
      return <DivergePage />;
    case 'sticky-notes-converge':
      return <ConvergePage />;
    case 'spot-exercises':
      return <SpotExercisesPage />;
    case 'prioritization':
      return <PrioritizationPage />;
    case 'synthesis-review':
      return <SynthesisReviewPage />;
    case 'brief-complete':
      return <BriefCompletePage />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Phase: {state.currentPhase}</h1>
            <p className="text-gray-600">This phase is not yet implemented.</p>
          </div>
        </div>
      );
  }
}

function AppContent() {
  const { state } = useSession();

  // Don't show timeline on welcome/project-context phase
  const showTimeline = state.currentPhase !== 'project-context';

  return (
    <div className="flex flex-col h-screen">
      {/* Global Timeline Bar */}
      {showTimeline && <GlobalTimeline />}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <PhaseRouter />
      </div>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Dev Tools (only in development mode) */}
      {import.meta.env.DEV && <DevTools />}
    </div>
  );
}

function App() {
  return (
    <SessionProvider>
      <ToastProvider>
        <MeetingTimerProvider>
          <AppContent />
        </MeetingTimerProvider>
      </ToastProvider>
    </SessionProvider>
  );
}

export default App;
