'use client';

import { Text } from '@mantine/core';
import { IconCheck, IconLoader2 } from '@tabler/icons-react';

interface AutosaveIndicatorProps {
  isSaving: boolean;
}

export function AutosaveIndicator({ isSaving }: AutosaveIndicatorProps) {
  return (
    <Text size="sm" color="gray.6" className="flex items-center gap-1">
      {isSaving ? (
        <>
          <IconLoader2 className="animate-spin" size={16} />
          Saving...
        </>
      ) : (
        <>
          <IconCheck size={16} className="text-green-500" />
          All changes saved
        </>
      )}
    </Text>
  );
}