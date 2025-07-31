import { useEffect, useRef, useCallback } from 'react';
import { useResume } from '@/app/[locale]/(default)/resume-generator/components/ResumeContext';

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;
  
  const debounced = ((...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  }) as T;
  
  (debounced as any).cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  return debounced as T & { cancel: () => void };
}

export function useAutoSaveResume() {
  const { data, documentState, saveDocument } = useResume();
  const previousDataRef = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Create a debounced save function
  const debouncedSave = useCallback(
    debounce(async () => {
      console.log('[AutoSave] Debounced save triggered');
      if (documentState.documentUuid) {
        console.log('[AutoSave] Saving document with UUID:', documentState.documentUuid);
        await saveDocument();
      } else {
        console.log('[AutoSave] No document UUID, skipping save');
      }
    }, 500),
    [documentState.documentUuid, saveDocument]
  );

  // Save immediately for critical changes
  const saveImmediately = useCallback(async () => {
    console.log('[AutoSave] Immediate save triggered');
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    if (documentState.documentUuid) {
      console.log('[AutoSave] Saving immediately with UUID:', documentState.documentUuid);
      await saveDocument();
    }
  }, [saveDocument, documentState.documentUuid]);

  useEffect(() => {
    // Skip if loading or no document
    if (documentState.isLoading || !documentState.documentUuid) {
      console.log('[AutoSave] Skipping - isLoading:', documentState.isLoading, 'documentUuid:', documentState.documentUuid);
      return;
    }

    // Create a serialized version of the data for comparison
    const currentDataString = JSON.stringify({
      resumeData: data,
      template: data.selectedTemplate,
      themeColor: data.themeColor,
      layoutConfiguration: data.layoutConfiguration,
      moduleSelection: data.moduleSelection
    });

    // Check if data has changed
    if (currentDataString !== previousDataRef.current) {
      console.log('[AutoSave] Data changed detected');
      
      // Parse the previous data BEFORE updating the ref
      const previousData = previousDataRef.current ? JSON.parse(previousDataRef.current) : null;
      
      // Now update the ref with new data
      previousDataRef.current = currentDataString;

      // Check if this is a critical change that needs immediate save
      const isCriticalChange = 
        previousData && (
          previousData.template !== data.selectedTemplate ||
          previousData.themeColor !== data.themeColor ||
          JSON.stringify(previousData.layoutConfiguration) !== JSON.stringify(data.layoutConfiguration) ||
          JSON.stringify(previousData.moduleSelection) !== JSON.stringify(data.moduleSelection)
        );

      if (isCriticalChange) {
        console.log('[AutoSave] Critical change detected - saving immediately');
        saveImmediately();
      } else {
        console.log('[AutoSave] Regular change detected - debounced save scheduled');
        debouncedSave();
      }
    }

    // Cleanup
    return () => {
      debouncedSave.cancel();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, documentState.isLoading, debouncedSave, saveImmediately]);

  return {
    isSaving: documentState.isSaving,
    lastSavedAt: documentState.lastSavedAt,
    saveError: documentState.saveError,
    saveNow: saveImmediately
  };
}