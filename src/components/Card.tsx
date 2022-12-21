import React, { memo, CSSProperties, FC } from 'react';
import { ItemTypes } from '../ItemTypes';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'

const style: CSSProperties = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
  color: 'black',
}

export interface CardProps {
  id: string,
  text: string,
  table: number,
  moveCard: (id: string, to: number, tableTo?: number) => void,
  findCard: (id: string) => { index: number },
  changeCardContainer: (card: CardSpec, table: number) => void,
}

interface CardSpec {
  id: string,
  text: string,
  table: number,
}

interface Item {
  id: string,
  originalIndex: number,
  table: number
}

interface DropResult {
  dropEffect: string,
  table: number
}

export const Card: FC<CardProps> = memo(function Card({
  id,
  text,
  table,
  moveCard,
  findCard,
  changeCardContainer
}) {

  const originalIndex = findCard(id).index;

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        const dropResult: DropResult | null = monitor.getDropResult();
        if (!didDrop) {
          console.log('Did not drop into container');
          moveCard(droppedId, originalIndex);
        } else {
          changeCardContainer({id: id, text: text, table: table}, dropResult!.table);
        }
      }
    }),
    [id, originalIndex, moveCard],
  )

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      hover({ id: draggedId }: Item, monitor) {
        if (draggedId !== id) {
          //console.log(monitor.getDropResult());
          const { index: overIndex } = findCard(id);
          console.log('ids', draggedId, overIndex);
          moveCard(draggedId, overIndex);
        }
      }
    }),
    [findCard, moveCard],
  )

  const opacity = isDragging ? 0 : 1;
  return (
    <div ref={(node) => drag(drop(node))} style={{...style, opacity}}>
      {text}
    </div>
  )
})