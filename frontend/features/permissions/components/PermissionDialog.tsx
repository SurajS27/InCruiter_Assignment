import React, { useState } from 'react';
import { usePermissionStore } from '../../../store/usePermissionStore';
import { useInterviewStore } from '../../../store/useInterviewStore';
import { permissionService } from '../../../services/permission.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Camera, Mic, ShieldAlert, Sparkles } from 'lucide-react';
import { storageService } from '../../../services/storage.service';

export const PermissionDialog: React.FC = React.memo(() => {
  const syncPermissions = usePermissionStore((state) => state.syncPermissions);
  const setBrowserSupported = usePermissionStore((state) => state.setBrowserSupported);
  const setCandidateName = useInterviewStore((state) => state.setCandidateName);
  const startInterview = useInterviewStore((state) => state.startInterview);

  const [name, setName] = useState<string>('');
  const [requesting, setRequesting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name to proceed.');
      return;
    }

    setRequesting(true);
    setError(null);

    const isSupported = permissionService.isBrowserSupported();
    setBrowserSupported(isSupported);

    if (!isSupported) {
      setError('Your browser does not support camera or microphone streams. Please use a modern browser.');
      setRequesting(false);
      return;
    }

    const result = await permissionService.requestPermissions();
    
    // Sync stores
    const cameraStatus = result.camera ? 'granted' : 'denied';
    const microphoneStatus = result.microphone ? 'granted' : 'denied';
    syncPermissions(cameraStatus, microphoneStatus);

    if (result.camera && result.microphone) {
      storageService.saveCandidate(name);
      setCandidateName(name);
      startInterview();
    } else {
      setError('Both camera and microphone permissions are required to start the interview session.');
    }
    setRequesting(false);
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-140px)]">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/60 backdrop-blur-xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600" />
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="inline-flex mx-auto p-3 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-full mb-2">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-zinc-100 tracking-tight">
            Verification Required
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm max-w-xs mx-auto">
            Please provide your name and enable system hardware to initialize the session.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleGrantAccess} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="candidate-name" className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Candidate Full Name
              </label>
              <input
                id="candidate-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Hardware Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-xl border border-zinc-900 bg-zinc-950/40">
                <div className="p-2 bg-zinc-900 text-zinc-400 rounded-lg">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-300">Camera</p>
                  <p className="text-[10px] text-zinc-500">Required</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-xl border border-zinc-900 bg-zinc-950/40">
                <div className="p-2 bg-zinc-900 text-zinc-400 rounded-lg">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-300">Microphone</p>
                  <p className="text-[10px] text-zinc-500">Required</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-start space-x-2.5 p-3 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400 text-xs leading-relaxed">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={requesting}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-950/20 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {requesting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Configuring Hardware...</span>
                </>
              ) : (
                <span>Request Permissions & Start</span>
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
});

PermissionDialog.displayName = 'PermissionDialog';
export default PermissionDialog;
