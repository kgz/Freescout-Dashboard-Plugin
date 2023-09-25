import React from "react";
import styled from "styled-components";

export interface IMasonryItemProps {
  id: string;
  rows?: number;
  columns?: number;
  item: React.ReactNode;
}

const MasonryGrid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.columns}, 1fr);
  grid-auto-flow: row dense;
  gap: 0px;
  width: 100%;
`;

const MasonryItem = styled.div<{ rows?: number; columns?: number }>`
  grid-column: span ${(p) => p.columns || 1};
  grid-row: span ${(p) => p.rows || 1};
  position: relative;
  max-width:${(p) =>(p?.columns ?? 1)*20}px;
  `;
//   padding-top: calc(100% * (${(p) => (p.rows || 1) / (p.columns || 1)}));

const MasonryItemContent = styled.div`
  position: relative;
 
`;

export const Masonry: React.FC<{
  columns: number;
  items: IMasonryItemProps[];
  style?: React.CSSProperties;
}> = ({ items, columns, style }) => {
  return (
    <MasonryGrid columns={columns} style={
        columns <= 30 ? {
            display: 'flex',
            flexWrap: 'nowrap',
            flexDirection: 'column',
            justifyContent: 'center',
    } : {}}>
      {items.map((item) => (
        <MasonryItem key={item.id} rows={item.rows} columns={item.columns} style={style}>
          <MasonryItemContent>{item.item}</MasonryItemContent>
        </MasonryItem>
      ))}
    </MasonryGrid>
  );
};
