import type { CSSProperties } from "react";
import { useDrag } from 'react-dnd';

const style: CSSProperties = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
}

export interface ColumnProps {
  name: string,
  order: number,
  selected: boolean,
  type: string,
  isDropped: boolean
}

export const Column = ({name, order, selected, type, isDropped}: ColumnProps) => {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type,
      item: { name },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      })
    }),
    [name, type],
  );

  return (
    <div ref={drag} style={{...style, opacity}} data-testid="column">
      {isDropped ? <s>{name}</s> : name}
    </div>
  )
}