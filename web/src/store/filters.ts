import { create } from "zustand";
import { DEFAULT_INDICATOR_ID } from "@/lib/constants/indicators";

interface FiltersState {
  indicatorId: number;
  year: number | null;
  uf: string | null;
  abrangencia: string | null;
  setIndicator: (indicatorId: number) => void;
  setYear: (year: number | null) => void;
  setUF: (uf: string | null) => void;
  setAbrangencia: (abrangencia: string | null) => void;
  reset: () => void;
}

const DEFAULTS = {
  indicatorId: DEFAULT_INDICATOR_ID,
  year: null,
  uf: null,
  abrangencia: null,
};

export const useFiltersStore = create<FiltersState>((set) => ({
  ...DEFAULTS,
  setIndicator: (indicatorId) => set({ indicatorId }),
  setYear: (year) => set({ year }),
  setUF: (uf) => set({ uf }),
  setAbrangencia: (abrangencia) => set({ abrangencia }),
  reset: () => set(DEFAULTS),
}));
