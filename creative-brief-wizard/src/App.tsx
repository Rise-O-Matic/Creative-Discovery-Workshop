import './App.css';
import { SessionProvider } from './contexts/SessionContext';
import { ToastProvider } from './contexts/ToastContext';
import { MeetingTimerProvider } from './contexts/MeetingTimerContext';
import { useSession } from './hooks/useSession';
import { WelcomePage } from './features/welcome/WelcomePage';
import { GranularDiscoveryPage } from './features/discovery/GranularDiscoveryPage';
// Sticky notes phases temporarily shelved
// import { DivergePage } from './features/diverge/DivergePage';
// import { ConvergePage } from './features/converge/ConvergePage';
// import { SpotExercisesPage } from './features/spot-exercises/SpotExercisesPage';
import PrioritizationPage from './features/prioritization/PrioritizationPage';
import { SynthesisReviewPage } from './features/review/SynthesisReviewPage';
import { BriefEditorPage } from './features/brief-editor/BriefEditorPage';
import { GlobalTimeline } from './components/GlobalTimeline';
import { ToastContainer } from './components/Toast';
import { DevTools } from './components/DevTools';
import { Version } from './components/Version';


function PhaseRouter() {
  const { state } = useSession();

  switch (state.currentPhase) {
    case 'project-context':
      return <WelcomePage />;
    case 'customer-discovery':
      return <GranularDiscoveryPage />;
    // Sticky notes phases temporarily shelved
    // case 'sticky-notes-diverge':
    //   return <DivergePage />;
    // case 'sticky-notes-converge':
    //   return <ConvergePage />;
    // case 'spot-exercises':
    //   return <SpotExercisesPage />;
    case 'prioritization':
      return <PrioritizationPage />;
    case 'synthesis-review':
      return <SynthesisReviewPage />;
    case 'brief-complete':
      return <BriefEditorPage />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Phase: {state.currentPhase}</h1>
            <p className="text-gray-600 mb-6">This phase is not yet implemented or an error occurred.</p>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reset Application
            </button>
          </div>
        </div>
      );
  }
}

function AppContent() {
  const { state } = useSession();
  // Timeline is always shown, state is used by PhaseRouter
  const showTimeline = !!state;

  return (
    <div className="flex flex-col h-screen">
      {/* Global Timeline Bar at Top */}
      {showTimeline && <GlobalTimeline />}

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <PhaseRouter />
      </div>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Dev Tools (only in development mode) */}
      {import.meta.env.DEV && <DevTools />}

      {/* Version Number */}
      <Version />
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
