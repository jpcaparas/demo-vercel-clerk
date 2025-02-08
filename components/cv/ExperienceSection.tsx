'use client';

import { Card, TextInput, Textarea, Grid, Button, ActionIcon, Checkbox } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { addExperience, updateExperience, removeExperience } from '@/store/features/cv/cvSlice';
import type { Experience } from '@/types/cv';
import { IconTrash } from '@tabler/icons-react';

type ExperienceFieldValue<T extends keyof Experience> = Experience[T];

export default function ExperienceSection() {
  const dispatch = useDispatch();
  const experience = useSelector((state: RootState) => state.cv.experience);

  const handleAdd = () => {
    dispatch(addExperience({
      company: '',
      position: '',
      startDate: new Date().toISOString(),
      current: false,
      description: '',
      achievements: []
    }));
  };

  const handleUpdate = (index: number, field: keyof Experience, value: ExperienceFieldValue<typeof field>) => {
    dispatch(updateExperience({ index, data: { [field]: value } }));
  };

  const handleRemove = (index: number) => {
    dispatch(removeExperience(index));
  };

  const handleAchievementChange = (index: number, achievementIndex: number, value: string) => {
    const achievements = [...(experience[index].achievements || [])];
    achievements[achievementIndex] = value;
    handleUpdate(index, 'achievements', achievements);
  };

  const handleAddAchievement = (index: number) => {
    const achievements = [...(experience[index].achievements || []), ''];
    handleUpdate(index, 'achievements', achievements);
  };

  const handleRemoveAchievement = (index: number, achievementIndex: number) => {
    const achievements = [...(experience[index].achievements || [])];
    achievements.splice(achievementIndex, 1);
    handleUpdate(index, 'achievements', achievements);
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Work Experience</h2>
        <Button onClick={handleAdd}>Add Experience</Button>
      </div>

      <div className="space-y-4">
        {experience.map((exp: Experience, index: number) => (
          <Card key={index} withBorder>
            <div className="flex justify-between">
              <h3 className="text-lg font-medium mb-3">Experience #{index + 1}</h3>
              <ActionIcon color="red" onClick={() => handleRemove(index)}>
                <IconTrash size={16} />
              </ActionIcon>
            </div>
            <Grid>
              <Grid.Col span={12}>
                <TextInput
                  label="Company"
                  value={exp.company}
                  onChange={(e) => handleUpdate(index, 'company', e.target.value as ExperienceFieldValue<'company'>)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Position"
                  value={exp.position}
                  onChange={(e) => handleUpdate(index, 'position', e.target.value as ExperienceFieldValue<'position'>)}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <DateInput
                  label="Start Date"
                  value={new Date(exp.startDate)}
                  onChange={(date) => handleUpdate(index, 'startDate', date?.toISOString() as ExperienceFieldValue<'startDate'>)}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <DateInput
                  label="End Date"
                  value={exp.endDate ? new Date(exp.endDate) : null}
                  onChange={(date) => handleUpdate(index, 'endDate', date?.toISOString() as ExperienceFieldValue<'endDate'>)}
                  disabled={exp.current}
                  clearable
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Checkbox
                  label="I currently work here"
                  checked={exp.current}
                  onChange={(e) => handleUpdate(index, 'current', e.currentTarget.checked as ExperienceFieldValue<'current'>)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Location"
                  value={exp.location || ''}
                  onChange={(e) => handleUpdate(index, 'location', e.target.value as ExperienceFieldValue<'location'>)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Description"
                  value={exp.description}
                  onChange={(e) => handleUpdate(index, 'description', e.target.value as ExperienceFieldValue<'description'>)}
                  minRows={3}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Key Achievements</label>
                    <Button size="xs" onClick={() => handleAddAchievement(index)}>
                      Add Achievement
                    </Button>
                  </div>
                  {(exp.achievements || []).map((achievement: string, achievementIndex: number) => (
                    <div key={achievementIndex} className="flex gap-2">
                      <TextInput
                        placeholder="Enter achievement..."
                        value={achievement}
                        onChange={(e) => handleAchievementChange(index, achievementIndex, e.target.value)}
                        className="flex-1"
                      />
                      <ActionIcon color="red" onClick={() => handleRemoveAchievement(index, achievementIndex)}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    </div>
                  ))}
                </div>
              </Grid.Col>
            </Grid>
          </Card>
        ))}
      </div>
    </Card>
  );
}