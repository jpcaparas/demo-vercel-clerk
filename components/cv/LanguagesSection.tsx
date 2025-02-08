'use client';

import { Card, TextInput, Grid, Button, ActionIcon, Select } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { addLanguage, updateLanguage, removeLanguage, reorderLanguages } from '@/store/features/cv/cvSlice';
import type { Language } from '@/types/cv';
import { IconTrash, IconGripVertical } from '@tabler/icons-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const PROFICIENCY_LEVELS = ['Basic', 'Conversational', 'Fluent', 'Native'] as const;

function SortableLanguageItem({ language, index, onUpdate, onRemove }: {
  language: Language;
  index: number;
  onUpdate: (index: number, field: keyof Language, value: string) => void;
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
    <Card withBorder style={style} ref={setNodeRef}>
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
            label="Language"
            value={language.name}
            onChange={(e) => onUpdate(index, 'name', e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Select
            label="Proficiency"
            data={PROFICIENCY_LEVELS}
            value={language.proficiency}
            onChange={(value) => onUpdate(index, 'proficiency', value || 'Basic')}
          />
        </Grid.Col>
      </Grid>
    </Card>
  );
}

export default function LanguagesSection() {
  const dispatch = useDispatch();
  const languages = useSelector((state: RootState) => state.cv.languages);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    dispatch(addLanguage({
      name: '',
      proficiency: 'Basic'
    }));
  };

  const handleUpdate = (index: number, field: keyof Language, value: string) => {
    dispatch(updateLanguage({ index, data: { [field]: value } }));
  };

  const handleRemove = (index: number) => {
    dispatch(removeLanguage(index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString());
      const newIndex = parseInt(over.id.toString());
      dispatch(reorderLanguages({ oldIndex, newIndex }));
    }
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Languages</h2>
        <Button onClick={handleAdd}>Add Language</Button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={languages.map((_, index) => index.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {languages.map((language: Language, index: number) => (
              <SortableLanguageItem
                key={index}
                language={language}
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