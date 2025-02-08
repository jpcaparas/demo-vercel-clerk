'use client';

import { Title, LoadingOverlay, Group } from '@mantine/core';
import { useAuth } from '@clerk/nextjs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useEffect, useState, useCallback, useRef } from 'react';
import PersonalInfoForm from '@/components/cv/PersonalInfoForm';
import EducationSection from '@/components/cv/EducationSection';
import ExperienceSection from '@/components/cv/ExperienceSection';
import SkillsSection from '@/components/cv/SkillsSection';
import LanguagesSection from '@/components/cv/LanguagesSection';
import ItemListSection from '@/components/cv/ItemListSection';
import { setCVData } from '@/store/features/cv/cvSlice';
import { notifications } from '@mantine/notifications';
import { AutosaveIndicator } from '@/components/cv/AutosaveIndicator';

const AUTOSAVE_DELAY = 3000; // 3 seconds
const MAX_PAYLOAD_SIZE = 7500; // 7.5 KB

export default function CVBuilder() {
  const { userId } = useAuth();
  const dispatch = useDispatch();
  const cvData = useSelector((state: RootState) => state.cv);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<string>('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSave = useCallback(async () => {
    const payload = JSON.stringify(cvData);
    if (payload.length > MAX_PAYLOAD_SIZE) {
      notifications.show({
        title: 'Warning',
        message: 'Your CV data is too large. Please keep it concise and avoid putting too much information in the fields.',
        color: 'yellow',
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/cv/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });
      
      if (!response.ok) {
        throw new Error('Failed to save CV data');
      }

      notifications.show({
        title: 'Success',
        message: 'Your CV has been saved successfully!',
        color: 'green',
      });
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to save CV data. Please try again.',
        color: 'red',
      });
    } finally {
      setIsSaving(false);
    }
  }, [cvData]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/cv/load');
        if (response.ok) {
          const data = await response.json();
          dispatch(setCVData(data));
          setLastSavedData(JSON.stringify(data));
        }
      } catch {
        notifications.show({
          title: 'Error',
          message: 'Failed to load CV data. Please try refreshing the page.',
          color: 'red',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userId, dispatch]);

  useEffect(() => {
    const currentData = JSON.stringify(cvData);
    if (!isLoading && lastSavedData !== currentData) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        handleSave();
        setLastSavedData(currentData);
      }, AUTOSAVE_DELAY);
    }
  }, [cvData, isLoading, lastSavedData, handleSave]);

  const handleBlur = () => {
    const currentData = JSON.stringify(cvData);
    if (lastSavedData !== currentData) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      handleSave();
      setLastSavedData(currentData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto relative" onBlur={handleBlur}>
      <LoadingOverlay visible={isSaving} />
      <div className="flex justify-between items-center mb-6">
        <Title order={1}>CV Builder</Title>
        <Group>
          <AutosaveIndicator isSaving={isSaving} />
        </Group>
      </div>

      <div className="space-y-6 relative">
        <LoadingOverlay visible={isLoading} />
        <PersonalInfoForm />
        <EducationSection />
        <ExperienceSection />
        <SkillsSection />
        <LanguagesSection />
        <ItemListSection 
          title="Certifications" 
          items={cvData.certifications || []} 
          type="certifications" 
        />
        <ItemListSection 
          title="Interests" 
          items={cvData.interests || []} 
          type="interests" 
        />
      </div>
    </div>
  );
}