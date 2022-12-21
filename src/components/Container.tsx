import { useDrop } from 'react-dnd';
import { CSSProperties, useEffect, useState } from 'react';
import { Card, CardProps } from './Card';

const style: CSSProperties = {
  height: '18rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
}

export interface ContainerProps {
  index: number,
  accept: string[],
  cards: CardSpec[],
  moveCard: (id: string, to: number, tableTo?: number) => void,
  findCard: (id: string) => { index: number },
  changeCardContainer: (card: CardSpec, table: number) => void,
  //onDrop: (column: any) => void,
}

interface CardSpec {
  id: string,
  text: string,
  table: number,
}

export const Container = ({index, accept, cards, moveCard, findCard, changeCardContainer}: ContainerProps) => {
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: () => ({table: index}),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  //console.log('options ', {canDrop, isOver});

  const isActive = isOver && canDrop;

  let backgroundColor = '#222';
  if (isActive) {
    backgroundColor = 'darkgreen';
  } else if (canDrop) {
    backgroundColor = 'darkkhaki';
  }

  return (
    <div ref={drop} style={{...style, backgroundColor}} data-testid="container">
      {isActive
        ? 'Release to drop'
        : `This container accepts: ${accept.join(', ')}`}
      {cards.map((card) => {
        if (card.table === index)
        return (
          <Card
            key={card.id}
            id={card.id}
            text={card.text}
            table={card.table}
            moveCard={moveCard}
            findCard={findCard}
            changeCardContainer={changeCardContainer}
          />
      )})}
    </div>
  )
}