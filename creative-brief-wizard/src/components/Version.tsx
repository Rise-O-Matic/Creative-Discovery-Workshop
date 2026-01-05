import { version } from '../../package.json';

export const Version: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-none">
      <div className="px-2 py-1 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-mono rounded">
        v{version}
      </div>
    </div>
  );
};
