import React, { ReactElement, useState } from 'react';
import styled from '@emotion/styled';
import { DragDropContext, Droppable, Draggable } from '@gsid/dnd';
import type {
  DropResult,
  DraggableProvided,
  DroppableProvided,
} from '@gsid/dnd';
import type { Quote as QuoteType } from '../types';
import { quotes as initial } from '../data';
import reorder from '../reorder';
import { grid } from '../constants';

interface QuoteProps {
  quote: QuoteType;
  index: number;
}

const QuoteItem = styled.div`
  width: 200px;
  border: 1px solid grey;
  margin-bottom: ${grid}px;
  background-color: lightblue;
  padding: ${grid}px;
`;

function Quote({ quote, index }: QuoteProps) {
  return (
    <Draggable draggableId={quote.id} index={index}>
      {(provided: DraggableProvided) => (
        <QuoteItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {quote.content}
        </QuoteItem>
      )}
    </Draggable>
  );
}

interface QuoteListProps {
  quotes: QuoteType[];
}

function QuoteList({ quotes }: QuoteListProps): ReactElement {
  return (
    <>
      {quotes.map((quote: QuoteType, index: number) => (
        <Quote quote={quote} index={index} key={quote.id} />
      ))}
    </>
  );
}

// Ensuring the whole list does not re-render when the droppable re-renders
const QuoteListMemo = React.memo<QuoteListProps>(QuoteList);

function QuoteApp(): ReactElement {
  const [quotes, setQuotes] = useState(initial);

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const newQuotes = reorder(
      quotes,
      result.source.index,
      result.destination.index,
    );

    setQuotes(newQuotes);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided: DroppableProvided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <QuoteListMemo quotes={quotes} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default QuoteApp;
