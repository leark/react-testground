import { memo, useCallback, useEffect, useState } from 'react'
import { NativeTypes } from 'react-dnd-html5-backend'
import update from 'immutability-helper'
import { Column } from './Column'
import { Container } from './Container'
import { ItemTypes } from '../ItemTypes'

interface ContainerState {
  accepts: string[]
  //lastDroppedItem: any
}

interface ColumnState {
  name: string
  type: string
}

export interface ContainerSpec {
  accepts: string[]
  lastDroppedItem: any
}
export interface ColumnSpec {
  name: string
  type: string
}
export interface PageState {
  droppedBoxNames: string[]
  dustbins: ContainerSpec[]
  boxes: ColumnSpec[]
}

const ITEMS = [
  {
    id: '1',
    text: '1',
    table: 0,
  },
  {
    id: '2',
    text: '2',
    table: 0,
  },
  {
    id: '3',
    text: '3',
    table: 0,
  },
  {
    id: '4',
    text: '4',
    table: 0,
  },
  {
    id: '5',
    text: '5',
    table: 0,
  },
  {
    id: '6',
    text: '6',
    table: 1,
  },
  {
    id: '7',
    text: '7',
    table: 1,
  },
]

export const Page = () => {
  const [cards, setCards] = useState(ITEMS);
  const [containers, setContainers] = useState<ContainerState[]>([
    { accepts: [ItemTypes.ACOLUMN, ItemTypes.CARD] },
    { accepts: [ItemTypes.SCOLUMN, ItemTypes.CARD] }
  ]);

  const [columns] = useState<ColumnState[]>([
    { name: 'Col1A', type: ItemTypes.ACOLUMN },
    { name: 'Col2A', type: ItemTypes.ACOLUMN },
    { name: 'Col3A', type: ItemTypes.ACOLUMN },
    { name: 'Col4S', type: ItemTypes.SCOLUMN }
  ]);

  const [droppedColumnNames, setDroppedColumnNames] = useState<string[]>([]);

  function isDropped(columnName: string) {
    return droppedColumnNames.indexOf(columnName) > -1;
  }

  const changeCardContainer = (currCard: { id: string, text: string, table: number,
  }, table: number) => {
    setCards((prevState) => {
      return prevState.map((c: {  
        id: string,
        text: string,
        table: number, }) => {
        return {
          ...c,
          table: c.id === currCard.id ? table : c.table,
        }
      })
    })
  }

  const findCard = useCallback(
    (id: string) => {
      const card = cards.filter((c) => `${c.id}` === id)[0] as {
        id: string,
        text: string,
        table: number,
      }
      return {
        card,
        index: cards.indexOf(card),
      }
    },
    [cards],
  )

  const moveCard = useCallback(
    (id: string, atIndex: number, atTable?: number) => {
      const {card, index} = findCard(id);
      // const bCard = findCard(atIndex + '');
      // if (typeof(atTable) !== undefined) {
      //   card.table = atTable!;
      // }
      // let cardsCopy = cards;
      // console.log(bCard);
      // const prev = cardsCopy.splice(atIndex, 1, card);
      // cardsCopy.splice(index, 1, prev[0]);
      // const prev = cardsCopy.splice(index, 1);
      // cardsCopy.splice(atIndex, 0, card);
      // cardsCopy.splice(index, 1);
      // cardsCopy.splice(atIndex, 0, card);
      // setCards(cardsCopy);
      // console.log('Moving from ' + index + ' to ' + atIndex);
      // console.log(card);
      setCards(
        update(cards, {
          $splice: [
            [index, 1],
            [atIndex, 0, card],
          ],
        }),
      )
    },
    [findCard, cards, setCards],
  )

  const handleDrop = useCallback(
    (index: number, item: { name: string }) => {
      const { name } = item;
      setDroppedColumnNames(
        // update droppedboxanmes
        [...droppedColumnNames, item.name]
      );
      // setContainers(
      //   // update containers
      //   []
      // );
    }, [droppedColumnNames, containers],
  )

  return (
    <div>
      <div style={{overflow:'hidden', clear: 'both'}}>
          {containers.map(({accepts}, index) => (
            <Container
              accept={accepts}
              cards={cards}
              moveCard={moveCard}
              findCard={findCard}
              changeCardContainer={changeCardContainer}
              index={index}
              key={index}
            />
          ))}
      </div>
      <div style={{overflow:'hidden', clear: 'both'}}>
          {columns.map(({ name, type}, index) => (
            <Column
              name={name}
              type={type}
              isDropped={isDropped(name)}
              key={index}
              order={0}
              selected={false}
            />
          ))}
      </div>
    </div>
  )
}
