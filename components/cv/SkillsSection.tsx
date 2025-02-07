'use client';

import { Card, TextInput, Grid, Button, ActionIcon, Select, NumberInput } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { addSkill, updateSkill, removeSkill, reorderSkills } from '@/store/features/cv/cvSlice';
import type { Skill } from '@/types/cv';
import { IconTrash, IconGripVertical } from '@tabler/icons-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

function SortableSkillItem({ skill, index, onUpdate, onRemove }: { 
  skill: Skill; 
  index: number;
  onUpdate: (index: number, field: keyof Skill, value: string | number | null) => void;
  onRemove: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: index.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card key={index} withBorder style={style} ref={setNodeRef}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center cursor-move" {...attributes} {...listeners}>
          <IconGripVertical size={16} />
        </div>
        <ActionIcon color="red" onClick={() => onRemove(index)}>
          <IconTrash size={16} />
        </ActionIcon>
      </div>
      <Grid>
        <Grid.Col span={12}>
          <TextInput
            label="Skill Name"
            value={skill.name}
            onChange={(e) => onUpdate(index, 'name', e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Select
            label="Proficiency Level"
            data={SKILL_LEVELS}
            value={skill.level}
            onChange={(value) => onUpdate(index, 'level', value || 'Beginner')}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <NumberInput
            label="Years of Experience"
            value={skill.yearsOfExperience}
            onChange={(value) => onUpdate(index, 'yearsOfExperience', value)}
            min={0}
            max={50}
          />
        </Grid.Col>
      </Grid>
    </Card>
  );
}

export default function SkillsSection() {
  const dispatch = useDispatch();
  const skills = useSelector((state: RootState) => state.cv.skills);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    dispatch(addSkill({
      name: '',
      level: 'Beginner'
    }));
  };

  const handleUpdate = (index: number, field: keyof Skill, value: string | number | null) => {
    dispatch(updateSkill({ index, data: { [field]: value } }));
  };

  const handleRemove = (index: number) => {
    dispatch(removeSkill(index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString());
      const newIndex = parseInt(over.id.toString());
      dispatch(reorderSkills({ oldIndex, newIndex }));
    }
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Skills</h2>
        <Button onClick={handleAdd}>Add Skill</Button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={skills.map((_, index) => index.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {skills.map((skill: Skill, index: number) => (
              <SortableSkillItem
                key={index}
                skill={skill}
                index={index}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Card>
  );
}