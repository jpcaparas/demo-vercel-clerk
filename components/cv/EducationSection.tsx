'use client';

import { Card, TextInput, Textarea, Grid, Button, ActionIcon, Collapse } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { addEducation, updateEducation, removeEducation, reorderEducation } from '@/store/features/cv/cvSlice';
import type { Education } from '@/types/cv';
import { IconTrash, IconGripVertical } from '@tabler/icons-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCallback, useState, useRef } from 'react';

interface SortableItemProps {
  id: number;
  education: Education;
  isExpanded: boolean;
  onExpand: (id: number) => void;
  onUpdate: (field: keyof Education, value: string | Date | null) => void;
  onRemove: () => void;
}

function SortableItem({ id, education: edu, isExpanded, onExpand, onUpdate, onRemove, isDragDisabled }: SortableItemProps & { isDragDisabled: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id,
    disabled: isDragDisabled
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const transitionTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleExpand = (id: number) => {
    onExpand(id);
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
      transitionTimeout.current = null;
    }
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      withBorder 
      className={`mb-4 ${isDragging ? 'shadow-md' : ''} ${!isExpanded ? 'opacity-70 hover:opacity-100' : ''}`}
    >
      <div className="flex items-center gap-2">
        <div {...attributes} {...listeners} className={`p-2 -ml-2 ${!isDragDisabled ? 'hover:bg-gray-100' : ''} rounded ${isDragDisabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'} touch-none`}>
          <IconGripVertical size={18} className={`text-gray-500 ${isDragDisabled ? 'opacity-50' : ''}`} />
        </div>
        <div className="flex-grow" onClick={() => handleExpand(id)}>
          <h3 className="text-lg font-medium my-2 cursor-pointer">
            {edu.institution || `Education #${id + 1}`}
          </h3>
        </div>
        <ActionIcon 
          color="red" 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </div>
        
      {!isExpanded && (
        <div className="mt-2 text-sm text-gray-600">
          {edu.degree} {edu.field ? `in ${edu.field}` : ''} 
          {edu.institution ? ` at ${edu.institution}` : ''}
        </div>
      )}

      <Collapse in={isExpanded} onTransitionEnd={() => {
        transitionTimeout.current = setTimeout(() => {
          // The timeout ref will be cleared if component unmounts
        }, 100);
      }}>
        <Grid className="mt-4">
          <Grid.Col span={12}>
            <TextInput
              label="Institution"
              value={edu.institution || ''}
              onChange={(e) => onUpdate('institution', e.target.value)}
              placeholder="Enter institution name"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Degree"
              value={edu.degree || ''}
              onChange={(e) => onUpdate('degree', e.target.value)}
              placeholder="Enter degree"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Field of Study"
              value={edu.field || ''}
              onChange={(e) => onUpdate('field', e.target.value)}
              placeholder="Enter field of study"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateInput
              label="Start Date"
              value={edu.startDate ? new Date(edu.startDate) : null}
              onChange={(date) => onUpdate('startDate', date)}
              placeholder="Select start date"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateInput
              label="End Date (Optional)"
              value={edu.endDate ? new Date(edu.endDate) : null}
              onChange={(date) => onUpdate('endDate', date)}
              clearable
              placeholder="Select end date"
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Location"
              value={edu.location || ''}
              onChange={(e) => onUpdate('location', e.target.value)}
              placeholder="Enter location"
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Description"
              value={edu.description || ''}
              onChange={(e) => onUpdate('description', e.target.value)}
              minRows={2}
              placeholder="Enter description"
            />
          </Grid.Col>
        </Grid>
      </Collapse>
    </Card>
  );
}

export default function EducationSection() {
  const dispatch = useDispatch();
  const education = useSelector((state: RootState) => state.cv.education);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleAdd = () => {
    dispatch(addEducation({
      institution: '',
      degree: '',
      field: '',
      startDate: new Date().toISOString(),
      description: ''
    }));
  };

  const handleUpdate = useCallback((index: number, field: keyof Education, value: string | Date | null) => {
    const processedValue = value instanceof Date ? value.toISOString() : value;
    dispatch(updateEducation({ index, data: { [field]: processedValue } }));
  }, [dispatch]);

  const handleRemove = useCallback((index: number) => {
    dispatch(removeEducation(index));
    if (expandedId === index) {
      setExpandedId(null);
    }
  }, [dispatch, expandedId]);

  const handleExpand = useCallback((id: number) => {
    setExpandedId(expandedId === id ? null : id);
  }, [expandedId]);

  const handleDragStart = () => {
    if (expandedId !== null) {
      setExpandedId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = Number(active.id);
      const newIndex = Number(over.id);
      dispatch(reorderEducation({ oldIndex, newIndex }));
    }
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Education</h2>
        <Button onClick={handleAdd}>Add Education</Button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={education.map((_, index) => index)}
          strategy={verticalListSortingStrategy}
        >
          {education.map((edu, index) => (
            <SortableItem
              key={index}
              id={index}
              education={edu}
              isExpanded={expandedId === index}
              onExpand={handleExpand}
              onUpdate={(field, value) => handleUpdate(index, field, value)}
              onRemove={() => handleRemove(index)}
              isDragDisabled={expandedId !== null}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Card>
  );
}