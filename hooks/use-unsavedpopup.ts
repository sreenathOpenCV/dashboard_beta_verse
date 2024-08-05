import { create } from "zustand"

interface UnsavedPopup {
    popupCollapse: boolean;
    unsavedChanges: boolean;
    invokePopupCollapse: (collapse?: boolean) => void;
    setUnsavedChanges: (hasChanges: boolean) => void;
}

export const useUnsavedPopup = create<UnsavedPopup>((set, get) => ({
    popupCollapse: false,
    unsavedChanges: false,
    invokePopupCollapse: (collapse) => set({ popupCollapse: collapse !== undefined ? collapse : !get().popupCollapse }),
    setUnsavedChanges: (hasChanges: boolean) => set({ unsavedChanges: hasChanges }),
}));
