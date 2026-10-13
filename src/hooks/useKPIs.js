import { useMemo } from 'react';
import { kpis } from '../utils/simulation.js';
export const useKPIs = (stacks, vehicles, claims) => useMemo(()=>kpis(stacks,vehicles,claims),[stacks,vehicles,claims]);
