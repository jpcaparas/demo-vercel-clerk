'use client';

import { Card, TextInput, Button, ActionIcon, Grid } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { IconTrash, IconGripVertical } from '@tabler/icons-react';
import { setCVData, reorderList } from '@/store/features/cv/cvSlice';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ItemListProps {
  title: string;
  items: string[];
  type: 'certifications' | 'interests';
}

function SortableItem({ value, index, onUpdate, onRemove }: {
  value: string;
  index: number;
  onUpdate: (index: number, value: string) => void;
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
            value={value}
            onChange={(e) => onUpdate(index, e.target.value)}
          />
        </Grid.Col>
      </Grid>
    </Card>
  );
}

export default function ItemListSection({ title, items = [], type }: ItemListProps) {
  const dispatch = useDispatch();
  const cvData = useSelector((state: RootState) => state.cv);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    const newItems = [...items, ''];
    dispatch(setCVData({
      ...cvData,
      [type]: newItems
    }));
  };

  const handleUpdate = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    dispatch(setCVData({
      ...cvData,
      [type]: newItems
    }));
  };

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    dispatch(setCVData({
      ...cvData,
      [type]: newItems
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString());
      const newIndex = parseInt(over.id.toString());
      dispatch(reorderList({ type, oldIndex, newIndex }));
    }
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button onClick={handleAdd}>Add {title.slice(0, -1)}</Button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items.map((_, index) => index.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {items.map((item, index) => (
              <SortableItem
                key={index}
                value={item}
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