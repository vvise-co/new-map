import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { Team, TeamWithMembers } from '@/lib/types';
import { getUserTeams, getTeam, checkHasTeam } from '@/lib/teamApi';
import { useAuth } from './AuthContext';

interface TeamContextType {
  teams: Team[];
  currentTeam: TeamWithMembers | null;
  hasTeam: boolean;
  loading: boolean;
  refreshTeams: () => Promise<void>;
  selectTeam: (teamId: string) => Promise<void>;
  clearTeam: () => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<TeamWithMembers | null>(null);
  const [hasTeam, setHasTeam] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentTeamRef = useRef<TeamWithMembers | null>(null);

  const refreshTeams = useCallback(async () => {
    if (!user) {
      setTeams([]);
      setCurrentTeam(null);
      currentTeamRef.current = null;
      setHasTeam(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [userTeams, hasTeamResult] = await Promise.all([
        getUserTeams(),
        checkHasTeam(),
      ]);
      setTeams(userTeams);
      setHasTeam(hasTeamResult);

      // Auto-select first team if we have one and no current selection
      if (userTeams.length > 0 && !currentTeamRef.current) {
        const teamDetails = await getTeam(userTeams[0].id);
        setCurrentTeam(teamDetails);
        currentTeamRef.current = teamDetails;
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      setTeams([]);
      setHasTeam(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Don't do anything while auth is still loading
    if (authLoading) {
      return;
    }

    if (user) {
      refreshTeams();
    } else {
      setTeams([]);
      setCurrentTeam(null);
      currentTeamRef.current = null;
      setHasTeam(false);
      setLoading(false);
    }
  }, [user, authLoading, refreshTeams]);

  const selectTeam = async (teamId: string) => {
    setLoading(true);
    try {
      const teamDetails = await getTeam(teamId);
      setCurrentTeam(teamDetails);
      currentTeamRef.current = teamDetails;
    } catch (error) {
      console.error('Failed to select team:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearTeam = () => {
    setCurrentTeam(null);
    currentTeamRef.current = null;
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        currentTeam,
        hasTeam,
        loading,
        refreshTeams,
        selectTeam,
        clearTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within TeamProvider');
  }
  return context;
}
